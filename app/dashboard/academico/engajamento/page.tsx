"use client";

import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MOCK_ENGAGEMENT } from "@/app/lib/mock-data";

export default function EngajamentoPage() {
    return (
        <GenericAnalyticsPage
            title="Engajamento Digital"
            description="Acessos à plataforma e interações online"
            dataset={MOCK_ENGAGEMENT}
            kpiUnit="%"
            insights={[
                "Engajamento digital 20% maior no Ensino Médio comparado ao Fundamental.",
                "Pico de acessos registrado durante a semana de provas."
            ]}
            kpiSlug="engajamento"
        />
    );
}
