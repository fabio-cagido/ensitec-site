"use client";

import { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import PageHeader from "@/components/dashboard/PageHeader";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function FinancialDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/dashboard/financeiro');
                if (!res.ok) throw new Error('Falha ao carregar dados financeiros');
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
                <p className="text-gray-600 font-medium">Carregando dados financeiros...</p>
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

    const { financeData, kpis, expenseDistribution, recentTransactions } = data;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard Financeiro"
                subtitle="Visão consolidada das finanças escolares"
                showLogo={true}
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Receita Total */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            {kpis.receitaTotalGrowth}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Receita Total</span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                        R$ {(kpis.receitaTotal / 1000).toFixed(1)}k
                    </div>
                </div>

                {/* Receita Recebida */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Wallet className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            {kpis.receitaRecebidaGrowth}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Receita Recebida</span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                        R$ {(kpis.receitaRecebida / 1000).toFixed(1)}k
                    </div>
                </div>

                {/* Receita Pendente */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Receita Pendente</span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                        R$ {(kpis.receitaAtrasada / 1000).toFixed(1)}k
                    </div>
                </div>

                {/* Inadimplência */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <CreditCard className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                            {kpis.inadimplenciaGrowth}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Inadimplência</span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{kpis.inadimplencia}%</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                {/* Histórico Receita vs Despesa */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Fluxo de Caixa</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#F3F4F6' }}
                                />
                                <Bar dataKey="receita" name="Recebido" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="pendente" name="Pendente" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribuição de Despesas */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Composição Estimada (Custos)</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expenseDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    iconType="circle"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Transações Recentes</h3>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Ver todas</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Descrição</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4 text-right">Valor</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentTransactions.map((t: any) => (
                                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{t.desc}</td>
                                    <td className="px-6 py-4 text-gray-500">{t.date}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                        {t.amount}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {t.type === 'income' ? 'Pago' : 'Pendente'}
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
