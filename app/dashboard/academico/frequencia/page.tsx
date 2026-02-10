"use client";

import { useState, useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Legend,
    LineChart,
    Line,
    BarChart,
    Bar
} from 'recharts';
import { ArrowLeft, Target, Calendar, Users, AlertTriangle, ArrowUpRight, ArrowDownRight, TrendingDown } from "lucide-react";
import Link from "next/link";
import AcademicFilters, { FilterState, defaultFilters, LABEL_MAP, COMPARISON_COLORS } from "@/components/filters/AcademicFilters";

// Mock data
const MOCK_DATA = [
    { bimestre: "1º Bim", unitId: "u1", year: "2026", freq: 94 },
    { bimestre: "2º Bim", unitId: "u1", year: "2026", freq: 91 },
    { bimestre: "3º Bim", unitId: "u1", year: "2026", freq: 88 },
    { bimestre: "4º Bim", unitId: "u1", year: "2026", freq: 92 },
    { bimestre: "1º Bim", unitId: "u3", year: "2026", freq: 90 },
    { bimestre: "2º Bim", unitId: "u3", year: "2026", freq: 85 },
    { bimestre: "3º Bim", unitId: "u3", year: "2026", freq: 82 },
    { bimestre: "4º Bim", unitId: "u3", year: "2026", freq: 88 },
    { bimestre: "1º Bim", unitId: "u1", year: "2025", freq: 88 },
    { bimestre: "2º Bim", unitId: "u1", year: "2025", freq: 85 },
];

// Dados mensais
const MONTHLY_EVOLUTION = [
    { mes: "Mar", freq: 88.5, meta: 75, faltas: 290 },
    { mes: "Abr", freq: 90.2, meta: 75, faltas: 245 },
    { mes: "Mai", freq: 89.1, meta: 75, faltas: 280 },
    { mes: "Jun", freq: 87.5, meta: 75, faltas: 310 },
    { mes: "Jul", freq: 82.2, meta: 75, faltas: 480 },
    { mes: "Ago", freq: 89.8, meta: 75, faltas: 215 },
    { mes: "Set", freq: 91.2, meta: 75, faltas: 245 },
    { mes: "Out", freq: 89.5, meta: 75, faltas: 312 },
    { mes: "Nov", freq: 87.8, meta: 75, faltas: 398 },
    { mes: "Dez", freq: 85.2, meta: 75, faltas: 445 },
    { mes: "Jan", freq: 88.1, meta: 75, faltas: 356 },
    { mes: "Fev", freq: 90.5, meta: 75, faltas: 278 },
];

// Turmas com baixa frequência
const TURMAS_BAIXA_FREQ = [
    { turma: "9º Ano B", freq: 78.5, alunos: 32, faltosos: 8 },
    { turma: "1º Médio A", freq: 81.2, alunos: 35, faltosos: 6 },
    { turma: "8º Ano C", freq: 82.1, alunos: 30, faltosos: 5 },
];

export default function FrequenciaPage() {
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
        const bimestres = ["1º Bim", "2º Bim", "3º Bim", "4º Bim"];
        return bimestres.map(bimestre => {
            const point: any = { bimestre };
            seriesToCompare.forEach(seriesKey => {
                const filtered = MOCK_DATA.filter(d => {
                    const matchBim = d.bimestre === bimestre;
                    if (comparisonMode === "ano") {
                        return matchBim && d.year === seriesKey && (filters.unidades.length === 0 || filters.unidades.includes(d.unitId));
                    }
                    return matchBim && d.unitId === seriesKey && (filters.anos.length === 0 || filters.anos.includes(d.year));
                });
                const label = LABEL_MAP[seriesKey] || seriesKey;
                point[label] = filtered.length > 0 ? Math.round(filtered.reduce((sum, d) => sum + d.freq, 0) / filtered.length) : 0;
            });
            return point;
        });
    }, [filters, seriesToCompare, comparisonMode]);

    const seriesLabels = seriesToCompare.map(s => LABEL_MAP[s] || s);

    // KPIs
    const currentMonth = MONTHLY_EVOLUTION[MONTHLY_EVOLUTION.length - 1];
    const previousMonth = MONTHLY_EVOLUTION[MONTHLY_EVOLUTION.length - 2];
    const variation = (currentMonth.freq - previousMonth.freq).toFixed(1);
    const isPositive = currentMonth.freq >= previousMonth.freq;
    const totalFaltas = MONTHLY_EVOLUTION.reduce((sum, m) => sum + m.faltas, 0);

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/academico" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Frequência Média</h1>
                    <p className="text-gray-500 text-sm">Acompanhamento mensal de presença escolar</p>
                </div>
            </div>

            {/* Filtros */}
            <AcademicFilters filters={filters} onFilterChange={setFilters} />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Frequência Atual</span>
                        <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {variation}pp
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{currentMonth.freq}%</p>
                    <p className="text-xs text-gray-500 mt-1">vs {previousMonth.freq}% mês anterior</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta MEC</span>
                        <Target size={16} className="text-rose-500" />
                    </div>
                    <p className="text-3xl font-black text-emerald-600">75%</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1">✓ Acima da meta mínima</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Faltas no Mês</span>
                        <Users size={16} className="text-amber-500" />
                    </div>
                    <p className="text-3xl font-black text-amber-600">{currentMonth.faltas}</p>
                    <p className="text-xs text-gray-500 mt-1">Total semestre: {totalFaltas}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Turmas Alerta</span>
                        <AlertTriangle size={16} className="text-rose-500" />
                    </div>
                    <p className="text-3xl font-black text-rose-600">{TURMAS_BAIXA_FREQ.length}</p>
                    <p className="text-xs text-gray-500 mt-1">abaixo de 85%</p>
                </div>
            </div>

            {/* Evolução Mensal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Evolução Mensal</h3>
                            <p className="text-xs text-gray-400">Frequência vs Meta MEC</p>
                        </div>
                        <Calendar size={16} className="text-gray-400" />
                    </div>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MONTHLY_EVOLUTION}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis domain={[70, 95]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }} />
                                <ReferenceLine y={75} stroke="#f43f5e" strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="freq" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} name="Frequência" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Volume de Faltas</h3>
                            <p className="text-xs text-gray-400">Quantidade mensal de ausências</p>
                        </div>
                        <TrendingDown size={16} className="text-gray-400" />
                    </div>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MONTHLY_EVOLUTION}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="faltas" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Faltas" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Gráfico Comparativo */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Evolução Bimestral - Comparativo</h3>
                        <p className="text-xs text-gray-400">Comparando: {seriesLabels.join(" vs ")}</p>
                    </div>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                {seriesLabels.map((label, idx) => (
                                    <linearGradient key={label} id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COMPARISON_COLORS[idx]} stopOpacity={0.2} />
                                        <stop offset="95%" stopColor={COMPARISON_COLORS[idx]} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="bimestre" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} />
                            <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <ReferenceLine y={75} stroke="#f43f5e" strokeDasharray="6 6" strokeWidth={2} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            {seriesLabels.map((label, idx) => (
                                <Area key={label} type="monotone" name={label} dataKey={label} stroke={COMPARISON_COLORS[idx]} strokeWidth={idx === 0 ? 4 : 2} strokeDasharray={idx > 0 ? "5 5" : undefined} fillOpacity={1} fill={`url(#gradient-${idx})`} />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Turmas com Baixa Frequência */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Turmas que Precisam de Atenção</h3>
                    <span className="text-xs text-rose-600 font-bold bg-rose-50 px-3 py-1 rounded-full">Frequência &lt; 85%</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Turma</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Frequência</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Total Alunos</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Alunos Faltosos</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TURMAS_BAIXA_FREQ.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-900">{item.turma}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-rose-600 font-bold">{item.freq}%</span>
                                    </td>
                                    <td className="py-3 px-4 text-center text-gray-600">{item.alunos}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-amber-600 font-bold">{item.faltosos}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Ver detalhes →</button>
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
