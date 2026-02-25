import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const uf = searchParams.get('uf');
    const cidade = searchParams.get('cidade');

    if (!uf || !cidade) {
        return NextResponse.json(
            { error: 'Parâmetros UF e cidade são obrigatórios' },
            { status: 400 }
        );
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 15000,
        statement_timeout: 30000,
        max: 1,
    });

    try {
        const client = await pool.connect();
        try {
            const bairrosQuery = `
                SELECT 
                    "NO_BAIRRO" as bairro,
                    ROUND(SUM("avg_mt" * "count_mt") / NULLIF(SUM("count_mt"), 0))::INTEGER as media_mt,
                    SUM("count_mt") as count_mt,
                    ROUND(SUM("avg_cn" * "count_cn") / NULLIF(SUM("count_cn"), 0))::INTEGER as media_cn,
                    SUM("count_cn") as count_cn,
                    ROUND(SUM("avg_ch" * "count_ch") / NULLIF(SUM("count_ch"), 0))::INTEGER as media_ch,
                    SUM("count_ch") as count_ch,
                    ROUND(SUM("avg_lc" * "count_lc") / NULLIF(SUM("count_lc"), 0))::INTEGER as media_lc,
                    SUM("count_lc") as count_lc,
                    ROUND(SUM("avg_redacao" * "count_redacao") / NULLIF(SUM("count_redacao"), 0))::INTEGER as media_redacao,
                    SUM("count_redacao") as count_redacao,
                    -- Média geral ponderada das 5 áreas (igual ao padrão dos outros drill-downs)
                    ROUND((
                        COALESCE(SUM("avg_mt" * "count_mt") / NULLIF(SUM("count_mt"), 0), 0) +
                        COALESCE(SUM("avg_cn" * "count_cn") / NULLIF(SUM("count_cn"), 0), 0) +
                        COALESCE(SUM("avg_ch" * "count_ch") / NULLIF(SUM("count_ch"), 0), 0) +
                        COALESCE(SUM("avg_lc" * "count_lc") / NULLIF(SUM("count_lc"), 0), 0) +
                        COALESCE(SUM("avg_redacao" * "count_redacao") / NULLIF(SUM("count_redacao"), 0), 0)
                    ) / 5)::INTEGER as media_geral
                FROM enem_agregado_bairro
                WHERE "SG_UF_PROVA" = $1
                  AND "NO_MUNICIPIO_PROVA" = $2
                  AND "NO_BAIRRO" IS NOT NULL
                  AND "NO_BAIRRO" <> ''
                  AND "avg_mt" > 0
                GROUP BY "NO_BAIRRO"
                ORDER BY media_geral DESC NULLS LAST
            `;

            const result = await client.query(bairrosQuery, [uf, cidade]);

            const safeNumber = (val: any) => (val !== null && val !== undefined ? Number(val) : 0);

            const bairros = result.rows.map((b: any) => ({
                bairro: b.bairro,
                media_mt: safeNumber(b.media_mt),
                media_cn: safeNumber(b.media_cn),
                media_ch: safeNumber(b.media_ch),
                media_lc: safeNumber(b.media_lc),
                media_redacao: safeNumber(b.media_redacao),
                media_geral: safeNumber(b.media_geral),
                total_alunos: safeNumber(b.count_redacao),
            }));

            return NextResponse.json({ uf, cidade, bairros });

        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('API Bairros Error:', error.message);
        return NextResponse.json(
            { error: 'Erro de conexão/query', details: error.message },
            { status: 500 }
        );
    } finally {
        await pool.end();
    }
}
