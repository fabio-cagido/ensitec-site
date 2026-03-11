import { NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { sessionClaims, userId } = await auth();
        const metadata = sessionClaims?.metadata as any;

        // Local development + Fallback se as claims não estiverem no JWT
        let escolaId = metadata?.escola_id;

        if (!escolaId && userId) {
            try {
                const { clerkClient } = await import('@clerk/nextjs/server');
                const client = await clerkClient();
                const user = await client.users.getUser(userId);
                escolaId = user.publicMetadata?.escola_id;

                // Injetamos no objeto para o queryWithTenant
                if (sessionClaims) {
                    if (!sessionClaims.metadata) (sessionClaims as any).metadata = {};
                    (sessionClaims.metadata as any).escola_id = escolaId;
                }
            } catch (err) {
                console.error("Erro fallback Clerk Overview:", err);
            }
        }


        // 1. ACADÊMICO: Frequência Geral e Média Global
        // Pega média de presença e notas de todo o ano letivo atual
        const resAcademico = await queryWithTenant(`
            SELECT 
                AVG(percentual_presenca) as frequencia,
                AVG(media_final) as media_global
            FROM desempenho_academico
        `, [], sessionClaims);
        const frequencia = parseFloat(resAcademico.rows[0]?.frequencia || 0);
        const mediaGlobal = parseFloat(resAcademico.rows[0]?.media_global || 0);

        // 2. FINANCEIRO: Margem Líquida
        const resFinanceiroReceita = await queryWithTenant(`
            SELECT SUM(valor) as total FROM financeiro_mensalidades 
            WHERE status_pagamento ILIKE 'pago'
        `, [], sessionClaims);
        const resFinanceiroDespesa = await queryWithTenant(`
            SELECT SUM(valor) as total FROM financeiro_despesas
        `, [], sessionClaims);

        const receita = parseFloat(resFinanceiroReceita.rows[0]?.total || 0);
        const despesa = parseFloat(resFinanceiroDespesa.rows[0]?.total || 0);

        let margem = 0;
        if (receita > 0) {
            margem = ((receita - despesa) / receita) * 100;
        }

        // 3. CLIENTES: Total de Alunos
        const resClientes = await queryWithTenant(`
            SELECT COUNT(*) as total FROM alunos 
            WHERE status_matricula ILIKE 'ativo' OR status_matricula ILIKE 'matriculado'
        `, [], sessionClaims);
        const totalAlunos = parseInt(resClientes.rows[0]?.total || 0);
        const percBolsistas = 0;

        // 4. OPERACIONAL: Chamados Abertos
        const resOperacional = await queryWithTenant(`
            SELECT COUNT(*) as total FROM operacional_chamados 
            WHERE status ILIKE 'aberto' OR status ILIKE 'em_andamento' OR status ILIKE 'pendente'
        `, [], sessionClaims);
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
    }
}
