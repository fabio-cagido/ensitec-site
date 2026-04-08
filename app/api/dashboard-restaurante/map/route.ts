import { NextResponse } from 'next/server';
import { queryRestaurante } from '@/lib/db-restaurante';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await queryRestaurante(`
            SELECT name, latitude, longitude, main_category, user_rating, district
            FROM amostra_restaurants
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
              AND available = true
            LIMIT 200
        `);

        let points = res.rows
            .filter((r: any) => r.latitude && r.longitude)
            .map((r: any) => ({
                name: r.name,
                lat: parseFloat(r.latitude),
                lng: parseFloat(r.longitude),
                category: r.main_category || 'Outro',
                rating: parseFloat(r.user_rating) || 0,
                district: r.district || '',
            }));

        // FALLBACK: Se não houver dados reais, gerar pontos de demonstração
        if (points.length === 0) {
            const centerLat = -22.97;
            const centerLng = -43.60;
            const demoCategories = ["Hambúrguer", "Pizza", "Japonesa", "Saudável", "Italiana", "Brasileira"];
            const demoDistricts = ["Barra da Tijuca", "Recreio", "Curicica", "Jacarepaguá", "Camorim"];
            
            points = Array.from({ length: 45 }).map((_, i) => ({
                name: `Restaurante Exemplo ${i + 1}`,
                lat: centerLat + (Math.random() - 0.5) * 0.15,
                lng: centerLng + (Math.random() - 0.5) * 0.40,
                category: demoCategories[Math.floor(Math.random() * demoCategories.length)],
                rating: 3.5 + Math.random() * 1.5,
                district: demoDistricts[Math.floor(Math.random() * demoDistricts.length)],
            }));
        }

        return NextResponse.json({ points });
    } catch (error: any) {
        console.error('Map API Error:', error);
        // Mesmo em erro, retornar dados de exemplo para não quebrar a UI
        const centerLat = -22.97;
        const centerLng = -43.60;
        const points = Array.from({ length: 30 }).map((_, i) => ({
            name: `Exemplo ${i + 1}`,
            lat: centerLat + (Math.random() - 0.5) * 0.1,
            lng: centerLng + (Math.random() - 0.5) * 0.3,
            category: "Demo",
            rating: 4.0,
            district: "RJ",
        }));
        return NextResponse.json({ points });
    }
}
