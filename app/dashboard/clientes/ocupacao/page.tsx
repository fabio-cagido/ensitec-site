"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { MOCK_OCCUPANCY } from "@/app/lib/mock-data";
import { ClientFilterBar, ClientFilterState } from "../components/ClientFilterBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Componente Gauge Velocímetro - Layout melhorado
function SpeedometerGauge({ percentage }: { percentage: number }) {
    const clampedValue = Math.min(Math.max(percentage, 0), 100);

    // Centro e dimensões
    const cx = 100;
    const cy = 90;
    const radius = 70;

    // Ângulo: 0% começa em 180° (esquerda), 100% termina em 0° (direita)
    // Arco de 180 graus (semicírculo)
    const needleAngle = 180 - (clampedValue / 100) * 180;

    // Converter para radianos
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    // Ponta do ponteiro
    const needleLength = 55;
    const needleX = cx + needleLength * Math.cos(toRadians(needleAngle));
    const needleY = cy - needleLength * Math.sin(toRadians(needleAngle));

    const getColor = () => {
        if (clampedValue >= 85) return '#10b981';
        if (clampedValue >= 70) return '#f59e0b';
        if (clampedValue >= 50) return '#f97316';
        return '#ef4444';
    };

    const getStatus = () => {
        if (clampedValue >= 85) return 'Excelente';
        if (clampedValue >= 70) return 'Bom';
        if (clampedValue >= 50) return 'Regular';
        return 'Crítico';
    };

    return (
        <div className="flex flex-col items-center">
            <svg width="200" height="120" viewBox="0 0 200 120">
                {/* Arco Vermelho (0-50%): 180° a 90° */}
                <path
                    d="M 30 90 A 70 70 0 0 1 100 20"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="14"
                    strokeLinecap="round"
                />

                {/* Arco Laranja (50-70%): 90° a 54° */}
                <path
                    d="M 100 20 A 70 70 0 0 1 141 31"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="14"
                />

                {/* Arco Amarelo (70-85%): 54° a 27° */}
                <path
                    d="M 141 31 A 70 70 0 0 1 162 52"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="14"
                />

                {/* Arco Verde (85-100%): 27° a 0° */}
                <path
                    d="M 162 52 A 70 70 0 0 1 170 90"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="14"
                    strokeLinecap="round"
                />

                {/* Ponteiro */}
                <line
                    x1={cx}
                    y1={cy}
                    x2={needleX}
                    y2={needleY}
                    stroke="#1f2937"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{ transition: 'all 0.7s ease-out' }}
                />

                {/* Centro do ponteiro */}
                <circle cx={cx} cy={cy} r="8" fill="#1f2937" />
                <circle cx={cx} cy={cy} r="4" fill="white" />
            </svg>

            {/* Labels abaixo do gauge */}
            <div className="flex justify-between w-full px-4 -mt-1">
                <span className="text-xs text-gray-400 font-medium">0%</span>
                <span className="text-xs text-gray-400 font-medium">100%</span>
            </div>

            {/* Valor e Status */}
            <div className="text-center mt-3">
                <span className="text-4xl font-bold text-gray-800">{clampedValue.toFixed(1)}%</span>
                <div className="mt-2">
                    <span
                        className="text-sm font-bold px-4 py-1.5 rounded-full"
                        style={{ backgroundColor: `${getColor()}20`, color: getColor() }}
                    >
                        {getStatus()}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function OcupacaoPage() {
    const [filters, setFilters] = useState<ClientFilterState | null>(null);

    // Dados filtrados
    const filteredData = useMemo(() => {
        if (!filters) return MOCK_OCCUPANCY;
        return MOCK_OCCUPANCY.filter(item => {
            if (filters.unidades.length > 0 && !filters.unidades.includes(item.unitId)) return false;
            if (filters.segmentos.length > 0 && !filters.segmentos.includes(item.segmentId)) return false;
            if (filters.anos.length > 0 && !filters.anos.includes(item.year)) return false;
            return true;
        });
    }, [filters]);

    // Média baseada nos filtros
    const avgOcupacao = useMemo(() => {
        if (filteredData.length === 0) return 0;
        const total = filteredData.reduce((sum, item) => sum + item.value, 0);
        return Number((total / filteredData.length).toFixed(1));
    }, [filteredData]);

    // Agregações
    const byUnit = useMemo(() => {
        const map = new Map();
        filteredData.forEach(item => {
            if (!map.has(item.unitId)) {
                map.set(item.unitId, { id: item.unitId, name: item.unitLabel, value: 0, count: 0 });
            }
            const entry = map.get(item.unitId);
            entry.value += item.value;
            entry.count += 1;
        });
        return Array.from(map.values()).map(item => ({
            id: item.id, name: item.name, value: Number((item.value / item.count).toFixed(1))
        }));
    }, [filteredData]);

    const bySegment = useMemo(() => {
        const map = new Map();
        filteredData.forEach(item => {
            if (!map.has(item.segmentId)) {
                map.set(item.segmentId, { name: item.segmentLabel, value: 0, count: 0 });
            }
            const entry = map.get(item.segmentId);
            entry.value += item.value;
            entry.count += 1;
        });
        return Array.from(map.values()).map(item => ({
            name: item.name, value: Number((item.value / item.count).toFixed(1))
        })).sort((a, b) => b.value - a.value);
    }, [filteredData]);

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/clientes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Taxa de Ocupação</h1>
                    <p className="text-gray-500">Percentual de capacidade utilizada por unidade e segmento</p>
                </div>
            </div>

            {/* Filtros */}
            <ClientFilterBar onFilterChange={setFilters} />

            {/* Cards: Verde simples + Velocímetro */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card Verde Simples */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <p className="text-emerald-100 text-sm font-medium">Taxa de Ocupação</p>
                    </div>
                    <h2 className="text-5xl font-bold">{avgOcupacao}%</h2>
                    <p className="text-emerald-100 text-sm mt-2">Capacidade utilizada</p>
                </div>

                {/* Velocímetro */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                    <SpeedometerGauge percentage={avgOcupacao} />
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Ocupação por Unidade</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={byUnit} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={120} />
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Bar dataKey="value" name="Ocupação (%)" fill="#10b981" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Ocupação por Segmento</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={bySegment}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Bar dataKey="value" name="Ocupação (%)" fill="#10b981" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Insights no final */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-3">💡 Insights</h3>
                <ul className="space-y-2 text-blue-800">
                    <li dangerouslySetInnerHTML={{ __html: "Taxa de ocupação <strong>acima de 85%</strong> na maioria dos segmentos." }} />
                    <li dangerouslySetInnerHTML={{ __html: "O segmento <strong>Infantil</strong> apresenta a maior taxa (93.3%)." }} />
                    <li dangerouslySetInnerHTML={{ __html: "Oportunidade de expansão no segmento <strong>Médio</strong> (71.4%)." }} />
                </ul>
            </div>
        </div>
    );
}
