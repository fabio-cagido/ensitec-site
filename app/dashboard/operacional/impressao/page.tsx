"use client";
import Link from "next/link";
import { ArrowLeft, Printer, DollarSign, FileText, Leaf } from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

// Mock Data
const PRINTING_TREND = [
    { month: 'Jan', pages: 12000 },
    { month: 'Fev', pages: 45000 }, // Volta às aulas
    { month: 'Mar', pages: 38000 },
    { month: 'Abr', pages: 35000 },
    { month: 'Mai', pages: 32000 },
    { month: 'Jun', pages: 28000 },
];

const DEPT_SPEND = [
    { name: 'Coord. Fund I', pages: 15000, cost: 2250, limit: 2000, status: 'Acima do Limite' },
    { name: 'Coord. Fund II', pages: 12000, cost: 1800, limit: 2000, status: 'Dentro da Meta' },
    { name: 'Ensino Médio', pages: 8500, cost: 1275, limit: 2000, status: 'Econômico' },
    { name: 'Secretaria', pages: 6000, cost: 900, limit: 1000, status: 'Dentro da Meta' },
    { name: 'Direção', pages: 2000, cost: 300, limit: 500, status: 'Econômico' },
];

export default function ImpressaoPage() {
    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/operacional" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Custos de Impressão</h1>
                    <p className="text-gray-500">Controle de Despesas e Sustentabilidade</p>
                </div>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Custo Total (Mês)</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ 6.5k</h3>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg text-red-600"><DollarSign size={20} /></div>
                    </div>
                    <span className="text-xs text-green-600 mt-2 font-medium">-5% vs mês anterior</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Páginas Impressas</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">43.500</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FileText size={20} /></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">Volume mensal atual</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Impacto Ambiental</p>
                            <h3 className="text-2xl font-bold text-green-600 mt-1">4.2</h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600"><Leaf size={20} /></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">Árvores "consumidas"</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Custo Médio/Página</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ 0,15</h3>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-600"><Printer size={20} /></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">Média da indústria: R$ 0,18</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Evolution Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Tendência de Impressão (Semestre)</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={PRINTING_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="pages" stroke="#ef4444" fillOpacity={1} fill="url(#colorPages)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Spenders Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Consumo por Departamento</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Setor</th>
                                    <th className="px-6 py-3 text-right">Custo Real</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {DEPT_SPEND.map((dept, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{dept.name}</td>
                                        <td className="px-6 py-4 text-right">
                                            R$ {dept.cost.toLocaleString('pt-BR')}
                                            <span className="text-xs text-gray-400 block"> / R$ {dept.limit} (Meta)</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`
                                                text-xs font-bold
                                                ${dept.status === 'Acima do Limite' ? 'text-red-500' :
                                                    dept.status === 'Econômico' ? 'text-green-500' : 'text-blue-500'}
                                            `}>
                                                {dept.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
