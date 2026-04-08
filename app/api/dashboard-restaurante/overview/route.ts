import { NextResponse } from 'next/server';
import { queryRestaurante } from '@/lib/db-restaurante';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // ============================================
        // KPIs extraídos da base real (amostra_restaurants + amostra_catalog)
        // ============================================
        const [
            statsRes, 
            catalogStatsRes, 
            categoryRes, 
            topRestaurantsRes, 
            catalogItemsRes, 
            geoRes
        ] = await Promise.all([
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
            // Preço médio do cardápio (Estatísticas)
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
            // Itens de referência do catálogo (Amostra para o Cardápio)
            queryRestaurante(`
                SELECT item_name as name, unit_price as price, description, unit_original_price as original_price
                FROM amostra_catalog
                WHERE unit_price > 0
                ORDER BY RANDOM()
                LIMIT 20
            `),
            // Distribuição por Bairro (Geográfico)
            queryRestaurante(`
                SELECT district as name, COUNT(*) as value, ROUND(AVG(user_rating)::numeric, 1) as avg_rating
                FROM amostra_restaurants
                WHERE district IS NOT NULL AND district != ''
                GROUP BY district
                ORDER BY value DESC
                LIMIT 10
            `),
        ]);

        const stats = statsRes.rows[0];
        const catalogStats = catalogStatsRes.rows[0];
        const categories = categoryRes.rows;
        const topRestaurants = topRestaurantsRes.rows;
        const catalogItems = catalogItemsRes.rows;
        const geoDistribution = geoRes.rows;

        // Calcular desconto médio do mercado
        const avgDiscount = catalogStats.avg_original_price > 0
            ? ((catalogStats.avg_original_price - catalogStats.avg_price) / catalogStats.avg_original_price * 100).toFixed(1)
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
                avgMenuPrice: parseFloat(catalogStats.avg_price),
                avgOriginalPrice: parseFloat(catalogStats.avg_original_price),
                avgDiscount: parseFloat(avgDiscount),
                totalMenuItems: parseInt(catalogStats.total_items),
            },
            categories,
            topRestaurants,
            catalogItems,
            geoDistribution
        });
    } catch (error: any) {
        console.error('Dashboard Restaurante Overview Error:', error);
        return NextResponse.json(
            { error: error.message || 'Erro ao buscar dados do restaurante' },
            { status: 500 }
        );
    }
}
