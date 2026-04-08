
const { Pool } = require('pg');
async function check() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL_RESTAURANTE,
        ssl: { rejectUnauthorized: false }
    });
    try {
        const res = await pool.query(`
            SELECT 
                t.table_name, 
                array_agg(c.column_name || ' (' || c.data_type || ')') as columns
            FROM information_schema.tables t
            JOIN information_schema.columns c ON t.table_name = c.table_name
            WHERE t.table_schema = 'public'
            GROUP BY t.table_name
        `);
        console.log("DATABASE STRUCTURE:");
        res.rows.forEach(row => {
            console.log(`Table: ${row.table_name}`);
            console.log(`Columns: ${row.columns.join(', ')}`);
            console.log("-------");
        });
    } catch (e) { console.error(e); }
    finally { await pool.end(); }
}
check();
