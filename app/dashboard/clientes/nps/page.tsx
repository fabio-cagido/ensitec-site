"use client";

import { useEffect, useState } from "react";
import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MetricData } from "@/app/lib/mock-data";

export default function NPSPage() {
    const [dataset, setDataset] = useState<MetricData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/analytics?metric=nps')
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
            title="NPS (Satisfação)"
            description="Net Promoter Score de alunos e responsáveis"
            dataset={dataset}
            kpiUnit=""
            insights={[
                "NPS na <strong>Zona de Excelência</strong>.",
                "Feedback positivo consistente sobre a infraestrutura."
            ]}
            kpiSlug="nps"
            backLink="/dashboard/clientes"
        />
    );
}
