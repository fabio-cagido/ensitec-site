import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const uf = searchParams.get('uf');
    const cidade = searchParams.get('cidade');
    // Aceita múltiplos: ?bairros=A&bairros=B  ou  legado: ?bairro=A
    const bairros = searchParams.getAll('bairros');
    const bairroLegado = searchParams.get('bairro');
    const bairrosList = bairros.length > 0 ? bairros : (bairroLegado ? [bairroLegado] : []);

    if (!uf || !cidade || bairrosList.length === 0) {
        return NextResponse.json(
            { error: 'Parâmetros UF, cidade e ao menos um bairro são obrigatórios' },
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
            // Gera os placeholders dinâmicos para o IN (...)
            // $1 = uf, $2 = cidade, $3...$N = bairros
            const placeholders = bairrosList.map((_, i) => `$${i + 3}`).join(', ');

            const escolasQuery = `
                SELECT 
                    "NO_ENTIDADE" as escola,
                    UPPER("NO_BAIRRO") as bairro,
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
                    ROUND((
                        COALESCE(SUM("avg_mt" * "count_mt") / NULLIF(SUM("count_mt"), 0), 0) +
                        COALESCE(SUM("avg_cn" * "count_cn") / NULLIF(SUM("count_cn"), 0), 0) +
                        COALESCE(SUM("avg_ch" * "count_ch") / NULLIF(SUM("count_ch"), 0), 0) +
                        COALESCE(SUM("avg_lc" * "count_lc") / NULLIF(SUM("count_lc"), 0), 0) +
                        COALESCE(SUM("avg_redacao" * "count_redacao") / NULLIF(SUM("count_redacao"), 0), 0)
                    ) / 5)::INTEGER as media_geral
                FROM enem_agregado_escola
                WHERE UPPER("SG_UF_PROVA") = UPPER($1)
                  AND UPPER("NO_MUNICIPIO_PROVA") = UPPER($2)
                  AND UPPER("NO_BAIRRO") IN (${placeholders})
                  AND "NO_ENTIDADE" IS NOT NULL
                GROUP BY "NO_ENTIDADE", UPPER("NO_BAIRRO")
                ORDER BY media_geral DESC NULLS LAST
            `;

            const result = await client.query(escolasQuery, [uf, cidade, ...bairrosList]);

            const safeNumber = (val: any) => (val !== null && val !== undefined ? Number(val) : 0);

            const escolas = result.rows.map((e: any) => ({
                escola: e.escola,
                bairro: e.bairro,
                media_mt: safeNumber(e.media_mt),
                media_cn: safeNumber(e.media_cn),
                media_ch: safeNumber(e.media_ch),
                media_lc: safeNumber(e.media_lc),
                media_redacao: safeNumber(e.media_redacao),
                media_geral: safeNumber(e.media_geral),
                total_alunos: safeNumber(e.count_redacao),
            }));

            return NextResponse.json({ uf, cidade, bairros: bairrosList, escolas });

        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('API Escolas Error:', error.message);
        return NextResponse.json(
            { error: 'Erro de conexão/query', details: error.message },
            { status: 500 }
        );
    } finally {
        await pool.end();
    }
}
