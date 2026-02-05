import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
    const client = await pool.connect();
    try {
        console.log('--- Checking Columns for enem_agregado_estado ---');
        const res1 = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'enem_agregado_estado';
    `);
        res1.rows.forEach(r => console.log(`${r.column_name} (${r.data_type})`));

        console.log('\n--- Checking Columns for enem_agregado_cidade ---');
        const res2 = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'enem_agregado_cidade';
    `);
        res2.rows.forEach(r => console.log(`${r.column_name} (${r.data_type})`));

    } catch (err) {
        console.error('Error querying schema:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

checkSchema();
