
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
const dbUrl = dbUrlMatch[1];

const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
});

async function findActiveSchool() {
    try {
        console.log('Finding school with most data...');
        const res = await pool.query('SELECT escola_id, count(*) FROM desempenho_academico GROUP BY escola_id ORDER BY 2 DESC LIMIT 1');
        if (res.rows.length > 0) {
            console.log('BEST SCHOOL ID:', res.rows[0].escola_id);
            console.log('Records found:', res.rows[0].count);
        } else {
            console.log('No data found with any escola_id.');
        }
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await pool.end();
    }
}
findActiveSchool();
