import { NextResponse, NextRequest } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Permitir até 60s no Vercel

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const tpEscola = searchParams.get('tp_escola');
    // Se tpEscola for "Todas" ou vazio, tratamos como NULL para o banco ignorar o filtro
    const filterValue = (tpEscola && tpEscola !== 'Todas') ? tpEscola : null;

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
            // IMPORTANTE: Cada área é calculada INDEPENDENTEMENTE com seu próprio denominador
            // Filtramos avg > 0 para excluir eliminados/ausentes (conforme Sinopse INEP)
            // ADICIONADO: Filtro por tp_escola_label
            const nacionalQuery = `
                SELECT 
                    -- Total geral (usando redação como proxy de inscritos ativos)
                    (SELECT SUM("count_redacao") FROM enem_agregado_estado WHERE "avg_redacao" > 0 AND ($1::text IS NULL OR "tp_escola_label" = $1)) as total,
                    
                    -- Ciências da Natureza (CN)
                    (SELECT ROUND(SUM("avg_cn" * "count_cn") / NULLIF(SUM("count_cn"), 0))::INTEGER 
                     FROM enem_agregado_estado WHERE "avg_cn" > 0 AND ($1::text IS NULL OR "tp_escola_label" = $1)) as media_cn,
                    (SELECT SUM("count_cn") FROM enem_agregado_estado WHERE "avg_cn" > 0 AND ($1::text IS NULL OR "tp_escola_label" = $1)) as count_cn,
                    
                    -- Ciências Humanas (CH)
                    (SELECT ROUND(SUM("avg_ch" * "count_ch") / NULLIF(SUM("count_ch"), 0))::INTEGER 
                     FROM enem_agregado_estado WHERE "avg_ch" > 0 AND ($1::text IS NULL OR "tp_escola_label" = $1)) as media_ch,
                    (SELECT SUM("count_ch") FROM enem_agregado_estado WHERE "avg_ch" > 0 AND ($1::text IS NULL OR "tp_escola_label" = $1)) as count_ch,
                    
                    -- Linguagens e Códigos (LC)
                    (SELECT ROUND(SUM("avg_lc" * "count_lc") / NULLIF(SUM("count_lc"), 0))::INTEGER 
                     FROM enem_agregado_estado WHERE "avg_lc" > 0 AND ($1::text IS NULL OR "tp_escola_label" = $1)) as media_lc,
                    (SELECT SUM("count_lc") FROM enem_agregado_estado WHERE "avg_lc" > 0 AND ($1::text IS NULL OR "tp_escola_label" = $1)) as count_lc,
                    
                    -- Matemática (MT)
                    (SELECT ROUND(SUM("avg_mt" * "count_mt") / NULLIF(SUM("count_mt"), 0))::INTEGER 
                     FROM enem_agregado_estado WHERE "avg_mt" > 0 AND ($1::text IS NULL OR "tp_escola_label" = $1)) as media_mt,
                    (SELECT SUM("count_mt") FROM enem_agregado_estado WHERE "avg_mt" > 0 AND ($1::text IS NULL OR "tp_escola_label" = $1)) as count_mt,
                    
                    -- Redação (RED)
                    (SELECT ROUND(SUM("avg_redacao" * "count_redacao") / NULLIF(SUM("count_redacao"), 0))::INTEGER 
                     FROM enem_agregado_estado WHERE "avg_redacao" > 0 AND ($1::text IS NULL OR "tp_escola_label" = $1)) as media_redacao,
                    (SELECT SUM("count_redacao") FROM enem_agregado_estado WHERE "avg_redacao" > 0 AND ($1::text IS NULL OR "tp_escola_label" = $1)) as count_redacao
            `;

            // Query para dados por estado (para o gráfico de barras)
            // Filtrando apenas estados com médias válidas (> 0)
            // AGORA COM GROUP BY PARA SUPORTAR O FILTRO (AGREGAÇÃO DE MÚLTIPLAS LINHAS SE "TODAS" OU ESPECÍFICO)
            const estadosQuery = `
                SELECT 
                    "SG_UF_PROVA" as uf,
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
                WHERE "avg_mt" > 0 AND "avg_cn" > 0 AND "avg_ch" > 0 AND "avg_lc" > 0 AND "avg_redacao" > 0
                AND ($1::text IS NULL OR "tp_escola_label" = $1)
                GROUP BY "SG_UF_PROVA"
                ORDER BY media_mt DESC
            `;

            const [nacionalResult, estadosResult] = await Promise.all([
                client.query(nacionalQuery, [filterValue]),
                client.query(estadosQuery, [filterValue])
            ]);

            const stats = nacionalResult.rows[0];
            const estados = estadosResult.rows;

            const safeNumber = (val: any) => val ? Number(val) : 0;

            const areas = [
                { area: 'Matemática', sigla: 'MT', media: safeNumber(stats.media_mt), count: safeNumber(stats.count_mt) },
                { area: 'Linguagens', sigla: 'LC', media: safeNumber(stats.media_lc), count: safeNumber(stats.count_lc) },
                { area: 'Ciências Humanas', sigla: 'CH', media: safeNumber(stats.media_ch), count: safeNumber(stats.count_ch) },
                { area: 'Ciências Natureza', sigla: 'CN', media: safeNumber(stats.media_cn), count: safeNumber(stats.count_cn) },
                { area: 'Redação', sigla: 'RED', media: safeNumber(stats.media_redacao), count: safeNumber(stats.count_redacao) },
            ];

            // Formatar dados por estado para o gráfico
            const estadosData = estados.map((e: any) => ({
                uf: e.uf,
                media_mt: safeNumber(e.media_mt),
                media_cn: safeNumber(e.media_cn),
                media_ch: safeNumber(e.media_ch),
                media_lc: safeNumber(e.media_lc),
                media_redacao: safeNumber(e.media_redacao),
                total_alunos: safeNumber(e.count_redacao) // Redação como proxy de total
            }));

            // Lista de UFs para o filtro (pode vir de todos os dados ou dados filtrados - vou manter dinâmico)
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
                counts: {
                    matematica: safeNumber(stats.count_mt),
                    linguagens: safeNumber(stats.count_lc),
                    humanas: safeNumber(stats.count_ch),
                    natureza: safeNumber(stats.count_cn),
                    redacao: safeNumber(stats.count_redacao),
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
