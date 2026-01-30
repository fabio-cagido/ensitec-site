const fs = require('fs');
const crypto = require('crypto');

// Helpers
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const uuid = () => crypto.randomUUID();
const formatDate = (d) => d.toISOString().split('T')[0];
const formatDateTime = (d) => d.toISOString();
const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- DADOS MESTRES ---
const CLASS_YEAR = 2026;

// --- 1. ESCOLAS (3 Unidades) ---
const escolas = [
    { id: '15b74999-8d06-4125-9b81-1711dd786399', nome: 'Escola Ensitec Modelo (RJ)', cidade: 'Rio de Janeiro', estado: 'RJ' },
    { id: '25b74999-8d06-4125-9b81-1711dd786398', nome: 'Escola Ensitec São Paulo (SP)', cidade: 'São Paulo', estado: 'SP' },
    { id: '35b74999-8d06-4125-9b81-1711dd786397', nome: 'Escola Ensitec Curitiba (PR)', cidade: 'Curitiba', estado: 'PR' }
];

// --- 2. ALUNOS (Distribuídos nas 3 escolas) ---
// Gerando 450 alunos (150 por escola aprox)
const alunos = [];
const turmas = ['1A', '1B', '2A', '2B', '3A', '3B'];
const statusMatricula = ['Ativo', 'Ativo', 'Ativo', 'Ativo', 'Ativo', 'Inadimplente', 'Evadido'];
const racas = ['Branca', 'Parda', 'Parda', 'Preta', 'Branca', 'Amarela', 'Indígena', 'Não declarado'];
const rendas = ['Até 3 SM', 'Até 3 SM', '3-6 SM', '3-6 SM', '3-6 SM', '6-10 SM', 'Acima de 10 SM'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes'];
const femaleNames = ['Ana', 'Maria', 'Julia', 'Beatriz', 'Mariana', 'Larissa', 'Camila', 'Letícia', 'Amanda', 'Luana', 'Isabela', 'Sophia', 'Helena', 'Valentina', 'Gabriela'];
const maleNames = ['João', 'Pedro', 'Lucas', 'Gabriel', 'Matheus', 'Guilherme', 'Gustavo', 'Rafael', 'Felipe', 'Bruno', 'Daniel', 'Vitor', 'Thiago', 'Leonardo', 'Rodrigo'];

for (let i = 0; i < 450; i++) {
    const escola = pickOne(escolas);
    const isFemale = Math.random() > 0.5;
    const firstName = isFemale ? pickOne(femaleNames) : pickOne(maleNames);
    const lastName = `${pickOne(lastNames)} ${pickOne(lastNames)}`;
    const genero = isFemale ? 'F' : 'M';
    const birthYear = randomInt(2008, 2012);
    const birthDate = `${birthYear}-${randomInt(1, 12)}-${randomInt(1, 28)}`;

    alunos.push({
        id: uuid(),
        escola_id: escola.id,
        nome_completo: `${firstName} ${lastName}`,
        data_nascimento: birthDate,
        genero,
        turma: pickOne(turmas),
        status_matricula: pickOne(statusMatricula),
        cor_raca: pickOne(racas),
        faixa_renda: pickOne(rendas)
    });
}

// --- 3. FINANCEIRO (Mensalidades) ---
const mensalidades = [];
for (const aluno of alunos) {
    const months = aluno.status_matricula === 'Evadido' ? 2 : 6;

    for (let m = 1; m <= months; m++) {
        let status = 'Pago';
        if (aluno.status_matricula === 'Inadimplente' && m > 3) status = 'Atrasado';
        if (m === 6) status = 'Pendente';

        mensalidades.push({
            id: uuid(),
            aluno_id: aluno.id,
            mes_referencia: `2026-${String(m).padStart(2, '0')}-01`,
            valor: 1200.00,
            status_pagamento: status
        });
    }
}

// --- 4. DESEMPENHO ACADÊMICO ---
const desempenho = [];
const disciplinas = ['Matemática', 'Português', 'História', 'Física', 'Química'];
for (const aluno of alunos) {
    if (aluno.status_matricula === 'Evadido') continue;

    disciplinas.forEach(disc => {
        let nota = randomInt(3, 100) / 10;
        if (Math.random() > 0.2) nota = Math.min(10, nota + 2);

        let presenca = randomInt(70, 100);
        if (nota < 5 && Math.random() > 0.5) presenca -= 15;

        desempenho.push({
            id: uuid(),
            aluno_id: aluno.id,
            disciplina: disc,
            media_final: Number(nota.toFixed(1)),
            percentual_presenca: presenca,
            ano_letivo: CLASS_YEAR
        });
    });
}

// --- 5. FINANCEIRO (Despesas - Escalonado para 3 escolas) ---
// Multiplicando as despesas por 3 (aprox) para refletir o tamanho maior
const despesas = [];
for (let m = 1; m <= 6; m++) {
    const monthStr = `2026-${String(m).padStart(2, '0')}`;
    despesas.push(
        { id: uuid(), categoria: 'Pessoal', valor: 125000, data_despesa: `${monthStr}-05`, descricao: 'Salários Funcionários (3 Unidades)' },
        { id: uuid(), categoria: 'Energia', valor: randomInt(30000, 42000), data_despesa: `${monthStr}-15`, descricao: 'Energia Elétrica (Consolidado)' },
        { id: uuid(), categoria: 'Manutenção', valor: randomInt(6000, 15000), data_despesa: `${monthStr}-20`, descricao: 'Reparos Prediais Gerais' },
        { id: uuid(), categoria: 'Insumos', valor: randomInt(9000, 18000), data_despesa: `${monthStr}-10`, descricao: 'Materiais de Uso e Consumo' },
        { id: uuid(), categoria: 'Marketing', valor: 7500, data_despesa: `${monthStr}-02`, descricao: 'Campanhas Regionais' }
    );
}

// --- 6. OPERACIONAL (Chamados - Aumentado) ---
const chamados = [];
const catChamados = ['Manutenção', 'TI', 'Limpeza', 'Segurança'];
const statusChamados = ['Resolvido', 'Resolvido', 'Em Andamento', 'Aberto'];
for (let i = 0; i < 150; i++) { // Mais chamados
    const date = randomDate(new Date('2026-01-01'), new Date('2026-06-25'));
    const status = pickOne(statusChamados);
    let resDate = '';

    if (status === 'Resolvido') {
        const d = new Date(date);
        d.setHours(d.getHours() + randomInt(2, 48));
        resDate = formatDateTime(d);
    }

    chamados.push({
        id: uuid(),
        categoria: pickOne(catChamados),
        descricao: `Solicitação #${i + 1000} - Unidade ${pickOne(['RJ', 'SP', 'PR'])}`,
        prioridade: pickOne(['Baixa', 'Média', 'Alta']),
        status: status,
        data_abertura: formatDateTime(date),
        data_resolucao: resDate
    });
}

// --- 7. MÉTRICAS MENSAIS ---
const metrics = [];
for (let m = 1; m <= 6; m++) {
    const ref = `2026-${String(m).padStart(2, '0')}-01`;
    metrics.push(
        { id: uuid(), mes_referencia: ref, tipo_metrica: 'nps', valor: randomInt(65, 88), unidade: 'num' },
        { id: uuid(), mes_referencia: ref, tipo_metrica: 'health_score', valor: (randomInt(75, 92) / 10).toFixed(1), unidade: 'num' },
        { id: uuid(), mes_referencia: ref, tipo_metrica: 'sla_secretaria', valor: (randomInt(12, 35) / 10).toFixed(1), unidade: 'dias' },
        { id: uuid(), mes_referencia: ref, tipo_metrica: 'absenteismo_docentes', valor: randomInt(2, 6), unidade: '%' },
        { id: uuid(), mes_referencia: ref, tipo_metrica: 'uptime_ti', valor: (randomInt(970, 999) / 10).toFixed(1), unidade: '%' },
        { id: uuid(), mes_referencia: ref, tipo_metrica: 'desperdicio_alimentacao', valor: randomInt(3, 8), unidade: '%' },
        { id: uuid(), mes_referencia: ref, tipo_metrica: 'bolsistas_total', valor: 135, unidade: 'num' } // Aprox 45 * 3
    );
}

// CSV WRITER (Com BOM para acentuação)
const writeCSV = (filename, headers, data) => {
    const bom = '\ufeff';
    const headerRow = headers.join(',');
    const rows = data.map(obj => headers.map(h => {
        let val = obj[h];
        if (val === undefined || val === null) return '';
        return String(val);
    }).join(','));

    const content = [headerRow, ...rows].join('\n');
    fs.writeFileSync(filename, bom + content, { encoding: 'utf8' });
    console.log(`Generated ${filename} with ${data.length} rows.`);
};

// WRITE ALL
writeCSV('escolas.csv', ['id', 'nome', 'cidade', 'estado'], escolas);
writeCSV('alunos.csv', ['id', 'escola_id', 'nome_completo', 'data_nascimento', 'genero', 'turma', 'status_matricula', 'cor_raca', 'faixa_renda'], alunos);
writeCSV('financeiro_mensalidades.csv', ['id', 'aluno_id', 'mes_referencia', 'valor', 'status_pagamento'], mensalidades);
writeCSV('desempenho_academico.csv', ['id', 'aluno_id', 'disciplina', 'media_final', 'percentual_presenca', 'ano_letivo'], desempenho);
writeCSV('financeiro_despesas.csv', ['id', 'categoria', 'valor', 'data_despesa', 'descricao'], despesas);
writeCSV('operacional_chamados.csv', ['id', 'categoria', 'descricao', 'prioridade', 'status', 'data_abertura', 'data_resolucao'], chamados);
writeCSV('metricas_mensais.csv', ['id', 'mes_referencia', 'tipo_metrica', 'valor', 'unidade'], metrics);

console.log('Todos os arquivos CSV foram gerados com sucesso!');
