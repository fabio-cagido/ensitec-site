"use client";

import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MOCK_NPS } from "@/app/lib/mock-data";

export default function NPSPage() {
    return (
        <GenericAnalyticsPage
            title="NPS (Satisfação)"
            description="Net Promoter Score de alunos e responsáveis"
            dataset={MOCK_NPS}
            kpiUnit=""
            insights={[
                "NPS na <strong>Zona de Excelência</strong> para a Unidade Sul.",
                "Feedback positivo consistente sobre a infraestrutura da Unidade Centro."
            ]}
            kpiSlug="nps"
            backLink="/dashboard/clientes"
        />
    );
}
