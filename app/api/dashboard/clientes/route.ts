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

        // 4. Geografia (Cidades das Escolas)
        const geoQuery = `
            SELECT 
                e.cidade as name,
                COUNT(a.id) as value
            FROM alunos a
            JOIN escolas e ON a.escola_id = e.id
            GROUP BY e.cidade
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
            ORDER BY count DESC
        `;
        const ageResult = await query(ageQuery);


        // 6. Transformando os resultados para o formato do dashboard
        const totalStudents = statusResult.rows.reduce((acc: number, curr: any) => acc + Number(curr.count), 0);
        const activeStudents = statusResult.rows.find((r: any) => r.status_matricula === 'Ativo')?.count || 0;
        const churnedStudents = statusResult.rows.find((r: any) => r.status_matricula === 'Evadido')?.count || 0;

        const occupancyBySegment = classResult.rows.map((r: any) => ({
            name: r.name,
            occupied: Number(r.occupied),
            capacity: 40, // Mockando capacidade
            rate: (Number(r.occupied) / 40) * 100
        }));

        const genderData = genderResult.rows.map((r: any) => ({
            name: r.genero === 'M' ? 'Masculino' : r.genero === 'F' ? 'Feminino' : 'Outro',
            value: Number(r.count)
        }));

        const geoData = geoResult.rows.map((r: any) => ({
            name: r.name,
            value: Number(r.value)
        }));

        const ageData = ageResult.rows.map((r: any) => ({
            age: r.age_group,
            count: Number(r.count)
        }));

        // Ordenar Faixa Etária
        const ageOrder = ['0-5', '6-10', '11-14', '15-18', '18+'];
        ageData.sort((a: any, b: any) => ageOrder.indexOf(a.age) - ageOrder.indexOf(b.age));


        // Mockando alguns dados que não estão no CSV mas estão no layout (Renda e Raça não tem na base)
        return NextResponse.json({
            kpis: {
                totalStudents: Number(totalStudents),
                occupancyRate: classResult.rows.length > 0 ? (Number(activeStudents) / (classResult.rows.length * 40) * 100).toFixed(1) : 0,
                churnRate: totalStudents > 0 ? (Number(churnedStudents) / Number(totalStudents) * 100).toFixed(1) : 0,
                scholarships: 45, // Mock
                scholarshipPercentage: 15, // Mock
                nps: 85, // Mock
                healthScore: 9.2 // Mock
            },
            occupancyBySegment,
            genderData,
            geoData: geoData.length > 0 ? geoData : [{ name: 'Sem dados', value: 0 }],
            raceData: [
                { name: 'Branca', value: 50 },
                { name: 'Parda', value: 45 },
                { name: 'Preta', value: 20 },
                { name: 'Outros', value: 5 }
            ],
            ageData: ageData.length > 0 ? ageData : [{ age: 'N/A', count: 0 }],
            incomeData: [
                { range: 'Até 3 SM', count: 20 },
                { range: '3-6 SM', count: 45 },
                { range: '6-10 SM', count: 35 }
            ]
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Clients API Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
