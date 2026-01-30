import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Para o dashboard operacional, os dados são majoritariamente de gestão de recursos e infraestrutura.
        // Como o schema atual é focado em alunos/financeiro/academico, vou mockar os indicadores operacionais
        // mas basear o que for possível em dados reais (ex: ocupação baseada em alunos ativos).

        // 1. Ocupação de Salas (Baseado em alunos ativos vs turmas)
        const classOccupationQuery = `
      SELECT 
        turma,
        COUNT(*) as count
      FROM alunos
      WHERE status_matricula = 'Ativo'
      GROUP BY turma
    `;
        const classResult = await query(classOccupationQuery);
        const avgOccupation = classResult.rows.length > 0
            ? Math.min(100, Math.round((classResult.rows.reduce((acc: number, curr: any) => acc + Number(curr.count), 0) / (classResult.rows.length * 40)) * 100))
            : 0;

        // 2. KPIs (Métricas Mensais + Alunos)
        // Buscando as metricas mais recentes para cada tipo
        const metricsQuery = `
            SELECT DISTINCT ON (tipo_metrica) 
                tipo_metrica, valor, unidade
            FROM metricas_mensais
            ORDER BY tipo_metrica, mes_referencia DESC
        `;
        const metricsResult = await query(metricsQuery);
        const metricsMap = metricsResult.rows.reduce((acc: any, curr: any) => {
            acc[curr.tipo_metrica] = { value: curr.valor, unit: curr.unidade };
            return acc;
        }, {});

        // Calculando Manutenção (Chamados abertos/em andamento)
        const maintenanceQuery = `
            SELECT COUNT(*) as count 
            FROM operacional_chamados 
            WHERE status != 'Resolvido'
        `;
        const maintenanceResult = await query(maintenanceQuery);

        // Mapeando para o formato do dashboard
        const kpis = {
            espacos: `${avgOccupation}%`,
            secretaria: metricsMap['sla_secretaria'] ? `${metricsMap['sla_secretaria'].value} dias` : "1.8 dias",
            manutencao: `${maintenanceResult.rows[0].count} Tickets`,
            docentes: metricsMap['absenteismo_docentes'] ? `${metricsMap['absenteismo_docentes'].value}%` : "2.4%",
            ti: metricsMap['uptime_ti'] ? `${metricsMap['uptime_ti'].value}%` : "99.8%",
            impressao: "R$ 12,50", // Não gerado no script, mantendo mock ou conectar a despesa especifica depois
            alimentacao: metricsMap['desperdicio_alimentacao'] ? `${metricsMap['desperdicio_alimentacao'].value}%` : "4.2%",
            seguranca: "Normal"
        };

        // 3. Histórico de Custos (Financeiro Despesas)
        const costQuery = `
            SELECT 
                to_char(data_despesa, 'Mon') as month,
                SUM(CASE WHEN categoria = 'Energia' THEN valor ELSE 0 END) as energia,
                SUM(CASE WHEN categoria = 'Manutenção' THEN valor ELSE 0 END) as manutencao,
                SUM(CASE WHEN categoria = 'Insumos' THEN valor ELSE 0 END) as insumos
            FROM financeiro_despesas
            GROUP BY to_char(data_despesa, 'Mon'), date_trunc('month', data_despesa)
            ORDER BY date_trunc('month', data_despesa)
            LIMIT 6
        `;
        const costResult = await query(costQuery);

        // 4. Performance de Chamados
        // Agrupando por dia da semana da abertura
        const ticketQuery = `
            SELECT 
                to_char(data_abertura, 'Dy') as name,
                COUNT(*) FILTER (WHERE status != 'Resolvido') as abertos,
                COUNT(*) FILTER (WHERE status = 'Resolvido') as resolvidos
            FROM operacional_chamados
            GROUP BY to_char(data_abertura, 'Dy'), date_part('dow', data_abertura)
            ORDER BY date_part('dow', data_abertura)
        `;
        const ticketResult = await query(ticketQuery);

        // Traduzindo dias da semana do Postgres (se estiver em ingles) para PT-BR rapido
        const dayMap: Record<string, string> = { 'Sun': 'Dom', 'Mon': 'Seg', 'Tue': 'Ter', 'Wed': 'Qua', 'Thu': 'Qui', 'Fri': 'Sex', 'Sat': 'Sab' };
        const ticketPerformance = ticketResult.rows.length > 0 ? ticketResult.rows.map((r: any) => ({
            name: dayMap[r.name] || r.name,
            abertos: Number(r.abertos),
            resolvidos: Number(r.resolvidos)
        })) : [
            { name: 'Seg', abertos: 0, resolvidos: 0 },
            { name: 'Ter', abertos: 0, resolvidos: 0 },
            { name: 'Qua', abertos: 0, resolvidos: 0 },
            { name: 'Qui', abertos: 0, resolvidos: 0 },
            { name: 'Sex', abertos: 0, resolvidos: 0 },
        ];

        return NextResponse.json({
            kpis,
            costHistory: costResult.rows.map((r: any) => ({
                month: r.month,
                energia: Number(r.energia),
                manutencao: Number(r.manutencao),
                insumos: Number(r.insumos)
            })),
            ticketPerformance
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Operational API Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
