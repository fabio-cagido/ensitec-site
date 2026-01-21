"use client";
import Link from "next/link";
import { ArrowLeft, Clock, MessageSquare, CheckCircle, UserPlus } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Mock Data
const SLA_TREND = [
    { day: 'Seg', recebidos: 45, resolvidos: 40 },
    { day: 'Ter', recebidos: 52, resolvidos: 48 },
    { day: 'Qua', recebidos: 38, resolvidos: 38 },
    { day: 'Qui', recebidos: 42, resolvidos: 45 }, // Resolvendo backlog
    { day: 'Sex', recebidos: 35, resolvidos: 32 },
];

const SERVICE_TYPE = [
    { type: 'Matrícula/Rematrícula', sla_avg: '2.5 dias', volume: 'Alta', status: 'Atenção' },
    { type: 'Histórico Escolar', sla_avg: '5.0 dias', volume: 'Média', status: 'Normal' },
    { type: 'Declarações', sla_avg: '0.2 dias', volume: 'Alta', status: 'Ótimo' },
    { type: 'Financeiro/Boletos', sla_avg: '1.2 dias', volume: 'Alta', status: 'Bom' },
    { type: 'Agendamento Coord.', sla_avg: '0.5 dias', volume: 'Baixa', status: 'Ótimo' },
];

export default function SecretariaPage() {
    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/operacional" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">SLA da Secretaria</h1>
                    <p className="text-gray-500">Tempo de Resposta e Satisfação</p>
                </div>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Tempo Médio (SLA)</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">1.8 dias</h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600"><Clock size={20} /></div>
                    </div>
                    <span className="text-xs text-green-600 mt-2 font-medium">Meta: &lt; 2.0 dias</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Solicitações Hoje</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">45</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><MessageSquare size={20} /></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">12 aguardando triagem</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Taxa de Resolução</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">94%</h3>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><CheckCircle size={20} /></div>
                    </div>
                    <span className="text-xs text-indigo-600 mt-2">1ª Interação</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Novas Matrículas</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><UserPlus size={20} /></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">Esta semana</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Fluxo de Atendimento (Semanal)</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={SLA_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <Bar dataKey="recebidos" name="Recebidos" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="resolvidos" name="Resolvidos" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Performance por Tipo</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Serviço</th>
                                    <th className="px-6 py-3">SLA Real</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {SERVICE_TYPE.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {item.type}
                                            <span className="block text-xs text-gray-400 font-normal">Vol: {item.volume}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{item.sla_avg}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`
                                                text-xs font-bold px-2 py-1 rounded-full
                                                ${item.status === 'Atenção' ? 'bg-red-100 text-red-600' :
                                                    item.status === 'Ótimo' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}
                                            `}>
                                                {item.status}
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
