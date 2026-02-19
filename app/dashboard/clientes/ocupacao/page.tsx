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
    Legend,
    LineChart,
    Line
} from 'recharts';
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Building2, Users } from "lucide-react";
import { ClientFilterBar, ClientFilterState } from "../components/ClientFilterBar";

const COMPARISON_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#06b6d4"];

interface MetricData {
    classLabel: string;
    unitLabel: string;
    value: number; // occupancy count
}

export default function OcupacaoPage() {
    const [dataset, setDataset] = useState<MetricData[]>([]);
    const [comparisonData, setComparisonData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ClientFilterState | null>(null);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('metric', 'occupancy');
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
                if (Array.isArray(data)) {
                    setDataset(data.sort((a, b) => b.value - a.value));
                }
                if (Array.isArray(comp)) setComparisonData(comp);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [filters]);

    const CAPACITY = 30;
    const totalMatriculados = dataset.reduce((acc, curr) => acc + curr.value, 0);
    const totalVagas = dataset.length * CAPACITY;
    const taxaMedia = totalVagas > 0 ? (totalMatriculados / totalVagas) * 100 : 0;
    const comparisonKeys = comparisonData.length > 0 ? Object.keys(comparisonData[0]).filter(k => k !== 'month') : [];

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/clientes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Taxa de Ocupação</h1>
                    <p className="text-gray-500 text-sm">Monitoramento de capacidade por sala de aula</p>
                </div>
            </div>

            <ClientFilterBar onFilterChange={setFilters} />

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Capacidade Total</span>
                    <div className="mt-2 flex items-baseline gap-1">
                        <p className="text-3xl font-black text-gray-900">{totalVagas}</p>
                        <span className="text-xs text-gray-400">Vagas</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Matriculados</span>
                    <div className="mt-2 flex items-baseline gap-1">
                        <p className="text-3xl font-black text-emerald-600">{totalMatriculados}</p>
                        <span className="text-xs text-gray-400">Alunos</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Média de Ocupação</span>
                    <div className="mt-2 flex items-baseline gap-1">
                        <p className="text-3xl font-black text-indigo-900">{taxaMedia.toFixed(1)}%</p>
                        <span className="text-xs text-indigo-400 font-bold bg-indigo-50 px-2 rounded-full">Global</span>
                    </div>
                </div>
            </div>

            {/* Comparison Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="mb-10">
                    <h3 className="font-bold text-gray-900 text-lg">Evolução da Ocupação - Unidade</h3>
                    <p className="text-xs text-gray-400">Variação mensal da taxa de preenchimento de vagas</p>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} />
                            <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" />
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

            {/* List of Turmas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Status por Turma</h3>
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <span>Ideal</span></div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> <span>Lotação</span></div>
                    </div>
                </div>

                <div className="divide-y divide-gray-50">
                    {dataset.map((item, index) => {
                        const occupancyPct = Math.min((item.value / CAPACITY) * 100, 100);
                        const isAlert = occupancyPct > 90;

                        return (
                            <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-6">
                                <div className="w-32">
                                    <p className="font-bold text-gray-900 text-sm">{item.classLabel}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-black">{item.unitLabel || 'Geral'}</p>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className={`font-bold ${isAlert ? 'text-amber-600' : 'text-emerald-600'}`}>
                                            {occupancyPct.toFixed(0)}% Ocupado
                                        </span>
                                        <span className="text-gray-400 font-medium">{item.value}/{CAPACITY} Vagas</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${isAlert ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                            style={{ width: `${occupancyPct}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="w-8 flex justify-center">
                                    {isAlert ? (
                                        <AlertCircle className="text-amber-500 w-5 h-5" />
                                    ) : (
                                        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
