
import { query } from './lib/db';

async function check() {
    try {
        console.log('Checking database...');
        const res = await query('SELECT count(*) FROM alunos');
        console.log('Alunos count:', res.rows[0].count);
    } catch (e: any) {
        console.error('Error:', e.message);
    }
}

check();
