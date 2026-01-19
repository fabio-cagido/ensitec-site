"use client";

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
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CreditCard, AlertCircle } from 'lucide-react';

const financeData = [
    { month: 'Jan', receita: 120000, despesa: 80000 },
    { month: 'Fev', receita: 135000, despesa: 85000 },
    { month: 'Mar', receita: 140000, despesa: 90000 },
    { month: 'Abr', receita: 130000, despesa: 88000 },
    { month: 'Mai', receita: 150000, despesa: 95000 },
    { month: 'Jun', receita: 160000, despesa: 100000 },
    { month: 'Jul', receita: 155000, despesa: 110000 }, // Férias/13º professores as vezes
    { month: 'Ago', receita: 165000, despesa: 95000 },
    { month: 'Set', receita: 170000, despesa: 92000 },
    { month: 'Out', receita: 175000, despesa: 96000 },
    { month: 'Nov', receita: 180000, despesa: 94000 },
    { month: 'Dez', receita: 190000, despesa: 120000 },
];

const expenseDistribution = [
    { name: 'Pessoal (Salários)', value: 550000 },
    { name: 'Infraestrutura', value: 120000 },
    { name: 'Marketing', value: 80000 },
    { name: 'Materiais', value: 50000 },
    { name: 'Outros', value: 30000 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

const recentTransactions = [
    { id: 1, desc: 'Mensalidade - Turma 3A', date: 'Hoje, 10:23', amount: '+ R$ 1.250,00', type: 'income' },
    { id: 2, desc: 'Fornecedor - Papelaria', date: 'Hoje, 09:15', amount: '- R$ 450,00', type: 'expense' },
    { id: 3, desc: 'Mensalidade - Turma 1B', date: 'Ontem, 16:45', amount: '+ R$ 1.250,00', type: 'income' },
    { id: 4, desc: 'Manutenção Ar Cond.', date: 'Ontem, 14:20', amount: '- R$ 850,00', type: 'expense' },
    { id: 5, desc: 'Mensalidade - Turma 2C', date: 'Ontem, 11:30', amount: '+ R$ 1.250,00', type: 'income' },
];

export default function FinancialDashboard() {
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Financeiro</h1>
                <p className="text-gray-500">Visão consolidada das finanças escolares</p>
            </header>

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
                            +12.5%
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Receita Total (Ano)</span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">R$ 2.4M</div>
                </div>

                {/* Despesas */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <CreditCard className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +4.2%
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Despesas Operacionais</span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">R$ 1.1M</div>
                </div>

                {/* Lucro Líquido */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <Wallet className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +8.1%
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Lucro Líquido</span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">R$ 1.3M</div>
                </div>

                {/* Inadimplência */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-orange-600" />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                            -2.5%
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Inadimplência</span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">4.2%</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                {/* Histórico Receita vs Despesa */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Fluxo de Caixa (12 meses)</h3>
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
                                <Bar dataKey="receita" name="Receita" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="despesa" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribuição de Despesas */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Composição de Despesas</h3>
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
                                    {expenseDistribution.map((entry, index) => (
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
                            {recentTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{t.desc}</td>
                                    <td className="px-6 py-4 text-gray-500">{t.date}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                        {t.amount}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Concluído
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
