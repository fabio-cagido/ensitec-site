
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

const getMockData = () => ({
    kpis: {
        totalStudents: 1000,
        totalStudentsGrowth: "+5.2%",
        occupancyRate: 85.4,
        churnRate: 2.1,
        scholarships: 154,
        scholarshipPercentage: 15.4,
        siblingPercentage: 32.0,
        nps: 72,
        npsGrowth: "+4 pts",
        healthScore: 8.4
    },
    occupancyBySegment: [
        { name: '1A', rate: 95 },
        { name: '1B', rate: 88 },
        { name: '2A', rate: 92 },
        { name: '3A', rate: 78 }
    ],
    genderData: [
        { name: 'Masculino', value: 520 },
        { name: 'Feminino', value: 480 }
    ],
    geoData: [
        { name: 'São Paulo', value: 650 },
        { name: 'Rio de Janeiro', value: 200 },
        { name: 'Curitiba', value: 150 }
    ],
    raceData: [
        { name: 'Parda', value: 450 },
        { name: 'Branca', value: 380 },
        { name: 'Preta', value: 120 },
        { name: 'Amarela', value: 50 }
    ],
    incomeData: [
        { range: '3-6 SM', count: 420 },
        { range: 'Até 3 SM', count: 350 },
        { range: '6-10 SM', count: 180 },
        { range: 'Acima 10 SM', count: 50 }
    ],
    ageData: [
        { age: '6-10', count: 320 },
        { age: '11-14', count: 450 },
        { age: '15-18', count: 230 }
    ]
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const units = searchParams.get('unidades')?.split(',').filter(Boolean) || [];
    const segments = searchParams.get('segmentos')?.split(',').filter(Boolean) || [];
    const years = searchParams.get('anos')?.split(',').filter(Boolean) || [];

    try {
        const studentStatusQuery = `SELECT status_matricula, COUNT(*) as count FROM alunos GROUP BY status_matricula`;
        const genderQuery = `SELECT genero, COUNT(*) as count FROM alunos GROUP BY genero`;
        const classQuery = `SELECT turma as name, COUNT(*) as occupied FROM alunos WHERE status_matricula = 'Ativo' GROUP BY turma ORDER BY turma`;
        const geoQuery = `SELECT COALESCE(cidade_aluno, e.cidade) as name, COUNT(a.id) as value FROM alunos a JOIN escolas e ON a.escola_id = e.id GROUP BY 1 ORDER BY value DESC LIMIT 5`;
        const ageQuery = `SELECT CASE WHEN EXTRACT(YEAR FROM age(data_nascimento)) BETWEEN 0 AND 5 THEN '0-5' WHEN EXTRACT(YEAR FROM age(data_nascimento)) BETWEEN 6 AND 10 THEN '6-10' WHEN EXTRACT(YEAR FROM age(data_nascimento)) BETWEEN 11 AND 14 THEN '11-14' WHEN EXTRACT(YEAR FROM age(data_nascimento)) BETWEEN 15 AND 18 THEN '15-18' ELSE '18+' END as age_group, COUNT(*) as count FROM alunos GROUP BY age_group`;
        const raceQuery = `SELECT cor_raca, COUNT(*) as count FROM alunos GROUP BY cor_raca`;
        const incomeQuery = `SELECT faixa_renda, COUNT(*) as count FROM alunos GROUP BY faixa_renda`;
        const aggregationQuery = `SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status_matricula = 'Ativo') as ativos, COUNT(*) FILTER (WHERE status_matricula = 'Evadido') as evadidos, COUNT(*) FILTER (WHERE bolsista = true) as bolsistas, COUNT(*) FILTER (WHERE tem_irmaos = true) as com_irmaos FROM alunos`;
        const metricsQuery = `SELECT DISTINCT ON (tipo_metrica) tipo_metrica, valor FROM metricas_mensais WHERE tipo_metrica IN ('nps', 'health_score') ORDER BY tipo_metrica, mes_referencia DESC`;

        try {
            const [statusResult, genderResult, classResult, geoResult, ageResult, raceResult, incomeResult, aggResult, metricsResult] = await Promise.all([
                query(studentStatusQuery), query(genderQuery), query(classQuery), query(geoQuery),
                query(ageQuery), query(raceQuery), query(incomeQuery), query(aggregationQuery), query(metricsQuery)
            ]);

            if (aggResult.rows.length > 0 && aggResult.rows[0].total > 0) {
                const agg = aggResult.rows[0];
                const totalStudents = Number(agg.total);
                const metricsMap = metricsResult.rows.reduce((acc: any, curr: any) => {
                    acc[curr.tipo_metrica] = { value: Number(curr.valor) };
                    return acc;
                }, {});

                return NextResponse.json({
                    kpis: {
                        totalStudents,
                        totalStudentsGrowth: "+5.2%",
                        occupancyRate: classResult.rows.length > 0 ? (Number(agg.ativos) / (classResult.rows.length * 40) * 100).toFixed(1) : 0,
                        churnRate: totalStudents > 0 ? (Number(agg.evadidos) / totalStudents * 100).toFixed(1) : 0,
                        scholarships: Number(agg.bolsistas),
                        scholarshipPercentage: totalStudents > 0 ? ((Number(agg.bolsistas) / totalStudents) * 100).toFixed(1) : 0,
                        siblingPercentage: totalStudents > 0 ? ((Number(agg.com_irmaos) / totalStudents) * 100).toFixed(1) : 0,
                        nps: metricsMap['nps'] ? metricsMap['nps'].value : 85,
                        npsGrowth: "+2 pts",
                        healthScore: metricsMap['health_score'] ? metricsMap['health_score'].value : 9.2
                    },
                    occupancyBySegment: classResult.rows.map((r: any) => ({
                        name: r.name,
                        rate: (Number(r.occupied) / 40) * 100
                    })),
                    genderData: genderResult.rows.map((r: any) => ({
                        name: r.genero === 'M' ? 'Masculino' : 'Feminino',
                        value: Number(r.count)
                    })),
                    geoData: geoResult.rows.map((r: any) => ({ name: r.name, value: Number(r.value) })),
                    raceData: raceResult.rows.map((r: any) => ({
                        name: r.cor_raca || 'Outros',
                        value: Number(r.count)
                    })),
                    incomeData: incomeResult.rows.map((r: any) => ({
                        range: r.faixa_renda || 'Outros',
                        count: Number(r.count)
                    })),
                    ageData: ageResult.rows.map((r: any) => ({
                        age: r.age_group,
                        count: Number(r.count)
                    }))
                });
            }
        } catch (dbErr) {
            console.warn("DB Fallback triggered for Clients Menu:", dbErr);
        }

        return NextResponse.json(getMockData());

    } catch (error) {
        console.error('Clients API Error:', error);
        return NextResponse.json(getMockData());
    }
}
