"use client";
import Link from "next/link";
import { ArrowLeft, UserX, UserCheck, GraduationCap, AlertCircle } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Mock Data
const ABSENCE_REASON = [
    { reason: 'Saúde', count: 12 },
    { reason: 'Pessoal', count: 5 },
    { reason: 'Trânsito', count: 3 },
    { reason: 'Outros', count: 2 },
];

export default function DocentesPage() {
    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/operacional" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Absenteísmo Docente</h1>
                    <p className="text-gray-500">Gestão de Faltas e Substituições</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Taxa de Absenteísmo</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">2.4%</h3>
                    <span className="text-xs text-green-600 mt-2">Abaixo da média (3.0%)</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Substituições Hoje</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">3</h3>
                    <span className="text-xs text-gray-400 mt-2">Cobertura 100%</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Atestados (Mês)</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">15</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Custo Subs.</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ 1.2k</h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Motivos de Ausência</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ABSENCE_REASON} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="reason" type="category" width={80} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
