"use client";

import { useState, useEffect } from "react";
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
    Users2,
    Loader2
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
import PageHeader from "@/components/dashboard/PageHeader";

const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];
const PIE_COLORS = ['#3b82f6', '#ec4899'];

export default function ClientDashboardPage() {
    const [filters, setFilters] = useState<ClientFilterState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (filters) {
                    if (filters.unidades.length) params.append('unidades', filters.unidades.join(','));
                    if (filters.segmentos.length) params.append('segmentos', filters.segmentos.join(','));
                    if (filters.anos.length) params.append('anos', filters.anos.join(','));
                }
                const res = await fetch(`/api/dashboard/clientes?${params.toString()}`);
                if (!res.ok) throw new Error('Falha ao carregar dados de clientes');
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [filters]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-gray-600 font-medium">Carregando dados de clientes...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-lg text-center">
                    <h2 className="text-red-700 font-bold text-xl mb-2">Erro no Carregamento</h2>
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const { kpis, occupancyBySegment, genderData, geoData, raceData, ageData, incomeData } = data;

    return (
        <div className="space-y-8 pb-10">
            <PageHeader
                title="Gestão de Clientes"
                subtitle="Perfil do Aluno, Ocupação e Satisfação"
                showLogo={true}
            />

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
                                <TrendingUp className="w-3 h-3" /> {kpis.totalStudentsGrowth}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mt-4">Total de Alunos</p>
                            <h3 className="text-3xl font-bold text-gray-900">{kpis.totalStudents}</h3>
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
                            <h3 className="text-3xl font-bold text-gray-900">{kpis.occupancyRate}%</h3>
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
                            <h3 className="text-3xl font-bold text-gray-900">{kpis.healthScore}</h3>
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
                            <span className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-full font-bold">{kpis.npsGrowth}</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mt-4">NPS (Satisfação)</p>
                            <h3 className="text-3xl font-bold text-gray-900">{kpis.nps}</h3>
                        </div>
                    </div>
                </Link>
            </div >


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
                                <h3 className="text-3xl font-bold text-gray-900">{kpis.scholarships}</h3>
                                <span className="text-sm text-gray-500">({kpis.scholarshipPercentage}%)</span>
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
                                <h3 className="text-3xl font-bold text-gray-900">{kpis.siblingPercentage}%</h3>
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
                            <h3 className="text-3xl font-bold text-gray-900">{kpis.churnRate}%</h3>
                        </div>
                    </div>
                </Link>
            </div >


            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Ocupação por Segmento - Click to see details */}
                <Link href="/dashboard/clientes/ocupacao" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer block">
                    <h3 className="font-bold text-gray-900 mb-6">Taxa de Ocupação por Turma</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={occupancyBySegment} layout="vertical" margin={{ left: 20 }}>
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
                        <h3 className="font-bold text-gray-900">Distribuição Geográfica (Cidades)</h3>
                        <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={geoData}>
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
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {genderData.map((entry: any, index: number) => (
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
                            <BarChart data={raceData}>
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
                            <BarChart data={incomeData}>
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
                            <BarChart data={ageData}>
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
        </div >
    );
}

