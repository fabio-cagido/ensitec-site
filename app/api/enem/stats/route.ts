import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Configuração explícita para debug
    console.log('Iniciando conexão com Supabase...');

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        statement_timeout: 10000, // 10s timeout
        connectionTimeoutMillis: 5000,
    });

    try {
        const client = await pool.connect();
        console.log('Conexão estabelecida! Executando query otimizada...');

        try {
            // Query amostral MUITO rápida (apenas 1% dos dados ou limite fixo)
            // Usando TABLESAMPLE SYSTEM (1) -> 1% dos blocos (aprox 40k linhas)
            const result = await client.query(`
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
      `);

            const stats = result.rows[0];
            console.log('Query executada com sucesso:', stats);

            const areas = [
                { area: 'Matemática', sigla: 'MT', media: stats.media_mt || 0 },
                { area: 'Linguagens', sigla: 'LC', media: stats.media_lc || 0 },
                { area: 'Ciências Humanas', sigla: 'CH', media: stats.media_ch || 0 },
                { area: 'Ciências Natureza', sigla: 'CN', media: stats.media_cn || 0 },
                { area: 'Redação', sigla: 'RED', media: stats.media_redacao || 0 },
            ];

            return NextResponse.json({
                total: parseInt(stats.total_estimado) || 0,
                medias: {
                    matematica: stats.media_mt || 0,
                    linguagens: stats.media_lc || 0,
                    humanas: stats.media_ch || 0,
                    natureza: stats.media_cn || 0,
                    redacao: stats.media_redacao || 0,
                },
                extremos: {
                    max_matematica: stats.max_mt || 0,
                    max_redacao: stats.max_redacao || 0,
                },
                areas: areas
            });

        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('ERRO DATABASE:', error);
        return NextResponse.json(
            { error: 'Erro ao conectar no banco', details: error.message },
            { status: 500 }
        );
    } finally {
        await pool.end();
    }
}
