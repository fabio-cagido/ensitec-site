"use client";

import { useState, useMemo } from "react";
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Target,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from "lucide-react";
import Link from "next/link";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import AcademicFilters, { FilterState, defaultFilters, LABEL_MAP, COMPARISON_COLORS } from "@/components/filters/AcademicFilters";

// Mock data
const MOCK_DATA = [
    { subject: "Matemática", unitId: "u1", year: "2026", total: 40, given: 38 },
    { subject: "Português", unitId: "u1", year: "2026", total: 40, given: 40 },
    { subject: "História", unitId: "u1", year: "2026", total: 30, given: 25 },
    { subject: "Física", unitId: "u1", year: "2026", total: 20, given: 18 },
    { subject: "Matemática", unitId: "u3", year: "2026", total: 40, given: 35 },
    { subject: "Português", unitId: "u3", year: "2026", total: 40, given: 38 },
    { subject: "História", unitId: "u3", year: "2026", total: 30, given: 22 },
    { subject: "Física", unitId: "u3", year: "2026", total: 20, given: 15 },
];

// Dados mensais
const MONTHLY_EVOLUTION = [
    { mes: "Set", cumprimento: 88, planejado: 520, executado: 458 },
    { mes: "Out", cumprimento: 90, planejado: 540, executado: 486 },
    { mes: "Nov", cumprimento: 85, planejado: 530, executado: 450 },
    { mes: "Dez", cumprimento: 82, planejado: 480, executado: 394 },
    { mes: "Jan", cumprimento: 91, planejado: 510, executado: 464 },
    { mes: "Fev", cumprimento: 93, planejado: 550, executado: 512 },
];

// Professores com pendências
const PROFESSORES_PENDENCIA = [
    { nome: "Prof. Carlos", disciplina: "História", pendentes: 8, taxa: 73 },
    { nome: "Prof. Ana", disciplina: "Física", pendentes: 5, taxa: 80 },
    { nome: "Prof. Roberto", disciplina: "Geografia", pendentes: 4, taxa: 82 },
];

export default function EficienciaPage() {
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

    const chartData = useMemo(() => {
        const subjects = ["Matemática", "Português", "História", "Física"];
        return subjects.map(subject => {
            const result: any = { subject, series: {} };
            seriesToCompare.forEach(seriesKey => {
                const filtered = MOCK_DATA.filter(d => {
                    const matchSubject = d.subject === subject;
                    if (comparisonMode === "ano") {
                        return matchSubject && d.year === seriesKey && (filters.unidades.length === 0 || filters.unidades.includes(d.unitId));
                    }
                    return matchSubject && d.unitId === seriesKey && (filters.anos.length === 0 || filters.anos.includes(d.year));
                });
                const label = LABEL_MAP[seriesKey] || seriesKey;
                if (filtered.length > 0) {
                    const totalSum = filtered.reduce((sum, d) => sum + d.total, 0);
                    const givenSum = filtered.reduce((sum, d) => sum + d.given, 0);
                    result.series[label] = {
                        total: Math.round(totalSum / filtered.length),
                        given: Math.round(givenSum / filtered.length),
                        pct: Math.round((givenSum / totalSum) * 100)
                    };
                }
            });
            return result;
        });
    }, [filters, seriesToCompare, comparisonMode]);

    const seriesLabels = seriesToCompare.map(s => LABEL_MAP[s] || s);

    const totals = useMemo(() => {
        return seriesLabels.map((label, idx) => {
            let totalPlanned = 0;
            let totalExecuted = 0;
            chartData.forEach(d => {
                if (d.series[label]) {
                    totalPlanned += d.series[label].total;
                    totalExecuted += d.series[label].given;
                }
            });
            return {
                label,
                color: COMPARISON_COLORS[idx],
                planned: totalPlanned,
                executed: totalExecuted,
                pct: totalPlanned > 0 ? Math.round((totalExecuted / totalPlanned) * 100) : 0
            };
        });
    }, [chartData, seriesLabels]);

    // KPIs
    const currentMonth = MONTHLY_EVOLUTION[MONTHLY_EVOLUTION.length - 1];
    const previousMonth = MONTHLY_EVOLUTION[MONTHLY_EVOLUTION.length - 2];
    const variation = (currentMonth.cumprimento - previousMonth.cumprimento).toFixed(1);
    const isPositive = currentMonth.cumprimento >= previousMonth.cumprimento;
    const totalPlanejado = MONTHLY_EVOLUTION.reduce((sum, m) => sum + m.planejado, 0);
    const totalExecutado = MONTHLY_EVOLUTION.reduce((sum, m) => sum + m.executado, 0);
    const aulasPendentes = currentMonth.planejado - currentMonth.executado;

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/academico" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Eficiência Operacional</h1>
                    <p className="text-gray-500 text-sm">Acompanhamento mensal do cumprimento da grade</p>
                </div>
            </div>

            {/* Filtros */}
            <AcademicFilters filters={filters} onFilterChange={setFilters} />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cumprimento</span>
                        <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {variation}pp
                        </div>
                    </div>
                    <p className="text-3xl font-black text-emerald-600">{currentMonth.cumprimento}%</p>
                    <p className="text-xs text-gray-500 mt-1">vs {previousMonth.cumprimento}% mês anterior</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Aulas Mês</span>
                        <BookOpen size={16} className="text-indigo-500" />
                    </div>
                    <p className="text-3xl font-black text-gray-900">{currentMonth.executado}</p>
                    <p className="text-xs text-gray-500 mt-1">de {currentMonth.planejado} planejadas</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pendentes</span>
                        <Clock size={16} className="text-amber-500" />
                    </div>
                    <p className="text-3xl font-black text-amber-600">{aulasPendentes}</p>
                    <p className="text-xs text-gray-500 mt-1">aulas a repor</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Taxa Semestre</span>
                        <Target size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-3xl font-black text-gray-900">{Math.round((totalExecutado / totalPlanejado) * 100)}%</p>
                    <p className="text-xs text-gray-500 mt-1">{totalExecutado}/{totalPlanejado} aulas</p>
                </div>
            </div>

            {/* Evolução Mensal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Evolução do Cumprimento</h3>
                            <p className="text-xs text-gray-400">Taxa mensal da grade curricular</p>
                        </div>
                        <Calendar size={16} className="text-gray-400" />
                    </div>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MONTHLY_EVOLUTION}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="cumprimento" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} name="Cumprimento" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Aulas Executadas vs Planejadas</h3>
                            <p className="text-xs text-gray-400">Volume mensal</p>
                        </div>
                        <TrendingUp size={16} className="text-gray-400" />
                    </div>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MONTHLY_EVOLUTION}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="planejado" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Planejado" />
                                <Bar dataKey="executado" fill="#6366f1" radius={[4, 4, 0, 0]} name="Executado" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tracker Comparativo */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Carga Horária por Disciplina - Comparativo</h3>
                        <p className="text-xs text-gray-400">Comparando: {seriesLabels.join(" vs ")}</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {chartData.map((item, idx) => (
                        <div key={idx} className="space-y-4">
                            <div className="flex items-center gap-2">
                                <BookOpen size={16} className="text-indigo-600" />
                                <span className="text-sm font-bold text-gray-900">{item.subject}</span>
                            </div>
                            <div className="space-y-3">
                                {seriesLabels.map((label, sIdx) => {
                                    const series = item.series[label];
                                    if (!series) return null;
                                    return (
                                        <div key={label} className="flex items-center gap-4">
                                            <div className="w-32 flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COMPARISON_COLORS[sIdx] }}></div>
                                                <span className="text-xs font-medium text-gray-600 truncate">{label}</span>
                                            </div>
                                            <div className="flex-1 flex gap-0.5 h-3">
                                                {Array.from({ length: series.total }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex-1 rounded-sm transition-all"
                                                        style={{ backgroundColor: i < series.given ? COMPARISON_COLORS[sIdx] : '#e5e7eb' }}
                                                    ></div>
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold w-16 text-right" style={{ color: COMPARISON_COLORS[sIdx] }}>
                                                {series.pct}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totais */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-gray-50">
                    {totals.map((total) => (
                        <div key={total.label} className="p-5 rounded-2xl border" style={{ backgroundColor: `${total.color}10`, borderColor: `${total.color}30` }}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: total.color }}></div>
                                <span className="text-xs font-bold text-gray-600">{total.label}</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black" style={{ color: total.color }}>{total.pct}%</span>
                                <span className="text-xs text-gray-500 mb-1">({total.executed}/{total.planned})</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Professores com Pendências */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Professores com Pendências de Reposição</h3>
                    <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">Agendar Reposições</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Professor</th>
                                <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Disciplina</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Aulas Pendentes</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Taxa Cumprimento</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROFESSORES_PENDENCIA.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-900">{item.nome}</td>
                                    <td className="py-3 px-4 text-gray-600">{item.disciplina}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-rose-600 font-bold">{item.pendentes}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-amber-600 font-bold">{item.taxa}%</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.taxa >= 80 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {item.taxa >= 80 ? 'Atenção' : 'Crítico'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
