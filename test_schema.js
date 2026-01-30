const { Pool } = require('pg');

async function listSchema() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const res = await pool.query(`
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
    } finally {
        await pool.end();
    }
}

listSchema();
