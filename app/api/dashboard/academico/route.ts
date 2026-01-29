import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Média Global por Disciplina
        const disciplinePerformanceQuery = `
      SELECT 
        disciplina as name,
        CAST(AVG(media_final) AS NUMERIC(10,1)) as val
      FROM desempenho_academico
      GROUP BY disciplina
      ORDER BY val DESC
    `;
        const disciplineResult = await query(disciplinePerformanceQuery);

        // 2. Média Geral e Frequência Média
        const globalMetricsQuery = `
            SELECT 
                CAST(AVG(media_final) AS NUMERIC(10,1)) as media_global,
                CAST(AVG(percentual_presenca) AS NUMERIC(10,1)) as frequencia_media
            FROM desempenho_academico
        `;
        const globalMetricsResult = await query(globalMetricsQuery);
        const mediaGlobal = globalMetricsResult.rows[0]?.media_global || 0;
        const frequenciaMedia = globalMetricsResult.rows[0]?.frequencia_media || 0;

        // 3. Taxa de Aprovação (Notas >= 6.0 E Presença >= 75%)
        const approvalCountQuery = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN media_final >= 6.0 AND percentual_presenca >= 75 THEN 1 ELSE 0 END) as aprovados
        FROM desempenho_academico
    `;
        const approvalResult = await query(approvalCountQuery);
        const approvalRate = ((Number(approvalResult.rows[0]?.aprovados) || 0) / (Number(approvalResult.rows[0]?.total) || 1) * 100).toFixed(1);

        // 4. Alunos em Risco (Média < 6.0 ou Frequência < 75%)
        const riskQuery = `
        SELECT COUNT(DISTINCT aluno_id) as risk_count 
        FROM desempenho_academico 
        WHERE media_final < 6.0 OR percentual_presenca < 75
    `;
        const riskResult = await query(riskQuery);

        // 5. Histograma de Notas
        const histogramQuery = `
        SELECT 
            floor(media_final) as bucket,
            COUNT(*) as count
        FROM desempenho_academico
        GROUP BY floor(media_final)
        ORDER BY bucket
    `;
        const histogramResult = await query(histogramQuery);

        // 6. Evolução Histórica (Mockado pois não temos histórico mensal de notas na tabela simples)
        // Se a tabela tivesse data de registro da nota, poderíamos usar.
        // Vamos manter mockado para não quebrar o gráfico, mas idealmente teríamos uma tabela de histórico.

        return NextResponse.json({
            kpis: {
                mediaGlobal: Number(mediaGlobal),
                approvalRate: Number(approvalRate),
                riskCount: Number(riskResult.rows[0].risk_count),
                attendance: Number(frequenciaMedia),
                digitalEngagement: 68, // Mock - sem dados na base
                feedbackTime: 2.5 // Mock - sem dados na base
            },
            disciplinePerformance: disciplineResult.rows.map((r: any) => ({
                ...r,
                val: Number(r.val),
                color: Number(r.val) < 6 ? "bg-red-500" : Number(r.val) < 8 ? "bg-yellow-500" : "bg-emerald-500"
            })),
            histogram: Array.from({ length: 11 }, (_, i) => ({
                bucket: i,
                count: histogramResult.rows.find((r: any) => Number(r.bucket) === i)?.count || 0
            })),
            evolution: [
                { month: 'Fev', media: 7.2 },
                { month: 'Mar', media: 7.4 },
                { month: 'Abr', media: 7.5 },
                { month: 'Mai', media: 7.8 },
                { month: 'Jun', media: 7.7 },
                { month: 'Jul', media: 7.8 },
            ]
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Academic API Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
