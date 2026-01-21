"use client";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, UserCheck, AlertOctagon, Car } from "lucide-react";

export default function SegurancaPage() {
    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/operacional" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Segurança e Acesso</h1>
                    <p className="text-gray-500">Controle de Portaria e Monitoramento</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Pessoas no Campus</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">842</h3>
                    <span className="text-xs text-gray-400 mt-2">Atualizado há 1 min</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Alertas</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">0</h3>
                    <span className="text-xs text-green-600 mt-2">Sem incidentes</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Visitantes</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
                    <span className="text-xs text-gray-400 mt-2">Identificados</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Status Portões</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">Fechados</h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Registro de Acessos Recentes</h3>
                    <span className="text-sm text-gray-400">Última hora</span>
                </div>

                <div className="space-y-4">
                    {[
                        { time: '14:45', name: 'Mariana Silva (Aluno)', type: 'Entrada', gate: 'Portaria Principal' },
                        { time: '14:42', name: 'João Santos (Prof)', type: 'Saída', gate: 'Estacionamento' },
                        { time: '14:38', name: 'Entregador (Visitante)', type: 'Entrada', gate: 'Serviço' },
                        { time: '14:30', name: 'Pedro Costa (Aluno)', type: 'Entrada', gate: 'Portaria Principal' },
                    ].map((log, i) => (
                        <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-4">
                                <div className="text-sm font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{log.time}</div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{log.name}</p>
                                    <p className="text-xs text-gray-500">{log.gate}</p>
                                </div>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${log.type === 'Entrada' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {log.type}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
