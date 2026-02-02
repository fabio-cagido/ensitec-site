
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = envContent.split('\n').reduce((acc: any, line) => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        acc[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
    }
    return acc;
}, {});

const pool = new Pool({
    connectionString: envVars.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function check() {
    const client = await pool.connect();
    try {
        console.log("--- COLUNAS ALUNOS ---");
        const resAlunos = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'alunos';
        `);
        resAlunos.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type}`));

        console.log("\n--- COLUNAS OPERACIONAL_CHAMADOS ---");
        const resChamados = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'operacional_chamados';
        `);
        resChamados.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type}`));

        console.log("\n--- COUNT CHAMADOS ---");
        const count = await client.query('SELECT count(*) FROM operacional_chamados');
        console.log("Total: " + count.rows[0].count);

    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        await pool.end();
    }
}
check();
