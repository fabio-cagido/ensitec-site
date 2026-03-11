
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
const dbUrl = dbUrlMatch[1];

const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
});

async function fixAll() {
    const targetId = 'e0bb177a-9b33-42a2-adb0-499e6a27979f';
    console.log('Force linking all NULL records to:', targetId);

    try {
        // Tentar criar a escola se não existir (ignorar se já existir)
        await pool.query('INSERT INTO escolas (id, nome) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING', [targetId, 'Escola Local Teste']);
        console.log('School entry verified.');

        const tables = ['alunos', 'desempenho_academico', 'financeiro_mensalidades', 'financeiro_despesas', 'operacional_chamados'];

        for (const t of tables) {
            const res = await pool.query(`UPDATE ${t} SET escola_id = $1 WHERE escola_id IS NULL`, [targetId]);
            console.log(`Table ${t}: ${res.rowCount} records updated.`);
        }

    } catch (e) {
        console.error('Error during fix:', e.message);
    } finally {
        await pool.end();
    }
}
fixAll();
