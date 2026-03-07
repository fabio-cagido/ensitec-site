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

/**
 * Execute a query with tenant isolation (Row Level Security enabled via JWT).
 */
export async function queryWithTenant(text: string, params: any[] = [], sessionClaims: any) {
    const currentPool = getPool();
    const client = await currentPool.connect();

    try {
        await client.query('BEGIN');

        // Se temos Identity JWT do Clerk passamos pro Postgres
        // Desta forma o RLS (Row Level Security) fará o resto do trabalho!
        if (sessionClaims) {
            const configQuery = `SET LOCAL "request.jwt.claims" = $1`;
            await client.query(configQuery, [JSON.stringify(sessionClaims)]);
        }

        const res = await client.query(text, params);

        await client.query('COMMIT');
        return res;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}
