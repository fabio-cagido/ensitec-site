import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000, // 10s para conectar
        statement_timeout: 45000,       // 45s para rodar a query (aumentado)
    });

    try {
        const client = await pool.connect();

        try {
            // Tenta TABLESAMPLE (Rápido)
            const query = `
        SELECT 
          COUNT(*) * 100 as total_estimado,
          CAST(AVG("NU_NOTA_CN") AS INTEGER) as media_cn,
          CAST(AVG("NU_NOTA_CH") AS INTEGER) as media_ch,
          CAST(AVG("NU_NOTA_LC") AS INTEGER) as media_lc,
          CAST(AVG("NU_NOTA_MT") AS INTEGER) as media_mt,
          CAST(AVG("NU_NOTA_REDACAO") AS INTEGER) as media_redacao,
          CAST(MAX("NU_NOTA_MT") AS INTEGER) as max_mt,
          CAST(MAX("NU_NOTA_REDACAO") AS INTEGER) as max_redacao
        FROM resultados_enem_2024 TABLESAMPLE SYSTEM (1)
        WHERE "NU_NOTA_MT" IS NOT NULL
      `;

            const result = await client.query(query);
            const stats = result.rows[0];

            // Fallback para valores zerados se vier null
            const safeNumber = (val: any) => val ? Number(val) : 0;

            const areas = [
                { area: 'Matemática', sigla: 'MT', media: safeNumber(stats.media_mt) },
                { area: 'Linguagens', sigla: 'LC', media: safeNumber(stats.media_lc) },
                { area: 'Ciências Humanas', sigla: 'CH', media: safeNumber(stats.media_ch) },
                { area: 'Ciências Natureza', sigla: 'CN', media: safeNumber(stats.media_cn) },
                { area: 'Redação', sigla: 'RED', media: safeNumber(stats.media_redacao) },
            ];

            return NextResponse.json({
                total: safeNumber(stats.total_estimado),
                medias: {
                    matematica: safeNumber(stats.media_mt),
                    linguagens: safeNumber(stats.media_lc),
                    humanas: safeNumber(stats.media_ch),
                    natureza: safeNumber(stats.media_cn),
                    redacao: safeNumber(stats.media_redacao),
                },
                extremos: {
                    max_matematica: safeNumber(stats.max_mt),
                    max_redacao: safeNumber(stats.max_redacao),
                },
                areas: areas
            });

        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('API Error:', error.message);
        return NextResponse.json(
            { error: 'Erro de conexão/query', details: error.message },
            { status: 500 }
        );
    } finally {
        await pool.end();
    }
}
