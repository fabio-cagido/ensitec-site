export interface MetricData {
    id: string;
    unitId: string;
    unitLabel: string;
    segmentId: string;
    segmentLabel: string;
    classId: string;
    classLabel: string;
    subjectId: string;
    subjectLabel: string;

    year: string;
    value: number;
}

// Helper builder to reduce boilerplate
// Added optional year, defaulting to "2026" for existing data compatibility
const createMock = (id: string, u: string, s: string, c: string, sub: string, val: number, year: string = "2026"): MetricData => ({
    id, unitId: u, unitLabel: u === 'u1' ? 'Unidade Centro' : 'Unidade Sul',
    segmentId: s, segmentLabel: s === 's2' ? 'Fund. II' : 'Ensino Médio',
    classId: c, classLabel: c === 't1' ? '9º Ano A' : c === 't2' ? '9º Ano B' : c === 't3' ? '3º Médio A' : c === 't5' ? '8º Ano A' : c === 't6' ? '1º Médio A' : 'Geral',
    subjectId: sub, subjectLabel: sub === 'm1' ? 'Matemática' : sub === 'm2' ? 'Português' : sub === 'm3' ? 'História' : sub === 'm5' ? 'Física' : 'Geral',
    year,
    value: val
});

// 1. Média Global (Notas 0-10)
export const MOCK_GRADES: MetricData[] = [
    createMock("g1", "u1", "s2", "t1", "m1", 7.5), createMock("g2", "u1", "s2", "t1", "m2", 8.0),
    createMock("g3", "u1", "s2", "t1", "m3", 8.5),
    createMock("g4", "u1", "s2", "t2", "m1", 6.0), createMock("g5", "u1", "s2", "t2", "m2", 7.2),
    createMock("g6", "u1", "s3", "t3", "m1", 8.8), createMock("g7", "u1", "s3", "t3", "m5", 7.5),
    createMock("g8", "u3", "s2", "t5", "m1", 8.2), createMock("g9", "u3", "s2", "t5", "m2", 8.5),
    createMock("g10", "u3", "s3", "t6", "m1", 6.8), createMock("g11", "u3", "s3", "t6", "m5", 6.5),
];

// 2. Taxa de Aprovação (% 0-100)
export const MOCK_APPROVAL: MetricData[] = [
    createMock("a1", "u1", "s2", "t1", "m1", 95), createMock("a2", "u1", "s2", "t1", "m2", 98),
    createMock("a3", "u1", "s2", "t2", "m1", 85), createMock("a4", "u1", "s2", "t2", "m2", 90),
    createMock("a5", "u3", "s3", "t6", "m1", 92), createMock("a6", "u3", "s3", "t6", "m5", 88),
];

// 3. Frequência Média (% 0-100)
export const MOCK_ATTENDANCE: MetricData[] = [
    createMock("f1", "u1", "s2", "t1", "all", 92),
    createMock("f2", "u1", "s2", "t2", "all", 88),
    createMock("f3", "u3", "s3", "t6", "all", 95),
];

// 4. Alunos em Risco (Contagem Inteira)
export const MOCK_RISK: MetricData[] = [
    createMock("r1", "u1", "s2", "t1", "all", 2),
    createMock("r2", "u1", "s2", "t2", "all", 8), // Turma problemática
    createMock("r3", "u3", "s3", "t6", "all", 1),
];

// 5. Taxa de Evasão (% Baixa 0-5)
export const MOCK_DROPOUT: MetricData[] = [
    createMock("d1", "u1", "s2", "all", "all", 1.2),
    createMock("d2", "u3", "s3", "all", "all", 0.5),
];

// 6. NPS (Índice 0-100)
export const MOCK_NPS: MetricData[] = [
    createMock("n1", "u1", "s2", "all", "all", 72),
    createMock("n2", "u3", "s3", "all", "all", 85),
];

// 7. Entrega de Atividades (%)
export const MOCK_DELIVERY: MetricData[] = [
    createMock("e1", "u1", "s2", "t1", "m1", 95),
    createMock("e2", "u1", "s2", "t2", "m1", 80),
];

// 8. Engajamento Digital (%)
export const MOCK_ENGAGEMENT: MetricData[] = [
    createMock("en1", "u1", "s2", "t1", "all", 65),
    createMock("en2", "u3", "s3", "t6", "all", 80),
];

// 9. Eficiência Operacional (Dias)
export const MOCK_EFFICIENCY: MetricData[] = [
    createMock("ef1", "u1", "all", "all", "all", 2.5),
    createMock("ef2", "u3", "all", "all", "all", 1.8),
];

export interface DataPoint {
    id: string;
    label: string;
    value: number;
    count: number;
    trend?: number;
    color?: string;
}

export function aggregateData(data: MetricData[], groupBy: 'unitId' | 'segmentId' | 'classId' | 'subjectId'): DataPoint[] {
    const map = new Map<string, { label: string; sum: number; count: number }>();

    data.forEach(item => {
        const key = item[groupBy];

        let label = "";
        if (groupBy === 'unitId') label = item.unitLabel;
        else if (groupBy === 'segmentId') label = item.segmentLabel;
        else if (groupBy === 'classId') label = item.classLabel;
        else if (groupBy === 'subjectId') label = item.subjectLabel;

        // Skip "all" or generic placeholders when grouping by specific refined dimensions if needed,
        // but for now, we render them if they exist in the data.
        if (item[groupBy] === 'all') return;

        if (!map.has(key)) {
            map.set(key, { label, sum: 0, count: 0 });
        }

        const entry = map.get(key)!;
        entry.sum += item.value;
        entry.count += 1;
    });

    const result: DataPoint[] = [];
    map.forEach((val, key) => {
        result.push({
            id: key,
            label: val.label,
            value: Number((val.sum / val.count).toFixed(1)), // Average
            count: val.count,
            color: getColorForKey(key)
        });
    });

    return result.sort((a, b) => b.value - a.value);
}

function getColorForKey(key: string): string {
    const colors = [
        "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-orange-500",
        "bg-red-500", "bg-cyan-500", "bg-pink-500", "bg-indigo-500"
    ];
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

// CLIENT DASHBOARD METRICS

// Total de Alunos (Contagem por Unidade/Segmento)
export const MOCK_TOTAL_STUDENTS: MetricData[] = [
    createMock("ts1", "u1", "s1", "all", "all", 450), // Infantil Centro
    createMock("ts2", "u1", "s2", "all", "all", 380), // Fund II Centro
    createMock("ts3", "u1", "s3", "all", "all", 220), // Médio Centro
    createMock("ts4", "u3", "s1", "all", "all", 200), // Infantil Sul
];

// Taxa de Ocupação (% por Unidade/Segmento)
export const MOCK_OCCUPANCY: MetricData[] = [
    createMock("oc1", "u1", "s1", "all", "all", 93.3), // Infantil Centro
    createMock("oc2", "u1", "s2", "all", "all", 88.9), // Fund II Centro
    createMock("oc3", "u1", "s3", "all", "all", 71.4), // Médio Centro
    createMock("oc4", "u3", "s1", "all", "all", 85.0), // Infantil Sul
];

// Alunos Bolsistas (Contagem por Unidade/Segmento)
export const MOCK_SCHOLARSHIPS: MetricData[] = [
    createMock("sc1", "u1", "s1", "all", "all", 45), // Infantil Centro
    createMock("sc2", "u1", "s2", "all", "all", 95), // Fund II Centro
    createMock("sc3", "u1", "s3", "all", "all", 120), // Médio Centro
    createMock("sc4", "u3", "s1", "all", "all", 52), // Infantil Sul
];

// Health Score (Índice 0-10 por Unidade/Segmento)
export const MOCK_HEALTH_SCORE: MetricData[] = [
    createMock("hs1", "u1", "s1", "all", "all", 9.2), // Infantil Centro
    createMock("hs2", "u1", "s2", "all", "all", 8.5), // Fund II Centro
    createMock("hs3", "u1", "s3", "all", "all", 8.0), // Médio Centro
    createMock("hs4", "u3", "s1", "all", "all", 9.0), // Infantil Sul
];

// Taxa de Irmãos (% de famílias com múltiplos alunos)
export const MOCK_SIBLINGS: MetricData[] = [
    createMock("sb1", "u1", "s1", "all", "all", 22.5), // Infantil Centro
    createMock("sb2", "u1", "s2", "all", "all", 18.0), // Fund II Centro
    createMock("sb3", "u1", "s3", "all", "all", 15.2), // Médio Centro
    createMock("sb4", "u3", "s1", "all", "all", 20.0), // Infantil Sul
];
