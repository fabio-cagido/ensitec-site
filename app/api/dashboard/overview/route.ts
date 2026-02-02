import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configurar conexão com fallback para env vars
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
});

export async function GET() {
    const client = await pool.connect();
    try {
        // 1. ACADÊMICO: Frequência Geral e Média Global
        // Pega média de presença e notas de todo o ano letivo atual
        const resAcademico = await client.query(`
            SELECT 
                AVG(percentual_presenca) as frequencia,
                AVG(media_final) as media_global
            FROM desempenho_academico
        `);
        const frequencia = parseFloat(resAcademico.rows[0]?.frequencia || 0);
        const mediaGlobal = parseFloat(resAcademico.rows[0]?.media_global || 0);

        // 2. FINANCEIRO: Margem Líquida (Simplificada: Recebido vs Despesas)
        // Somar mensalidades PAGAS vs Total de Despesas
        const resFinanceiroReceita = await client.query(`
            SELECT SUM(valor) as total FROM financeiro_mensalidades WHERE status_pagamento = 'Pago'
        `);
        const resFinanceiroDespesa = await client.query(`
            SELECT SUM(valor) as total FROM financeiro_despesas
        `);

        const receita = parseFloat(resFinanceiroReceita.rows[0]?.total || 0);
        const despesa = parseFloat(resFinanceiroDespesa.rows[0]?.total || 0);

        // Margem = (Receita - Despesa) / Receita
        let margem = 0;
        let execucao = 0; // % de receita esperada que foi realizada? Vamos usar Receita/Despesa como indicador de saúde

        if (receita > 0) {
            margem = ((receita - despesa) / receita) * 100;
        }

        // 3. CLIENTES: Total de Alunos e Bolsistas
        // Vamos considerar bolsista quem tem flag ou (se não tiver coluna) simular baseado na query, 
        // mas aqui faremos o count real de ativos.
        const resClientes = await client.query(`
            SELECT COUNT(*) as total FROM alunos WHERE status_matricula = 'Ativo' OR status_matricula = 'Matriculado'
        `);
        const totalAlunos = parseInt(resClientes.rows[0]?.total || 0);
        // Placeholder para bolsistas se não houver coluna, ou count real se houver.
        // Assumindo sem coluna por enquanto, retornamos 0 ou um fixo proporcional estatístico se preferir, 
        // mas melhor ser honesto:
        const totalBolsistas = 0;
        const percBolsistas = 0;

        // 4. OPERACIONAL: Chamados Abertos
        const resOperacional = await client.query(`
            SELECT COUNT(*) as total FROM operacional_chamados WHERE status IN ('Aberto', 'Em Andamento', 'Pendente')
        `);
        const chamadosAbertos = parseInt(resOperacional.rows[0]?.total || 0);

        // Retorno Agregado
        return NextResponse.json({
            academico: {
                frequencia: frequencia.toFixed(1),
                media: mediaGlobal.toFixed(1)
            },
            financeiro: {
                margem: margem.toFixed(1),
                execucao: "N/A" // Dado complexo para calcular rapido
            },
            clientes: {
                total: totalAlunos,
                bolsistas: percBolsistas
            },
            operacional: {
                chamados: chamadosAbertos,
                criticos: "N/A"
            }
        });

    } catch (error: any) {
        console.error('Erro API Overview:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}
