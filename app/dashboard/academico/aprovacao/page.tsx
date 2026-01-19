"use client";

import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MOCK_APPROVAL } from "@/app/lib/mock-data";

export default function AprovacaoPage() {
    return (
        <GenericAnalyticsPage
            title="Taxa de Aprovação"
            description="Percentual de alunos aprovados diretamente"
            dataset={MOCK_APPROVAL}
            kpiUnit="%"
            insights={[
                "Taxa de aprovação recorde no <strong>Ensino Médio</strong> da Unidade Centro.",
                "Pequena queda observada no 9º Ano B em Matérias de Exatas."
            ]}
            kpiSlug="aprovacao"
        />
    );
}
