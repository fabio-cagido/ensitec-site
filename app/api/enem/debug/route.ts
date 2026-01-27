import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Para o Transaction Pooler do Supabase, precisamos de configurações específicas
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 30000,  // 30 segundos para conectar
        idleTimeoutMillis: 30000,
        max: 1, // Manter apenas 1 conexão no pool
    });

    try {
        const client = await pool.connect();

        try {
            // Listar todas as tabelas
            const tablesQuery = `
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            `;
            const tablesResult = await client.query(tablesQuery);
            const tables = tablesResult.rows.map(r => r.table_name);

            // Verificar estrutura da tabela enem_agregado_estado se existir
            let estadoColumns: any[] = [];
            let estadoSample: any[] = [];

            if (tables.includes('enem_agregado_estado')) {
                const columnsQuery = `
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = 'enem_agregado_estado'
                `;
                const columnsResult = await client.query(columnsQuery);
                estadoColumns = columnsResult.rows;

                // Pegar uma amostra
                const sampleQuery = `SELECT * FROM enem_agregado_estado LIMIT 3`;
                const sampleResult = await client.query(sampleQuery);
                estadoSample = sampleResult.rows;
            }

            // Verificar estrutura da tabela enem_agregado_cidade se existir
            let cidadeColumns: any[] = [];
            let cidadeSample: any[] = [];

            if (tables.includes('enem_agregado_cidade')) {
                const columnsQuery = `
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = 'enem_agregado_cidade'
                `;
                const columnsResult = await client.query(columnsQuery);
                cidadeColumns = columnsResult.rows;

                // Pegar uma amostra
                const sampleQuery = `SELECT * FROM enem_agregado_cidade LIMIT 3`;
                const sampleResult = await client.query(sampleQuery);
                cidadeSample = sampleResult.rows;
            }

            return NextResponse.json({
                success: true,
                tables,
                enem_agregado_estado: {
                    exists: tables.includes('enem_agregado_estado'),
                    columns: estadoColumns,
                    sample: estadoSample
                },
                enem_agregado_cidade: {
                    exists: tables.includes('enem_agregado_cidade'),
                    columns: cidadeColumns,
                    sample: cidadeSample
                }
            });

        } finally {
            client.release();
        }
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    } finally {
        await pool.end();
    }
}
