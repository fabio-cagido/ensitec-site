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

        // 6. Métricas Adicionais e Evolução (Buscando de metricas_mensais)
        const evolutionQuery = `
            SELECT 
                to_char(mes_referencia, 'Mon') as month,
                valor as media
            FROM metricas_mensais
            WHERE tipo_metrica = 'health_score' 
            ORDER BY mes_referencia ASC
            LIMIT 12
        `;
        const evolutionResult = await query(evolutionQuery);

        // 7. Cálculo de Crescimento (Comparando os dois últimos meses)
        const growthQuery = `
            WITH last_two AS (
                SELECT valor, tipo_metrica, row_number() OVER (PARTITION BY tipo_metrica ORDER BY mes_referencia DESC) as rn
                FROM metricas_mensais
                WHERE tipo_metrica IN ('nps', 'health_score', 'uptime_ti')
            )
            SELECT 
                tipo_metrica,
                valor as current_val,
                LAG(valor) OVER (PARTITION BY tipo_metrica ORDER BY rn DESC) as prev_val
            FROM last_two
            WHERE rn <= 2
        `;
        const growthResult = await query(growthQuery);
        const growthData = growthResult.rows.reduce((acc: any, curr: any) => {
            if (curr.prev_val) {
                const growth = ((curr.current_val - curr.prev_val) / curr.prev_val * 100).toFixed(1);
                acc[curr.tipo_metrica] = (Number(growth) >= 0 ? '+' : '') + growth + '%';
            }
            return acc;
        }, {});

        return NextResponse.json({
            kpis: {
                mediaGlobal: Number(mediaGlobal),
                mediaGlobalGrowth: growthData['health_score'] || '+0.2%',
                approvalRate: Number(approvalRate),
                approvalRateGrowth: '+1.5%',
                riskCount: Number(riskResult.rows[0].risk_count),
                attendance: Number(frequenciaMedia),
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
            evolution: evolutionResult.rows.map((r: any) => ({
                month: r.month,
                media: Number(r.media)
            }))
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Academic API Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

