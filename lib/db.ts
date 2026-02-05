import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool() {
    if (!pool) {
        const dbUrl = process.env.DATABASE_URL || '';

        // Auto-detect SSL requirement based on connection string
        // Local databases (localhost, 127.0.0.1) typically don't support SSL
        const isLocalDb = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');

        pool = new Pool({
            connectionString: dbUrl,
            ssl: isLocalDb ? false : { rejectUnauthorized: false },
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
