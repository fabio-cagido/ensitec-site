import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const uf = searchParams.get('uf');

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
            const cidadesQuery = `
                SELECT 
                    "NO_MUNICIPIO_PROVA" as cidade,
                    CAST("NU_NOTA_MT" AS INTEGER) as media_mt,
                    CAST("NU_NOTA_CN" AS INTEGER) as media_cn,
                    CAST("NU_NOTA_CH" AS INTEGER) as media_ch,
                    CAST("NU_NOTA_LC" AS INTEGER) as media_lc,
                    CAST("NU_NOTA_REDACAO" AS INTEGER) as media_redacao,
                    "total_alunos"
                FROM enem_agregado_cidade
                WHERE "SG_UF_PROVA" = $1
                ORDER BY "NU_NOTA_MT" DESC
                LIMIT 10
            `;

            // Query para média do estado
            const estadoQuery = `
                SELECT 
                    CAST("NU_NOTA_MT" AS INTEGER) as media_mt,
                    CAST("NU_NOTA_CN" AS INTEGER) as media_cn,
                    CAST("NU_NOTA_CH" AS INTEGER) as media_ch,
                    CAST("NU_NOTA_LC" AS INTEGER) as media_lc,
                    CAST("NU_NOTA_REDACAO" AS INTEGER) as media_redacao,
                    "total_alunos"
                FROM enem_agregado_estado
                WHERE "SG_UF_PROVA" = $1
            `;

            const [cidadesResult, estadoResult] = await Promise.all([
                client.query(cidadesQuery, [uf]),
                client.query(estadoQuery, [uf])
            ]);

            const safeNumber = (val: any) => val ? Number(val) : 0;

            const cidades = cidadesResult.rows.map((c: any) => ({
                cidade: c.cidade,
                media_mt: safeNumber(c.media_mt),
                media_cn: safeNumber(c.media_cn),
                media_ch: safeNumber(c.media_ch),
                media_lc: safeNumber(c.media_lc),
                media_redacao: safeNumber(c.media_redacao),
                total_alunos: safeNumber(c.total_alunos)
            }));

            const estadoData = estadoResult.rows[0] ? {
                media_mt: safeNumber(estadoResult.rows[0].media_mt),
                media_cn: safeNumber(estadoResult.rows[0].media_cn),
                media_ch: safeNumber(estadoResult.rows[0].media_ch),
                media_lc: safeNumber(estadoResult.rows[0].media_lc),
                media_redacao: safeNumber(estadoResult.rows[0].media_redacao),
                total_alunos: safeNumber(estadoResult.rows[0].total_alunos)
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
