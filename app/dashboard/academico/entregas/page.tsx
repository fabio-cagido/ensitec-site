"use client";

import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MOCK_DELIVERY } from "@/app/lib/mock-data";

export default function EntregasPage() {
    return (
        <GenericAnalyticsPage
            title="Entrega de Atividades"
            description="Taxa de cumprimento de tarefas e trabalhos"
            dataset={MOCK_DELIVERY}
            kpiUnit="%"
            insights={[
                "Alta adesão às atividades digitais no <strong>9º Ano A</strong>.",
                "Necessário reforçar prazos com a turma 9º Ano B."
            ]}
            kpiSlug="entregas"
        />
    );
}
