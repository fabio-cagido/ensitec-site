"use client";

import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MOCK_RISK } from "@/app/lib/mock-data";

export default function RiscoPage() {
    return (
        <GenericAnalyticsPage
            title="Alunos em Risco"
            description="Contagem de alunos com notas vermelhas ou baixa frequência"
            dataset={MOCK_RISK}
            kpiUnit=""
            insights={[
                "Concentração de alunos em risco identificada no <strong>9º Ano B</strong> (Unidade Centro).",
                "Recomendado intervenção pedagógica focada em Matemática."
            ]}
            kpiSlug="risco"
        />
    );
}
