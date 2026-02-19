"use client";

import { useEffect, useState } from "react";
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
import Link from "next/link";
import { ArrowLeft, Users, Home, TrendingUp, Heart } from "lucide-react";
import { ClientFilterBar, ClientFilterState } from "../components/ClientFilterBar";

export default function IrmaosPage() {
    const [stats, setStats] = useState({
        totalFamilies: 800,
        familiesWithMultiple: 256,
        penetrationRate: 32
    });
    const [comparisonData, setComparisonData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ClientFilterState | null>(null);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('metric', 'siblings');
        if (filters) {
            if (filters.unidades.length) params.append('unidades', filters.unidades.join(','));
            if (filters.segmentos.length) params.append('segmentos', filters.segmentos.join(','));
        }

        const fetchMain = fetch(`/api/dashboard/analytics?${params.toString()}`).then(res => res.json());

        // Custom mock for siblings comparison
        let mockComp = [
            { name: 'Unidade Centro', Taxa: 35 },
            { name: 'Unidade Sul', Taxa: 28 },
            { name: 'Unidade Norte', Taxa: 24 },
        ];

        if (filters && filters.unidades.length > 0) {
            const unitMap: Record<string, string> = { 'u1': 'Centro', 'u2': 'Norte', 'u3': 'Sul' };
            const selected = filters.unidades.map(u => unitMap[u]);
            mockComp = mockComp.filter(m => selected.some(s => m.name.includes(s)));
        }

        fetchMain
            .then((data: any) => {
                if (data && data.length > 0) {
                    const totalMultiple = data.reduce((acc: number, curr: any) => acc + curr.value, 0);
                    const totalFamilies = 1000;
                    setStats({
                        totalFamilies: totalFamilies,
                        familiesWithMultiple: totalMultiple,
                        penetrationRate: (totalMultiple / totalFamilies) * 100
                    });
                }
                setComparisonData(mockComp);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [filters]);

    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (stats.penetrationRate / 100) * circumference;

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/clientes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Famílias com Irmãos</h1>
                    <p className="text-gray-500 text-sm">Índice de retenção por núcleo familiar</p>
                </div>
            </div>

            <ClientFilterBar onFilterChange={setFilters} />

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Núcleos Familiares</span>
                    <p className="text-3xl font-black text-gray-900 mt-2">{stats.totalFamilies}</p>
                    <p className="text-xs text-gray-400 font-bold mt-1 flex items-center gap-1">
                        <Home size={14} className="text-blue-500" /> Total de famílias cadastradas
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-emerald-500">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Famílias com +1 Filho</span>
                    <p className="text-3xl font-black text-emerald-600 mt-2">{stats.familiesWithMultiple}</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                        <Users size={14} /> Fidelidade familiar comprovada
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Potencial de LTV</span>
                    <p className="text-3xl font-black text-indigo-600 mt-2">2.4x</p>
                    <p className="text-xs text-indigo-600 font-bold mt-1 flex items-center gap-1">
                        <TrendingUp size={14} /> vs famílias de filho único
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Giant Progress Circle */}
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[450px]">
                    <div className="relative">
                        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                            <circle cx="100" cy="100" r={radius} stroke="#f3f4f6" strokeWidth="15" fill="transparent" />
                            <circle cx="100" cy="100" r={radius} stroke="#6366f1" strokeWidth="15" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <p className="text-4xl font-black text-indigo-600 tracking-tighter">{stats.penetrationRate.toFixed(1)}%</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Geral</p>
                        </div>
                    </div>
                    <div className="mt-8 text-center max-w-xs">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold mb-2">
                            <Heart size={12} /> Confiança Institucional
                        </div>
                        <p className="text-gray-500 text-[11px] leading-tight">Retenção de longo prazo e estabilidade familiar.</p>
                    </div>
                </div>

                {/* Comparison Bar Chart */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="mb-8">
                        <h3 className="font-bold text-gray-900">Penetração por Unidade</h3>
                        <p className="text-xs text-gray-400">Comparativo do percentual de famílias multigeracionais</p>
                    </div>
                    <div className="flex-grow">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={comparisonData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="Taxa" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
