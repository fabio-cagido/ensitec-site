import { query } from './lib/db';

async function listSchema() {
    try {
        const res = await query(`
            SELECT 
                table_name, 
                column_name, 
                data_type,
                is_nullable
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            ORDER BY table_name, ordinal_position;
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error fetching schema:', err);
    }
}

listSchema();
