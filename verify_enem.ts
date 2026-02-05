
import { query } from './lib/db';

async function verifyTable() {
    try {
        console.log('--- Checking Columns for enem_agregado_estado ---');
        // Tenta pegar uma linha qualquer para ver as chaves (nomes de colunas)
        const res = await query('SELECT * FROM enem_agregado_estado LIMIT 1');

        if (res.rows.length === 0) {
            console.log('Tabela existe mas está vazia. Consultando information_schema...');
            const resSchema = await query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'enem_agregado_estado';
            `);
            console.log('Colunas:', resSchema.rows.map(r => r.column_name).join(', '));
        } else {
            console.log('Colunas encontradas:', Object.keys(res.rows[0]).join(', '));
        }

    } catch (e: any) {
        console.error('ERRO AO ACESSAR TABELA:', e.message);
    }
}

verifyTable();
