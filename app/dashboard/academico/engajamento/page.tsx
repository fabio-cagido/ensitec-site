"use client";

import { useState, useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    AreaChart,
    Area
} from 'recharts';
import { ArrowLeft, Zap, Monitor, Users, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import Link from "next/link";
import AcademicFilters, { FilterState, defaultFilters, LABEL_MAP, COMPARISON_COLORS } from "@/components/filters/AcademicFilters";

// Mock data
const MOCK_DATA = [
    { day: "Seg", unitId: "u1", year: "2026", value: 65 },
    { day: "Ter", unitId: "u1", year: "2026", value: 72 },
    { day: "Qua", unitId: "u1", year: "2026", value: 85 },
    { day: "Qui", unitId: "u1", year: "2026", value: 78 },
    { day: "Sex", unitId: "u1", year: "2026", value: 92 },
    { day: "Sáb", unitId: "u1", year: "2026", value: 45 },
    { day: "Dom", unitId: "u1", year: "2026", value: 30 },
    { day: "Seg", unitId: "u3", year: "2026", value: 58 },
    { day: "Ter", unitId: "u3", year: "2026", value: 65 },
    { day: "Qua", unitId: "u3", year: "2026", value: 75 },
    { day: "Qui", unitId: "u3", year: "2026", value: 70 },
    { day: "Sex", unitId: "u3", year: "2026", value: 82 },
    { day: "Sáb", unitId: "u3", year: "2026", value: 38 },
    { day: "Dom", unitId: "u3", year: "2026", value: 25 },
];

// Dados mensais
const MONTHLY_EVOLUTION = [
    { mes: "Set", engajamento: 68, acessos: 12500, tempoMedio: 18 },
    { mes: "Out", engajamento: 72, acessos: 14200, tempoMedio: 22 },
    { mes: "Nov", engajamento: 75, acessos: 15800, tempoMedio: 25 },
    { mes: "Dez", engajamento: 65, acessos: 9800, tempoMedio: 15 },
    { mes: "Jan", engajamento: 70, acessos: 11200, tempoMedio: 20 },
    { mes: "Fev", engajamento: 78, acessos: 16500, tempoMedio: 28 },
];

// Recursos mais utilizados
const RECURSOS_TOP = [
    { recurso: "Videoaulas", acessos: 4520, crescimento: 15 },
    { recurso: "Exercícios", acessos: 3890, crescimento: 8 },
    { recurso: "Material PDF", acessos: 2340, crescimento: -3 },
    { recurso: "Fórum", acessos: 1250, crescimento: 22 },
    { recurso: "Simulados", acessos: 980, crescimento: 45 },
];

export default function EngajamentoPage() {
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
        const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
        return days.map(day => {
            const point: any = { day };
            seriesToCompare.forEach(seriesKey => {
                const filtered = MOCK_DATA.filter(d => {
                    const matchDay = d.day === day;
                    if (comparisonMode === "ano") {
                        return matchDay && d.year === seriesKey && (filters.unidades.length === 0 || filters.unidades.includes(d.unitId));
                    }
                    return matchDay && d.unitId === seriesKey && (filters.anos.length === 0 || filters.anos.includes(d.year));
                });
                const label = LABEL_MAP[seriesKey] || seriesKey;
                point[label] = filtered.length > 0 ? Math.round(filtered.reduce((sum, d) => sum + d.value, 0) / filtered.length) : 0;
            });
            return point;
        });
    }, [filters, seriesToCompare, comparisonMode]);

    const seriesLabels = seriesToCompare.map(s => LABEL_MAP[s] || s);

    // KPIs
    const currentMonth = MONTHLY_EVOLUTION[MONTHLY_EVOLUTION.length - 1];
    const previousMonth = MONTHLY_EVOLUTION[MONTHLY_EVOLUTION.length - 2];
    const variation = (currentMonth.engajamento - previousMonth.engajamento).toFixed(1);
    const isPositive = currentMonth.engajamento >= previousMonth.engajamento;
    const totalAcessos = MONTHLY_EVOLUTION.reduce((sum, m) => sum + m.acessos, 0);

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/academico" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Engajamento Digital</h1>
                    <p className="text-gray-500 text-sm">Acompanhamento mensal do uso da plataforma</p>
                </div>
            </div>

            {/* Filtros */}
            <AcademicFilters filters={filters} onFilterChange={setFilters} />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Engajamento</span>
                        <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {variation}pp
                        </div>
                    </div>
                    <p className="text-3xl font-black text-indigo-600">{currentMonth.engajamento}%</p>
                    <p className="text-xs text-gray-500 mt-1">vs {previousMonth.engajamento}% mês anterior</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Acessos Mês</span>
                        <Monitor size={16} className="text-blue-500" />
                    </div>
                    <p className="text-3xl font-black text-gray-900">{(currentMonth.acessos / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-gray-500 mt-1">Total semestre: {(totalAcessos / 1000).toFixed(1)}k</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tempo Médio</span>
                        <Clock size={16} className="text-amber-500" />
                    </div>
                    <p className="text-3xl font-black text-gray-900">{currentMonth.tempoMedio} min</p>
                    <p className="text-xs text-gray-500 mt-1">por sessão</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Usuários Ativos</span>
                        <Users size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-3xl font-black text-emerald-600">892</p>
                    <p className="text-xs text-gray-500 mt-1">de 950 cadastrados (94%)</p>
                </div>
            </div>

            {/* Evolução + Acessos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Evolução do Engajamento</h3>
                            <p className="text-xs text-gray-400">Taxa mensal de interação</p>
                        </div>
                        <Calendar size={16} className="text-gray-400" />
                    </div>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MONTHLY_EVOLUTION}>
                                <defs>
                                    <linearGradient id="engGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis domain={[50, 90]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="engajamento" stroke="#6366f1" strokeWidth={3} fill="url(#engGradient)" name="Engajamento" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Volume de Acessos</h3>
                            <p className="text-xs text-gray-400">Quantidade mensal</p>
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
                                <Bar dataKey="acessos" fill="#10b981" radius={[4, 4, 0, 0]} name="Acessos" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Gráfico Comparativo */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Padrão Semanal - Comparativo</h3>
                        <p className="text-xs text-gray-400">Comparando: {seriesLabels.join(" vs ")}</p>
                    </div>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 13, fontWeight: 600 }} />
                            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            {seriesLabels.map((label, idx) => (
                                <Line key={label} type="monotone" name={label} dataKey={label} stroke={COMPARISON_COLORS[idx]} strokeWidth={idx === 0 ? 4 : 2} strokeDasharray={idx > 0 ? "5 5" : undefined} dot={{ r: idx === 0 ? 6 : 4, fill: COMPARISON_COLORS[idx], strokeWidth: 2, stroke: '#fff' }} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recursos Mais Utilizados */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Recursos Mais Utilizados</h3>
                    <span className="text-xs text-gray-500">Este mês</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Recurso</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Acessos</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Crescimento</th>
                                <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Tendência</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RECURSOS_TOP.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-900">{item.recurso}</td>
                                    <td className="py-3 px-4 text-center font-bold text-gray-700">{item.acessos.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`font-bold ${item.crescimento >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {item.crescimento >= 0 ? '+' : ''}{item.crescimento}%
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${item.crescimento >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                style={{ width: `${Math.min(100, Math.abs(item.crescimento) * 2)}%` }}
                                            ></div>
                                        </div>
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
