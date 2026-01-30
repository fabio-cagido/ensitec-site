"use client";

import { useEffect, useState } from "react";
import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MetricData } from "@/app/lib/mock-data";

export default function BolsistasPage() {
    const [dataset, setDataset] = useState<MetricData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/analytics?metric=scholarships')
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
            title="Alunos Bolsistas"
            description="Distribuição de alunos com bolsas de estudo"
            dataset={dataset}
            kpiUnit=" alunos"
            insights={[
                "Programa de bolsas atende <strong>20%</strong> do corpo discente.",
                "Maior concentração no ensino <strong>Fundamental II</strong>."
            ]}
            kpiSlug="scholarships"
            backLink="/dashboard/clientes"
        />
    );
}
