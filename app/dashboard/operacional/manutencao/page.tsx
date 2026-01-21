"use client";
import Link from "next/link";
import { ArrowLeft, Wrench, AlertTriangle, CheckCircle, Wallet } from "lucide-react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

// Mock Data
const TICKETS_BY_CATEGORY = [
    { name: 'Elétrica', value: 8, color: '#f59e0b' }, // Amber
    { name: 'Hidráulica', value: 5, color: '#3b82f6' }, // Blue
    { name: 'Ar Condicionado', value: 12, color: '#06b6d4' }, // Cyan
    { name: 'Mobiliário', value: 15, color: '#8b5cf6' }, // Purple
    { name: 'Predial/Alvenaria', value: 4, color: '#10b981' }, // Emerald
];

const RECENT_TICKETS = [
    { id: "CH-2024-089", title: "Ar Condicionado Sala 3B Pingando", cat: "Ar Condicionado", priority: "Alta", status: "Em Aberto", date: "21/05/2026", requester: "Prof. Ana" },
    { id: "CH-2024-088", title: "Projetor Lab 2 sem sinal", cat: "Elétrica", priority: "Crítica", status: "Em Andamento", date: "21/05/2026", requester: "Coord. João" },
    { id: "CH-2024-087", title: "Torneira Banheiro Masc. Térreo", cat: "Hidráulica", priority: "Média", status: "Concluído", date: "20/05/2026", requester: "Zeladoria" },
    { id: "CH-2024-086", title: "Cadeira quebrada Biblioteca", cat: "Mobiliário", priority: "Baixa", status: "Em Aberto", date: "19/05/2026", requester: "Bibl. Maria" },
    { id: "CH-2024-085", title: "Lâmpada queimada Corredor A", cat: "Elétrica", priority: "Baixa", status: "Concluído", date: "18/05/2026", requester: "Segurança" },
];

export default function ManutencaoPage() {
    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/operacional" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manutenção e Zeladoria</h1>
                    <p className="text-gray-500">Gestão de Ativos e Conservação Predial</p>
                </div>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Chamados Abertos</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Wrench size={20} /></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">3 novos hoje</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Críticos</p>
                            <h3 className="text-2xl font-bold text-red-600 mt-1">2</h3>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertTriangle size={20} /></div>
                    </div>
                    <span className="text-xs text-red-500 mt-2 font-medium">Requer atenção imediata</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Resolvidos (Mês)</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">45</h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600"><CheckCircle size={20} /></div>
                    </div>
                    <span className="text-xs text-green-600 mt-2">Alta produtividade</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Custo Reparos</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ 3.2k</h3>
                        </div>
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Wallet size={20} /></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">Acumulado do mês</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tables takes 2/3 */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Chamados Recentes</h3>
                        <button className="text-sm text-blue-600 font-medium hover:underline">Ver Todos</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">ID / Problema</th>
                                    <th className="px-6 py-3">Categoria</th>
                                    <th className="px-6 py-3">Prioridade</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {RECENT_TICKETS.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{ticket.title}</div>
                                            <div className="text-xs text-gray-400">{ticket.id} • {ticket.date}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{ticket.cat}</td>
                                        <td className="px-6 py-4">
                                            <span className={`
                                                px-2 py-1 rounded-md text-xs font-bold
                                                ${ticket.priority === 'Crítica' ? 'bg-red-100 text-red-700' :
                                                    ticket.priority === 'Alta' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-gray-100 text-gray-600'}
                                            `}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`
                                                inline-block w-2.5 h-2.5 rounded-full mr-2
                                                ${ticket.status === 'Concluído' ? 'bg-green-500' :
                                                    ticket.status === 'Em Andamento' ? 'bg-blue-500' :
                                                        'bg-gray-400'}
                                            `}></span>
                                            {ticket.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Chart takes 1/3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Por Categoria</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={TICKETS_BY_CATEGORY}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {TICKETS_BY_CATEGORY.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-500">
                        Maior incidência em <strong>Mobiliário</strong> e <strong>Ar Condicionado</strong>.
                    </div>
                </div>
            </div>
        </div>
    )
}
