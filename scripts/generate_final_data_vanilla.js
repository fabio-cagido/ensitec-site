
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- HELPER FUNCTIONS ---

const randomUUID = () => crypto.randomUUID();

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min, max) => (Math.random() * (max - min) + min);

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const formatDate = (date) => date.toISOString().split('T')[0];

const formatDateTime = (date) => date.toISOString();

// --- DATA LISTS ---

const NAMES_FIRST = ['Miguel', 'Arthur', 'Gael', 'Heitor', 'Helena', 'Alice', 'Laura', 'Maria', 'Sophia', 'Bernardo', 'Gabriel', 'Davi', 'Pedro', 'João', 'Lucas', 'Matheus', 'Nicolas', 'Guilherme', 'Gustavo', 'Felipe', 'Samuel', 'Enzo', 'Lorenzo', 'Theo', 'Benjamin', 'Julia', 'Beatriz', 'Mariana', 'Ana', 'Livia', 'Isabela', 'Camila', 'Larissa', 'Gabriela', 'Bianca', 'Leticia', 'Melissa', 'Yasmin', 'Nicole'];
const NAMES_LAST = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos', 'Gonçalves', 'Santana', 'Teixeira'];

const NEIGHBORHOODS = ['Centro', 'Jardins', 'Vila Mariana', 'Moema', 'Pinheiros', 'Perdizes', 'Santana', 'Tatuapé', 'Mooca', 'Lapa', 'Barra Funda', 'Liberdade', 'Aclimação', 'Ipiranga', 'Saúde'];

const generateName = () => `${randomChoice(NAMES_FIRST)} ${randomChoice(NAMES_LAST)}`;

// --- CONFIG ---

const UNIDADES = ['Centro', 'Sul', 'Norte'];
const SEGMENTOS = ['Infantil', 'Fundamental I', 'Fundamental II', 'Ensino Médio'];
const TURMAS = {
    'Infantil': ['G1', 'G2', 'G3'],
    'Fundamental I': ['1A', '1B', '2A', '2B', '3A', '4A', '5A'],
    'Fundamental II': ['6A', '6B', '7A', '7B', '8A', '9A'],
    'Ensino Médio': ['1EM-A', '2EM-A', '3EM-A']
};
const DISCIPLINAS = {
    'Infantil': ['Desenv. Cognitivo', 'Socialização'],
    'Fundamental I': ['Português', 'Matemática', 'Ciências', 'História', 'Geografia'],
    'Fundamental II': ['Português', 'Matemática', 'Ciências', 'História', 'Geografia', 'Inglês', 'Ed. Física'],
    'Ensino Médio': ['Português', 'Matemática', 'Física', 'Química', 'Biologia', 'História', 'Sociologia', 'Inglês']
};
const COORDS = {
    'Centro': [-23.5505, -46.6333],
    'Sul': [-23.6505, -46.7000],
    'Norte': [-23.4805, -46.6000]
};

const TOTAL_ALUNOS = 480;
const START_DATE = new Date('2025-02-01');
const CURRENT_DATE = new Date('2026-03-30'); // Extended to ensure coverage
const ESCOLA_ID = 'e9f8g7h6-1234-5678-9101-abcdef123456'; // Static ID for linkage

// Helper for realistic grades
const getAcademicPerformance = (studious) => {
    let nota, presenca, entrega;
    if (studious) {
        nota = randomFloat(6.5, 10);
        presenca = randomFloat(85, 100);
        entrega = randomFloat(90, 100);
    } else {
        nota = randomFloat(2, 7.5);
        presenca = randomFloat(60, 90);
        entrega = randomFloat(40, 85);
    }
    return { nota, presenca, entrega };
};

// --- GENERATION LOGIC ---

function main() {
    console.log("Starting Data Generation (Vanilla JS)...");

    // 1. Escolas
    const escolas = [{
        id: ESCOLA_ID,
        nome: 'Ensitec School',
        cidade: 'São Paulo',
        estado: 'SP',
        created_at: new Date().toISOString()
    }];

    // 2. Alunos
    const alunos = [];
    console.log("Generating Alunos...");
    for (let i = 0; i < TOTAL_ALUNOS; i++) {
        const unidade = randomChoice(UNIDADES);
        const segmento = randomChoice(SEGMENTOS);
        const turma = randomChoice(TURMAS[segmento]);

        // Status Logic
        const roll = Math.random();
        let status = 'Ativo';
        let dtEvasao = '';
        const dtMatricula = formatDate(randomDate(new Date('2024-11-01'), new Date('2025-01-31')));

        if (roll < 0.20) {
            status = 'Evadido';
            dtEvasao = formatDate(randomDate(START_DATE, CURRENT_DATE));
        } else if (roll < 0.34) {
            status = 'Inadimplente';
        }

        const [latBase, lonBase] = COORDS[unidade];

        alunos.push({
            id: randomUUID(),
            escola_id: ESCOLA_ID,
            nome_completo: generateName(),
            data_nascimento: formatDate(randomDate(new Date('2007-01-01'), new Date('2019-12-31'))),
            genero: Math.random() > 0.5 ? 'M' : 'F',
            turma: turma,
            segmento: segmento,
            unidade: unidade, // Added Unidade
            status_matricula: status,
            cor_raca: randomChoice(['Branca', 'Parda', 'Preta', 'Amarela', 'Indígena']),
            faixa_renda: randomChoice(['Até 3 SM', '3-6 SM', '6-10 SM', 'Acima de 10 SM']),
            bolsista: Math.random() < 0.15 ? 'true' : 'false',
            tem_irmaos: Math.random() < 0.30 ? 'true' : 'false',
            cidade_aluno: 'São Paulo',
            latitude: (latBase + randomFloat(-0.02, 0.02)).toFixed(8),
            longitude: (lonBase + randomFloat(-0.02, 0.02)).toFixed(8),
            data_matricula: dtMatricula,
            data_evasao: dtEvasao,
            cep: `${randomInt(1000, 9999)}-${randomInt(100, 999)}`, // Generated Pattern
            created_at: new Date().toISOString()
        });
    }

    // 3. Desempenho
    const desempenho = [];
    console.log("Generating Desempenho...");
    alunos.forEach(aluno => {
        if (aluno.status_matricula === 'Evadido') return;

        const studious = Math.random() > 0.25;

        // 2025: 4 Bimestres
        for (let bim = 1; bim <= 4; bim++) {
            DISCIPLINAS[aluno.segmento].forEach(disc => {
                const { nota, presenca, entrega } = getAcademicPerformance(studious);
                desempenho.push({
                    id: randomUUID(),
                    aluno_id: aluno.id,
                    disciplina: disc,
                    media_final: nota.toFixed(1),
                    percentual_presenca: presenca.toFixed(1),
                    taxa_entrega_atividades: entrega.toFixed(1),
                    bimestre: bim,
                    ano_letivo: 2025,
                    created_at: new Date().toISOString()
                });
            });
        }

        // 2026: 1 Bimestre (only if not evicted before feb 2026)
        if (!aluno.data_evasao || new Date(aluno.data_evasao) > new Date('2026-02-01')) {
            DISCIPLINAS[aluno.segmento].forEach(disc => {
                const { nota, presenca, entrega } = getAcademicPerformance(studious);
                desempenho.push({
                    id: randomUUID(),
                    aluno_id: aluno.id,
                    disciplina: disc,
                    media_final: nota.toFixed(1),
                    percentual_presenca: presenca.toFixed(1),
                    taxa_entrega_atividades: entrega.toFixed(1),
                    bimestre: 1,
                    ano_letivo: 2026,
                    created_at: new Date().toISOString()
                });
            });
        }
    });

    // 4. Financeiro & Metricas
    const financeiro = [];
    const metricas = [];
    const chamados = [];
    console.log("Generating Financeiro & Operacional...");

    let cursor = new Date(START_DATE);
    while (cursor <= CURRENT_DATE) {
        const monthStr = formatDate(cursor).substring(0, 7) + '-01'; // YYYY-MM-01

        // 4a. Mensalidades
        alunos.forEach(aluno => {
            if (aluno.bolsista === 'true') return;
            if (aluno.data_evasao && cursor > new Date(aluno.data_evasao)) return;

            let statusPg = 'Pago';
            // Inadimplencia logic
            if (aluno.status_matricula === 'Inadimplente' && Math.random() < 0.8) statusPg = 'Atrasado';
            // Current month pending
            if (cursor.getMonth() === CURRENT_DATE.getMonth() && cursor.getFullYear() === CURRENT_DATE.getFullYear()) {
                statusPg = 'Pendente';
            }

            financeiro.push({
                id: randomUUID(),
                aluno_id: aluno.id,
                mes_referencia: monthStr,
                valor: 1500.00,
                status_pagamento: statusPg,
                created_at: new Date().toISOString()
            });
        });

        // 4b. Metricas Mensais (Per Unit)
        UNIDADES.forEach(unidade => {
            let factor = 1.0;
            if (unidade === 'Sul') factor = 0.8;
            if (unidade === 'Norte') factor = 0.6;

            // NPS & Health Score
            metricas.push({ id: randomUUID(), mes_referencia: monthStr, unidade_escolar: unidade, tipo_metrica: 'nps', valor: randomInt(70, 95), unidade: 'score' });
            metricas.push({ id: randomUUID(), mes_referencia: monthStr, unidade_escolar: unidade, tipo_metrica: 'health_score', valor: randomFloat(7.5, 9.8).toFixed(1), unidade: 'score' });

            // Resources
            metricas.push({ id: randomUUID(), mes_referencia: monthStr, unidade_escolar: unidade, tipo_metrica: 'consumo_energia', valor: (randomFloat(2000, 3000) * factor).toFixed(2), unidade: 'kwh' });
            metricas.push({ id: randomUUID(), mes_referencia: monthStr, unidade_escolar: unidade, tipo_metrica: 'taxa_desperdicio', valor: randomFloat(2, 4.5).toFixed(1), unidade: '%' });
            metricas.push({ id: randomUUID(), mes_referencia: monthStr, unidade_escolar: unidade, tipo_metrica: 'absenteismo_docentes', valor: randomFloat(1, 3).toFixed(1), unidade: '%' });

            // Food Metrics
            const refeicoes = Math.floor(randomFloat(2500, 4000) * factor);
            const custoRefeicao = randomFloat(12.50, 16.00).toFixed(2);
            metricas.push({ id: randomUUID(), mes_referencia: monthStr, unidade_escolar: unidade, tipo_metrica: 'refeicoes_servidas', valor: refeicoes, unidade: 'qtd' });
            metricas.push({ id: randomUUID(), mes_referencia: monthStr, unidade_escolar: unidade, tipo_metrica: 'custo_refeicao', valor: custoRefeicao, unidade: 'BRL' });

            // Uptime
            metricas.push({ id: randomUUID(), mes_referencia: monthStr, unidade_escolar: unidade, tipo_metrica: 'uptime_ti', valor: randomChoice(['99.9', '99.5', '100.0']), unidade: '%' });
        });

        // Advance Month
        cursor.setMonth(cursor.getMonth() + 1);
    }

    // 5. Chamados (Operacional)
    for (let k = 0; k < 150; k++) {
        const dtOpen = randomDate(START_DATE, CURRENT_DATE);
        chamados.push({
            id: randomUUID(),
            categoria: randomChoice(['Manutenção', 'TI', 'Limpeza', 'Secretaria']),
            descricao: 'Solicitação de suporte técnico ou manutenção',
            prioridade: randomChoice(['Baixa', 'Média', 'Alta']),
            status: Math.random() > 0.3 ? 'Resolvido' : 'Aberto',
            data_abertura: formatDateTime(dtOpen),
            data_resolucao: formatDateTime(new Date(dtOpen.getTime() + 86400000 * randomFloat(0.5, 3))),
            created_at: dtOpen.toISOString()
        });
    }

    // 4c. Despesas (Financeiro)
    const despesas = [];
    const CATEGORIAS_DESPESA = ['Pessoal', 'Infraestrutura', 'Tecnologia', 'Marketing', 'Materiais'];

    let cursorDesp = new Date(START_DATE);
    while (cursorDesp <= CURRENT_DATE) {
        // Generate 3-5 expenses per category per month
        CATEGORIAS_DESPESA.forEach(cat => {
            const num = randomInt(5, 10); // Check volume
            for (let i = 0; i < num; i++) {
                despesas.push({
                    id: randomUUID(),
                    categoria: cat,
                    valor: randomFloat(1200, 8000).toFixed(2),
                    data_despesa: formatDate(new Date(cursorDesp.getTime() + Math.random() * 2592000000)), // random day in month
                    descricao: `Despesa ${cat} - ${randomInt(1, 100)}`,
                    created_at: new Date().toISOString()
                });
            }
        });
        cursorDesp.setMonth(cursorDesp.getMonth() + 1);
    }

    // --- WRITING FILES ---
    const writeCSV = (name, records) => {
        if (records.length === 0) return;
        const keys = Object.keys(records[0]);
        const header = keys.join(',');
        const rows = records.map(r => keys.map(k => {
            const val = r[k];
            // Simple escape for CSV
            if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
            return val;
        }).join(','));

        const content = [header, ...rows].join('\n');
        fs.writeFileSync(path.join(__dirname, '..', name), content);
        console.log(`Created ${name} (${records.length} records)`);
    };

    writeCSV('escolas.csv', escolas);
    writeCSV('alunos.csv', alunos);
    writeCSV('desempenho_academico.csv', desempenho);
    writeCSV('financeiro_mensalidades.csv', financeiro);
    writeCSV('operacional_chamados.csv', chamados);
    writeCSV('metricas_mensais.csv', metricas);
    writeCSV('financeiro_despesas.csv', despesas);
}

main();
