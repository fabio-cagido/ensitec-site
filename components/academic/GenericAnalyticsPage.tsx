"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FilterBar } from "@/components/academic/FilterBar";
import { ComparisonView } from "@/components/academic/ComparisonView";
import { MetricData, aggregateData, DataPoint } from "@/app/lib/mock-data";

interface GenericAnalyticsPageProps {
    title: string;
    description: string;
    dataset: MetricData[];
    kpiUnit?: string;
    insights?: string[];
    kpiSlug?: string; // Slug for deep linking to History
}

export function GenericAnalyticsPage({
    title,
    description,
    dataset,
    kpiUnit = "",
    insights = [],
    kpiSlug
}: GenericAnalyticsPageProps) {
    const router = useRouter();
    const [activeFilters, setActiveFilters] = useState<any>({
        unidades: [],
        segmentos: [],
        materias: [],
        turmas: [],
        anos: [],
        meses: [],
        periodos: []
    });

    const { byUnit, bySegment, byClass, bySubject, hasData } = useMemo(() => {
        // 1. Filter the RAW granular data
        const filtered = dataset.filter(item => {
            if (activeFilters.unidades.length > 0 && !activeFilters.unidades.includes(item.unitId)) return false;
            if (activeFilters.segmentos.length > 0 && !activeFilters.segmentos.includes(item.segmentId)) return false;
            if (activeFilters.turmas.length > 0 && !activeFilters.turmas.includes(item.classId)) return false;
            if (activeFilters.materias.length > 0 && !activeFilters.materias.includes(item.subjectId)) return false;
            return true;
        });

        // 2. Aggregate filtered data
        return {
            byUnit: aggregateData(filtered, 'unitId'),
            bySegment: aggregateData(filtered, 'segmentId'),
            byClass: aggregateData(filtered, 'classId'),
            bySubject: aggregateData(filtered, 'subjectId'),
            hasData: filtered.length > 0
        };
    }, [activeFilters, dataset]);

    const handleNavigate = (item: DataPoint, paramKey: string) => {
        if (!kpiSlug) return;
        router.push(`/dashboard/academico/historico?kpi=${kpiSlug}&${paramKey}=${item.id}`);
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/academico" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-500 text-sm">{description}</p>
                </div>
            </div>

            {/* Filter Bar */}
            <FilterBar onFilterChange={setActiveFilters} />

            {!hasData ? (
                <div className="text-center py-20 text-gray-500">
                    <p>Nenhum dado encontrado para os filtros selecionados.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* 1. Comparativo por UNIDADE */}
                    {byUnit.length > 0 && (
                        <section>
                            <ComparisonView
                                title="Desempenho por Unidade"
                                data={byUnit}
                                kpiUnit={kpiUnit}
                                onItemClick={kpiSlug ? (item) => handleNavigate(item, "unitId") : undefined}
                            />
                        </section>
                    )}

                    {/* 2. Comparativo por SEGMENTO */}
                    {bySegment.length > 0 && (
                        <section>
                            <ComparisonView
                                title="Desempenho por Nível de Ensino"
                                data={bySegment}
                                kpiUnit={kpiUnit}
                                onItemClick={kpiSlug ? (item) => handleNavigate(item, "segmentId") : undefined}
                            />
                        </section>
                    )}

                    {/* 3. Comparativo por TURMA */}
                    {byClass.length > 0 && (
                        <section>
                            <ComparisonView
                                title="Desempenho por Turma"
                                data={byClass}
                                kpiUnit={kpiUnit}
                                onItemClick={kpiSlug ? (item) => handleNavigate(item, "classId") : undefined}
                            />
                        </section>
                    )}

                    {/* 4. Comparativo por MATÉRIA */}
                    {bySubject.length > 0 && (
                        <section>
                            <ComparisonView
                                title="Desempenho por Disciplina"
                                data={bySubject}
                                kpiUnit={kpiUnit}
                                onItemClick={kpiSlug ? (item) => handleNavigate(item, "subjectId") : undefined}
                            />
                        </section>
                    )}
                </div>
            )}

            {/* Automated Insights */}
            {insights.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-8">
                    <h3 className="font-bold text-gray-900 mb-4">Insigths I.A.</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        {insights.map((insight, i) => (
                            <li key={i} className="flex gap-2 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                                <span dangerouslySetInnerHTML={{ __html: insight }} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
