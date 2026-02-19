"use client";

import { useState, useMemo } from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea,
    Legend,
    LineChart,
    Line,
    BarChart,
    Bar
} from 'recharts';
import { ArrowLeft, AlertTriangle, Users, TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight, UserX } from "lucide-react";
import Link from "next/link";
import AcademicFilters, { FilterState, defaultFilters, LABEL_MAP, COMPARISON_COLORS } from "@/components/filters/AcademicFilters";

// Mock students
const generateStudents = () => {
    return Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        name: `Aluno ${i + 1}`,
        frequencia: Math.floor(Math.random() * (100 - 55) + 55),
        nota: Number((Math.random() * (10 - 2) + 2).toFixed(1)),
        unitId: i % 2 === 0 ? "u1" : "u3",
        year: ["2025", "2026"][Math.floor(Math.random() * 2)],
    }));
};

const ALL_STUDENTS = generateStudents();

// Dados mensais
const MONTHLY_EVOLUTION = [
    { mes: "Jan", risco: 20, total: 450 },
    { mes: "Fev", risco: 16, total: 450 },
    { mes: "Mar", risco: 15, total: 450 },
    { mes: "Abr", risco: 16, total: 450 },
    { mes: "Mai", risco: 14, total: 450 },
    { mes: "Jun", risco: 19, total: 450 },
    { mes: "Jul", risco: 25, total: 450 },
    { mes: "Ago", risco: 20, total: 450 },
    { mes: "Set", risco: 18, total: 450 },
    { mes: "Out", risco: 22, total: 450 },
    { mes: "Nov", risco: 28, total: 450 },
    { mes: "Dez", risco: 25, total: 450 },
];

// Alunos em risco detalhados
const ALUNOS_RISCO = [
    { nome: "João Silva", turma: "9º Ano B", nota: 4.2, freq: 68, motivo: "Baixa frequência e notas" },
    { nome: "Maria Santos", turma: "1º Médio A", nota: 3.8, freq: 72, motivo: "Notas abaixo da média" },
    { nome: "Pedro Costa", turma: "8º Ano C", nota: 4.5, freq: 65, motivo: "Frequência crítica" },
    { nome: "Ana Oliveira", turma: "9º Ano A", nota: 4.8, freq: 70, motivo: "Baixa frequência" },
    { nome: "Lucas Lima", turma: "3º Médio A", nota: 3.2, freq: 78, motivo: "Notas muito baixas" },
];

export default function RiscoPage() {
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

    const studentsBySeries = useMemo(() => {
        const grouped: Record<string, typeof ALL_STUDENTS> = {};
        seriesToCompare.forEach(seriesKey => {
            grouped[seriesKey] = ALL_STUDENTS.filter(s => {
                if (comparisonMode === "ano") {
                    return s.year === seriesKey && (filters.unidades.length === 0 || filters.unidades.includes(s.unitId));
                }
                return s.unitId === seriesKey && (filters.anos.length === 0 || filters.anos.includes(s.year));
            });
        });
        return grouped;
    }, [filters, seriesToCompare, comparisonMode]);

    const seriesLabels = seriesToCompare.map(s => LABEL_MAP[s] || s);

    const riskCounts = useMemo(() => {
        return seriesToCompare.map(key => {
            const students = studentsBySeries[key] || [];
            return {
                label: LABEL_MAP[key] || key,
                total: students.length,
                risk: students.filter(s => s.nota < 5 || s.frequencia < 75).length
            };
        });
    }, [studentsBySeries, seriesToCompare]);

    // KPIs
    const currentMonth = MONTHLY_EVOLUTION[MONTHLY_EVOLUTION.length - 1];
    const previousMonth = MONTHLY_EVOLUTION[MONTHLY_EVOLUTION.length - 2];
    const variation = currentMonth.risco - previousMonth.risco;
    const isPositive = variation <= 0; // menos risco é positivo
    const totalRisco = riskCounts.reduce((sum, r) => sum + r.risk, 0);
    const totalAlunos = riskCounts.reduce((sum, r) => sum + r.total, 0);

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/academico" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Alunos em Risco</h1>
                    <p className="text-gray-500 text-sm">Monitoramento mensal de vulnerabilidade acadêmica</p>
                </div>
            </div>

            {/* Filtros */}
            <AcademicFilters filters={filters} onFilterChange={setFilters} />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Alunos em Risco</span>
                        <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                            {Math.abs(variation)}
                        </div>
                    </div>
                    <p className="text-3xl font-black text-rose-600">{currentMonth.risco}</p>
                    <p className="text-xs text-rose-500 mt-1">vs {previousMonth.risco} mês anterior</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Taxa de Risco</span>
                        <AlertTriangle size={16} className="text-amber-500" />
                    </div>
                    <p className="text-3xl font-black text-gray-900">{((totalRisco / totalAlunos) * 100).toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-1">{totalRisco} de {totalAlunos} alunos</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recuperados</span>
                        <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-3xl font-black text-emerald-600">8</p>
                    <p className="text-xs text-gray-500 mt-1">saíram do risco este mês</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Novos Casos</span>
                        <UserX size={16} className="text-rose-500" />
                    </div>
                    <p className="text-3xl font-black text-rose-600">4</p>
                    <p className="text-xs text-gray-500 mt-1">entraram em risco este mês</p>
                </div>
            </div>

            {/* Evolução Mensal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Evolução do Risco</h3>
                            <p className="text-xs text-gray-400">Quantidade de alunos em situação crítica</p>
                        </div>
                        <Calendar size={16} className="text-gray-400" />
                    </div>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MONTHLY_EVOLUTION}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="risco" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e', r: 4 }} name="Em Risco" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Distribuição por Unidade</h3>
                            <p className="text-xs text-gray-400">Alunos em risco por escola</p>
                        </div>
                    </div>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={riskCounts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 12 }} width={120} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="risk" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Em Risco" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Gráfico Comparativo */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Matriz de Vulnerabilidade - Comparativo</h3>
                        <p className="text-xs text-gray-400">Comparando: {seriesLabels.join(" vs ")}</p>
                    </div>
                </div>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis type="number" dataKey="frequencia" name="Frequência" unit="%" domain={[50, 100]} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} label={{ value: 'Frequência (%)', position: 'bottom', fill: '#6b7280', fontSize: 12 }} />
                            <YAxis type="number" dataKey="nota" name="Nota" domain={[0, 10]} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} label={{ value: 'Nota (0-10)', angle: -90, position: 'left', fill: '#6b7280', fontSize: 12 }} />
                            <ZAxis type="number" range={[80, 120]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <ReferenceArea x1={50} x2={75} y1={0} y2={5} fill="#fef2f2" stroke="#fee2e2" />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            {seriesToCompare.map((seriesKey, idx) => (
                                <Scatter key={seriesKey} name={LABEL_MAP[seriesKey] || seriesKey} data={studentsBySeries[seriesKey] || []} fill={COMPARISON_COLORS[idx]} fillOpacity={0.7} />
                            ))}
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Lista de Alunos em Risco */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Alunos que Precisam de Intervenção</h3>
                    <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">Exportar Lista</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Aluno</th>
                                <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Turma</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Nota</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Frequência</th>
                                <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Motivo</th>
                                <th className="text-center py-3 px-4 font-bold text-gray-500 text-xs uppercase">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ALUNOS_RISCO.map((aluno, idx) => (
                                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-900">{aluno.nome}</td>
                                    <td className="py-3 px-4 text-gray-600">{aluno.turma}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-rose-600 font-bold">{aluno.nota}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-amber-600 font-bold">{aluno.freq}%</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-xs text-gray-500">{aluno.motivo}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button className="text-xs font-bold text-white bg-rose-500 px-3 py-1 rounded-lg hover:bg-rose-600">Acionar</button>
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
