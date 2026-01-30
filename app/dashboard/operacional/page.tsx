"use client";

import { useState, useEffect } from "react";
import {
    LayoutGrid,
    Clock,
    Wrench,
    UserX,
    Wifi,
    Printer,
    Utensils,
    ShieldCheck,
    ArrowRight,
    TrendingUp,
    Loader2
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Area,
    AreaChart,
    ComposedChart,
    Legend
} from 'recharts';

const ICON_MAP: Record<string, any> = {
    espacos: LayoutGrid,
    secretaria: Clock,
    manutencao: Wrench,
    docentes: UserX,
    ti: Wifi,
    impressao: Printer,
    alimentacao: Utensils,
    seguranca: ShieldCheck,
};

const COLOR_MAP: Record<string, string> = {
    espacos: "blue",
    secretaria: "green",
    manutencao: "orange",
    docentes: "purple",
    ti: "cyan",
    impressao: "red",
    alimentacao: "yellow",
    seguranca: "emerald",
};

const PATH_MAP: Record<string, string> = {
    espacos: "/dashboard/operacional/espacos",
    secretaria: "/dashboard/operacional/secretaria",
    manutencao: "/dashboard/operacional/manutencao",
    docentes: "/dashboard/operacional/docentes",
    ti: "/dashboard/operacional/ti",
    impressao: "/dashboard/operacional/impressao",
    alimentacao: "/dashboard/operacional/alimentacao",
    seguranca: "/dashboard/operacional/seguranca",
};

const TITLE_MAP: Record<string, string> = {
    espacos: "Eficiência de Espaço",
    secretaria: "SLA de Atendimento",
    manutencao: "Manutenção",
    docentes: "Absenteísmo Docente",
    ti: "Gestão de TI",
    impressao: "Custos de Impressão",
    alimentacao: "Alimentação",
    seguranca: "Segurança",
};

const SUBTEXT_MAP: Record<string, string> = {
    espacos: "Ocupação de Salas",
    secretaria: "Secretaria",
    manutencao: "3 Críticos",
    docentes: "Substituições",
    ti: "Uptime Rede/Wi-Fi",
    impressao: "Custo Médio/Aluno",
    alimentacao: "Taxa de Desperdício",
    seguranca: "Fluxo Controlado",
};

export default function OperationalPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/dashboard/operacional');
                if (!res.ok) throw new Error('Falha ao carregar dados operacionais');
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-gray-600 font-medium">Carregando indicadores operacionais...</p>
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

    const { kpis, costHistory, ticketPerformance } = data;

    return (
        <div className="space-y-8 pb-10">
            <PageHeader
                title="Dashboard Operacional"
                subtitle="Eficiência, Manutenção e Recursos"
                showLogo={true}
            />

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(kpis).map(([key, value]: [string, any]) => {
                    const Icon = ICON_MAP[key] || LayoutGrid;
                    const color = COLOR_MAP[key] || "blue";
                    return (
                        <Link href={PATH_MAP[key] || "#"} key={key} className="block group">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full hover:shadow-md transition-all hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{TITLE_MAP[key]}</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
                                    <p className={`text-xs mt-1 font-medium text-${color}-600`}>
                                        {SUBTEXT_MAP[key]}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Evolução de Custos (Area Chart) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Evolução de Custos Operacionais
                        </h3>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={costHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorEnergia" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorManutencao" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `R$${val / 1000}k`} />
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                                <Tooltip
                                    formatter={(value: any) => `R$ ${(value || 0).toLocaleString()}`}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="energia" stackId="1" stroke="#f59e0b" fill="url(#colorEnergia)" name="Energia & Água" />
                                <Area type="monotone" dataKey="manutencao" stackId="1" stroke="#3b82f6" fill="url(#colorManutencao)" name="Manutenção" />
                                <Area type="monotone" dataKey="insumos" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} name="Insumos/Papel" />
                                <Legend verticalAlign="top" height={36} iconType="circle" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Eficiência de Chamados (Composed Chart) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-indigo-500" />
                        Performance de Atendimento (Semanal)
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={ticketPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <Bar dataKey="abertos" name="Chamados Abertos" barSize={30} fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                <Line type="monotone" dataKey="resolvidos" name="Resolvidos" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
