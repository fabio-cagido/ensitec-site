import { NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

interface Transaction {
  id: string;
  desc: string;
  date: string;
  amount: number;
  type: string;
}

export async function GET() {
  try {
    const { sessionClaims, userId } = await auth();
    const metadata = sessionClaims?.metadata as any;

    // Fallback se as claims não estiverem no JWT
    let escolaId = metadata?.escola_id;
    if (!escolaId && userId) {
      try {
        const { clerkClient } = await import('@clerk/nextjs/server');
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        escolaId = user.publicMetadata?.escola_id;
        if (sessionClaims) {
          if (!sessionClaims.metadata) (sessionClaims as any).metadata = {};
          (sessionClaims.metadata as any).escola_id = escolaId;
        }
      } catch (err) {
        console.error("Erro fallback Clerk Financeiro:", err);
      }
    }

    // 1. Receita por mês (Fluxo de Caixa)
    const fluxodeCaixaQuery = `
      SELECT 
        to_char(mes_referencia, 'Mon') as month,
        SUM(CASE WHEN status_pagamento ILIKE 'pago' THEN valor ELSE 0 END) as receita,
        SUM(CASE WHEN status_pagamento NOT ILIKE 'pago' THEN valor ELSE 0 END) as pendente,
        SUM(valor) as total
      FROM financeiro_mensalidades
      GROUP BY mes_referencia, to_char(mes_referencia, 'Mon')
      ORDER BY MIN(mes_referencia) ASC
      LIMIT 12
    `;
    const fluxoResult = await queryWithTenant(fluxodeCaixaQuery, [], sessionClaims);

    // 2. KPIs
    const kpiQuery = `
      SELECT 
        SUM(valor) as total_geral,
        SUM(CASE WHEN status_pagamento ILIKE 'pago' THEN valor ELSE 0 END) as total_pago,
        SUM(CASE WHEN status_pagamento ILIKE 'atrasado' THEN valor ELSE 0 END) as total_atrasado,
        COUNT(*) as total_transacoes,
        CAST(SUM(CASE WHEN status_pagamento ILIKE 'atrasado' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0) AS NUMERIC(10,2)) as taxa_inadimplencia
      FROM financeiro_mensalidades
    `;
    const kpiResult = await queryWithTenant(kpiQuery, [], sessionClaims);
    const kpis = kpiResult.rows[0] || { total_geral: 0, total_pago: 0, total_atrasado: 0, taxa_inadimplencia: 0 };

    // 3. Distribuição de Despesas
    const expensesQuery = `
      SELECT 
        categoria as name,
        SUM(valor) as value
      FROM financeiro_despesas
      GROUP BY categoria
      ORDER BY value DESC
    `;
    const expensesResult = await queryWithTenant(expensesQuery, [], sessionClaims);
    const expenseDistribution = (expensesResult.rows || []).map((r: any) => ({ name: r.name, value: Number(r.value) }));

    // 4. Transações Recentes
    const recentTransactionsQuery = `
      SELECT 
        f.id,
        a.nome_completo as desc,
        to_char(f.created_at, 'DD/MM, HH24:MI') as date,
        f.valor as amount,
        f.status_pagamento as type
      FROM financeiro_mensalidades f
      JOIN alunos a ON f.aluno_id = a.id
      ORDER BY f.created_at DESC
      LIMIT 5
    `;
    const recentResult = await queryWithTenant(recentTransactionsQuery, [], sessionClaims);

    // 5. Cálculo de Crescimento
    const growthQuery = `
      WITH monthly_totals AS (
        SELECT 
          date_trunc('month', mes_referencia) as month,
          SUM(valor) as total
        FROM financeiro_mensalidades
        GROUP BY 1
        ORDER BY 1 DESC
        LIMIT 2
      )
      SELECT 
        total as current_val,
        LEAD(total) OVER (ORDER BY month DESC) as prev_val
      FROM monthly_totals
    `;
    const growthResult = await queryWithTenant(growthQuery, [], sessionClaims);
    let growth = "+0.0%";
    if (growthResult.rows.length >= 2 && growthResult.rows[1].current_val > 0) {
      const g = ((growthResult.rows[0].current_val - growthResult.rows[1].current_val) / growthResult.rows[1].current_val * 100).toFixed(1);
      growth = (Number(g) >= 0 ? '+' : '') + g + '%';
    }

    return NextResponse.json({
      financeData: fluxoResult.rows || [],
      kpis: {
        receitaTotal: Number(kpis.total_geral || 0),
        receitaTotalGrowth: growth,
        receitaRecebida: Number(kpis.total_pago || 0),
        receitaRecebidaGrowth: "+4.2%",
        receitaAtrasada: Number(kpis.total_atrasado || 0),
        inadimplencia: Number(kpis.taxa_inadimplencia || 0),
        inadimplenciaGrowth: "-2.5%"
      },
      expenseDistribution,
      recentTransactions: (recentResult.rows || []).map((r: any) => ({
        ...r,
        amount: (r.type?.toLowerCase() === 'pago' ? '+' : '-') + ' R$ ' + Number(r.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        type: r.type?.toLowerCase() === 'pago' ? 'income' : 'expense'
      }))
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Financial API Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
