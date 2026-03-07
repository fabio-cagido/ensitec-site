import { NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

const CITY_COORDS: Record<string, [number, number]> = {
    'Rio de Janeiro': [-22.9068, -43.1729],
    'São Paulo': [-23.5505, -46.6333],
    'Curitiba': [-25.4284, -49.2733],
};

export async function GET() {
    try {
        const { sessionClaims } = await auth();
        const metadata = sessionClaims?.metadata as any;

        if (!metadata?.escola_id) {
            return NextResponse.json({ error: 'Tenant ID missing.' }, { status: 403 });
        }
        const schoolsQuery = `
            SELECT 
                a.unidade as id, 
                a.unidade as name, 
                MAX(COALESCE(nullif(trim(a.cidade_aluno), ''), e.cidade)) as city,
                COUNT(a.id) as students
            FROM alunos a
            JOIN escolas e ON e.id = a.escola_id
            GROUP BY a.unidade
        `;
        const result = await queryWithTenant(schoolsQuery, [], sessionClaims);

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
