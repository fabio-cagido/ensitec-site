"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Legend
} from 'recharts';
import Link from "next/link";
import { ArrowLeft, Users, UserPlus, UserMinus, TrendingUp, Calendar } from "lucide-react";
import { ClientFilterBar, ClientFilterState } from "../components/ClientFilterBar";

const COMPARISON_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#06b6d4"];

export default function TotalAlunosPage() {
    const [dataset, setDataset] = useState<any[]>([]);
    const [comparisonData, setComparisonData] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, newToday: 12, canceled: 2 });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ClientFilterState | null>(null);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('metric', 'total-students');
        if (filters) {
            if (filters.unidades.length) params.append('unidades', filters.unidades.join(','));
            if (filters.segmentos.length) params.append('segmentos', filters.segmentos.join(','));
            if (filters.anos.length) params.append('anos', filters.anos.join(','));
            if (filters.tiposMatricula.length) params.append('tiposMatricula', filters.tiposMatricula.join(','));
        }

        const fetchMain = fetch(`/api/dashboard/analytics?${params.toString()}`).then(res => res.json());

        const compParams = new URLSearchParams(params);
        compParams.append('compare', 'unit');
        const fetchComp = fetch(`/api/dashboard/analytics?${compParams.toString()}`).then(res => res.json());

        Promise.all([fetchMain, fetchComp])
            .then(([data, comp]) => {
                if (Array.isArray(data)) {
                    let total = 0;
                    const unitMap = new Map<string, number>();
                    data.forEach((item: any) => {
                        total += item.value;
                        unitMap.set(item.unitLabel, (unitMap.get(item.unitLabel) || 0) + item.value);
                    });
                    setDataset(Array.from(unitMap.entries()).map(([key, val]) => ({ name: key, Alunos: val })));
                    setStats(prev => ({ ...prev, total }));
                }
                if (Array.isArray(comp)) setComparisonData(comp);
            })
            .catch(err => console.error("Error fetching data:", err))
            .finally(() => setLoading(false));
    }, [filters]);

    const comparisonKeys = comparisonData.length > 0 ? Object.keys(comparisonData[0]).filter(k => k !== 'month') : [];

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/clientes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Total de Alunos</h1>
                    <p className="text-gray-500 text-sm">Visão geral executiva da base de alunos</p>
                </div>
            </div>

            <ClientFilterBar onFilterChange={setFilters} />

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Alunos Ativos</span>
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <Users size={16} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <TrendingUp size={12} className="text-emerald-500" /> +5.2% vs mês anterior
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Matrículas Hoje</span>
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <UserPlus size={16} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-emerald-600">{stats.newToday}</p>
                    <p className="text-xs text-gray-500 mt-1">+4 vs ontem</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cancelamentos</span>
                        <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                            <UserMinus size={16} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-rose-600">{stats.canceled}</p>
                    <p className="text-xs text-gray-500 mt-1">-1 vs média</p>
                </div>
            </div>

            {/* Comparison Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Evolução da Base - Comparativo</h3>
                        <p className="text-xs text-gray-400">Comparação mensal do volume de alunos por unidade</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} />
                        Março 2025 - Fevereiro 2026
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={comparisonData}>
                            <defs>
                                {comparisonKeys.map((key, idx) => (
                                    <linearGradient key={key} id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COMPARISON_COLORS[idx % COMPARISON_COLORS.length]} stopOpacity={0.2} />
                                        <stop offset="95%" stopColor={COMPARISON_COLORS[idx % COMPARISON_COLORS.length]} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} />
                            <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            {comparisonKeys.map((key, idx) => (
                                <Area
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={COMPARISON_COLORS[idx % COMPARISON_COLORS.length]}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill={`url(#grad-${idx})`}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Distribution Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 text-lg">Distribuição Atual</h3>
                    <p className="text-xs text-gray-400">Filtro atual: {filters?.unidades.length ? `${filters.unidades.length} unidades` : 'Todas as Unidades'}</p>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataset}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                            <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="Alunos" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
