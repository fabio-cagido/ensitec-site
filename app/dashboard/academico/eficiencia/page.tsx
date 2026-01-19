"use client";

import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MOCK_EFFICIENCY } from "@/app/lib/mock-data";

export default function EficienciaPage() {
    return (
        <GenericAnalyticsPage
            title="Eficiência Operacional"
            description="Tempo médio de resposta e correção (em dias)"
            dataset={MOCK_EFFICIENCY}
            kpiUnit="d"
            insights={[
                "Tempo médio de correção de provas reduzido para <strong>1.8 dias</strong> na Unidade Sul.",
                "Processos administrativos dentro do SLA estipulado."
            ]}
            kpiSlug="eficiencia"
        />
    );
}
