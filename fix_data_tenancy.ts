
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env.local') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
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

    } catch (e: any) {
        console.error('Error fixing data:', e.message);
    } finally {
        await pool.end();
    }
}
fix();
