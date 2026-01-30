"use client";

import { useEffect, useState } from "react";
import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MetricData } from "@/app/lib/mock-data";

export default function MediaGlobalPage() {
    const [dataset, setDataset] = useState<MetricData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/analytics?metric=grades')
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
            title="Média Global de Notas"
            description="Análise detalhada de performance por notas"
            dataset={dataset}
            kpiUnit=""
            insights={[
                "Média geral acima de <strong>7.0</strong> na maioria das turmas.",
                "Disciplinas de <strong>Humanas</strong> apresentam as melhores médias.",
                "Necessidade de reforço em <strong>Exatas</strong> no Ensino Médio."
            ]}
            kpiSlug="media-global"
        />
    );
}
