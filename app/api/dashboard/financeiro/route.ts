import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
    // 1. Receita por mês (Fluxo de Caixa)
    const fluxodeCaixaQuery = `
      SELECT 
        to_char(mes_referencia, 'Mon') as month,
        SUM(CASE WHEN status_pagamento = 'Pago' THEN valor ELSE 0 END) as receita,
        SUM(CASE WHEN status_pagamento != 'Pago' THEN valor ELSE 0 END) as pendente,
        SUM(valor) as total
      FROM financeiro_mensalidades
      GROUP BY mes_referencia
      ORDER BY mes_referencia ASC
      LIMIT 12
    `;
    const fluxoResult = await query(fluxodeCaixaQuery);

    // 2. KPIs
    const kpiQuery = `
      SELECT 
        SUM(valor) as total_geral,
        SUM(CASE WHEN status_pagamento = 'Pago' THEN valor ELSE 0 END) as total_pago,
        SUM(CASE WHEN status_pagamento = 'Atrasado' THEN valor ELSE 0 END) as total_atrasado,
        COUNT(*) as total_transacoes,
        CAST(SUM(CASE WHEN status_pagamento = 'Atrasado' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS NUMERIC(10,2)) as taxa_inadimplencia
      FROM financeiro_mensalidades
    `;
    const kpiResult = await query(kpiQuery);
    const kpis = kpiResult.rows[0];

    // 3. Distribuição de Despesas
    // Deixando de ser mockado e buscando do banco
    const expensesQuery = `
      SELECT 
        categoria as name,
        SUM(valor) as value
      FROM financeiro_despesas
      GROUP BY categoria
      ORDER BY value DESC
    `;
    const expensesResult = await query(expensesQuery);

    // Se não tiver despesas cadastradas ainda, retorna array vazio para não quebrar o gráfico (ou mantém um fallback)
    const expenseDistribution = expensesResult.rows.length > 0
      ? expensesResult.rows.map((r: any) => ({ name: r.name, value: Number(r.value) }))
      : [];

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
    const recentResult = await query(recentTransactionsQuery);

    return NextResponse.json({
      financeData: fluxoResult.rows,
      kpis: {
        receitaTotal: Number(kpis.total_geral),
        receitaRecebida: Number(kpis.total_pago),
        receitaAtrasada: Number(kpis.total_atrasado),
        inadimplencia: Number(kpis.taxa_inadimplencia)
      },
      expenseDistribution,
      recentTransactions: recentResult.rows.map((r: any) => ({
        ...r,
        amount: (r.type === 'Pago' ? '+' : '-') + ' R$ ' + Number(r.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        type: r.type === 'Pago' ? 'income' : 'expense'
      }))
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Financial API Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
