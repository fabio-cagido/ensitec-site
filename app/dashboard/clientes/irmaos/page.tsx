"use client";

import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MOCK_SIBLINGS } from "@/app/lib/mock-data";

export default function IrmaosPage() {
    return (
        <GenericAnalyticsPage
            title="Famílias com +1 Filho"
            description="Percentual de famílias com múltiplos alunos matriculados"
            dataset={MOCK_SIBLINGS}
            kpiUnit="%"
            insights={[
                "Taxa média de <strong>18.5%</strong> de famílias com irmãos.",
                "Segmento <strong>Infantil</strong> apresenta maior taxa (22.5%).",
                "Famílias com múltiplos filhos demonstram <strong>maior fidelidade</strong>."
            ]}
            kpiSlug="irmaos"
            backLink="/dashboard/clientes"
        />
    );
}
