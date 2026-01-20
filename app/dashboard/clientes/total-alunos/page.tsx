"use client";

import { GenericAnalyticsPage } from "@/components/academic/GenericAnalyticsPage";
import { MOCK_TOTAL_STUDENTS } from "@/app/lib/mock-data";

export default function TotalAlunosPage() {
    return (
        <GenericAnalyticsPage
            title="Total de Alunos"
            description="Distribuição de alunos ativos por unidade e segmento"
            dataset={MOCK_TOTAL_STUDENTS}
            kpiUnit=" alunos"
            insights={[
                "A <strong>Unidade Centro</strong> concentra o maior número de alunos.",
                "O segmento <strong>Infantil</strong> apresenta alta demanda.",
                "Crescimento de <strong>+5%</strong> em relação ao ano anterior."
            ]}
            kpiSlug="total-alunos"
            backLink="/dashboard/clientes"
        />
    );
}
