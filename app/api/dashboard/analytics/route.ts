
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface MetricData {
    unitLabel: string;
    classLabel: string;
    value: number;
}

// Realistic Fallback Data Generators
const getMockTotalStudents = () => [
    { unitLabel: 'Centro', value: 450 },
    { unitLabel: 'Sul', value: 380 },
    { unitLabel: 'Norte', value: 320 }
].map(d => ({ ...d, classLabel: 'Geral' }));

const getMockScholarships = () => {
    const units = ['Centro', 'Sul', 'Norte'];
    const classes = ['1A', '1B', '2A', '2B', '3A', '3B'];
    const data = [];
    for (const u of units) {
        for (const c of classes) {
            const scholar = Math.floor(Math.random() * 8) + 2;
            data.push({ unitLabel: u, classLabel: c, value: scholar });
        }
    }
    return data;
};

const getMockOccupancy = () => {
    const units = ['Centro', 'Sul', 'Norte'];
    const data = [];
    for (const u of units) {
        data.push({ classLabel: '1A', unitLabel: u, value: Math.floor(Math.random() * 5) + 25 });
        data.push({ classLabel: '1B', unitLabel: u, value: Math.floor(Math.random() * 10) + 20 });
        data.push({ classLabel: '2A', unitLabel: u, value: Math.floor(Math.random() * 10) + 20 });
        data.push({ classLabel: '3A', unitLabel: u, value: Math.floor(Math.random() * 5) + 25 });
    }
    return data;
};

const getMockSiblings = () => [
    { unitLabel: 'Centro', value: 35 },
    { unitLabel: 'Sul', value: 28 },
    { unitLabel: 'Norte', value: 24 }
];

const getMockDemography = (type: string) => {
    if (type === 'gender') return [
        { name: 'Masculino', value: 520 },
        { name: 'Feminino', value: 480 }
    ];
    if (type === 'race') return [
        { name: 'Branca', value: 400 },
        { name: 'Parda', value: 350 },
        { name: 'Preta', value: 150 },
        { name: 'Amarela', value: 80 },
        { name: 'Indígena', value: 20 }
    ];
    if (type === 'age') return [
        { name: '4-6 anos', value: 120 },
        { name: '7-10 anos', value: 250 },
        { name: '11-14 anos', value: 380 },
        { name: '15-18 anos', value: 250 }
    ];
    if (type === 'income') return [
        { name: 'Até 2 SM', value: 210 },
        { name: '2 a 5 SM', value: 450 },
        { name: '5 a 10 SM', value: 240 },
        { name: 'Acima de 10 SM', value: 100 }
    ];
    if (type === 'neighborhood') return [
        { name: 'Centro', value: 320 },
        { name: 'Batel', value: 150 },
        { name: 'Água Verde', value: 180 },
        { name: 'Portão', value: 120 },
        { name: 'Outros', value: 230 }
    ];
    return [];
};

const getMockLocations = () => {
    const segments = ['Infantil', 'Fundamental II', 'Ensino Médio'];
    return Array.from({ length: 50 }, (_, i) => ({
        id: `mock-loc-${i}-${Math.floor(Math.random() * 1000)}`,
        lat: -25.4297 + (Math.random() - 0.5) * 0.05,
        lng: -49.2719 + (Math.random() - 0.5) * 0.05,
        segment: segments[Math.floor(Math.random() * segments.length)],
        age: Math.floor(Math.random() * 14) + 4
    }));
};

const getMockHistory = (metric: string) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map(m => ({
        month: m,
        value: metric === 'nps' ? Math.floor(Math.random() * 20) + 60 : parseFloat((Math.random() * 2 + 7.5).toFixed(1))
    }));
};

const getMockComparison = (metric: string, dimension: string) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const keys = dimension === 'unit' ? ['Unidade Centro', 'Unidade Sul', 'Unidade Norte'] : ['Infantil', 'Fundamental II', 'Ensino Médio'];

    return months.map(m => {
        const point: any = { month: m };
        keys.forEach(k => {
            if (metric === 'nps') point[k] = Math.floor(Math.random() * 15) + 65;
            else if (metric === 'total-students') point[k] = Math.floor(Math.random() * 40) + 350;
            else if (metric === 'health-score') point[k] = parseFloat((Math.random() * 1.5 + 7.8).toFixed(1));
            else if (metric === 'evasao') point[k] = parseFloat((Math.random() * 2 + 1.5).toFixed(1));
            else if (metric === 'scholarships') point[k] = Math.floor(Math.random() * 10) + 15;
            else if (metric === 'occupancy') point[k] = Math.floor(Math.random() * 10) + 85;
        });
        return point;
    });
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric');
    const compare = searchParams.get('compare'); // unit | segment

    // Filter Params
    const units = searchParams.get('unidades')?.split(',').filter(Boolean) || [];
    const segments = searchParams.get('segmentos')?.split(',').filter(Boolean) || [];
    const types = searchParams.get('tiposMatricula')?.split(',').filter(Boolean) || [];
    const years = searchParams.get('anos')?.split(',').filter(Boolean) || [];

    try {
        if (compare && metric) {
            let data = getMockComparison(metric, compare);

            // Map IDs to Labels for strict filtering
            const unitMap: Record<string, string> = { 'u1': 'Unidade Centro', 'u2': 'Unidade Norte', 'u3': 'Unidade Sul' };
            const segMap: Record<string, string> = { 's1': 'Infantil', 's2': 'Fundamental II', 's3': 'Ensino Médio' };

            const selectedUnits = units.map(u => unitMap[u] || u);
            const selectedSegs = segments.map(s => segMap[s] || s);

            if (selectedUnits.length > 0 || selectedSegs.length > 0) {
                data = data.map(item => {
                    const newItem: any = { month: item.month };
                    Object.keys(item).forEach(k => {
                        if (k === 'month') return;

                        const isMatch = compare === 'unit'
                            ? selectedUnits.some(u => k.toLowerCase().includes(u.toLowerCase()))
                            : selectedSegs.some(s => k.toLowerCase().includes(s.toLowerCase()));

                        if (isMatch) {
                            newItem[k] = item[k];
                        }
                    });
                    return newItem;
                });
            }
            return NextResponse.json(data);
        }

        let sql = '';
        let params: any[] = [];
        // Note: Real SQL would incorporate the filters here
        if (metric === 'total-students') {
            sql = `SELECT e.nome as unit_label, a.turma as class_label, COUNT(*) as value FROM alunos a JOIN escolas e ON a.escola_id = e.id WHERE a.status_matricula != 'Evadido' GROUP BY e.nome, a.turma`;
        } else if (metric === 'scholarships') {
            sql = `SELECT e.nome as unit_label, a.turma as class_label, COUNT(*) as value FROM alunos a JOIN escolas e ON a.escola_id = e.id WHERE a.bolsista = true AND a.status_matricula != 'Evadido' GROUP BY e.nome, a.turma`;
        } else if (metric === 'occupancy') {
            sql = `SELECT turma as class_label, COUNT(*) as value FROM alunos WHERE status_matricula != 'Evadido' GROUP BY turma`;
        } else if (metric === 'demography') {
            const type = searchParams.get('type') || 'gender';
            if (type === 'gender') {
                sql = `SELECT e.nome as unit_label, a.genero as name, COUNT(*) as value FROM alunos a JOIN escolas e ON a.escola_id = e.id WHERE a.status_matricula != 'Evadido' GROUP BY e.nome, a.genero`;
            } else if (type === 'race') {
                sql = `SELECT e.nome as unit_label, a.cor_raca as name, COUNT(*) as value FROM alunos a JOIN escolas e ON a.escola_id = e.id WHERE a.status_matricula != 'Evadido' GROUP BY e.nome, a.cor_raca`;
            } else if (type === 'income') {
                sql = `SELECT e.nome as unit_label, a.faixa_renda as name, COUNT(*) as value FROM alunos a JOIN escolas e ON a.escola_id = e.id WHERE a.status_matricula != 'Evadido' GROUP BY e.nome, a.faixa_renda`;
            } else if (type === 'age') {
                sql = `
                    SELECT 
                        e.nome as unit_label,
                        CASE 
                            WHEN extract(year from age(current_date, data_nascimento)) BETWEEN 0 AND 6 THEN '4-6 anos'
                            WHEN extract(year from age(current_date, data_nascimento)) BETWEEN 7 AND 10 THEN '7-10 anos'
                            WHEN extract(year from age(current_date, data_nascimento)) BETWEEN 11 AND 14 THEN '11-14 anos'
                            ELSE '15-18 anos'
                        END as name,
                        COUNT(*) as value
                    FROM alunos a JOIN escolas e ON a.escola_id = e.id 
                    WHERE a.status_matricula != 'Evadido'
                    GROUP BY e.nome, name
                 `;
            } else if (type === 'neighborhood') {
                sql = `SELECT e.nome as unit_label, a.cidade_aluno as name, COUNT(*) as value FROM alunos a JOIN escolas e ON a.escola_id = e.id WHERE a.status_matricula != 'Evadido' GROUP BY e.nome, a.cidade_aluno`;
            }
        } else if (metric === 'locations') {
            sql = `SELECT a.id, a.latitude as lat, a.longitude as lng, a.segmento as segment, extract(year from age(current_date, a.data_nascimento)) as age FROM alunos a WHERE a.status_matricula != 'Evadido' AND a.latitude IS NOT NULL`;
        }

        if (sql) {
            try {
                const result = await query(sql);
                if (result.rows.length > 0) {
                    if (metric === 'locations') {
                        return NextResponse.json(result.rows.map(r => ({
                            id: r.id,
                            lat: Number(r.lat),
                            lng: Number(r.lng),
                            segment: r.segment,
                            age: Number(r.age)
                        })));
                    }

                    if (metric === 'demography') {
                        let mapped = result.rows.map(r => ({
                            unitLabel: r.unit_label || 'Geral',
                            name: r.name,
                            value: Number(r.value)
                        }));

                        const unitMap: Record<string, string> = { 'u1': 'Unidade Centro', 'u2': 'Unidade Norte', 'u3': 'Unidade Sul' };
                        const selectedUnits = units.map(u => unitMap[u] || u);

                        if (selectedUnits.length > 0) {
                            mapped = mapped.filter(m => selectedUnits.some(u => m.unitLabel.toLowerCase().includes(u.toLowerCase()) || u === m.unitLabel));
                        }

                        const aggregated = mapped.reduce((acc, curr) => {
                            const existing = acc.find((item: any) => item.name === curr.name);
                            if (existing) {
                                existing.value += curr.value;
                            } else {
                                acc.push({ name: curr.name, value: curr.value });
                            }
                            return acc;
                        }, [] as any[]);

                        aggregated.forEach((item: any) => {
                            if (item.name === 'M') item.name = 'Masculino';
                            if (item.name === 'F') item.name = 'Feminino';
                        });

                        return NextResponse.json(aggregated);
                    }

                    let mapped = result.rows.map(r => ({
                        unitLabel: r.unit_label || 'Geral',
                        classLabel: r.class_label || 'Geral',
                        value: Number(r.value)
                    }));

                    const unitMap: Record<string, string> = { 'u1': 'Unidade Centro', 'u2': 'Unidade Norte', 'u3': 'Unidade Sul' };
                    const selectedUnits = units.map(u => unitMap[u] || u);

                    if (selectedUnits.length > 0) {
                        mapped = mapped.filter(m => selectedUnits.some(u => m.unitLabel.toLowerCase().includes(u.toLowerCase()) || u === m.unitLabel));
                    }

                    return NextResponse.json(mapped);
                } else if (metric === 'demography') {
                    // Empty state fallback for demography from real DB avoiding mock override
                    return NextResponse.json([]);
                }
            } catch (dbErr) {
                console.warn(`Query failed for ${metric}: ${dbErr}`);
            }
        }

        const unitMap: Record<string, string> = { 'u1': 'Centro', 'u2': 'Norte', 'u3': 'Sul' };
        const segMap: Record<string, string> = { 's1': 'Infantil', 's2': 'Fundamental II', 's3': 'Ensino Médio' };

        const selectedUnits = units.map(u => unitMap[u] || u);
        const selectedSegs = segments.map(s => segMap[s] || s);
        const yearMultiplier = years.includes('2025') ? 0.92 : years.includes('2024') ? 0.85 : 1.0;

        // FALLBACK MOCK DATA
        let mockData: any = [];
        if (metric === 'total-students') {
            mockData = getMockTotalStudents().map(m => ({ ...m, value: Math.floor(m.value * yearMultiplier) }));
            if (selectedUnits.length > 0) mockData = mockData.filter((m: any) => selectedUnits.some(u => m.unitLabel.toLowerCase().includes(u.toLowerCase())));
        }
        else if (metric === 'scholarships') {
            mockData = getMockScholarships().map(m => ({ ...m, value: Math.floor(m.value * yearMultiplier) }));
            if (selectedUnits.length > 0) mockData = mockData.filter((m: any) => selectedUnits.some(u => m.unitLabel.toLowerCase().includes(u.toLowerCase())));
            // For segments, we can infer from classLabel (A=Infantil, B=Medium, etc - mock logic)
        }
        else if (metric === 'occupancy') {
            mockData = getMockOccupancy().map(m => ({ ...m, value: Math.floor(m.value * yearMultiplier) }));
            if (selectedUnits.length > 0) mockData = mockData.filter((m: any) => selectedUnits.some(u => m.unitLabel.toLowerCase().includes(u.toLowerCase())));
            if (selectedSegs.length > 0) {
                // Simple mock segment logic: map classes to segments
                mockData = mockData.filter((m: any) => {
                    if (selectedSegs.includes('Infantil')) return m.classLabel.includes('1');
                    if (selectedSegs.includes('Fundamental II')) return m.classLabel.includes('2');
                    if (selectedSegs.includes('Ensino Médio')) return m.classLabel.includes('3');
                    return true;
                });
            }
        }
        else if (metric === 'siblings') {
            mockData = getMockSiblings();
            if (selectedUnits.length > 0) mockData = mockData.filter((m: any) => selectedUnits.some(u => m.unitLabel.toLowerCase().includes(u.toLowerCase())));
        }
        else if (metric === 'demography') {
            const type = searchParams.get('type') || 'gender';
            mockData = getMockDemography(type);
        }
        else if (metric === 'locations') {
            mockData = getMockLocations();
        }
        else if (metric === 'nps') {
            mockData = { score: 72, promoters: 520, neutrals: 300, detractors: 180 };
        }
        else if (metric === 'health-score') {
            mockData = {
                current: 8.4,
                history: getMockHistory('health-score').map(h => ({ month: h.month, value: h.value }))
            };
        }
        else if (metric === 'evasao') {
            mockData = getMockHistory('evasao').map(h => ({ month: h.month, Evadidos: Math.floor(h.value / 2), Meta: 5 }));
        }

        return NextResponse.json(mockData);

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json([], { status: 200 });
    }
}
