
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Script manual sem usar lib/db.ts para controlar SSL
async function verifyTable() {
    console.log('--- Tentando conectar SEM SSL ---');
    // Remove query params de sslmode se houver na string
    const connStr = process.env.DATABASE_URL?.split('?')[0];

    // Tenta sem SSL explicitamente
    const pool = new Pool({
        connectionString: connStr,
        ssl: false
    });

    try {
        const client = await pool.connect();
        console.log('Conexão realizada!');
        const res = await client.query('SELECT * FROM enem_agregado_estado LIMIT 1');

        if (res.rows.length === 0) {
            console.log('Tabela vazia.');
        } else {
            console.log('Colunas encontradas:', Object.keys(res.rows[0]).join(', '));
        }
        client.release();
    } catch (e: any) {
        console.error('ERRO SEM SSL:', e.message);

        // Se falhar, tenta COM ssl (fallback)
        console.log('\n--- Tentando conectar COM SSL ---');
        const poolSSL = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });

        try {
            const clientSSL = await poolSSL.connect();
            console.log('Conexão SSL realizada!');
            const res = await clientSSL.query('SELECT * FROM enem_agregado_estado LIMIT 1');
            console.log('Colunas encontradas:', Object.keys(res.rows[0]).join(', '));
            clientSSL.release();
            await poolSSL.end();
        } catch (errSSL: any) {
            console.error('ERRO COM SSL:', errSSL.message);
        }
    } finally {
        await pool.end();
    }
}

verifyTable();
