import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface GeoData {
    name: string;
    value: number;
}

interface AgeData {
    age: string;
    count: number;
}

export async function GET() {
    try {
        // 1. Total de Alunos e Status
        const studentStatusQuery = `
      SELECT 
        status_matricula,
        COUNT(*) as count
      FROM alunos
      GROUP BY status_matricula
    `;
        const statusResult = await query(studentStatusQuery);

        // 2. Gênero
        const genderQuery = `
      SELECT 
        genero,
        COUNT(*) as count
      FROM alunos
      GROUP BY genero
    `;
        const genderResult = await query(genderQuery);

        // 3. Turmas (Ocupação)
        const classQuery = `
      SELECT 
        turma as name,
        COUNT(*) as occupied
      FROM alunos
      WHERE status_matricula = 'Ativo'
      GROUP BY turma
      ORDER BY turma
    `;
        const classResult = await query(classQuery);

        // 4. Geografia (Cidades dos Alunos ou das Escolas)
        const geoQuery = `
            SELECT 
                COALESCE(cidade_aluno, e.cidade) as name,
                COUNT(a.id) as value
            FROM alunos a
            JOIN escolas e ON a.escola_id = e.id
            GROUP BY 1
            ORDER BY value DESC
            LIMIT 5
        `;
        const geoResult = await query(geoQuery);

        // 5. Faixa Etária (Calculada)
        const ageQuery = `
            SELECT 
                CASE 
                    WHEN EXTRACT(YEAR FROM age(data_nascimento)) BETWEEN 0 AND 5 THEN '0-5'
                    WHEN EXTRACT(YEAR FROM age(data_nascimento)) BETWEEN 6 AND 10 THEN '6-10'
                    WHEN EXTRACT(YEAR FROM age(data_nascimento)) BETWEEN 11 AND 14 THEN '11-14'
                    WHEN EXTRACT(YEAR FROM age(data_nascimento)) BETWEEN 15 AND 18 THEN '15-18'
                    ELSE '18+' 
                END as age_group,
                COUNT(*) as count
            FROM alunos
            GROUP BY age_group
        `;
        const ageResult = await query(ageQuery);

        // 6. Cor/Raça
        const raceQuery = `
            SELECT cor_raca, COUNT(*) as count 
            FROM alunos 
            GROUP BY cor_raca
        `;
        const raceResult = await query(raceQuery);

        // 7. Renda
        const incomeQuery = `
            SELECT faixa_renda, COUNT(*) as count 
            FROM alunos 
            GROUP BY faixa_renda
        `;
        const incomeResult = await query(incomeQuery);

        // 8. KPIs Agregados (Bolsistas, Irmãos, etc)
        const aggregationQuery = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status_matricula = 'Ativo') as ativos,
                COUNT(*) FILTER (WHERE status_matricula = 'Evadido') as evadidos,
                COUNT(*) FILTER (WHERE bolsista = true) as bolsistas,
                COUNT(*) FILTER (WHERE tem_irmaos = true) as com_irmaos
            FROM alunos
        `;
        const aggResult = await query(aggregationQuery);
        const agg = aggResult.rows[0];

        // 9. Métricas de Satisfação (NPS, Health Score)
        const metricsQuery = `
            SELECT DISTINCT ON (tipo_metrica) 
                tipo_metrica, valor
            FROM metricas_mensais
            WHERE tipo_metrica IN ('nps', 'health_score')
            ORDER BY tipo_metrica, mes_referencia DESC
        `;
        const metricsResult = await query(metricsQuery);
        const metricsMap = metricsResult.rows.reduce((acc: any, curr: any) => {
            acc[curr.tipo_metrica] = { value: Number(curr.valor) };
            return acc;
        }, {});

        // 10. Cálculo de Crescimento (NPS)
        const growthQuery = `
            WITH last_two AS (
                SELECT valor, row_number() OVER (ORDER BY mes_referencia DESC) as rn
                FROM metricas_mensais
                WHERE tipo_metrica = 'nps'
            )
            SELECT valor FROM last_two WHERE rn <= 2
        `;
        const growthResult = await query(growthQuery);
        let npsGrowth = "+0.0%";
        if (growthResult.rows.length >= 2) {
            const diff = (growthResult.rows[0].valor - growthResult.rows[1].valor).toFixed(1);
            npsGrowth = (Number(diff) >= 0 ? '+' : '') + diff + ' pts';
        }

        const totalStudents = Number(agg.total);

        // Transformando os resultados para o formato do dashboard
        const ageOrder = ['0-5', '6-10', '11-14', '15-18', '18+'];
        const ageDataSorted = ageResult.rows.map((r: any) => ({
            age: r.age_group,
            count: Number(r.count)
        })).sort((a: any, b: any) => ageOrder.indexOf(a.age) - ageOrder.indexOf(b.age));

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
                npsGrowth: npsGrowth,
                healthScore: metricsMap['health_score'] ? metricsMap['health_score'].value : 9.2
            },
            occupancyBySegment: classResult.rows.map((r: any) => ({
                name: r.name,
                occupied: Number(r.occupied),
                capacity: 40,
                rate: (Number(r.occupied) / 40) * 100
            })),
            genderData: genderResult.rows.map((r: any) => ({
                name: r.genero === 'M' ? 'Masculino' : r.genero === 'F' ? 'Feminino' : 'Outro',
                value: Number(r.count)
            })),
            geoData: geoResult.rows.map((r: any) => ({ name: r.name, value: Number(r.value) })),
            raceData: raceResult.rows.map((r: any) => ({
                name: r.cor_raca || 'Não declarado',
                value: Number(r.count)
            })),
            incomeData: incomeResult.rows.map((r: any) => ({
                range: r.faixa_renda || 'Não declarado',
                count: Number(r.count)
            })),
            ageData: ageDataSorted
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Clients API Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
