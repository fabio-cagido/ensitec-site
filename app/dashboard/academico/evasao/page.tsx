"use client";

import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MOCK_DROPOUT } from "@/app/lib/mock-data";

export default function EvasaoPage() {
    return (
        <GenericAnalyticsPage
            title="Taxa de Evasão"
            description="Monitoramento de cancelamentos e transferências"
            dataset={MOCK_DROPOUT}
            kpiUnit="%"
            insights={[
                "Evasão controlada e abaixo de 2% em todas as unidades.",
                "Nenhuma evasão registrada na Unidade Sul no último mês."
            ]}
            kpiSlug="evasao"
        />
    );
}
