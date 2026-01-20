"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, GraduationCap } from "lucide-react";
import Link from "next/link";
import { MOCK_SCHOLARSHIPS } from "@/app/lib/mock-data";
import { ClientFilterBar, ClientFilterState } from "../components/ClientFilterBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function BolsistasPage() {
    const [filters, setFilters] = useState<ClientFilterState | null>(null);

    // Filtrar dados baseado nos filtros ativos
    const filteredData = useMemo(() => {
        let data = MOCK_SCHOLARSHIPS;

        if (filters) {
            data = data.filter(item => {
                if (filters.unidades.length > 0 && !filters.unidades.includes(item.unitId)) return false;
                if (filters.segmentos.length > 0 && !filters.segmentos.includes(item.segmentId)) return false;
                if (filters.anos.length > 0 && !filters.anos.includes(item.year)) return false;
                return true;
            });
        }

        return data;
    }, [filters]);

    // Agregar por unidade
    const byUnit = useMemo(() => {
        const map = new Map();
        filteredData.forEach(item => {
            if (!map.has(item.unitId)) {
                map.set(item.unitId, { id: item.unitId, name: item.unitLabel, value: 0 });
            }
            map.get(item.unitId).value += item.value;
        });
        return Array.from(map.values());
    }, [filteredData]);

    // Agregar por segmento
    const bySegment = useMemo(() => {
        const map = new Map();
        filteredData.forEach(item => {
            if (!map.has(item.segmentId)) {
                map.set(item.segmentId, { id: item.segmentId, name: item.segmentLabel, value: 0 });
            }
            map.get(item.segmentId).value += item.value;
        });
        return Array.from(map.values());
    }, [filteredData]);

    const total = filteredData.reduce((sum, item) => sum + item.value, 0);
    const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/clientes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Alunos Bolsistas</h1>
                    <p className="text-gray-500">Distribuição de alunos com bolsas de estudo</p>
                </div>
            </div>

            {/* Filtros Principais */}
            <ClientFilterBar onFilterChange={setFilters} />

            {/* KPI Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-8 rounded-3xl shadow-lg text-white">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-purple-100 text-sm font-medium">Total de Bolsistas</p>
                        <h2 className="text-5xl font-bold">{total}</h2>
                    </div>
                </div>
                <p className="text-purple-100">Representando 24.9% do total de alunos</p>
            </div>

            {/* Mensagem quando não há dados */}
            {filteredData.length === 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                    <p className="text-yellow-800">
                        Nenhum dado encontrado para os filtros selecionados.
                    </p>
                </div>
            )}

            {/* Gráficos */}
            {filteredData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Por Unidade */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6">Bolsistas por Unidade</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={byUnit}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" name="Bolsistas" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Por Segmento - Pie Chart */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6">Distribuição por Segmento</h3>
                        <div className="h-80 flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={bySegment}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {bySegment.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Insights no final */}
            {filteredData.length > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                    <h3 className="font-bold text-blue-900 mb-3">💡 Insights</h3>
                    <ul className="space-y-2 text-blue-800">
                        <li dangerouslySetInnerHTML={{ __html: `Total de <strong>${total} alunos bolsistas</strong> nos filtros selecionados.` }} />
                        <li dangerouslySetInnerHTML={{ __html: "Maior concentração no segmento <strong>Médio</strong>." }} />
                        <li dangerouslySetInnerHTML={{ __html: "Programa de bolsas contribui para a <strong>inclusão social</strong>." }} />
                    </ul>
                </div>
            )}
        </div>
    );
}
