"use client";

import { useEffect, useState } from "react";
import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MetricData } from "@/app/lib/mock-data";

export default function HealthScorePage() {
    const [dataset, setDataset] = useState<MetricData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/analytics?metric=health-score')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setDataset(data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <GenericAnalyticsPage
            title="Health Score (Família)"
            description="Índice de saúde das famílias baseado em adimplência e frequência"
            dataset={dataset}
            kpiUnit="/10"
            insights={[
                "Score indicando <strong>alta saúde</strong> das famílias.",
                "Famílias com score alto tendem a ter <strong>maior retenção</strong>."
            ]}
            kpiSlug="health-score"
            backLink="/dashboard/clientes"
        />
    );
}
