
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const envPath = path.resolve(process.cwd(), '.env.local');
let envVars: any = {};

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envVars = envContent.split('\n').reduce((acc, line) => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
            if (key && value && !key.startsWith('#')) {
                acc[key] = value;
            }
        }
        return acc;
    }, {} as any);
}

const pool = new Pool({
    connectionString: envVars.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
});

async function check() {
    try {
        console.log('Connecting to DB...');
        // Check if table exists first
        const tableCheck = await pool.query("SELECT to_regclass('public.alunos')");
        if (!tableCheck.rows[0].to_regclass) {
            console.log('Table alunos does NOT exist.');
            return;
        }

        const res = await pool.query('SELECT count(*) FROM alunos');
        console.log('Alunos count:', res.rows[0].count);

        const fin = await pool.query('SELECT count(*) FROM financeiro_mensalidades');
        console.log('Financeiro count:', fin.rows[0].count);

        const des = await pool.query('SELECT count(*) FROM desempenho_academico');
        console.log('Desempenho count:', des.rows[0].count);

    } catch (e: any) {
        console.error('Check Error:', e.message);
    } finally {
        await pool.end();
    }
}
check();
