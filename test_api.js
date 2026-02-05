const fs = require('fs');
const { Pool } = require('pg');

async function testAPI() {
    // Carregar .env.local
    let dbUrl = '';
    try {
        const envFile = fs.readFileSync('.env.local', 'utf8');
        const lines = envFile.split('\n');
        for (const line of lines) {
            if (line.startsWith('DATABASE_URL=')) {
                dbUrl = line.split('=')[1].trim().replace(/^"|"$/g, '');
            }
        }
    } catch (e) {
        console.error('Erro ao ler .env.local:', e.message);
        return;
    }

    console.log('Testando query da API Stats...\n');

    // Detectar SSL
    const isLocalDb = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
    console.log('SSL:', isLocalDb ? 'DESABILITADO (local)' : 'HABILITADO (remoto)');

    const pool = new Pool({
        connectionString: dbUrl,
        ssl: isLocalDb ? false : { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
    });

    try {
        const client = await pool.connect();
        console.log('✓ Conexão estabelecida\n');

        // Testar query nacional (igual à API)
        console.log('Executando nacionalQuery...');
        const nacionalQuery = `
            SELECT 
                SUM("count_redacao") as total,
                ROUND(SUM("avg_cn" * "count_cn") / NULLIF(SUM("count_cn"), 0))::INTEGER as media_cn,
                SUM("count_cn") as count_cn,
                ROUND(SUM("avg_ch" * "count_ch") / NULLIF(SUM("count_ch"), 0))::INTEGER as media_ch,
                SUM("count_ch") as count_ch,
                ROUND(SUM("avg_lc" * "count_lc") / NULLIF(SUM("count_lc"), 0))::INTEGER as media_lc,
                SUM("count_lc") as count_lc,
                ROUND(SUM("avg_mt" * "count_mt") / NULLIF(SUM("count_mt"), 0))::INTEGER as media_mt,
                SUM("count_mt") as count_mt,
                ROUND(SUM("avg_redacao" * "count_redacao") / NULLIF(SUM("count_redacao"), 0))::INTEGER as media_redacao,
                SUM("count_redacao") as count_redacao
            FROM enem_agregado_estado
        `;

        const res1 = await client.query(nacionalQuery);
        console.log('✓ nacionalQuery executada com sucesso');
        console.log('Resultado:', res1.rows[0]);

        // Testar query estados
        console.log('\nExecutando estadosQuery...');
        const estadosQuery = `
            SELECT 
                "SG_UF_PROVA" as uf,
                ROUND("avg_mt")::INTEGER as media_mt,
                "count_mt",
                ROUND("avg_cn")::INTEGER as media_cn,
                "count_cn",
                ROUND("avg_ch")::INTEGER as media_ch,
                "count_ch",
                ROUND("avg_lc")::INTEGER as media_lc,
                "count_lc",
                ROUND("avg_redacao")::INTEGER as media_redacao,
                "count_redacao"
            FROM enem_agregado_estado
            ORDER BY "avg_mt" DESC
        `;

        const res2 = await client.query(estadosQuery);
        console.log('✓ estadosQuery executada com sucesso');
        console.log(`Retornou ${res2.rows.length} estados`);
        console.log('Primeiro estado:', res2.rows[0]);

        client.release();
        console.log('\n✓ TODAS AS QUERIES FUNCIONARAM!');
    } catch (err) {
        console.error('\n✗ ERRO:', err.message);
        console.error('Stack:', err.stack);
    } finally {
        await pool.end();
    }
}

testAPI();
