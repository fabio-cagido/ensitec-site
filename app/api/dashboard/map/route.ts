import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

const CITY_COORDS: Record<string, [number, number]> = {
    'Rio de Janeiro': [-22.9068, -43.1729],
    'São Paulo': [-23.5505, -46.6333],
    'Curitiba': [-25.4284, -49.2733],
};

export async function GET() {
    try {
        const schoolsQuery = `
            SELECT 
                e.id, 
                e.nome as name, 
                e.cidade as city,
                COUNT(a.id) as students
            FROM escolas e
            LEFT JOIN alunos a ON e.id = a.escola_id
            GROUP BY e.id, e.nome, e.cidade
        `;
        const result = await query(schoolsQuery);

        const schools = result.rows.map(r => ({
            id: r.id,
            name: r.name,
            city: r.city,
            students: Number(r.students),
            position: CITY_COORDS[r.city] || [-22.9, -43.2]
        }));

        return NextResponse.json(schools);
    } catch (error) {
        console.error('Map API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch map data' }, { status: 500 });
    }
}
