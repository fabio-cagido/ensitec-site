"use client";

import { useEffect, useState } from "react";
import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MetricData } from "@/app/lib/mock-data";

export default function EvasaoPage() {
    const [dataset, setDataset] = useState<MetricData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/analytics?metric=dropout')
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
            title="Taxa de Evasão"
            description="Monitoramento de cancelamentos e transferências"
            dataset={dataset}
            kpiUnit="%"
            insights={[
                "Evasão controlada e abaixo de 2% em todas as unidades.",
                "Melhoria na retenção em comparação ao semestre anterior."
            ]}
            kpiSlug="evasao"
            backLink="/dashboard/clientes"
        />
    );
}
