"use client";

import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from 'recharts';
import Link from "next/link";
import { ArrowLeft, MessageSquare, TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { ClientFilterBar, ClientFilterState } from "../components/ClientFilterBar";

const NPS_COLORS = ["#10b981", "#94a3b8", "#f43f5e"]; // Promotores, Neutros, Detratores
const COMPARISON_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#06b6d4"];

export default function NPSPage() {
    const [data, setData] = useState<any>({ score: 72, promoters: 520, neutrals: 300, detractors: 180 });
    const [comparisonData, setComparisonData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ClientFilterState | null>(null);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('metric', 'nps');
        if (filters) {
            if (filters.unidades.length) params.append('unidades', filters.unidades.join(','));
            if (filters.segmentos.length) params.append('segmentos', filters.segmentos.join(','));
        }

        const fetchMain = fetch(`/api/dashboard/analytics?${params.toString()}`).then(res => res.json());
        const fetchComp = fetch(`/api/dashboard/analytics?${params.toString()}&compare=unit`).then(res => res.json());

        Promise.all([fetchMain, fetchComp])
            .then(([main, comp]) => {
                if (main) setData(main);
                if (Array.isArray(comp)) setComparisonData(comp);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [filters]);

    const pieData = [
        { name: 'Promotores', value: data.promoters },
        { name: 'Neutros', value: data.neutrals },
        { name: 'Detratores', value: data.detractors },
    ];

    const comparisonKeys = comparisonData.length > 0 ? Object.keys(comparisonData[0]).filter(k => k !== 'month') : [];

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/clientes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Satisfação (NPS)</h1>
                    <p className="text-gray-500 text-sm">Métrica de lealdade e recomendação dos responsáveis</p>
                </div>
            </div>

            <ClientFilterBar onFilterChange={setFilters} />

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">NPS Score</span>
                    <p className="text-4xl font-black text-indigo-600 mt-2">{data.score}</p>
                    <p className="text-xs text-indigo-700 font-bold mt-1">Zona de Excelência</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Respondentes</span>
                    <p className="text-4xl font-black text-gray-900 mt-2">412</p>
                    <p className="text-xs text-gray-500 mt-1">41.2% da base total</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Variação Anual</span>
                    <p className="text-4xl font-black text-emerald-600 mt-2">+4</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                        <TrendingUp size={14} /> Evolução positiva
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sentimento</span>
                    <div className="mt-4 flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`h-2 flex-grow rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-medium">Predominantemente Positivo</p>
                </div>
            </div>

            {/* Comparison Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Evolução do NPS - Comparativo</h3>
                        <p className="text-xs text-gray-400">Comparação mensal do NPS entre unidades</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} />
                        Histórico 2025/26
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} />
                            <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Legend verticalAlign="top" align="right" />
                            {comparisonKeys.map((key, idx) => (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={COMPARISON_COLORS[idx % COMPARISON_COLORS.length]}
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Main NPS Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[450px]">
                    <h3 className="font-bold text-gray-900 text-center mb-8">Composição do Score</h3>

                    <div className="relative w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={90}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={NPS_COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">NPS</span>
                            <span className="text-6xl font-black text-gray-900 leading-none">{data.score}</span>
                        </div>
                    </div>

                    {/* Bottom Badges */}
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                            <TrendingUp size={14} className="text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-700">{data.promoters} Promotores</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                            <Minus size={14} className="text-slate-500" />
                            <span className="text-xs font-bold text-slate-700">{data.neutrals} Neutros</span>
                        </div>
                        <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full border border-rose-100">
                            <TrendingDown size={14} className="text-rose-600" />
                            <span className="text-xs font-bold text-rose-700">{data.detractors} Detratores</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col cursor-help hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-6">
                            <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Principais Elogios</h4>
                            <MessageSquare size={16} className="text-emerald-500" />
                        </div>
                        <div className="space-y-4 flex-grow">
                            {[
                                { text: "Excelente infraestrutura e laboratórios.", pct: 85 },
                                { text: "Atenção individualizada dos professores.", pct: 72 },
                                { text: "Metodologia de ensino inovadora.", pct: 68 },
                            ].map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-gray-700">{item.text}</span>
                                        <span className="font-bold text-emerald-600">{item.pct}%</span>
                                    </div>
                                    <div className="h-1 bg-emerald-100 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full" style={{ width: `${item.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl border-none">
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Benchmark Setorial</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Média Nacional</p>
                                <p className="text-2xl font-black">62</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Meta Institucional</p>
                                <p className="text-2xl font-black">75</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
