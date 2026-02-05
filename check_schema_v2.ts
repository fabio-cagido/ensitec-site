
import { query } from './lib/db';

async function checkSchema() {
    try {
        console.log('--- Checking Columns for enem_agregado_estado ---');
        const res1 = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'enem_agregado_estado';
        `);
        if (res1.rows.length === 0) {
            console.log('Table enem_agregado_estado NOT FOUND');
        } else {
            res1.rows.forEach(r => console.log(`${r.column_name} (${r.data_type})`));
        }

        console.log('\n--- Checking Columns for enem_agregado_cidade ---');
        const res2 = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'enem_agregado_cidade';
        `);
        if (res2.rows.length === 0) {
            console.log('Table enem_agregado_cidade NOT FOUND');
        } else {
            res2.rows.forEach(r => console.log(`${r.column_name} (${r.data_type})`));
        }

    } catch (e: any) {
        console.error('Error:', e.message);
    }
}

checkSchema();
