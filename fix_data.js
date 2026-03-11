
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Carregar .env.local manualmente para evitar dependências extras
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);

if (!dbUrlMatch) {
    console.error('DATABASE_URL not found in .env.local');
    process.exit(1);
}

const dbUrl = dbUrlMatch[1];

const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
});

async function fix() {
    const targetId = 'e0bb177a-9b33-42a2-adb0-499e6a27979f';
    console.log('Linking records to school:', targetId);

    try {
        const r1 = await pool.query('UPDATE desempenho_academico SET escola_id = $1', [targetId]);
        console.log('Academic records linked:', r1.rowCount);

        const r2 = await pool.query('UPDATE financeiro_mensalidades SET escola_id = $1', [targetId]);
        console.log('Financial revenue linked:', r2.rowCount);

        const r3 = await pool.query('UPDATE financeiro_despesas SET escola_id = $1', [targetId]);
        console.log('Financial expenses linked:', r3.rowCount);

        const r4 = await pool.query('UPDATE operacional_chamados SET escola_id = $1', [targetId]);
        console.log('Operational tickets linked:', r4.rowCount);

        const r5 = await pool.query('UPDATE alunos SET escola_id = $1', [targetId]);
        console.log('Students linked:', r5.rowCount);

    } catch (e) {
        console.error('Error fixing data:', e.message);
    } finally {
        await pool.end();
    }
}
fix();
