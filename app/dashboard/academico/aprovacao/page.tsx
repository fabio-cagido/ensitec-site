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
    Line
} from 'recharts';
import { ArrowLeft, CheckCircle2, TrendingUp, TrendingDown, Users, AlertTriangle, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import AcademicFilters, { FilterState, defaultFilters, LABEL_MAP, COMPARISON_COLORS } from "@/components/filters/AcademicFilters";

// Mock data
const MOCK_DATA = [
    { turma: "9º Ano A", turmaId: "t1", unitId: "u1", year: "2026", aprovados: 92, recuperacao: 5, reprovados: 3 },
    { turma: "9º Ano B", turmaId: "t2", unitId: "u1", year: "2026", aprovados: 85, recuperacao: 10, reprovados: 5 },
    { turma: "3º Médio A", turmaId: "t3", unitId: "u1", year: "2026", aprovados: 88, recuperacao: 8, reprovados: 4 },
    { turma: "9º Ano A", turmaId: "t1", unitId: "u3", year: "2026", aprovados: 90, recuperacao: 7, reprovados: 3 },
    { turma: "9º Ano B", turmaId: "t2", unitId: "u3", year: "2026", aprovados: 78, recuperacao: 15, reprovados: 7 },
    { turma: "1º Médio A", turmaId: "t6", unitId: "u3", year: "2026", aprovados: 82, recuperacao: 12, reprovados: 6 },
];

// Dados mensais para acompanhamento
const MONTHLY_EVOLUTION = [
    { mes: "Set", aprovacao: 82, meta: 90 },
    { mes: "Out", aprovacao: 84, meta: 90 },
    { mes: "Nov", aprovacao: 85, meta: 90 },
    { mes: "Dez", aprovacao: 83, meta: 90 },
    { mes: "Jan", aprovacao: 86, meta: 90 },
    { mes: "Fev", aprovacao: 88, meta: 90 },
];

export default function AprovacaoPage() {
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
        const turmas = ["9º Ano A", "9º Ano B", "3º Médio A", "1º Médio A"];
        return turmas.map(turma => {
            const point: any = { turma };
            seriesToCompare.forEach(seriesKey => {
                const filtered = MOCK_DATA.filter(d => {
                    const matchTurma = d.turma === turma;
                    if (comparisonMode === "ano") {
                        return matchTurma && d.year === seriesKey && (filters.unidades.length === 0 || filters.unidades.includes(d.unitId));
                    }
                    return matchTurma && d.unitId === seriesKey && (filters.anos.length === 0 || filters.anos.includes(d.year));
                });
                const label = LABEL_MAP[seriesKey] || seriesKey;
                point[label] = filtered.length > 0 ? Math.round(filtered.reduce((sum, d) => sum + d.aprovados, 0) / filtered.length) : 0;
            });
            return point;
        }).filter(d => Object.values(d).some(v => typeof v === 'number' && v > 0));
    }, [filters, seriesToCompare, comparisonMode]);

    const seriesLabels = seriesToCompare.map(s => LABEL_MAP[s] || s);

    // KPIs
    const currentMonth = MONTHLY_EVOLUTION[MONTHLY_EVOLUTION.length - 1];
    const previousMonth = MONTHLY_EVOLUTION[MONTHLY_EVOLUTION.length - 2];
    const variation = (currentMonth.aprovacao - previousMonth.aprovacao).toFixed(1);
    const isPositive = currentMonth.aprovacao >= previousMonth.aprovacao;

    // Turmas críticas
    const turmasCriticas = MOCK_DATA.filter(d => d.aprovados < 85).length;
    const alunosRecuperacao = MOCK_DATA.reduce((sum, d) => sum + d.recuperacao, 0);

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/academico" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Taxa de Aprovação</h1>
                    <p className="text-gray-500 text-sm">Acompanhamento mensal do desempenho por turma</p>
                </div>
            </div>

            {/* Filtros */}
            <AcademicFilters filters={filters} onFilterChange={setFilters} />

            {/* KPIs para o Diretor */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Taxa Atual</span>
                        <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {variation}pp
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{currentMonth.aprovacao}%</p>
                    <p className="text-xs text-gray-500 mt-1">vs {previousMonth.aprovacao}% mês anterior</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta Institucional</span>
                        <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-3xl font-black text-gray-900">90%</p>
                    <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(currentMonth.aprovacao / 90) * 100}%` }}></div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Em Recuperação</span>
                        <Users size={16} className="text-amber-500" />
                    </div>
                    <p className="text-3xl font-black text-amber-600">{alunosRecuperacao}</p>
                    <p className="text-xs text-gray-500 mt-1">alunos precisam de apoio</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Turmas Críticas</span>
                        <AlertTriangle size={16} className="text-rose-500" />
                    </div>
                    <p className="text-3xl font-black text-rose-600">{turmasCriticas}</p>
                    <p className="text-xs text-gray-500 mt-1">abaixo de 85% de aprovação</p>
                </div>
            </div>

            {/* Evolução Mensal */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-gray-900">Evolução da Taxa de Aprovação</h3>
                        <p className="text-xs text-gray-400">Últimos 12 meses vs Meta de 90%</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} />
                        Atualizado em Fevereiro/2026
                    </div>
                </div>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MONTHLY_EVOLUTION}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <YAxis domain={[75, 95]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="meta" stroke="#e5e7eb" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Meta" />
                            <Line type="monotone" dataKey="aprovacao" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} name="Aprovação" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfico Comparativo */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Aprovação por Turma - Comparativo</h3>
                        <p className="text-xs text-gray-400">Comparando: {seriesLabels.join(" vs ")}</p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-bold">
                        <CheckCircle2 size={14} /> Meta: 90%
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={4} barCategoryGap="20%">
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="turma" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 13, fontWeight: 600 }} />
                            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" />
                            <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`${value}%`, 'Aprovação']} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            {seriesLabels.map((label, idx) => (
                                <Bar key={label} name={label} dataKey={label} fill={COMPARISON_COLORS[idx]} radius={[6, 6, 0, 0]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tabela Detalhada */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Detalhamento por Turma</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Turma</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Aprovados</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Recuperação</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Reprovados</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_DATA.slice(0, 4).map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-900">{item.turma}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-emerald-600 font-bold">{item.aprovados}%</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-amber-600 font-bold">{item.recuperacao}%</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-rose-600 font-bold">{item.reprovados}%</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.aprovados >= 90 ? 'bg-emerald-100 text-emerald-700' : item.aprovados >= 85 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {item.aprovados >= 90 ? 'Atingiu meta' : item.aprovados >= 85 ? 'Atenção' : 'Crítico'}
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
