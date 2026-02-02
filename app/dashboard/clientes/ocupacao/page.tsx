"use client";

import { useEffect, useState } from "react";
import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MetricData } from "@/app/lib/mock-data";

export default function OcupacaoPage() {
    const [dataset, setDataset] = useState<MetricData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/analytics?metric=occupancy')
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
            title="Taxa de Ocupação da Turma"
            description="Distribuição percentual da ocupação de turmas"
            dataset={dataset}
            kpiUnit="%"
            insights={[
                "As turmas do <strong>Ensino Médio</strong> apresentam ocupação média de 85%.",
                "Turmas da <strong>Manhã</strong> estão próximas da capacidade máxima."
            ]}
            kpiSlug="occupancy"
            backLink="/dashboard/clientes"
        />
    );
}
