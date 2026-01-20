"use client";

import { useState } from "react";
import {
    Users,
    Percent,
    GraduationCap,
    TrendingUp,
    TrendingDown,
    UserMinus,
    Smile,
    MapPin,
    HeartPulse,
    Users2
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { ClientFilterBar, ClientFilterState } from "./components/ClientFilterBar";
import Link from "next/link";

// --- MOCK DATA ---
const KPI_DATA = {
    totalStudents: 1250,
    occupancyRate: 85.4, // %
    scholarships: 312, // Count
    scholarshipPercentage: 24.9, // %
    nps: 72,
    churnRate: 1.2, // %
    healthScore: 8.8, // 0-10
    siblingsRate: 18.5, // % families with >1 student
    enemScore: 685, // Média Geral
    enemApprovals: 82 // % Aprovação
};

const OCCUPANCY_BY_SEGMENT = [
    { name: 'Infantil', capacity: 300, occupied: 280, rate: 93.3 },
    { name: 'Fund. I', capacity: 450, occupied: 400, rate: 88.9 },
    { name: 'Fund. II', capacity: 400, occupied: 320, rate: 80.0 },
    { name: 'Médio', capacity: 350, occupied: 250, rate: 71.4 },
];

const GENDER_DATA = [
    { name: 'Feminino', value: 650 },
    { name: 'Masculino', value: 600 },
];

const RACE_DATA = [
    { name: 'Branca', value: 500 },
    { name: 'Parda', value: 450 },
    { name: 'Preta', value: 200 },
    { name: 'Amarela', value: 80 },
    { name: 'Indígena', value: 20 },
];

const AGE_DATA = [
    { age: '2-5', count: 150 },
    { age: '6-10', count: 400 },
    { age: '11-14', count: 320 },
    { age: '15-18', count: 380 },
];

const INCOME_DATA = [
    { range: 'Até 3 SM', count: 200 },
    { range: '3-6 SM', count: 450 },
    { range: '6-10 SM', count: 350 },
    { range: '> 10 SM', count: 250 },
];

const GEO_DATA = [
    { name: 'Centro', value: 350 },
    { name: 'Jd. América', value: 280 },
    { name: 'Vila Nova', value: 200 },
    { name: 'Bela Vista', value: 150 },
    { name: 'Outros', value: 270 },
];

const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];
const PIE_COLORS = ['#3b82f6', '#ec4899']; // Blue, Pink for Gender

export default function ClientDashboardPage() {
    const [filters, setFilters] = useState<ClientFilterState | null>(null);

    // Filter Logic would go here (filtering the mock data based on 'filters' state)
    // For now, we display static mock data.

    return (
        <div className="space-y-8 pb-10">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestão de Clientes</h1>
                <p className="text-gray-500">Perfil do Aluno, Ocupação e Satisfação</p>
            </header>

            <ClientFilterBar onFilterChange={setFilters} />

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* 1. Total de Alunos */}
                <Link href="/dashboard/clientes/total-alunos" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +5%
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mt-4">Total de Alunos</p>
                            <h3 className="text-3xl font-bold text-gray-900">{KPI_DATA.totalStudents}</h3>
                        </div>
                    </div>
                </Link>


                {/* 2. Taxa de Ocupação */}
                <Link href="/dashboard/clientes/ocupacao" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <Percent className="w-6 h-6 text-emerald-600" />
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-full font-bold">Alta</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mt-4">Taxa de Ocupação</p>
                            <h3 className="text-3xl font-bold text-gray-900">{KPI_DATA.occupancyRate}%</h3>
                            <p className="text-xs text-gray-400 mt-1">Capacidade Utilizada</p>
                        </div>
                    </div>
                </Link>

                {/* 3. Health Score (CS) */}
                <Link href="/dashboard/clientes/health-score" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-pink-50 rounded-lg">
                                <HeartPulse className="w-6 h-6 text-pink-600" />
                            </div>
                            <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-bold">A+</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mt-4">Health Score (Família)</p>
                            <h3 className="text-3xl font-bold text-gray-900">{KPI_DATA.healthScore}</h3>
                            <p className="text-xs text-gray-400 mt-1">Engajamento + Frequência</p>
                        </div>
                    </div>
                </Link>

                {/* 4. NPS (MOVED) */}
                <Link href="/dashboard/clientes/nps" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-yellow-50 rounded-lg">
                                <Smile className="w-6 h-6 text-yellow-600" />
                            </div>
                            <span className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-full font-bold">Zona Qualidade</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mt-4">NPS (Satisfação)</p>
                            <h3 className="text-3xl font-bold text-gray-900">{KPI_DATA.nps}</h3>
                        </div>
                    </div>
                </Link>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 5. Bolsistas */}
                <Link href="/dashboard/clientes/bolsistas" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mt-4">Alunos Bolsistas</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-gray-900">{KPI_DATA.scholarships}</h3>
                                <span className="text-sm text-gray-500">({KPI_DATA.scholarshipPercentage}%)</span>
                            </div>
                        </div>
                    </div>
                </Link>


                {/* 6. Taxa de Irmãos */}
                <Link href="/dashboard/clientes/irmaos" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Users2 className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mt-4">Famílias com +1 Filho</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-gray-900">{KPI_DATA.siblingsRate}%</h3>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Fidelidade Alta</p>
                        </div>
                    </div>
                </Link>


                {/* 7. Evasão (MOVED) - Full width on small, 1/4 on large if needed or just part of another grid */}
                <Link href="/dashboard/clientes/evasao" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <UserMinus className="w-6 h-6 text-red-600" />
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-full font-bold">Baixa</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mt-4">Taxa de Evasão</p>
                            <h3 className="text-3xl font-bold text-gray-900">{KPI_DATA.churnRate}%</h3>
                        </div>
                    </div>
                </Link>
            </div >


            {/* CHARTS SECTION */}
            < div className="grid grid-cols-1 lg:grid-cols-2 gap-8" >

                {/* Ocupação por Segmento - Click to see details */}
                <Link href="/dashboard/clientes/ocupacao" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer block">
                    <h3 className="font-bold text-gray-900 mb-6">Taxa de Ocupação por Segmento</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={OCCUPANCY_BY_SEGMENT} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip />
                                <Bar dataKey="rate" name="Ocupação (%)" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-emerald-500 mt-2 text-center">Clique para ver detalhes →</p>
                </Link>

                {/* Geographic Distribution - Click to see details */}
                <Link href="/dashboard/clientes/perfil-aluno" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer block">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Distribuição Geográfica (Bairros)</h3>
                        <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={GEO_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" name="Alunos" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-blue-500 mt-2 text-center">Clique para ver detalhes →</p>
                </Link>

                {/* Perfil: Gênero - Click to see details */}
                <Link href="/dashboard/clientes/perfil-aluno" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer block">
                    <h3 className="font-bold text-gray-900 mb-6">Perfil: Gênero</h3>
                    <div className="h-72 w-full flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={GENDER_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {GENDER_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-blue-500 mt-2 text-center">Clique para ver detalhes →</p>
                </Link>

                {/* Perfil: Cor/Raça - Click to see details */}
                <Link href="/dashboard/clientes/perfil-aluno" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer block">
                    <h3 className="font-bold text-gray-900 mb-6">Perfil: Cor/Raça</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={RACE_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" name="Alunos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-blue-500 mt-2 text-center">Clique para ver detalhes →</p>
                </Link>

                {/* Perfil: Renda Familiar - Click to see details */}
                <Link href="/dashboard/clientes/perfil-aluno" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer block">
                    <h3 className="font-bold text-gray-900 mb-6">Perfil Socioeconômico (Renda)</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={INCOME_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" name="Famílias" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-blue-500 mt-2 text-center">Clique para ver detalhes →</p>
                </Link>

                {/* Perfil: Faixa Etária - Click to see details */}
                <Link href="/dashboard/clientes/perfil-aluno" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer block lg:col-span-1">
                    <h3 className="font-bold text-gray-900 mb-6">Distribuição Etária</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={AGE_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="age" label={{ value: 'Idade (Anos)', position: 'insideBottom', offset: -5 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" name="Alunos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-blue-500 mt-2 text-center">Clique para ver detalhes →</p>
                </Link>

            </div>
        </div>
    );
}

