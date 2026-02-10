"use client";

import { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { ArrowLeft, Clock, CheckCircle2, AlertTriangle, Calendar, ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";
import Link from "next/link";
import AcademicFilters, { FilterState, defaultFilters, LABEL_MAP, COMPARISON_COLORS } from "@/components/filters/AcademicFilters";

// Mock data
const MOCK_DATA = [
    { materia: "Matemática", materiaId: "m1", unitId: "u1", year: "2026", prazo: 82, atraso: 18 },
    { materia: "Português", materiaId: "m2", unitId: "u1", year: "2026", prazo: 90, atraso: 10 },
    { materia: "História", materiaId: "m3", unitId: "u1", year: "2026", prazo: 88, atraso: 12 },
    { materia: "Física", materiaId: "m5", unitId: "u1", year: "2026", prazo: 75, atraso: 25 },
    { materia: "Matemática", materiaId: "m1", unitId: "u3", year: "2026", prazo: 78, atraso: 22 },
    { materia: "Português", materiaId: "m2", unitId: "u3", year: "2026", prazo: 85, atraso: 15 },
    { materia: "História", materiaId: "m3", unitId: "u3", year: "2026", prazo: 80, atraso: 20 },
    { materia: "Física", materiaId: "m5", unitId: "u3", year: "2026", prazo: 70, atraso: 30 },
];

// Dados mensais
const MONTHLY_EVOLUTION = [
    { mes: "Set", prazo: 78, atraso: 22, total: 1250 },
    { mes: "Out", prazo: 80, atraso: 20, total: 1340 },
    { mes: "Nov", prazo: 82, atraso: 18, total: 1420 },
    { mes: "Dez", prazo: 79, atraso: 21, total: 980 },
    { mes: "Jan", prazo: 84, atraso: 16, total: 1180 },
    { mes: "Fev", prazo: 86, atraso: 14, total: 1350 },
];

// Turmas com mais atrasos
const TURMAS_ATRASO = [
    { turma: "9º Ano B", prazo: 68, pendentes: 45, mediaAtraso: 2.3 },
    { turma: "8º Ano C", prazo: 72, pendentes: 38, mediaAtraso: 1.8 },
    { turma: "1º Médio A", prazo: 75, pendentes: 32, mediaAtraso: 1.5 },
];

export default function EntregasPage() {
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
        const materias = ["Matemática", "Português", "História", "Física"];
        return materias.map(materia => {
            const point: any = { materia };
            seriesToCompare.forEach(seriesKey => {
                const filtered = MOCK_DATA.filter(d => {
                    const matchMateria = d.materia === materia;
                    if (comparisonMode === "ano") {
                        return matchMateria && d.year === seriesKey && (filters.unidades.length === 0 || filters.unidades.includes(d.unitId));
                    }
                    return matchMateria && d.unitId === seriesKey && (filters.anos.length === 0 || filters.anos.includes(d.year));
                });
                const label = LABEL_MAP[seriesKey] || seriesKey;
                point[label] = filtered.length > 0 ? Math.round(filtered.reduce((sum, d) => sum + d.prazo, 0) / filtered.length) : 0;
            });
            return point;
        });
    }, [filters, seriesToCompare, comparisonMode]);

    const seriesLabels = seriesToCompare.map(s => LABEL_MAP[s] || s);

    // KPIs
    const currentMonth = MONTHLY_EVOLUTION[MONTHLY_EVOLUTION.length - 1];
    const previousMonth = MONTHLY_EVOLUTION[MONTHLY_EVOLUTION.length - 2];
    const variation = (currentMonth.prazo - previousMonth.prazo).toFixed(1);
    const isPositive = currentMonth.prazo >= previousMonth.prazo;
    const totalAtividades = MONTHLY_EVOLUTION.reduce((sum, m) => sum + m.total, 0);

    // Pie data
    const pieData = [
        { name: "No Prazo", value: currentMonth.prazo, color: "#10b981" },
        { name: "Atrasadas", value: currentMonth.atraso, color: "#f59e0b" },
    ];

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/academico" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Entrega de Atividades</h1>
                    <p className="text-gray-500 text-sm">Acompanhamento mensal de pontualidade</p>
                </div>
            </div>

            {/* Filtros */}
            <AcademicFilters filters={filters} onFilterChange={setFilters} />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Taxa No Prazo</span>
                        <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {variation}pp
                        </div>
                    </div>
                    <p className="text-3xl font-black text-emerald-600">{currentMonth.prazo}%</p>
                    <p className="text-xs text-gray-500 mt-1">vs {previousMonth.prazo}% mês anterior</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Atividades Mês</span>
                        <FileText size={16} className="text-indigo-500" />
                    </div>
                    <p className="text-3xl font-black text-gray-900">{currentMonth.total}</p>
                    <p className="text-xs text-gray-500 mt-1">Total semestre: {totalAtividades}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Média Atraso</span>
                        <Clock size={16} className="text-amber-500" />
                    </div>
                    <p className="text-3xl font-black text-amber-600">1.4 dias</p>
                    <p className="text-xs text-gray-500 mt-1">após o prazo</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Turmas Críticas</span>
                        <AlertTriangle size={16} className="text-rose-500" />
                    </div>
                    <p className="text-3xl font-black text-rose-600">{TURMAS_ATRASO.length}</p>
                    <p className="text-xs text-gray-500 mt-1">abaixo de 80% no prazo</p>
                </div>
            </div>

            {/* Evolução + Distribuição */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Evolução Mensal</h3>
                            <p className="text-xs text-gray-400">Taxa de entregas no prazo</p>
                        </div>
                        <Calendar size={16} className="text-gray-400" />
                    </div>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MONTHLY_EVOLUTION}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis domain={[70, 95]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="prazo" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} name="No Prazo" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Distribuição Atual</h3>
                    <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={2}>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-2">
                        {pieData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="font-medium">{item.name}: {item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gráfico Comparativo */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Entregas por Disciplina - Comparativo</h3>
                        <p className="text-xs text-gray-400">Comparando: {seriesLabels.join(" vs ")}</p>
                    </div>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={4} barCategoryGap="20%">
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="materia" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 13, fontWeight: 600 }} />
                            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" />
                            <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            {seriesLabels.map((label, idx) => (
                                <Bar key={label} name={label} dataKey={label} fill={COMPARISON_COLORS[idx]} radius={[6, 6, 0, 0]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Turmas com Atrasos */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Turmas com Maior Índice de Atraso</h3>
                    <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">Enviar Lembrete</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Turma</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">No Prazo</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Pendentes</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Média Atraso</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TURMAS_ATRASO.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-900">{item.turma}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-amber-600 font-bold">{item.prazo}%</span>
                                    </td>
                                    <td className="py-3 px-4 text-center text-gray-600">{item.pendentes}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-rose-600 font-bold">{item.mediaAtraso} dias</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.prazo >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {item.prazo >= 75 ? 'Atenção' : 'Crítico'}
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
