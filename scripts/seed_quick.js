
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { randomUUID } = require('crypto');

// Load Env
const envPath = path.resolve(process.cwd(), '.env.local');
let envVars = {};
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
    }, {});
}

// Fallback to .env if .env.local missing
if (!envVars.DATABASE_URL) {
    const envPath2 = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath2)) {
        const envContent = fs.readFileSync(envPath2, 'utf-8');
        const envVars2 = envContent.split('\n').reduce((acc, line) => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
                if (key && !key.startsWith('#')) acc[key] = value;
            }
            return acc;
        }, {});
        envVars = { ...envVars2, ...envVars };
    }
}

if (!envVars.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env.local or .env');
    process.exit(1);
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
const UNIDADES = ["Centro", "Sul", "Norte"];

function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min) + min); }
function randomFloat(min, max) { return Math.random() * (max - min) + min; }

async function seed() {
    const client = await pool.connect();
    try {
        console.log('🌱 Starting Optimized Seed Process (JS)...');
        await client.query('BEGIN');

        // 1. Clear Data
        console.log('🧹 Clearing existing data...');
        // We use CASCADE to clear dependent tables too
        try {
            await client.query('TRUNCATE TABLE financeiro_mensalidades, desempenho_academico, alunos, escolas, financeiro_despesas, operacional_chamados, metricas_mensais CASCADE');
        } catch (e) {
            console.log('⚠️ Could not truncate all tables (maybe they do not exist). Proceeding...');
        }

        // 2. Insert School
        console.log('🏫 Creating School...');
        // Ensure table exists (simple check/create if needed handled by schema usually, but here we assume schema exists)
        const schoolRes = await client.query(
            'INSERT INTO escolas (id, nome, cidade, estado) VALUES ($1, $2, $3, $4) RETURNING id',
            [randomUUID(), SCHOOLS[0].nome, SCHOOLS[0].cidade, SCHOOLS[0].estado]
        );
        const schoolId = schoolRes.rows[0].id;

        // 3. Prepare Bulk Data
        console.log('🎓 Preparing Student Data...');
        const students = [];
        const performances = [];
        const financials = [];

        for (let i = 0; i < 150; i++) {
            const studentId = randomUUID();
            const firstName = randomChoice(NAMES);
            const lastName = `${randomChoice(SURNAMES)} ${randomChoice(SURNAMES)}`;
            const fullName = `${firstName} ${lastName}`;
            const gender = Math.random() > 0.5 ? 'M' : 'F';
            const yearOfBirth = randomInt(2008, 2012);
            const dob = `${yearOfBirth}-${randomInt(1, 12)}-${randomInt(1, 28)}`;
            const turma = randomChoice(CLASSES);
            const unidade = randomChoice(UNIDADES);

            let status = 'Ativo';
            const r = Math.random();
            if (r > 0.9) status = 'Inadimplente';
            if (r > 0.98) status = 'Evadido';

            // We must quote strings properly for SQL values
            students.push(`('${studentId}', '${schoolId}', '${unidade}', '${fullName}', '${dob}', '${gender}', '${turma}', '${status}')`);

            if (status !== 'Evadido') {
                for (const subj of SUBJECTS) {
                    let media = randomFloat(4, 9.5);
                    let presenca = randomFloat(70, 100);
                    if (presenca < 75) media *= 0.8;
                    if (Math.random() > 0.9) media = randomFloat(2, 6);
                    performances.push(`('${randomUUID()}', '${schoolId}', '${unidade}', '${studentId}', '${subj}', ${media.toFixed(1)}, ${presenca.toFixed(1)}, 2026)`);
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
                financials.push(`('${randomUUID()}', '${schoolId}', '${unidade}', '${studentId}', '${mesRef}', ${val}, '${payStatus}')`);
            }
        }

        // 4. Batch Inserts
        console.log(`🚀 Inserting ${students.length} Students...`);
        if (students.length) {
            await client.query(`
                INSERT INTO alunos (id, escola_id, unidade, nome_completo, data_nascimento, genero, turma, status_matricula) 
                VALUES ${students.join(',')}
            `);
        }

        console.log(`🚀 Inserting ${performances.length} Performance Records...`);
        const chunkSize = 1000;
        for (let i = 0; i < performances.length; i += chunkSize) {
            const chunk = performances.slice(i, i + chunkSize);
            await client.query(`
                INSERT INTO desempenho_academico (id, escola_id, unidade, aluno_id, disciplina, media_final, percentual_presenca, ano_letivo) 
                VALUES ${chunk.join(',')}
            `);
        }

        console.log(`🚀 Inserting ${financials.length} Financial Records...`);
        for (let i = 0; i < financials.length; i += chunkSize) {
            const chunk = financials.slice(i, i + chunkSize);
            await client.query(`
                INSERT INTO financeiro_mensalidades (id, escola_id, unidade, aluno_id, mes_referencia, valor, status_pagamento) 
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
            const unidade = randomChoice(UNIDADES);
            expenses.push(`('${randomUUID()}', '${schoolId}', '${unidade}', '${cat}', ${val.toFixed(2)}, '${date}', 'Despesa de ${cat}')`);
        }
        await client.query(`
            INSERT INTO financeiro_despesas (id, escola_id, unidade, categoria, valor, data_despesa, descricao)
            VALUES ${expenses.join(',')}
        `);

        // 6. Metrics
        console.log('📊 Inserting Metrics...');
        const METRICS = [
            { type: 'uptime_ti', val: 99.8, suffix: '%' },
            { type: 'sla_secretaria', val: 2.5, suffix: 'dias' },
            { type: 'absenteismo_docentes', val: 3.2, suffix: '%' },
            { type: 'nps', val: 75, suffix: 'score' }, // Added NPS
            { type: 'health_score', val: 8.5, suffix: 'score' } // Added Health Score
        ];
        const metrics = [];
        for (const m of METRICS) {
            for (const u of UNIDADES) {
                // slightly randomize per unit so charts don't look perfectly flat if compared
                const adjVal = m.val * randomFloat(0.9, 1.1);
                metrics.push(`('${randomUUID()}', '${schoolId}', '${u}', '2026-03-01', '${m.type}', ${adjVal.toFixed(2)}, '${m.suffix}')`);
            }
        }
        await client.query(`
            INSERT INTO metricas_mensais (id, escola_id, unidade, mes_referencia, tipo_metrica, valor, desc_unidade)
            VALUES ${metrics.join(',')}
        `);

        await client.query('COMMIT');
        console.log('✅ Seed Completed Successfully!');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Seed Failed:', e.message);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
