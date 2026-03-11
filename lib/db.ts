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

        if (sessionClaims && sessionClaims.metadata?.escola_id) {
            // Usamos set_config para passar o JSON de forma segura e compatível com parâmetros
            await client.query("SELECT set_config('request.jwt.claims', $1, true)", [JSON.stringify(sessionClaims)]);
        } else {
            await client.query("SELECT set_config('request.jwt.claims', '', true)");
        }

        const res = await client.query(text, params);
        await client.query('COMMIT');
        return res;
    } catch (e: any) {
        await client.query('ROLLBACK');
        console.error('--- DATABASE ERROR DETECTED ---');
        console.error('Query:', text);
        console.error('Error Message:', e.message);
        console.error('Error Code:', e.code);
        if (e.message.includes('permission denied')) {
            console.error('HINT: This looks like a Row Level Security (RLS) issue.');
        }
        throw e;
    } finally {
        client.release();
    }
}
