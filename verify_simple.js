
const fs = require('fs');
const { Pool } = require('pg');

async function run() {
    // 1. Carregar .env manualmente
    let dbUrl = process.env.DATABASE_URL;
    try {
        const envFile = fs.readFileSync('.env.local', 'utf8');
        const lines = envFile.split('\n');
        for (const line of lines) {
            if (line.startsWith('DATABASE_URL=')) {
                dbUrl = line.split('=')[1].trim().replace(/^"|"$/g, ''); // Tira aspas
            }
        }
    } catch (e) {
        console.log('Não foi possível ler .env, usando process.env');
    }

    if (!dbUrl) {
        console.error('DATABASE_URL não encontrada!');
        return;
    }

    console.log('URL encontrada (mascarada):', dbUrl.substring(0, 15) + '...');

    // 2. Conectar sem SSL
    console.log('Tentando conectar SEM SSL...');
    const pool = new Pool({
        connectionString: dbUrl,
        ssl: false
    });

    try {
        const client = await pool.connect();
        console.log('SUCESSO! Conectado sem SSL.');

        // 3. Verificar colunas
        console.log('\n--- Colunas enem_agregado_estado ---');
        const res = await client.query('SELECT * FROM enem_agregado_estado LIMIT 1');
        if (res.rows.length === 0) {
            console.log('Tabela vazia. Consultando schema...');
            const schemaRes = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'enem_agregado_estado'");
            console.log(schemaRes.rows.map(r => r.column_name).join(', '));
        } else {
            console.log(Object.keys(res.rows[0]).join(', '));
        }

        console.log('\n--- Colunas enem_agregado_cidade ---');
        const res2 = await client.query('SELECT * FROM enem_agregado_cidade LIMIT 1');
        if (res2.rows.length === 0) {
            console.log('Tabela vazia (cidade).');
            const schemaRes = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'enem_agregado_cidade'");
            console.log(schemaRes.rows.map(r => r.column_name).join(', '));
        } else {
            console.log(Object.keys(res2.rows[0]).join(', '));
        }

        client.release();
    } catch (err) {
        console.error('Falha ao conectar sem SSL:', err.message);

        // Se falhar, tentar com SSL
        console.log('\nTentando com SSL...');
        const poolSSL = new Pool({
            connectionString: dbUrl,
            ssl: { rejectUnauthorized: false }
        });
        try {
            const clientSSL = await poolSSL.connect();
            console.log('SUCESSO! Conectado COM SSL.');
            clientSSL.release();
            await poolSSL.end();
        } catch (errSSL) {
            console.error('Falha ao conectar COM SSL:', errSSL.message);
        }
    } finally {
        await pool.end();
    }
}

run();
