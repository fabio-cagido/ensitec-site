"use client";

import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MOCK_ATTENDANCE } from "@/app/lib/mock-data";

export default function FrequenciaPage() {
    return (
        <GenericAnalyticsPage
            title="Frequência Média"
            description="Acompanhamento da presença escolar por turma e segmento"
            dataset={MOCK_ATTENDANCE}
            kpiUnit="%"
            insights={[
                "Frequência estável acima da meta (90%) em todas as unidades.",
                "Unidade Sul apresenta o melhor índice de presença no último trimestre."
            ]}
            kpiSlug="frequencia"
        />
    );
}
