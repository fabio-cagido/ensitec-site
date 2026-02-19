"use client";

import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Legend
} from 'recharts';
import Link from "next/link";
import { ArrowLeft, TrendingDown, DollarSign, Target, Calendar } from "lucide-react";
import { ClientFilterBar, ClientFilterState } from "../components/ClientFilterBar";

const COMPARISON_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#06b6d4"];

export default function EvasaoPage() {
    const [comparisonData, setComparisonData] = useState<any[]>([]);
    const [stats, setStats] = useState({ current: 2.1, ltvLoss: 450000, target: 5 });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ClientFilterState | null>(null);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('metric', 'evasao');
        params.append('compare', 'unit');
        if (filters) {
            if (filters.unidades.length) params.append('unidades', filters.unidades.join(','));
            if (filters.segmentos.length) params.append('segmentos', filters.segmentos.join(','));
        }

        fetch(`/api/dashboard/analytics?${params.toString()}`)
            .then(res => res.json())
            .then((comp) => {
                if (Array.isArray(comp)) setComparisonData(comp);
            })
            .catch(err => console.error(err))
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Taxa de Evasão (Churn)</h1>
                    <p className="text-gray-500 text-sm">Monitoramento preventivo de perda de base estudantil</p>
                </div>
            </div>

            <ClientFilterBar onFilterChange={setFilters} />

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Taxa Atual (YTD)</span>
                    <p className="text-4xl font-black text-rose-600 mt-2">{stats.current}%</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                        <TrendingDown size={14} /> Dentro da meta aceitável
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Impacto Financeiro (LTV)</span>
                    <p className="text-4xl font-black text-gray-900 mt-2">R$ 450k</p>
                    <p className="text-xs text-gray-400 font-bold mt-1 flex items-center gap-1">
                        <DollarSign size={14} className="text-rose-500" /> Perda projetada em receita anual
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta de Retenção</span>
                    <p className="text-4xl font-black text-indigo-600 mt-2">{stats.target}%</p>
                    <p className="text-xs text-indigo-600 font-bold mt-1 flex items-center gap-1">
                        <Target size={14} /> Teto máximo estabelecido
                    </p>
                </div>
            </div>

            {/* Comparison Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Evolução da Evasão - Comparativo</h3>
                        <p className="text-xs text-gray-400">Taxa de cancelamento mensal por unidade</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} />
                        Histórico 2025/26
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
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <ReferenceLine y={5} stroke="#f43f5e" strokeDasharray="5 5" label={{ value: 'Teto 5%', position: 'right', fill: '#f43f5e', fontSize: 10, fontWeight: 'bold' }} />
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

            <div className="bg-rose-900 p-8 rounded-2xl text-white shadow-xl border-none">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-2">Análise de Causa Raiz</h4>
                        <div className="space-y-4 max-w-xl mt-6">
                            {[
                                { cause: "Mudança de Endereço", pct: 45 },
                                { cause: "Questões Financeiras", pct: 30 },
                                { cause: "Adaptação Pedagógica", pct: 15 },
                                { cause: "Outros", pct: 10 },
                            ].map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-bold text-rose-100">{item.cause}</span>
                                        <span className="font-black text-rose-400">{item.pct}%</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="bg-rose-500 h-full" style={{ width: `${item.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-1">Total Evadidos</p>
                        <p className="text-5xl font-black">21</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
