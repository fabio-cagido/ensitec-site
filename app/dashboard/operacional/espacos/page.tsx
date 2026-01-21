"use client";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, Clock, Users, Building2 } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

// Mock Data
const OCCUPANCY_HOURLY = [
    { hour: '07h', labs: 20, salas: 85, quadras: 10 },
    { hour: '08h', labs: 65, salas: 95, quadras: 40 },
    { hour: '09h', labs: 85, salas: 90, quadras: 60 },
    { hour: '10h', labs: 90, salas: 40, quadras: 85 }, // Recreio/Intervalo
    { hour: '11h', labs: 75, salas: 95, quadras: 50 },
    { hour: '12h', labs: 15, salas: 20, quadras: 10 },
    { hour: '13h', labs: 30, salas: 75, quadras: 30 },
    { hour: '14h', labs: 60, salas: 85, quadras: 50 },
    { hour: '15h', labs: 70, salas: 80, quadras: 60 },
    { hour: '16h', labs: 50, salas: 60, quadras: 80 },
];

const SPACES_LIST = [
    { id: 1, name: "Laboratório de Química", type: "Laboratório", capacity: 30, avg_occupancy: "82%", status: "Ocupado" },
    { id: 2, name: "Sala 3B (Ensino Médio)", type: "Sala de Aula", capacity: 45, avg_occupancy: "94%", status: "Ocupado" },
    { id: 3, name: "Quadra Poliesportiva 1", type: "Esportes", capacity: 100, avg_occupancy: "65%", status: "Livre" },
    { id: 4, name: "Auditório Principal", type: "Auditório", capacity: 200, avg_occupancy: "15%", status: "Livre" },
    { id: 5, name: "Sala de Informática 1", type: "Laboratório", capacity: 25, avg_occupancy: "88%", status: "Em Manutenção" },
    { id: 6, name: "Biblioteca Central", type: "Estudo", capacity: 80, avg_occupancy: "45%", status: "Livre" },
];

export default function EspacosPage() {
    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/operacional" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Ocupação de Espaços</h1>
                    <p className="text-gray-500">Gestão Eficiente de Salas e Laboratórios</p>
                </div>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Taxa Global de Ocupação</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">78%</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><LayoutGrid size={20} /></div>
                    </div>
                    <span className="text-xs text-green-600 mt-2 font-medium">Dentro da meta (75-85%)</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Horário de Pico</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">10:00</h3>
                        </div>
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Clock size={20} /></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">Maior fluxo em áreas comuns</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Salas Ociosas</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">4</h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600"><Building2 size={20} /></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">Disponíveis agora</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Capacidade Total</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">1.250</h3>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Users size={20} /></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">Alunos simultâneos</span>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Ocupação Média por Horário (%)</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={OCCUPANCY_HOURLY} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend verticalAlign="top" height={36} iconType="circle" />
                            <Bar dataKey="salas" name="Salas de Aula" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="labs" name="Laboratórios" stackId="a" fill="#8b5cf6" />
                            <Bar dataKey="quadras" name="Áreas Comuns" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Status dos Ambientes</h3>
                    <button className="text-sm text-blue-600 font-medium hover:underline">Ver Mapa Completo</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Ambiente</th>
                                <th className="px-6 py-3">Tipo</th>
                                <th className="px-6 py-3">Capacidade</th>
                                <th className="px-6 py-3">Ocupação Média</th>
                                <th className="px-6 py-3 text-right">Status Atual</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {SPACES_LIST.map((space) => (
                                <tr key={space.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{space.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{space.type}</td>
                                    <td className="px-6 py-4 text-gray-500">{space.capacity} pessoas</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${parseInt(space.avg_occupancy) > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                    style={{ width: space.avg_occupancy }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">{space.avg_occupancy}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`
                                            px-2 py-1 rounded-full text-xs font-bold
                                            ${space.status === 'Livre' ? 'bg-green-100 text-green-700' :
                                                space.status === 'Ocupado' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'}
                                        `}>
                                            {space.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
