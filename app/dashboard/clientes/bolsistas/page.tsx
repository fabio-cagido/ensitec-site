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
import { ArrowLeft, GraduationCap, Percent, TrendingUp } from "lucide-react";
import { ClientFilterBar, ClientFilterState } from "../components/ClientFilterBar";

const COMPARISON_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#06b6d4"];

export default function BolsistasPage() {
    const [dataset, setDataset] = useState<any[]>([]);
    const [comparisonData, setComparisonData] = useState<any[]>([]);
    const [summary, setSummary] = useState({ total: 0, scholarshipCount: 0, percentage: 0 });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ClientFilterState | null>(null);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('metric', 'scholarships');
        if (filters) {
            if (filters.unidades.length) params.append('unidades', filters.unidades.join(','));
            if (filters.segmentos.length) params.append('segmentos', filters.segmentos.join(','));
            if (filters.anos.length) params.append('anos', filters.anos.join(','));
        }

        const fetchMain = fetch(`/api/dashboard/analytics?${params.toString()}`).then(res => res.json());

        const compParams = new URLSearchParams(params);
        compParams.append('compare', 'unit');
        const fetchComp = fetch(`/api/dashboard/analytics?${compParams.toString()}`).then(res => res.json());

        Promise.all([fetchMain, fetchComp])
            .then(([data, comp]) => {
                if (Array.isArray(data)) {
                    const unitMap = new Map<string, { total: number, scholars: number }>();
                    data.forEach((item: any) => {
                        const existing = unitMap.get(item.unitLabel) || { total: 0, scholars: 0 };
                        const totalUnitStudents = item.total || 100;
                        unitMap.set(item.unitLabel, {
                            total: existing.total + totalUnitStudents,
                            scholars: existing.scholars + item.value
                        });
                    });

                    setDataset(Array.from(unitMap.entries()).map(([name, stats]) => ({
                        name: name,
                        Pagantes: stats.total - stats.scholars,
                        Bolsistas: stats.scholars
                    })));

                    const totalScholars = Array.from(unitMap.values()).reduce((a, b) => a + b.scholars, 0);
                    const totalAll = Array.from(unitMap.values()).reduce((a, b) => a + b.total, 0);

                    setSummary({
                        total: totalAll,
                        scholarshipCount: totalScholars,
                        percentage: totalAll > 0 ? (totalScholars / totalAll) * 100 : 0
                    });
                }
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Alunos Bolsistas</h1>
                    <p className="text-gray-500 text-sm">Análise de concessão de bolsas e impacto social</p>
                </div>
            </div>

            <ClientFilterBar onFilterChange={setFilters} />

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Bolsistas</span>
                    <p className="text-3xl font-black text-gray-900 mt-2">{summary.scholarshipCount}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <GraduationCap size={14} className="text-purple-500" /> Alunos com benefício ativo
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Taxa de Penetração</span>
                    <p className="text-3xl font-black text-indigo-600 mt-2">{summary.percentage.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Percent size={14} className="text-indigo-500" /> Fração da base estudantil
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Budget Utilizado</span>
                    <p className="text-3xl font-black text-emerald-600 mt-2">R$ 1.2M</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                        <TrendingUp size={14} /> Valor total em isenções
                    </p>
                </div>
            </div>

            {/* Comparison Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="mb-10">
                    <h3 className="font-bold text-gray-900 text-lg">Evolução de Bolsas - Unidade</h3>
                    <p className="text-xs text-gray-400">Tendência histórica de penetração de bolsas por campus</p>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
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

            {/* Stacked Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="mb-10">
                    <h3 className="font-bold text-gray-900 text-lg">Proporção por Unidade</h3>
                    <p className="text-xs text-gray-400">Distribuição entre alunos pagantes e bolsistas (100% Stacked)</p>
                </div>

                <div className="h-[450px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={dataset}
                            layout="vertical"
                            stackOffset="expand"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 13 }}
                                width={120}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                }}
                                formatter={(value: any) => `${(value * 100).toFixed(1)}%`}
                            />
                            <Legend verticalAlign="top" align="right" />
                            <Bar
                                dataKey="Pagantes"
                                stackId="a"
                                fill="#94a3b8"
                                radius={[0, 0, 0, 0]}
                                barSize={40}
                            />
                            <Bar
                                dataKey="Bolsistas"
                                stackId="a"
                                fill="#3b82f6"
                                radius={[0, 4, 4, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-2xl text-white border-none shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <TrendingUp size={20} />
                    </div>
                    <h4 className="font-bold text-lg">Impacto de Retenção</h4>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                    Alunos bolsistas possuem uma taxa de evasão <span className="text-emerald-400 font-bold">12% menor</span> que a média da escola.
                    O programa de bolsas não apenas cumpre um papel social, mas serve como âncora de estabilidade para as turmas.
                </p>
                <div className="mt-6 flex gap-8">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Retention Rate</p>
                        <p className="text-2xl font-black text-emerald-400">98.2%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
