import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Permitir até 60s no Vercel

export async function GET() {
    // Configuração otimizada para Supabase Transaction Pooler
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 45000,  // 45s para conectar (banco pode estar pausado)
        idleTimeoutMillis: 30000,
        max: 1,
    });

    try {
        const client = await pool.connect();

        try {
            // Query para médias nacionais usando dados agregados por estado
            // Usamos média ponderada pelo número de alunos de cada estado
            const nacionalQuery = `
                SELECT 
                    SUM("total_alunos") as total,
                    ROUND(SUM("NU_NOTA_CN" * "total_alunos") / NULLIF(SUM("total_alunos"), 0))::INTEGER as media_cn,
                    ROUND(SUM("NU_NOTA_CH" * "total_alunos") / NULLIF(SUM("total_alunos"), 0))::INTEGER as media_ch,
                    ROUND(SUM("NU_NOTA_LC" * "total_alunos") / NULLIF(SUM("total_alunos"), 0))::INTEGER as media_lc,
                    ROUND(SUM("NU_NOTA_MT" * "total_alunos") / NULLIF(SUM("total_alunos"), 0))::INTEGER as media_mt,
                    ROUND(SUM("NU_NOTA_REDACAO" * "total_alunos") / NULLIF(SUM("total_alunos"), 0))::INTEGER as media_redacao
                FROM enem_agregado_estado
            `;

            // Query para dados por estado (para o gráfico de barras)
            const estadosQuery = `
                SELECT 
                    "SG_UF_PROVA" as uf,
                    ROUND("NU_NOTA_MT")::INTEGER as media_mt,
                    ROUND("NU_NOTA_CN")::INTEGER as media_cn,
                    ROUND("NU_NOTA_CH")::INTEGER as media_ch,
                    ROUND("NU_NOTA_LC")::INTEGER as media_lc,
                    ROUND("NU_NOTA_REDACAO")::INTEGER as media_redacao,
                    "total_alunos"
                FROM enem_agregado_estado
                ORDER BY "NU_NOTA_MT" DESC
            `;

            const [nacionalResult, estadosResult] = await Promise.all([
                client.query(nacionalQuery),
                client.query(estadosQuery)
            ]);

            const stats = nacionalResult.rows[0];
            const estados = estadosResult.rows;

            const safeNumber = (val: any) => val ? Number(val) : 0;

            const areas = [
                { area: 'Matemática', sigla: 'MT', media: safeNumber(stats.media_mt) },
                { area: 'Linguagens', sigla: 'LC', media: safeNumber(stats.media_lc) },
                { area: 'Ciências Humanas', sigla: 'CH', media: safeNumber(stats.media_ch) },
                { area: 'Ciências Natureza', sigla: 'CN', media: safeNumber(stats.media_cn) },
                { area: 'Redação', sigla: 'RED', media: safeNumber(stats.media_redacao) },
            ];

            // Formatar dados por estado para o gráfico
            const estadosData = estados.map((e: any) => ({
                uf: e.uf,
                media_mt: safeNumber(e.media_mt),
                media_cn: safeNumber(e.media_cn),
                media_ch: safeNumber(e.media_ch),
                media_lc: safeNumber(e.media_lc),
                media_redacao: safeNumber(e.media_redacao),
                total_alunos: safeNumber(e.total_alunos)
            }));

            // Lista de UFs para o filtro
            const listaUFs = estados.map((e: any) => e.uf).sort();

            return NextResponse.json({
                total: safeNumber(stats.total),
                medias: {
                    matematica: safeNumber(stats.media_mt),
                    linguagens: safeNumber(stats.media_lc),
                    humanas: safeNumber(stats.media_ch),
                    natureza: safeNumber(stats.media_cn),
                    redacao: safeNumber(stats.media_redacao),
                },
                areas,
                estados: estadosData,
                listaUFs
            });

        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('API Error:', error.message);
        return NextResponse.json(
            {
                error: 'Erro de conexão/query',
                details: error.message,
                hint: 'Verifique se o banco Supabase está ativo e se as tabelas enem_agregado_estado e enem_agregado_cidade existem.'
            },
            { status: 500 }
        );
    } finally {
        await pool.end();
    }
}
