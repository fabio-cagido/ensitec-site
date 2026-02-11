
import { query } from './lib/db';

async function inspect() {
    try {
        console.log('--- Colunas em enem_agregado_estado ---');
        const cols = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'enem_agregado_estado'
            ORDER BY ordinal_position;
        `);
        cols.rows.forEach(r => console.log(`${r.column_name} (${r.data_type})`));

        console.log('\n--- Valores distintos em tp_escola_label ---');
        const distinct = await query(`
            SELECT "tp_escola_label", count(*) 
            FROM enem_agregado_estado 
            GROUP BY "tp_escola_label";
        `);
        console.log(distinct.rows);

    } catch (e: any) {
        console.error('Erro:', e.message);
    }
}

inspect();
