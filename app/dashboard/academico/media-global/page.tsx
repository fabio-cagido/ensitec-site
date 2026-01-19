"use client";

import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MOCK_GRADES } from "@/app/lib/mock-data";

export default function MediaGlobalPage() {
    return (
        <GenericAnalyticsPage
            title="Média Global"
            description="Análise detalhada de performance por notas"
            dataset={MOCK_GRADES}
            kpiUnit=""
            insights={[
                "A unidade <strong>Centro</strong> mantém a liderança em exatas no Ensino Médio.",
                "Atenção necessária para <strong>Matemática</strong> no 9º Ano B (Unidade Centro), performance 20% abaixo da média."
            ]}
            kpiSlug="media-global"
        />
    );
}
