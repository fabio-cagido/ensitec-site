import { NextResponse } from 'next/server';
import { queryRestaurante } from '@/lib/db-restaurante';

export async function GET() {
    try {
        // ============================================
        // KPIs extraídos da base real (amostra_restaurants + amostra_catalog)
        // ============================================
        const [statsRes, catalogRes, categoryRes, topRestaurantsRes] = await Promise.all([
            // Média de taxa de entrega, nota, tempo e total de restaurantes
            queryRestaurante(`
                SELECT 
                    COUNT(*) as total_restaurants,
                    ROUND(AVG(delivery_fee)::numeric / 100, 2) as avg_delivery_fee,
                    ROUND(AVG(user_rating)::numeric, 2) as avg_rating,
                    ROUND(AVG(delivery_min_minutes)::numeric, 0) as avg_min_time,
                    ROUND(AVG(delivery_max_minutes)::numeric, 0) as avg_max_time,
                    ROUND(AVG(user_rating_count)::numeric, 0) as avg_rating_count,
                    COUNT(DISTINCT main_category) as total_categories,
                    COUNT(DISTINCT city) as total_cities
                FROM amostra_restaurants
                WHERE available = true
            `),
            // Preço médio do cardápio
            queryRestaurante(`
                SELECT 
                    ROUND(AVG(unit_price)::numeric, 2) as avg_price,
                    ROUND(AVG(unit_original_price)::numeric, 2) as avg_original_price,
                    COUNT(*) as total_items,
                    COUNT(DISTINCT restaurant_name) as total_restaurants_with_menu
                FROM amostra_catalog
                WHERE unit_price > 0
            `),
            // Top categorias
            queryRestaurante(`
                SELECT main_category, COUNT(*) as total
                FROM amostra_restaurants
                WHERE main_category IS NOT NULL AND main_category != ''
                GROUP BY main_category
                ORDER BY total DESC
                LIMIT 10
            `),
            // Top restaurantes por nota
            queryRestaurante(`
                SELECT name, user_rating, user_rating_count, main_category, city, district
                FROM amostra_restaurants
                WHERE user_rating IS NOT NULL AND user_rating_count > 50
                ORDER BY user_rating DESC, user_rating_count DESC
                LIMIT 8
            `),
        ]);

        const stats = statsRes.rows[0];
        const catalog = catalogRes.rows[0];
        const categories = categoryRes.rows;
        const topRestaurants = topRestaurantsRes.rows;

        // Calcular desconto médio do mercado
        const avgDiscount = catalog.avg_original_price > 0
            ? ((catalog.avg_original_price - catalog.avg_price) / catalog.avg_original_price * 100).toFixed(1)
            : '0';

        return NextResponse.json({
            kpis: {
                totalRestaurants: parseInt(stats.total_restaurants),
                avgDeliveryFee: parseFloat(stats.avg_delivery_fee),
                avgRating: parseFloat(stats.avg_rating),
                avgDeliveryTime: `${stats.avg_min_time}-${stats.avg_max_time}`,
                avgRatingCount: parseInt(stats.avg_rating_count),
                totalCategories: parseInt(stats.total_categories),
                totalCities: parseInt(stats.total_cities),
                avgMenuPrice: parseFloat(catalog.avg_price),
                avgOriginalPrice: parseFloat(catalog.avg_original_price),
                avgDiscount: parseFloat(avgDiscount),
                totalMenuItems: parseInt(catalog.total_items),
            },
            categories,
            topRestaurants,
        });
    } catch (error: any) {
        console.error('Dashboard Restaurante Overview Error:', error);
        return NextResponse.json(
            { error: error.message || 'Erro ao buscar dados do restaurante' },
            { status: 500 }
        );
    }
}
