
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';

// Load Env
const envPath = path.resolve(process.cwd(), '.env.local');
let envVars: any = {};
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envVars = envContent.split('\n').reduce((acc, line) => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
            if (key && !key.startsWith('#')) acc[key] = value;
        }
        return acc;
    }, {} as any);
}

const pool = new Pool({
    connectionString: envVars.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
});

const SCHOOLS = [
    { nome: "Escola Ensitec Modelo", cidade: "Rio de Janeiro", estado: "RJ" }
];

const NAMES = ["Arthur", "Miguel", "Heitor", "Gael", "Théo", "Davi", "Gabriel", "Bernardo", "Samuel", "João", "Helena", "Alice", "Laura", "Maria", "Sophia", "Manuela", "Maitê", "Liz", "Cecília", "Isabella"];
const SURNAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida"];
const SUBJECTS = ["Matemática", "Português", "História", "Física", "Química", "Biologia", "Geografia"];
const CLASSES = ["1A", "1B", "2A", "2B", "3A", "3B"];

function randomChoice(arr: any[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min) + min); }
function randomFloat(min: number, max: number) { return Math.random() * (max - min) + min; }

async function seed() {
    const client = await pool.connect();
    try {
        console.log('🌱 Starting Optimized Seed Process...');
        await client.query('BEGIN');

        // 1. Clear Data
        console.log('🧹 Clearing existing data...');
        await client.query('TRUNCATE TABLE financeiro_mensalidades, desempenho_academico, alunos, escolas, financeiro_despesas, operacional_chamados, metricas_mensais CASCADE');

        // 2. Insert School
        console.log('🏫 Creating School...');
        const schoolRes = await client.query(
            'INSERT INTO escolas (id, nome, cidade, estado) VALUES ($1, $2, $3, $4) RETURNING id',
            [randomUUID(), SCHOOLS[0].nome, SCHOOLS[0].cidade, SCHOOLS[0].estado]
        );
        const schoolId = schoolRes.rows[0].id;

        // 3. Prepare Bulk Data
        console.log('🎓 Preparing Student Data...');
        const students: any[] = [];
        const performances: any[] = [];
        const financials: any[] = [];

        for (let i = 0; i < 150; i++) {
            const studentId = randomUUID();
            const firstName = randomChoice(NAMES);
            const lastName = `${randomChoice(SURNAMES)} ${randomChoice(SURNAMES)}`;
            const fullName = `${firstName} ${lastName}`;
            const gender = Math.random() > 0.5 ? 'M' : 'F';
            const yearOfBirth = randomInt(2008, 2012);
            const dob = `${yearOfBirth}-${randomInt(1, 12)}-${randomInt(1, 28)}`;
            const turma = randomChoice(CLASSES);

            let status = 'Ativo';
            const r = Math.random();
            if (r > 0.9) status = 'Inadimplente';
            if (r > 0.98) status = 'Evadido';

            students.push(`('${studentId}', '${schoolId}', '${fullName}', '${dob}', '${gender}', '${turma}', '${status}')`);

            if (status !== 'Evadido') {
                for (const subj of SUBJECTS) {
                    let media = randomFloat(4, 9.5);
                    let presenca = randomFloat(70, 100);
                    if (presenca < 75) media *= 0.8;
                    if (Math.random() > 0.9) media = randomFloat(2, 6);
                    performances.push(`('${randomUUID()}', '${studentId}', '${subj}', ${media.toFixed(1)}, ${presenca.toFixed(1)}, 2026)`);
                }
            }

            for (let m = 1; m <= 3; m++) {
                const mesRef = `2026-${m.toString().padStart(2, '0')}-01`;
                const val = 1200.00;
                let payStatus = 'Pago';
                if (status === 'Inadimplente') {
                    payStatus = Math.random() > 0.5 ? 'Atrasado' : 'Pendente';
                } else if (Math.random() > 0.9) {
                    payStatus = 'Atrasado';
                }
                financials.push(`('${randomUUID()}', '${studentId}', '${mesRef}', ${val}, '${payStatus}')`);
            }
        }

        // 4. Batch Inserts
        console.log(`🚀 Inserting ${students.length} Students...`);
        if (students.length) {
            await client.query(`
                INSERT INTO alunos (id, escola_id, nome_completo, data_nascimento, genero, turma, status_matricula) 
                VALUES ${students.join(',')}
            `);
        }

        console.log(`🚀 Inserting ${performances.length} Performance Records...`);
        // Chunking to avoid parameter limit/query size issues if necessary, but string concat usually handles a lot
        const chunkSize = 1000;
        for (let i = 0; i < performances.length; i += chunkSize) {
            const chunk = performances.slice(i, i + chunkSize);
            await client.query(`
                INSERT INTO desempenho_academico (id, aluno_id, disciplina, media_final, percentual_presenca, ano_letivo) 
                VALUES ${chunk.join(',')}
            `);
        }

        console.log(`🚀 Inserting ${financials.length} Financial Records...`);
        for (let i = 0; i < financials.length; i += chunkSize) {
            const chunk = financials.slice(i, i + chunkSize);
            await client.query(`
                INSERT INTO financeiro_mensalidades (id, aluno_id, mes_referencia, valor, status_pagamento) 
                VALUES ${chunk.join(',')}
            `);
        }

        // 5. Expenses
        console.log('💸 Inserting Expenses...');
        const CATEGORIES = ['Pessoal', 'Energia', 'Manutenção', 'Marketing', 'Insumos'];
        const expenses = [];
        for (let i = 0; i < 20; i++) {
            const cat = randomChoice(CATEGORIES);
            const val = randomFloat(500, 5000);
            const date = `2026-${randomInt(1, 3)}-${randomInt(1, 28)}`;
            expenses.push(`('${randomUUID()}', '${cat}', ${val.toFixed(2)}, '${date}', 'Despesa de ${cat}')`);
        }
        await client.query(`
            INSERT INTO financeiro_despesas (id, categoria, valor, data_despesa, descricao)
            VALUES ${expenses.join(',')}
        `);

        // 6. Metrics
        console.log('📊 Inserting Metrics...');
        const METRICS = [
            { type: 'uptime_ti', val: 99.8, unit: '%' },
            { type: 'sla_secretaria', val: 2.5, unit: 'dias' },
            { type: 'absenteismo_docentes', val: 3.2, unit: '%' }
        ];
        const metrics = METRICS.map(m => `('${randomUUID()}', '2026-03-01', '${m.type}', ${m.val}, '${m.unit}')`);
        await client.query(`
            INSERT INTO metricas_mensais (id, mes_referencia, tipo_metrica, valor, unidade)
            VALUES ${metrics.join(',')}
        `);

        await client.query('COMMIT');
        console.log('✅ Seed Completed Successfully!');

    } catch (e: any) {
        await client.query('ROLLBACK');
        console.error('❌ Seed Failed:', e.message);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
