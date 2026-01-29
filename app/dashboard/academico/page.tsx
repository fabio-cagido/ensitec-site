"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import { Loader2, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Cell
} from 'recharts';

export default function AcademicoPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/dashboard/academico');
                if (!res.ok) throw new Error('Falha ao carregar dados acadêmicos');
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-gray-600 font-medium">Carregando dados acadêmicos...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-lg text-center">
                    <h2 className="text-red-700 font-bold text-xl mb-2">Erro no Carregamento</h2>
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const { kpis, disciplinePerformance, histogram, evolution } = data;

    return (
        <div className="space-y-8 pb-10">
            <PageHeader
                title="Acadêmico"
                subtitle="Gestão Pedagógica e Performance Educacional"
                showLogo={true}
            />

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Média Global */}
                <Link href="/dashboard/academico/media-global" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Média Global</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">{kpis.mediaGlobal}</h3>
                            </div>
                            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-bold">+0.2%</span>
                        </div>
                        <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${kpis.mediaGlobal * 10}%` }}></div>
                        </div>
                    </div>
                </Link>

                {/* 2. Taxa de Aprovação */}
                <Link href="/dashboard/academico/aprovacao" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Taxa de Aprovação</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">{kpis.approvalRate}%</h3>
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-full font-bold">+1.5%</span>
                        </div>
                        <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${kpis.approvalRate}%` }}></div>
                        </div>
                    </div>
                </Link>

                {/* 3. Alunos em Risco */}
                <Link href="/dashboard/academico/risco" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Alunos em Risco</p>
                                <h3 className="text-3xl font-bold text-red-600 mt-2">{kpis.riskCount}</h3>
                            </div>
                            <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full font-bold">Crítico</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Notas abaixo de 5.0</p>
                    </div>
                </Link>
            </div>

            {/* SEÇÃO VISUAL E GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Histograma de Notas */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Distribuição de Notas</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={histogram}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="bucket" label={{ value: 'Nota', position: 'insideBottom', offset: -5 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Desempenho por Disciplina */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Desempenho por Disciplina</h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {disciplinePerformance.map((d: any) => (
                            <div key={d.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{d.name}</span>
                                    <span className="font-bold text-gray-900">{d.val}</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className={`${d.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${d.val * 10}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Evolução Histórica */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Evolução da Média Geral</h3>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +8.2%
                            </span>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={evolution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <YAxis domain={[5, 10]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="media"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3b82f6', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
