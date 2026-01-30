"use client";

import { useEffect, useState } from "react";
import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MetricData } from "@/app/lib/mock-data";

export default function AprovacaoPage() {
    const [dataset, setDataset] = useState<MetricData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/analytics?metric=approval')
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
            title="Taxa de Aprovação"
            description="Percentual de alunos aprovados diretamente"
            dataset={dataset}
            kpiUnit="%"
            insights={[
                "Taxa de aprovação consolidada acima de <strong>85%</strong>.",
                "Menor índice de reprovação no <strong>Fundamental II</strong>.",
                "Evolução positiva em relação ao semestre anterior."
            ]}
            kpiSlug="aprovacao"
        />
    );
}
