"use client";

import { useEffect, useState } from "react";
import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MetricData } from "@/app/lib/mock-data";

export default function TotalAlunosPage() {
    const [dataset, setDataset] = useState<MetricData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/analytics?metric=total-students')
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
            title="Total de Alunos"
            description="Distribuição de alunos ativos por unidade e segmento"
            dataset={dataset}
            kpiUnit=" alunos"
            insights={[
                "A <strong>Unidade Centro</strong> concentra o maior número de alunos.",
                "O segmento <strong>Infantil</strong> apresenta alta demanda.",
                "Crescimento de <strong>+5%</strong> em relação ao ano anterior."
            ]}
            kpiSlug="total-alunos"
            backLink="/dashboard/clientes"
        />
    );
}
