import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 10000,
            statement_timeout: 45000,
        });
    }
    return pool;
}

export async function query(text: string, params?: any[]) {
    const currentPool = getPool();
    return currentPool.query(text, params);
}
