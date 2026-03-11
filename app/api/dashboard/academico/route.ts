import { NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { sessionClaims } = await auth();
        const metadata = sessionClaims?.metadata as any;

        console.log('--- DEBUG ACADEMICO API ---');
        console.log('Escola ID recebido:', metadata?.escola_id);
        console.log('Role recebida:', metadata?.role);

        // Local dev allowance + Fallback se as claims não estiverem no JWT
        let escolaId = metadata?.escola_id;
        let userRole = metadata?.role;

        // Se estivermos logados mas o JWT não tem as claims (falta configurar JWT Template no Clerk)
        // buscamos direto via SDK
        const { userId } = await auth();
        if (!escolaId && userId) {
            try {
                const { clerkClient } = await import('@clerk/nextjs/server');
                const client = await clerkClient();
                const user = await client.users.getUser(userId);
                escolaId = user.publicMetadata?.escola_id;
                userRole = user.publicMetadata?.role;

                // Injetamos de volta no objeto para o queryWithTenant usar
                if (!sessionClaims.metadata) (sessionClaims as any).metadata = {};
                (sessionClaims.metadata as any).escola_id = escolaId;
                (sessionClaims.metadata as any).role = userRole;
            } catch (err) {
                console.error("Erro ao buscar fallback de metadata no Clerk:", err);
            }
        }

        // 1. Média Global por Disciplina
        const disciplinePerformanceQuery = `
      SELECT 
        disciplina as name,
        CAST(AVG(media_final) AS NUMERIC(10,1)) as val
      FROM desempenho_academico
      GROUP BY disciplina
      ORDER BY val DESC
    `;
        const disciplineResult = await queryWithTenant(disciplinePerformanceQuery, [], sessionClaims);

        // 2. Média Geral e Frequência Média
        const globalMetricsQuery = `
            SELECT 
                CAST(AVG(media_final) AS NUMERIC(10,1)) as media_global,
                CAST(AVG(percentual_presenca) AS NUMERIC(10,1)) as frequencia_media
            FROM desempenho_academico
        `;
        const globalMetricsResult = await queryWithTenant(globalMetricsQuery, [], sessionClaims);
        const mediaGlobal = globalMetricsResult.rows[0]?.media_global || 0;
        const frequenciaMedia = globalMetricsResult.rows[0]?.frequencia_media || 0;

        // 3. Taxa de Aprovação (Notas >= 6.0 E Presença >= 75%)
        const approvalCountQuery = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN media_final >= 6.0 AND percentual_presenca >= 75 THEN 1 ELSE 0 END) as aprovados
        FROM desempenho_academico
    `;
        const approvalResult = await queryWithTenant(approvalCountQuery, [], sessionClaims);
        const totalAlunos = Number(approvalResult.rows[0]?.total) || 0;
        const totalAprovados = Number(approvalResult.rows[0]?.aprovados) || 0;
        const approvalRate = totalAlunos > 0 ? ((totalAprovados / totalAlunos) * 100).toFixed(1) : "0.0";

        // 4. Alunos em Risco (Média < 6.0 ou Frequência < 75%)
        const riskQuery = `
        SELECT COUNT(DISTINCT aluno_id) as risk_count 
        FROM desempenho_academico 
        WHERE media_final < 6.0 OR percentual_presenca < 75
    `;
        const riskResult = await queryWithTenant(riskQuery, [], sessionClaims);
        const riskCount = riskResult.rows[0]?.risk_count || 0;

        // 5. Histograma de Notas
        const histogramQuery = `
        SELECT 
            floor(media_final) as bucket,
            COUNT(*) as count
        FROM desempenho_academico
        GROUP BY floor(media_final)
        ORDER BY bucket
    `;
        const histogramResult = await queryWithTenant(histogramQuery, [], sessionClaims);

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
        const evolutionResult = await queryWithTenant(evolutionQuery, [], sessionClaims);

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
        const growthResult = await queryWithTenant(growthQuery, [], sessionClaims);
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
                riskCount: Number(riskCount),
                attendance: Number(frequenciaMedia),
                digitalEngagement: 85 // Mocked for now as it's static in UI
            },
            disciplinePerformance: (disciplineResult.rows || []).map((r: any) => ({
                ...r,
                val: Number(r.val),
                color: Number(r.val) < 6 ? "bg-red-500" : Number(r.val) < 8 ? "bg-yellow-500" : "bg-emerald-500"
            })),
            histogram: Array.from({ length: 11 }, (_, i) => ({
                bucket: i,
                count: histogramResult.rows.find((r: any) => Number(r.bucket) === i)?.count || 0
            })),
            evolution: (evolutionResult.rows || []).map((r: any) => ({
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

