"use client";

import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MOCK_HEALTH_SCORE } from "@/app/lib/mock-data";

export default function HealthScorePage() {
    return (
        <GenericAnalyticsPage
            title="Health Score (Família)"
            description="Índice de saúde das famílias baseado em adimplência e frequência"
            dataset={MOCK_HEALTH_SCORE}
            kpiUnit="/10"
            insights={[
                "Score médio de <strong>8.8/10</strong>, indicando alta qualidade.",
                "Segmento <strong>Infantil</strong> apresenta o melhor score (9.2).",
                "Famílias com score alto tendem a ter <strong>maior retenção</strong>."
            ]}
            kpiSlug="health-score"
            backLink="/dashboard/clientes"
        />
    );
}
