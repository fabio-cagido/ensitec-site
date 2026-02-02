"use client";

import { useEffect, useState } from "react";
import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MetricData } from "@/app/lib/mock-data";

export default function FrequenciaPage() {
    const [dataset, setDataset] = useState<MetricData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/analytics?metric=attendance')
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
            title="Frequência Média"
            description="Acompanhamento da presença escolar por turma e segmento"
            dataset={dataset}
            kpiUnit="%"
            insights={[
                "Frequência média da escola está em <strong>92%</strong>.",
                "Baixa incidência de faltas injustificadas no último mês.",
                "Turmas 'Manhã' apresentam melhor índice de pontualidade."
            ]}
            kpiSlug="frequencia"
        />
    );
}
