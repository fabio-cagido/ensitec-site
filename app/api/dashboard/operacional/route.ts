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

        // 2. Mock de dados que não existem no banco mas são necessários para o dashboard
        const kpis = {
            espacos: `${avgOccupation}%`,
            secretaria: "1.8 dias",
            manutencao: "12 Tickets",
            docentes: "2.4%",
            ti: "99.8%",
            impressao: "R$ 12,50",
            alimentacao: "4.2%",
            seguranca: "Normal"
        };

        const costHistory = [
            { month: 'Jan', energia: 12500, manutencao: 4200, insumos: 3100 },
            { month: 'Fev', energia: 14200, manutencao: 3800, insumos: 8500 },
            { month: 'Mar', energia: 13800, manutencao: 2100, insumos: 4200 },
            { month: 'Abr', energia: 13500, manutencao: 5400, insumos: 3800 },
            { month: 'Mai', energia: 12900, manutencao: 3200, insumos: 3500 },
            { month: 'Jun', energia: 11800, manutencao: 2800, insumos: 3100 },
        ];

        const ticketPerformance = [
            { name: 'Seg', abertos: 14, resolvidos: 12 },
            { name: 'Ter', abertos: 25, resolvidos: 20 },
            { name: 'Qua', abertos: 18, resolvidos: 18 },
            { name: 'Qui', abertos: 12, resolvidos: 15 },
            { name: 'Sex', abertos: 9, resolvidos: 11 },
        ];

        return NextResponse.json({
            kpis,
            costHistory,
            ticketPerformance
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Operational API Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
