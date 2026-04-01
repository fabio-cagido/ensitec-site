import { Pool } from 'pg';

let poolRestaurante: Pool | null = null;

/**
 * Pool de conexão exclusivo para o banco de dados de Restaurantes.
 * Usa a variável de ambiente DATABASE_URL_RESTAURANTE.
 * Quando migrar para o Supabase principal, basta trocar a variável.
 */
export function getPoolRestaurante() {
    if (!poolRestaurante) {
        const dbUrl = process.env.DATABASE_URL_RESTAURANTE || '';

        const isLocalDb = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');

        poolRestaurante = new Pool({
            connectionString: dbUrl,
            ssl: isLocalDb ? false : { rejectUnauthorized: false },
            connectionTimeoutMillis: 10000,
            statement_timeout: 45000,
        });
    }
    return poolRestaurante;
}

export async function queryRestaurante(text: string, params?: any[]) {
    const currentPool = getPoolRestaurante();
    return currentPool.query(text, params);
}
