"use client";

import { useState, useMemo } from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import { ArrowLeft, Info, TrendingUp, TrendingDown, Target, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import AcademicFilters, { FilterState, defaultFilters, LABEL_MAP, COMPARISON_COLORS } from "@/components/filters/AcademicFilters";

// Mock data with all dimensions
const MOCK_DATA = [
    { subject: "Matemática", subjectId: "m1", unitId: "u1", year: "2026", value: 7.5 },
    { subject: "Português", subjectId: "m2", unitId: "u1", year: "2026", value: 8.2 },
    { subject: "História", subjectId: "m3", unitId: "u1", year: "2026", value: 8.0 },
    { subject: "Física", subjectId: "m5", unitId: "u1", year: "2026", value: 6.8 },
    { subject: "Matemática", subjectId: "m1", unitId: "u3", year: "2026", value: 8.1 },
    { subject: "Português", subjectId: "m2", unitId: "u3", year: "2026", value: 7.5 },
    { subject: "História", subjectId: "m3", unitId: "u3", year: "2026", value: 7.8 },
    { subject: "Física", subjectId: "m5", unitId: "u3", year: "2026", value: 7.2 },
    { subject: "Matemática", subjectId: "m1", unitId: "u1", year: "2025", value: 7.0 },
    { subject: "Português", subjectId: "m2", unitId: "u1", year: "2025", value: 7.8 },
    { subject: "História", subjectId: "m3", unitId: "u1", year: "2025", value: 7.5 },
    { subject: "Física", subjectId: "m5", unitId: "u1", year: "2025", value: 6.2 },
];

// Dados mensais para acompanhamento do diretor
const MONTHLY_DATA = [
    { mes: "Set", media: 7.2, meta: 7.5 },
    { mes: "Out", media: 7.4, meta: 7.5 },
    { mes: "Nov", media: 7.6, meta: 7.5 },
    { mes: "Dez", media: 7.3, meta: 7.5 },
    { mes: "Jan", media: 7.5, meta: 7.5 },
    { mes: "Fev", media: 7.8, meta: 7.5 },
];

export default function MediaGlobalPage() {
    const [filters, setFilters] = useState<FilterState>(defaultFilters);

    const comparisonMode = useMemo(() => {
        if (filters.unidades.length > 1) return "unidade";
        if (filters.anos.length > 1) return "ano";
        return "unidade";
    }, [filters]);

    const seriesToCompare = useMemo(() => {
        if (comparisonMode === "ano") {
            return filters.anos.length > 0 ? filters.anos : ["2026", "2025"];
        }
        return filters.unidades.length > 0 ? filters.unidades : ["u1", "u3"];
    }, [comparisonMode, filters.anos, filters.unidades]);

    const radarData = useMemo(() => {
        const subjects = ["Matemática", "Português", "História", "Física"];
        return subjects.map(subject => {
            const point: any = { subject };
            seriesToCompare.forEach(seriesKey => {
                const filtered = MOCK_DATA.filter(d => {
                    const matchSubject = d.subject === subject;
                    if (comparisonMode === "ano") {
                        return matchSubject && d.year === seriesKey && (filters.unidades.length === 0 || filters.unidades.includes(d.unitId));
                    }
                    return matchSubject && d.unitId === seriesKey && (filters.anos.length === 0 || filters.anos.includes(d.year));
                });
                const avg = filtered.length > 0 ? Number((filtered.reduce((sum, d) => sum + d.value, 0) / filtered.length).toFixed(1)) : 0;
                point[LABEL_MAP[seriesKey] || seriesKey] = avg;
            });
            return point;
        });
    }, [filters, seriesToCompare, comparisonMode]);

    const seriesLabels = seriesToCompare.map(s => LABEL_MAP[s] || s);

    // KPIs para o diretor
    const currentMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];
    const previousMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2];
    const variation = ((currentMonth.media - previousMonth.media) / previousMonth.media * 100).toFixed(1);
    const isPositive = currentMonth.media >= previousMonth.media;

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/academico" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Média Global</h1>
                    <p className="text-gray-500 text-sm">Acompanhamento mensal de desempenho acadêmico</p>
                </div>
            </div>

            {/* Filtros */}
            <AcademicFilters filters={filters} onFilterChange={setFilters} />

            {/* KPIs para o Diretor */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Média Atual</span>
                        <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {variation}%
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{currentMonth.media}</p>
                    <p className="text-xs text-gray-500 mt-1">vs {previousMonth.media} mês anterior</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta Institucional</span>
                        <Target size={16} className="text-indigo-500" />
                    </div>
                    <p className="text-3xl font-black text-gray-900">{currentMonth.meta}</p>
                    <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${currentMonth.media >= currentMonth.meta ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, (currentMonth.media / currentMonth.meta) * 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Melhor Disciplina</span>
                        <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-xl font-black text-gray-900">Português</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1">Média 8.2</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Atenção Necessária</span>
                        <TrendingDown size={16} className="text-rose-500" />
                    </div>
                    <p className="text-xl font-black text-gray-900">Física</p>
                    <p className="text-xs text-rose-600 font-bold mt-1">Média 6.8 (abaixo da meta)</p>
                </div>
            </div>

            {/* Acompanhamento Mensal */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-gray-900">Evolução Mensal</h3>
                        <p className="text-xs text-gray-400">Últimos 12 meses vs Meta Institucional</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} />
                        Atualizado em Fevereiro/2026
                    </div>
                </div>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MONTHLY_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <YAxis domain={[6, 9]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="meta" stroke="#e5e7eb" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Meta" />
                            <Line type="monotone" dataKey="media" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} name="Média" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfico Comparativo Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Matriz de Competências Comparativa</h3>
                            <p className="text-xs text-gray-400">Comparando: {seriesLabels.join(" vs ")}</p>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-full cursor-help">
                            <Info size={16} />
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                                {seriesLabels.map((label, idx) => (
                                    <Radar key={label} name={label} dataKey={label} stroke={COMPARISON_COLORS[idx]} strokeWidth={idx === 0 ? 3 : 2} fill={COMPARISON_COLORS[idx]} fillOpacity={idx === 0 ? 0.3 : 0.1} strokeDasharray={idx > 0 ? "4 4" : undefined} />
                                ))}
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tabela de Acompanhamento por Disciplina */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4">Detalhamento Mensal</h4>
                    <div className="space-y-3">
                        {[
                            { disc: "Matemática", atual: 7.5, anterior: 7.2, meta: 7.5 },
                            { disc: "Português", atual: 8.2, anterior: 8.0, meta: 7.5 },
                            { disc: "História", atual: 8.0, anterior: 7.8, meta: 7.5 },
                            { disc: "Física", atual: 6.8, anterior: 6.5, meta: 7.5 },
                        ].map((item, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold text-gray-900">{item.disc}</span>
                                    <span className={`text-xs font-bold ${item.atual >= item.meta ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {item.atual >= item.anterior ? '↑' : '↓'} {item.atual}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${item.atual >= item.meta ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                        style={{ width: `${(item.atual / 10) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Meta: {item.meta} | Anterior: {item.anterior}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
