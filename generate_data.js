const fs = require('fs');
const crypto = require('crypto');

// Helpers
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const uuid = () => crypto.randomUUID();
const formatDate = (d) => d.toISOString().split('T')[0];
const formatDateTime = (d) => d.toISOString();

// DATA GENERATION

// 1. Financeiro Despesas (Jan-Jun 2026)
// Categorias: Pessoal, Infraestrutura, Marketing, Energia, Manutenção, Insumos
const expenses = [];
const categories = ['Pessoal', 'Infraestrutura', 'Marketing', 'Energia', 'Manutenção', 'Insumos'];
for (let month = 0; month < 6; month++) {
    const year = 2026;
    // Pessoal: fixo ~40k
    expenses.push({ id: uuid(), categoria: 'Pessoal', valor: 40000 + Math.random() * 2000, data_despesa: `${year}-0${month + 1}-05`, descricao: 'Folha de Pagamento' });

    // Energia: variavel
    expenses.push({ id: uuid(), categoria: 'Energia', valor: 12000 + Math.random() * 3000, data_despesa: `${year}-0${month + 1}-15`, descricao: 'Conta de Luz' });

    // Manutenção: variavel
    expenses.push({ id: uuid(), categoria: 'Manutenção', valor: 3000 + Math.random() * 5000, data_despesa: `${year}-0${month + 1}-20`, descricao: 'Reparos Gerais' });

    // Insumos: começo de ano alto
    const insumoVal = month < 2 ? 8000 : 3000;
    expenses.push({ id: uuid(), categoria: 'Marketing', valor: 2000, data_despesa: `${year}-0${month + 1}-10`, descricao: 'Ads' });
    expenses.push({ id: uuid(), categoria: 'Insumos', valor: insumoVal + Math.random() * 1000, data_despesa: `${year}-0${month + 1}-02`, descricao: 'Material Escritorio' });
}

// 2. Operacional Chamados (Ultimos 30 dias)
const tickets = [];
const ticketCats = ['Manutenção', 'TI', 'Limpeza', 'Segurança'];
const priorities = ['Baixa', 'Média', 'Alta', 'Crítica'];
const statuses = ['Resolvido', 'Resolvido', 'Resolvido', 'Em Andamento', 'Aberto'];

for (let i = 0; i < 50; i++) {
    const date = randomDate(new Date('2026-05-01'), new Date('2026-06-30'));
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    let resolutionDate = '';
    if (status === 'Resolvido') {
        const resDate = new Date(date);
        resDate.setHours(resDate.getHours() + Math.random() * 48); // 0-48h resolution
        resolutionDate = formatDateTime(resDate);
    }

    tickets.push({
        id: uuid(),
        categoria: ticketCats[Math.floor(Math.random() * ticketCats.length)],
        descricao: `Ticket #${i + 100}`,
        prioridade: priorities[Math.floor(Math.random() * priorities.length)],
        status: status,
        data_abertura: formatDateTime(date),
        data_resolucao: resolutionDate
    });
}

// 3. Métricas Mensais (Jan-Jun 2026)
const metrics = [];
const metricTypes = [
    { type: 'nps', base: 75, var: 15 },
    { type: 'health_score', base: 8, var: 2 },
    { type: 'sla_secretaria', base: 1.5, var: 1 }, // dias
    { type: 'absenteismo_docentes', base: 2, var: 2 }, // %
    { type: 'uptime_ti', base: 99, var: 1 }, // %
    { type: 'desperdicio_alimentacao', base: 4, var: 2 }, // %
    { type: 'bolsistas_total', base: 45, var: 5 } // count
];

for (let month = 0; month < 6; month++) {
    const refDate = `${2026}-0${month + 1}-01`;
    metricTypes.forEach(m => {
        let val = m.base + (Math.random() * m.var) * (Math.random() > 0.5 ? 1 : -1);
        if (m.type === 'uptime_ti') val = Math.min(100, Math.max(90, val));
        if (m.type === 'nps') val = Math.min(100, Math.round(val));

        metrics.push({
            id: uuid(),
            mes_referencia: refDate,
            tipo_metrica: m.type,
            valor: val.toFixed(2),
            unidade: m.type.includes('percent') || m.type === 'uptime_ti' || m.type === 'absenteismo_docentes' ? '%' : 'num'
        });
    });
}

// WRITE TO CSVs
const writeCSV = (filename, headers, data) => {
    const headerRow = headers.join(',');
    const rows = data.map(obj => headers.map(h => obj[h] || '').join(','));
    fs.writeFileSync(filename, [headerRow, ...rows].join('\n'));
};

writeCSV('financeiro_despesas.csv', ['id', 'categoria', 'valor', 'data_despesa', 'descricao'], expenses);
writeCSV('operacional_chamados.csv', ['id', 'categoria', 'descricao', 'prioridade', 'status', 'data_abertura', 'data_resolucao'], tickets);
writeCSV('metricas_mensais.csv', ['id', 'mes_referencia', 'tipo_metrica', 'valor', 'unidade'], metrics);

console.log('CSVs gerados com sucesso!');
