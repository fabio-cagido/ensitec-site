import { NextResponse } from 'next/server';
import { queryRestaurante } from '@/lib/db-restaurante';

export async function GET() {
    try {
        const res = await queryRestaurante(`
            SELECT name, latitude, longitude, main_category, user_rating, district
            FROM amostra_restaurants
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
              AND available = true
            LIMIT 200
        `);

        const points = res.rows
            .filter((r: any) => r.latitude && r.longitude)
            .map((r: any) => ({
                name: r.name,
                lat: parseFloat(r.latitude),
                lng: parseFloat(r.longitude),
                category: r.main_category || 'Outro',
                rating: parseFloat(r.user_rating) || 0,
                district: r.district || '',
            }));

        return NextResponse.json({ points });
    } catch (error: any) {
        console.error('Map API Error:', error);
        return NextResponse.json({ points: [] }, { status: 500 });
    }
}
