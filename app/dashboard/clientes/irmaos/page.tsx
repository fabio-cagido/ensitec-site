"use client";

import { useEffect, useState } from "react";
import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MetricData } from "@/app/lib/mock-data";

export default function IrmaosPage() {
    const [dataset, setDataset] = useState<MetricData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/analytics?metric=siblings')
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
            title="Famílias com +1 Filho"
            description="Percentual de famílias com múltiplos alunos matriculados"
            dataset={dataset}
            kpiUnit="%"
            insights={[
                "Aproximadamente <strong>35%</strong> dos alunos possuem irmãos na escola.",
                "Segmento <strong>Infantil</strong> apresenta maior taxa.",
                "Famílias com múltiplos filhos demonstram <strong>maior fidelidade</strong>."
            ]}
            kpiSlug="irmaos"
            backLink="/dashboard/clientes"
        />
    );
}
