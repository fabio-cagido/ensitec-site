"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart2, Calendar, Download, TrendingUp } from "lucide-react";

import { FilterBar } from "@/components/academic/FilterBar";
import { TrendChart } from "@/components/academic/TrendChart";
import { generateHistoryForMetric, getMonthName } from "@/app/lib/mock-history-data";
import {
    MOCK_GRADES, MOCK_APPROVAL, MOCK_ATTENDANCE, MOCK_RISK,
    MOCK_DROPOUT, MOCK_NPS, MOCK_DELIVERY, MOCK_ENGAGEMENT, MOCK_EFFICIENCY,
    MetricData
} from "@/app/lib/mock-data";

// Map slugs to mocked datasets and metadata
const KPI_MAP: Record<string, { label: string; data: MetricData[]; unit: string, color: string }> = {
    "media-global": { label: "Média Global", data: MOCK_GRADES, unit: "", color: "#3b82f6" },
    "aprovacao": { label: "Taxa de Aprovação", data: MOCK_APPROVAL, unit: "%", color: "#10b981" },
    "frequencia": { label: "Frequência Média", data: MOCK_ATTENDANCE, unit: "%", color: "#8b5cf6" },
    "risco": { label: "Alunos em Risco", data: MOCK_RISK, unit: "", color: "#ef4444" },
    "evasao": { label: "Taxa de Evasão", data: MOCK_DROPOUT, unit: "%", color: "#f97316" },
    "nps": { label: "NPS (Satisfação)", data: MOCK_NPS, unit: "", color: "#ec4899" },
    "entregas": { label: "Entrega de Atividades", data: MOCK_DELIVERY, unit: "%", color: "#06b6d4" },
    "engajamento": { label: "Engajamento Digital", data: MOCK_ENGAGEMENT, unit: "%", color: "#6366f1" },
    "eficiencia": { label: "Eficiência Operacional", data: MOCK_EFFICIENCY, unit: "d", color: "#14b8a6" },
};

function HistoricoContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // 1. Read URL Params
    const urlKpi = searchParams.get("kpi") || "media-global";
    const urlUnit = searchParams.get("unitId") || "";
    const urlSegment = searchParams.get("segmentId") || "";
    const urlClass = searchParams.get("classId") || "";
    const urlSubject = searchParams.get("subjectId") || "";

    // 2. Local State for Filters (Synced with FilterBar)
    const [activeKpi, setActiveKpi] = useState(urlKpi);
    const [filters, setFilters] = useState<any>({
        unidades: urlUnit ? [urlUnit] : [],
        segmentos: urlSegment ? [urlSegment] : [],
        materias: urlSubject ? [urlSubject] : [],
        turmas: urlClass ? [urlClass] : [],
        anos: ["2026"],
        meses: [],
        periodos: []
    });

    // Sync state when URL changes (external navigation)
    useEffect(() => {
        if (urlKpi) setActiveKpi(urlKpi);
    }, [urlKpi]);

    // 3. Resolve Data based on current KPI
    const kpiConfig = KPI_MAP[activeKpi] || KPI_MAP["media-global"];

    // 4. Calculate Historical Data
    // We simulate history based on the *average* of the currently filtered view.
    const historyData = useMemo(() => {
        // Filter the dataset first
        const filtered = kpiConfig.data.filter(item => {
            if (filters.unidades.length > 0 && !filters.unidades.includes(item.unitId)) return false;
            if (filters.segmentos.length > 0 && !filters.segmentos.includes(item.segmentId)) return false;
            if (filters.turmas.length > 0 && !filters.turmas.includes(item.classId)) return false;
            if (filters.materias.length > 0 && !filters.materias.includes(item.subjectId)) return false;
            return true;
        });

        // Compute current average/total
        let currentValue = 0;
        if (filtered.length > 0) {
            const sum = filtered.reduce((acc, item) => acc + item.value, 0);
            currentValue = sum / filtered.length;
        }

        // Generate history ending at this value
        return generateHistoryForMetric(currentValue, "2026", activeKpi === 'risco' ? 2 : 1.5);
    }, [kpiConfig, filters, activeKpi]);

    // Handle context change
    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        // Note: we don't update URL here to avoid spamming history stack, but we could.
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/academico" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Histórico de Indicadores</h1>
                        <p className="text-gray-500 text-sm">Data Explorer e análise de tendências</p>
                    </div>
                </div>

                {/* KPI Selector Dropdown */}
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                    <BarChart2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600 mr-2">Indicador:</span>
                    <select
                        value={activeKpi}
                        onChange={(e) => {
                            setActiveKpi(e.target.value);
                            router.push(`/dashboard/academico/historico?kpi=${e.target.value}`);
                        }}
                        className="bg-transparent text-sm font-bold text-gray-900 outline-none cursor-pointer hover:bg-gray-50 rounded p-1"
                    >
                        {Object.entries(KPI_MAP).map(([slug, config]) => (
                            <option key={slug} value={slug}>{config.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filter Bar */}
            <FilterBar onFilterChange={handleFilterChange} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. Trend Chart (Takes up 2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    <TrendChart
                        title={`Evolução Temporal: ${kpiConfig.label}`}
                        data={historyData}
                        lineColor={kpiConfig.color}
                        unit={kpiConfig.unit}
                    />

                    {/* Insights Box */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold text-blue-900">Análise de Tendência</h3>
                        </div>
                        <p className="text-blue-800 text-sm leading-relaxed">
                            O indicador <strong>{kpiConfig.label}</strong> apresenta uma tendência de
                            {historyData[historyData.length - 1].value >= historyData[0].value ? " alta " : " baixa "}
                            nos últimos 12 meses. O pico foi registrado em <strong>{historyData.reduce((prev, current) => (prev.value > current.value) ? prev : current).month}</strong>.
                        </p>
                    </div>
                </div>

                {/* 2. Detailed Table (Takes up 1 col) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-800">Detalhamento Mensal</h3>
                        <button className="text-gray-400 hover:text-blue-600">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Mês</th>
                                    <th className="px-4 py-3 text-right">Valor</th>
                                    <th className="px-4 py-3 text-right">Δ%</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[...historyData].reverse().map((point, i) => {
                                    // Calculate delta with previous month (which is next in reversed array)
                                    // Original array: [Jan, ..., Dec]
                                    // Reversed here for table: [Dec, ..., Jan]
                                    // Next item in loop allows comparing.

                                    // Actually simpler: iterate original reversed manually or look ahead.
                                    // Let's just use the original index logic.
                                    const prevVal = i < historyData.length - 1 ? historyData[historyData.length - 2 - i].value : point.value;
                                    // Wait, logic is hard inverted. 
                                    // historyData is Jan->Dec.
                                    // We are mapping Dec->Jan.
                                    // Current point is Dec (index 0 in map). Comparing to Nov (index 10 in historyData, or index 1 in map).

                                    const actualIndexInHistory = historyData.length - 1 - i;
                                    const prevPoint = actualIndexInHistory > 0 ? historyData[actualIndexInHistory - 1] : point;
                                    const delta = point.value - prevPoint.value;
                                    const deltaPercent = prevPoint.value !== 0 ? (delta / prevPoint.value) * 100 : 0;

                                    return (
                                        <tr key={point.monthId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                                                {getMonthName(point.monthId)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-700">
                                                {point.value}{kpiConfig.unit}
                                            </td>
                                            <td className={`px-4 py-3 text-right font-medium ${delta >= 0 ? "text-green-600" : "text-red-500"}`}>
                                                {delta > 0 ? "+" : ""}{deltaPercent.toFixed(1)}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HistoricoPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Carregando histórico...</div>}>
            <HistoricoContent />
        </Suspense>
    );
}
