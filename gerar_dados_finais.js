const fs = require('fs');
const crypto = require('crypto');

// --- Helper Functions ---
function randomUUID() {
    return crypto.randomUUID();
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
    const val = Math.random() * (max - min) + min;
    return val.toFixed(decimals);
}

// --- Data Arrays ---
const CIDADES_ALUNOS = [
    'São Paulo', 'Guarulhos', 'Campinas', 'Osasco', 'Santo André',
    'São Bernardo do Campo', 'Sorocaba', 'Ribeirão Preto', 'Santos', 'Diadema'
];

const NOMES_BASE = ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Julia', 'Gabriel', 'Beatriz', 'Matheus', 'Larissa', 'Guilherme', 'Sophia', 'Felipe', 'Valentina', 'Gustavo', 'Helena', 'Thiago', 'Luana', 'Bruno', 'Isabela', 'Daniel', 'Camila', 'Rodrigo', 'Mariana', 'Leonardo', 'Vitor', 'Amanda', 'Eduardo', 'Letícia', 'Rafael'];
const SOBRENOMES_BASE = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes'];

// --- 1. Escolas ---
const escolas = [
    { id: randomUUID(), nome: 'Unidade Centro', cidade: 'São Paulo', estado: 'SP' },
    { id: randomUUID(), nome: 'Unidade Zona Sul', cidade: 'São Paulo', estado: 'SP' },
    { id: randomUUID(), nome: 'Unidade Alphaville', cidade: 'Barueri', estado: 'SP' }
];

let csvEscolas = 'id,nome,cidade,estado\n';
escolas.forEach(e => {
    csvEscolas += `${e.id},${e.nome},${e.cidade},${e.estado}\n`;
});
fs.writeFileSync('escolas.csv', csvEscolas);
console.log('✅ escolas.csv gerado.');

// --- 2. Alunos ---
const alunos = [];
const turmas = ['1A', '1B', '2A', '2B', '3A', '3B'];
const segmentos = ['Ensino Médio', 'Fundamental II'];
const statusPossiveis = ['Ativo', 'Ativo', 'Ativo', 'Inadimplente', 'Evadido']; // Peso maior para Ativo

for (let i = 0; i < 480; i++) {
    const escola = randomChoice(escolas);
    const nome = `${randomChoice(NOMES_BASE)} ${randomChoice(SOBRENOMES_BASE)} ${randomChoice(SOBRENOMES_BASE)}`;
    const dataNasc = randomDate(new Date(2008, 0, 1), new Date(2013, 11, 31)).toISOString().split('T')[0];
    const genero = Math.random() > 0.5 ? 'M' : 'F';
    const turma = randomChoice(turmas);
    const segmento = turma.startsWith('3') ? 'Ensino Médio' : randomChoice(segmentos);
    const status = randomChoice(statusPossiveis);
    const corRaca = randomChoice(['Branca', 'Parda', 'Preta', 'Amarela', 'Indígena', 'Não declarado']);
    const renda = randomChoice(['Até 3 SM', '3-6 SM', '6-10 SM', 'Acima de 10 SM']);
    const bolsista = Math.random() < 0.2 ? 'TRUE' : 'FALSE'; // 20% bolsistas
    const temIrmaos = Math.random() < 0.35 ? 'TRUE' : 'FALSE'; // 35% com irmãos
    const cidade = randomChoice(CIDADES_ALUNOS);

    alunos.push({
        id: randomUUID(),
        escola_id: escola.id,
        nome_completo: nome,
        data_nascimento: dataNasc,
        genero,
        turma,
        segmento,
        status_matricula: status,
        cor_raca: corRaca,
        faixa_renda: renda,
        bolsista,
        tem_irmaos: temIrmaos,
        cidade_aluno: cidade
    });
}

let csvAlunos = 'id,escola_id,nome_completo,data_nascimento,genero,turma,segmento,status_matricula,cor_raca,faixa_renda,bolsista,tem_irmaos,cidade_aluno\n';
alunos.forEach(a => {
    csvAlunos += `${a.id},${a.escola_id},${a.nome_completo},${a.data_nascimento},${a.genero},${a.turma},${a.segmento},${a.status_matricula},${a.cor_raca},${a.faixa_renda},${a.bolsista},${a.tem_irmaos},${a.cidade_aluno}\n`;
});
fs.writeFileSync('alunos.csv', csvAlunos);
console.log('✅ alunos.csv gerado.');

// --- 3. Desempenho Acadêmico ---
const disciplinas = ['Matemática', 'Português', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês'];
let csvDesempenho = 'id,aluno_id,disciplina,media_final,percentual_presenca,ano_letivo\n';

alunos.forEach(aluno => {
    if (aluno.status_matricula !== 'Evadido') {
        disciplinas.forEach(disc => {
            // Randomizando média com peso maior para notas altas
            let media = randomFloat(4, 10);
            if (Math.random() > 0.3) media = randomFloat(6, 10); // 70% chance de nota azul

            let presenca = randomInt(60, 100);
            if (Math.random() > 0.2) presenca = randomInt(85, 100);

            csvDesempenho += `${randomUUID()},${aluno.id},${disc},${media},${presenca},2024\n`;
        });
    }
});
fs.writeFileSync('desempenho_academico.csv', csvDesempenho);
console.log('✅ desempenho_academico.csv gerado.');

// --- 4. Financeiro Mensalidades ---
let csvFinanceiro = 'id,aluno_id,mes_referencia,valor,status_pagamento\n';
const meses = ['2023-08-01', '2023-09-01', '2023-10-01', '2023-11-01', '2023-12-01', '2024-01-01'];

alunos.forEach(aluno => {
    // Alunos evadidos param de pagar em algum momento, mas simplificaremos
    if (aluno.status_matricula === 'Ativo' || aluno.status_matricula === 'Inadimplente') {
        meses.forEach((mes, index) => {
            let valor = 1200.00;
            if (aluno.bolsista === 'TRUE') valor = 600.00;

            let statusPgto = 'Pago';
            // Simular inadimplência nos ultimos meses
            if (aluno.status_matricula === 'Inadimplente' && index >= 4) {
                statusPgto = 'Atrasado';
            } else if (Math.random() < 0.05) { // 5% de atraso aleatório
                statusPgto = 'Atrasado';
            }

            csvFinanceiro += `${randomUUID()},${aluno.id},${mes},${valor},${statusPgto}\n`;
        });
    }
});
fs.writeFileSync('financeiro_mensalidades.csv', csvFinanceiro);
console.log('✅ financeiro_mensalidades.csv gerado.');

// --- 5. Financeiro Despesas ---
const categoriasDespesa = ['Pessoal', 'Marketing', 'Energia', 'Manutenção', 'Insumos', 'Impostos'];
let csvDespesas = 'id,categoria,valor,data_despesa,descricao\n';

meses.forEach(mes => {
    categoriasDespesa.forEach(cat => {
        let valorBase = 0;
        if (cat === 'Pessoal') valorBase = 150000;
        else if (cat === 'Impostos') valorBase = 40000;
        else if (cat === 'Energia') valorBase = 12000;
        else valorBase = 5000;

        const valorReal = (valorBase * randomFloat(0.9, 1.1)).toFixed(2);
        csvDespesas += `${randomUUID()},${cat},${valorReal},${mes},Despesa mensal referente a ${cat}\n`;
    });
});
fs.writeFileSync('financeiro_despesas.csv', csvDespesas);
console.log('✅ financeiro_despesas.csv gerado.');

// --- 6. Operacional Chamados ---
const categoriasChamado = ['Manutenção', 'TI', 'Limpeza', 'Segurança'];
const statusChamado = ['Aberto', 'Em Andamento', 'Resolvido'];
const prioridades = ['Baixa', 'Média', 'Alta', 'Crítica'];
let csvChamados = 'id,categoria,descricao,prioridade,status,data_abertura,data_resolucao\n';

for (let i = 0; i < 50; i++) {
    const cat = randomChoice(categoriasChamado);
    const status = randomChoice(statusChamado);
    const dataAbertura = randomDate(new Date(2023, 8, 1), new Date(2024, 1, 28)).toISOString();
    let dataResolucao = '';
    if (status === 'Resolvido') {
        const d = new Date(dataAbertura);
        d.setHours(d.getHours() + randomInt(2, 48)); // Resolvido enter 2h e 48h depois
        dataResolucao = d.toISOString();
    }

    csvChamados += `${randomUUID()},${cat},Chamado de teste ${i},${randomChoice(prioridades)},${status},${dataAbertura},${dataResolucao}\n`;
}
fs.writeFileSync('operacional_chamados.csv', csvChamados);
console.log('✅ operacional_chamados.csv gerado.');

// --- 7. Métricas Mensais (KPIs Gerais) ---
let csvMetricas = 'id,mes_referencia,tipo_metrica,valor,unidade\n';
meses.forEach(mes => {
    csvMetricas += `${randomUUID()},${mes},nps,${randomInt(60, 95)},score\n`;
    csvMetricas += `${randomUUID()},${mes},health_score,${randomFloat(7, 10, 1)},score\n`;
    csvMetricas += `${randomUUID()},${mes},sla_secretaria,${randomFloat(1, 5, 1)},dias\n`;
    csvMetricas += `${randomUUID()},${mes},uptime_ti,${randomFloat(98, 100, 2)},%\n`;
    csvMetricas += `${randomUUID()},${mes},absenteismo_docentes,${randomFloat(0, 5, 1)},%\n`;
    csvMetricas += `${randomUUID()},${mes},desperdicio_alimentacao,${randomFloat(2, 8, 1)},%\n`;
    csvMetricas += `${randomUUID()},${mes},bolsistas_total,${randomInt(80, 100)},alunos\n`;
});
fs.writeFileSync('metricas_mensais.csv', csvMetricas);
console.log('✅ metricas_mensais.csv gerado.');

// --- 8. ENEM - Agregado Estado ---
const ufs = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO', 'DF', 'AM', 'PA', 'MA', 'ES', 'MT', 'MS', 'RN', 'PB', 'AL', 'SE', 'PI', 'TO', 'RO', 'AC', 'AP', 'RR'];
let csvEnemEstado = 'SG_UF_PROVA,NU_NOTA_CN,NU_NOTA_CH,NU_NOTA_LC,NU_NOTA_MT,NU_NOTA_REDACAO,total_alunos\n';

ufs.forEach(uf => {
    const total = randomInt(5000, 500000); // Variar tamanho
    csvEnemEstado += `${uf},${randomInt(480, 620)},${randomInt(500, 650)},${randomInt(500, 630)},${randomInt(500, 700)},${randomInt(550, 750)},${total}\n`;
});
fs.writeFileSync('enem_agregado_estado.csv', csvEnemEstado);
console.log('✅ enem_agregado_estado.csv gerado.');

// --- 9. ENEM - Agregado Cidade (Amostra) ---
let csvEnemCidade = 'id,CO_MUNICIPIO_PROVA,NO_MUNICIPIO_PROVA,SG_UF_PROVA,NU_NOTA_CN,NU_NOTA_CH,NU_NOTA_LC,NU_NOTA_MT,NU_NOTA_REDACAO,total_alunos\n';
const cidadesSample = [
    { nome: 'São Paulo', uf: 'SP' }, { nome: 'Campinas', uf: 'SP' }, { nome: 'Guarulhos', uf: 'SP' },
    { nome: 'Rio de Janeiro', uf: 'RJ' }, { nome: 'Niterói', uf: 'RJ' },
    { nome: 'Belo Horizonte', uf: 'MG' }, { nome: 'Uberlândia', uf: 'MG' },
    { nome: 'Curitiba', uf: 'PR' }, { nome: 'Porto Alegre', uf: 'RS' },
    { nome: 'Salvador', uf: 'BA' }, { nome: 'Fortaleza', uf: 'CE' }, { nome: 'Recife', uf: 'PE' }
];

cidadesSample.forEach((cid, idx) => {
    csvEnemCidade += `${randomUUID()},${1000 + idx},${cid.nome},${cid.uf},${randomInt(480, 620)},${randomInt(500, 650)},${randomInt(500, 630)},${randomInt(500, 700)},${randomInt(550, 750)},${randomInt(1000, 50000)}\n`;
});

fs.writeFileSync('enem_agregado_cidade.csv', csvEnemCidade);
console.log('✅ enem_agregado_cidade.csv gerado.');

console.log('🚀 Geração de dados completa! Importe os arquivos CSV no Supabase.');
