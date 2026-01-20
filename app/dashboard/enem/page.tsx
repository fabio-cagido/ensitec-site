"use client";

import { useState } from "react";
import { ArrowLeft, GraduationCap, TrendingUp, BookOpen, Award } from "lucide-react";
import Link from "next/link";
import { ClientFilterBar, ClientFilterState } from "../clientes/components/ClientFilterBar";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';

// Dados Históricos (Estático para todas as views)
const HISTORIC_DATA = [
    { year: '2020', score: 640 },
    { year: '2021', score: 655 },
    { year: '2022', score: 648 },
    { year: '2023', score: 672 },
    { year: '2024', score: 685 },
];

// Dados Mock por Ano
const MOCK_DB: Record<string, { kpis: any; area: any[] }> = {
    "2024": {
        kpis: { score: 685, approval: 82, essay: 840, growth: "+13", growthLabel: "pontos vs 2023" },
        area: [
            { subject: 'Matemática', A: 720, B: 580, fullMark: 1000 },
            { subject: 'Linguagens', A: 650, B: 550, fullMark: 1000 },
            { subject: 'Ciências Natureza', A: 680, B: 540, fullMark: 1000 },
            { subject: 'Ciências Humanas', A: 690, B: 560, fullMark: 1000 },
            { subject: 'Redação', A: 840, B: 600, fullMark: 1000 },
        ]
    },
    "2023": {
        kpis: { score: 672, approval: 78, essay: 820, growth: "+24", growthLabel: "pontos vs 2022" },
        area: [
            { subject: 'Matemática', A: 700, B: 570, fullMark: 1000 },
            { subject: 'Linguagens', A: 640, B: 540, fullMark: 1000 },
            { subject: 'Ciências Natureza', A: 660, B: 530, fullMark: 1000 },
            { subject: 'Ciências Humanas', A: 680, B: 550, fullMark: 1000 },
            { subject: 'Redação', A: 820, B: 590, fullMark: 1000 },
        ]
    },
    "2022": {
        kpis: { score: 648, approval: 75, essay: 800, growth: "-7", growthLabel: "pontos vs 2021" },
        area: [
            { subject: 'Matemática', A: 680, B: 560, fullMark: 1000 },
            { subject: 'Linguagens', A: 630, B: 530, fullMark: 1000 },
            { subject: 'Ciências Natureza', A: 640, B: 520, fullMark: 1000 },
            { subject: 'Ciências Humanas', A: 660, B: 540, fullMark: 1000 },
            { subject: 'Redação', A: 800, B: 580, fullMark: 1000 },
        ]
    }
};

export default function EnemPage() {
    const [filters, setFilters] = useState<ClientFilterState | null>(null);

    // Lógica de Filtro Ativo
    const currentYear = filters?.anos?.[0] || "2024";
    const currentData = MOCK_DB[currentYear as keyof typeof MOCK_DB] || MOCK_DB["2024"];

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Enem</h1>
                    <p className="text-gray-500">Desempenho no Exame Nacional do Ensino Médio ({currentYear})</p>
                </div>
            </div>

            <ClientFilterBar onFilterChange={setFilters} />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 rounded-3xl shadow-lg text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-indigo-100 text-sm font-medium">Média Geral</p>
                            <h2 className="text-4xl font-bold">{currentData.kpis.score}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-100 bg-indigo-600/30 px-3 py-1 rounded-full w-fit">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">{currentData.kpis.growth} {currentData.kpis.growthLabel}</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Award className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Aprovação Sisu (1ª Chamada)</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{currentData.kpis.approval}%</h3>
                    <p className="text-xs text-green-600 mt-1 font-medium">Superior à média nacional</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Nota Média Redação</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{currentData.kpis.essay}</h3>
                    <p className="text-xs text-gray-500 mt-1">Consistência alta</p>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Evolução Histórica - Mantém estático para contexto, mas destaca o ano atual se possível (opcional) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Evolução da Nota Média</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={HISTORIC_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" />
                                <YAxis domain={[500, 800]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    name="Média Escola"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ r: 6, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Radar Chart - Dinâmico por Ano */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900">Desempenho por Área ({currentYear})</h3>
                        <div className="flex gap-4 text-xs">
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-indigo-500"></span> Escola
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-gray-300"></span> Média Nacional
                            </div>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={90} data={currentData.area}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 1000]} />
                                <Radar
                                    name="Escola"
                                    dataKey="A"
                                    stroke="#6366f1"
                                    fill="#6366f1"
                                    fillOpacity={0.5}
                                />
                                <Radar
                                    name="Média Nacional"
                                    dataKey="B"
                                    stroke="#d1d5db"
                                    fill="#d1d5db"
                                    fillOpacity={0.3}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Insights */}
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg">
                <h3 className="font-bold text-indigo-900 mb-3">💡 Insights Pedagógicos ({currentYear})</h3>
                <ul className="space-y-2 text-indigo-800">
                    <li>• Destaque absoluto em <strong>Redação</strong> ({currentData.kpis.essay} pts), 40% acima da média nacional.</li>
                    <li>• Área de <strong>Matemática</strong> contribuiu significativamente para a média geral de {currentData.kpis.score}.</li>
                </ul>
            </div>
        </div>
    );
}
