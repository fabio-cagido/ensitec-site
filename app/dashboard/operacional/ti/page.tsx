"use client";
import Link from "next/link";
import { ArrowLeft, Wifi, Server, Monitor, ShieldAlert } from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const NETWORK_UPTIME = [
    { time: '08:00', ping: 12 },
    { time: '10:00', ping: 45 },
    { time: '12:00', ping: 25 },
    { time: '14:00', ping: 30 },
    { time: '16:00', ping: 15 },
    { time: '18:00', ping: 10 },
];

export default function TiPage() {
    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/operacional" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gestão de TI</h1>
                    <p className="text-gray-500">Monitoramento de Infraestrutura</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Link Principal</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">Online</h3>
                    <span className="text-xs text-gray-400 mt-2">Uptime 99.9%</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Chamados TI</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">5</h3>
                    <span className="text-xs text-gray-400 mt-2">2 Críticos</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Dispositivos</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">240</h3>
                    <span className="text-xs text-gray-400 mt-2">Conectados agora</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Backup</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">OK</h3>
                    <span className="text-xs text-gray-400 mt-2">Último: 03:00 AM</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Latência da Rede (ms)</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={NETWORK_UPTIME}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="ping" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
