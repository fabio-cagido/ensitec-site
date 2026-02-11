import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const uf = searchParams.get('uf');
    const tpEscola = searchParams.get('tp_escola');
    const filterValue = (tpEscola && tpEscola !== 'Todas') ? tpEscola : null;

    if (!uf) {
        return NextResponse.json(
            { error: 'Parâmetro UF é obrigatório' },
            { status: 400 }
        );
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
        statement_timeout: 30000,
    });

    try {
        const client = await pool.connect();

        try {
            // Query para Top 10 cidades do estado selecionado
            // AGORA COM AGREGAÇÃO (GROUP BY) E FILTRO DE ESCOLA
            const cidadesQuery = `
                SELECT 
                    "NO_MUNICIPIO_PROVA" as cidade,
                    ROUND(SUM("avg_mt" * "count_mt") / NULLIF(SUM("count_mt"), 0))::INTEGER as media_mt,
                    SUM("count_mt") as "count_mt",
                    ROUND(SUM("avg_cn" * "count_cn") / NULLIF(SUM("count_cn"), 0))::INTEGER as media_cn,
                    SUM("count_cn") as "count_cn",
                    ROUND(SUM("avg_ch" * "count_ch") / NULLIF(SUM("count_ch"), 0))::INTEGER as media_ch,
                    SUM("count_ch") as "count_ch",
                    ROUND(SUM("avg_lc" * "count_lc") / NULLIF(SUM("count_lc"), 0))::INTEGER as media_lc,
                    SUM("count_lc") as "count_lc",
                    ROUND(SUM("avg_redacao" * "count_redacao") / NULLIF(SUM("count_redacao"), 0))::INTEGER as media_redacao,
                    SUM("count_redacao") as "count_redacao",
                    SUM("count_redacao") as total_alunos
                FROM enem_agregado_cidade
                WHERE "SG_UF_PROVA" = $1
                  AND "avg_mt" > 0 AND "avg_cn" > 0 AND "avg_ch" > 0 AND "avg_lc" > 0 AND "avg_redacao" > 0
                  AND ($2::text IS NULL OR "tp_escola_label" = $2)
                GROUP BY "NO_MUNICIPIO_PROVA"
                ORDER BY media_mt DESC
                LIMIT 10
            `;

            // Query para média do estado (KPIs)
            // AGORA COM AGREGAÇÃO E FILTRO
            const estadoQuery = `
                SELECT 
                    ROUND(SUM("avg_mt" * "count_mt") / NULLIF(SUM("count_mt"), 0))::INTEGER as media_mt,
                    SUM("count_mt") as "count_mt",
                    ROUND(SUM("avg_cn" * "count_cn") / NULLIF(SUM("count_cn"), 0))::INTEGER as media_cn,
                    SUM("count_cn") as "count_cn",
                    ROUND(SUM("avg_ch" * "count_ch") / NULLIF(SUM("count_ch"), 0))::INTEGER as media_ch,
                    SUM("count_ch") as "count_ch",
                    ROUND(SUM("avg_lc" * "count_lc") / NULLIF(SUM("count_lc"), 0))::INTEGER as media_lc,
                    SUM("count_lc") as "count_lc",
                    ROUND(SUM("avg_redacao" * "count_redacao") / NULLIF(SUM("count_redacao"), 0))::INTEGER as media_redacao,
                    SUM("count_redacao") as "count_redacao",
                    SUM("count_redacao") as total_alunos
                FROM enem_agregado_estado
                WHERE "SG_UF_PROVA" = $1
                  AND "avg_mt" > 0 AND "avg_cn" > 0 AND "avg_ch" > 0 AND "avg_lc" > 0 AND "avg_redacao" > 0
                  AND ($2::text IS NULL OR "tp_escola_label" = $2)
                GROUP BY "SG_UF_PROVA"
            `;

            const [cidadesResult, estadoResult] = await Promise.all([
                client.query(cidadesQuery, [uf, filterValue]),
                client.query(estadoQuery, [uf, filterValue])
            ]);

            const safeNumber = (val: any) => val ? Number(val) : 0;

            const cidades = cidadesResult.rows.map((c: any) => ({
                cidade: c.cidade,
                media_mt: safeNumber(c.media_mt),
                media_cn: safeNumber(c.media_cn),
                media_ch: safeNumber(c.media_ch),
                media_lc: safeNumber(c.media_lc),
                media_redacao: safeNumber(c.media_redacao),
                total_alunos: safeNumber(c.count_redacao) // Redação como proxy
            }));

            const estadoData = estadoResult.rows[0] ? {
                media_mt: safeNumber(estadoResult.rows[0].media_mt),
                media_cn: safeNumber(estadoResult.rows[0].media_cn),
                media_ch: safeNumber(estadoResult.rows[0].media_ch),
                media_lc: safeNumber(estadoResult.rows[0].media_lc),
                media_redacao: safeNumber(estadoResult.rows[0].media_redacao),
                total_alunos: safeNumber(estadoResult.rows[0].count_redacao)
            } : null;

            return NextResponse.json({
                uf,
                estado: estadoData,
                topCidades: cidades
            });

        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('API Cidades Error:', error.message);
        return NextResponse.json(
            { error: 'Erro de conexão/query', details: error.message },
            { status: 500 }
        );
    } finally {
        await pool.end();
    }
}
