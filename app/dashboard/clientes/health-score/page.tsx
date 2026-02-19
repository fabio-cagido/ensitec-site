"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Legend
} from 'recharts';
import Link from "next/link";
import { ArrowLeft, Activity, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { ClientFilterBar, ClientFilterState } from "../components/ClientFilterBar";

const COMPARISON_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#06b6d4"];

export default function HealthScorePage() {
    const [history, setHistory] = useState<any[]>([]);
    const [comparisonData, setComparisonData] = useState<any[]>([]);
    const [score, setScore] = useState(8.4);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ClientFilterState | null>(null);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('metric', 'health-score');
        if (filters) {
            if (filters.unidades.length) params.append('unidades', filters.unidades.join(','));
            if (filters.segmentos.length) params.append('segmentos', filters.segmentos.join(','));
        }

        const fetchMain = fetch(`/api/dashboard/analytics?${params.toString()}`).then(res => res.json());

        const compParams = new URLSearchParams(params);
        compParams.append('compare', 'unit');
        const fetchComp = fetch(`/api/dashboard/analytics?${compParams.toString()}`).then(res => res.json());

        Promise.all([fetchMain, fetchComp])
            .then(([data, comp]) => {
                if (data.history) setHistory(data.history);
                if (data.current) setScore(data.current);
                if (Array.isArray(comp)) setComparisonData(comp);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [filters]);

    const trackerData = history.slice(-12).map(d => ({
        month: d.month,
        value: d.value,
        color: d.value >= 8 ? 'bg-emerald-500' : d.value >= 6 ? 'bg-amber-500' : 'bg-rose-500'
    }));

    const comparisonKeys = comparisonData.length > 0 ? Object.keys(comparisonData[0]).filter(k => k !== 'month') : [];

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/clientes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Health Score</h1>
                    <p className="text-gray-500 text-sm">Índice de engajamento e saúde das matrículas</p>
                </div>
            </div>

            <ClientFilterBar onFilterChange={setFilters} />

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Score Atual</span>
                    <p className="text-4xl font-black text-emerald-600 mt-2">{score}</p>
                    <p className="text-xs text-emerald-700 font-bold mt-1">✓ Saúde Excelente</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta de Retenção</span>
                    <p className="text-4xl font-black text-gray-900 mt-2">8.0</p>
                    <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: '80%' }}></div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Variação (Trim)</span>
                    <p className="text-4xl font-black text-emerald-600 mt-2">+0.6</p>
                    <div className="mt-2 flex items-center gap-1 text-emerald-600">
                        <TrendingUp size={14} />
                        <span className="text-xs font-bold">Crescimento constante</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Alertas de Fadiga</span>
                        <AlertTriangle size={16} className="text-amber-500" />
                    </div>
                    <p className="text-4xl font-black text-rose-600 mt-2">14</p>
                    <p className="text-xs text-gray-500 mt-1">Alunos em score crítico</p>
                </div>
            </div>

            {/* Comparison Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 text-lg">Evolução do Engajamento - Comparativo</h3>
                    <p className="text-xs text-gray-400">Comparação mensal do Health Score entre as unidades</p>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} />
                            <YAxis domain={[6, 10]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <ReferenceLine y={8.0} stroke="#f43f5e" strokeDasharray="5 5" label={{ value: 'Target', position: 'right', fill: '#f43f5e', fontSize: 10 }} />
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

            {/* Tracker Row */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity size={16} className="text-indigo-600" />
                    Histórico de Estabilidade (Últimos 12 meses)
                </h4>
                <div className="grid grid-cols-12 gap-2">
                    {trackerData.map((item, idx) => (
                        <div key={idx} className="group relative">
                            <div className={`h-8 rounded-md ${item.color} opacity-80 hover:opacity-100 transition-opacity cursor-help shadow-sm`} />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 font-bold">
                                {item.month}: {item.value}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>Março 2025</span>
                    <span>Fevereiro 2026</span>
                </div>
            </div>

            {/* Action Card */}
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4 items-center">
                <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-amber-900">Alerta de Fadiga Detectado</h4>
                    <p className="text-amber-700 text-sm">Identificamos uma queda de 1.2 pontos na Unidade Sul. Recomendamos intervenção pedagógica preventiva.</p>
                </div>
                <button className="ml-auto bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-amber-700 transition-colors">
                    Gerar Relatório
                </button>
            </div>
        </div>
    );
}
