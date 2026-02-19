
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

const NAMES = ["Arthur", "Miguel", "Heitor", "Gael", "Théo", "Davi", "Gabriel", "Bernardo", "Samuel", "João", "Helena", "Alice", "Laura", "Maria", "Sophia", "Manuela", "Maitê", "Liz", "Cecília", "Isabella"];
const SURNAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida"];
const SUBJECTS = ["Matemática", "Português", "História", "Física", "Química", "Biologia", "Geografia"];
const CLASSES = ["1A", "1B", "2A", "2B", "3A", "3B"];
const UNITS = ["Centro", "Sul", "Norte"];

function randomChoice(arr: any[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min) + min); }
function randomFloat(min: number, max: number) { return Math.random() * (max - min) + min; }

export async function GET() {
    let client;
    try {
        const pool = getPool();
        client = await pool.connect();

        await client.query('BEGIN');

        // 1. Clear Data
        try {
            await client.query('TRUNCATE TABLE financeiro_mensalidades, desempenho_academico, alunos, escolas, financeiro_despesas, operacional_chamados, metricas_mensais CASCADE');
        } catch (e) {
            console.log('Truncate warning:', e);
        }

        // 2. Insert Schools (Units)
        const schoolIds: string[] = [];
        for (const unitName of UNITS) {
            const res = await client.query(
                'INSERT INTO escolas (id, nome, cidade, estado) VALUES ($1, $2, $3, $4) RETURNING id',
                [randomUUID(), `Unidade ${unitName}`, "São Paulo", "SP"]
            );
            schoolIds.push(res.rows[0].id);
        }

        // 3. Insert Alunos
        for (let i = 0; i < 200; i++) {
            const studentId = randomUUID();
            const schoolId = randomChoice(schoolIds);
            const firstName = randomChoice(NAMES);
            const lastName = `${randomChoice(SURNAMES)} ${randomChoice(SURNAMES)}`;
            const fullName = `${firstName} ${lastName}`;
            const gender = Math.random() > 0.5 ? 'M' : 'F';
            const yearOfBirth = randomInt(2008, 2013);
            const dob = `${yearOfBirth}-${randomInt(1, 12)}-${randomInt(1, 28)}`;
            const turma = randomChoice(CLASSES);

            let status = 'Ativo';
            const r = Math.random();
            if (r > 0.85) status = 'Inadimplente';
            if (r > 0.95) status = 'Evadido';

            let segmento = 'Fundamental II';
            if (turma.startsWith('1') || turma.startsWith('2') || turma.startsWith('3')) segmento = 'Ensino Médio';

            const bolsista = Math.random() < 0.2;
            const tem_irmaos = Math.random() < 0.3;
            const cor_raca = randomChoice(['Branca', 'Parda', 'Preta', 'Amarela']);
            const faixa_renda = randomChoice(['Até 3 SM', '3-6 SM', '6-10 SM']);

            // Insert Student with fallback for missing columns
            try {
                await client.query(
                    `INSERT INTO alunos (id, escola_id, nome_completo, data_nascimento, genero, turma, segmento, status_matricula, bolsista, tem_irmaos, cor_raca, faixa_renda) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                    [studentId, schoolId, fullName, dob, gender, turma, segmento, status, bolsista, tem_irmaos, cor_raca, faixa_renda]
                );
            } catch (err) {
                await client.query(
                    `INSERT INTO alunos (id, escola_id, nome_completo, data_nascimento, genero, turma, segmento, status_matricula, bolsista, tem_irmaos) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                    [studentId, schoolId, fullName, dob, gender, turma, segmento, status, bolsista, tem_irmaos]
                );
            }

            // Academic Performance
            if (status !== 'Evadido') {
                for (const subj of SUBJECTS) {
                    let media = randomFloat(4, 9.5);
                    let presenca = randomFloat(70, 100);
                    await client.query(
                        `INSERT INTO desempenho_academico (id, aluno_id, disciplina, media_final, percentual_presenca, ano_letivo)
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [randomUUID(), studentId, subj, media.toFixed(2), presenca.toFixed(2), 2024]
                    );
                }
            }

            // Financials
            for (let m = 1; m <= 6; m++) {
                const mesRef = `2024-${m.toString().padStart(2, '0')}-01`;
                await client.query(
                    `INSERT INTO financeiro_mensalidades (id, aluno_id, mes_referencia, valor, status_pagamento)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [randomUUID(), studentId, mesRef, bolsista ? 0 : 1500.00, status === 'Inadimplente' && m > 3 ? 'Atrasado' : 'Pago']
                );
            }
        }

        // 4. Operational & Expenses
        const CATEGORIES = ['Pessoal', 'Energia', 'Manutenção', 'Marketing', 'Insumos'];
        for (let i = 0; i < 50; i++) {
            const cat = randomChoice(CATEGORIES);
            const val = randomFloat(500, 5000);
            const date = `2024-${randomInt(1, 6)}-${randomInt(1, 28)}`;
            await client.query(
                `INSERT INTO financeiro_despesas (id, categoria, valor, data_despesa, descricao)
                 VALUES ($1, $2, $3, $4, $5)`,
                [randomUUID(), cat, val.toFixed(2), date, `Despesa de ${cat}`]
            );
        }

        // 5. Metrics
        for (let m = 1; m <= 6; m++) {
            const mesRef = `2024-${m.toString().padStart(2, '0')}-01`;
            await client.query(
                `INSERT INTO metricas_mensais (id, mes_referencia, tipo_metrica, valor, unidade) VALUES 
                 ($1, $2, 'nps', $3, 'score'),
                 ($4, $5, 'health_score', $6, 'score'),
                 ($7, $8, 'evasao', $9, '%')`,
                [
                    randomUUID(), mesRef, randomInt(60, 90),
                    randomUUID(), mesRef, randomInt(7, 10),
                    randomUUID(), mesRef, randomInt(0, 5)
                ]
            );
        }

        await client.query('COMMIT');
        return NextResponse.json({ success: true, message: "Database seeded successfully" });

    } catch (err: any) {
        if (client) await client.query('ROLLBACK');
        console.error("Seeding Error Details:", err);
        return NextResponse.json({
            success: false,
            error: err.message || "Unknown Error",
            stack: err.stack
        }, { status: 200 });
    } finally {
        if (client) client.release();
    }
}
