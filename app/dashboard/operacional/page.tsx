"use client";

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
    TrendingUp
} from "lucide-react";
import Link from "next/link";
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
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
    ComposedChart,
    Legend
} from 'recharts';

// --- MOCK DATA ---
const OPERATIONAL_KPIS = [
    {
        id: "espacos",
        title: "Eficiência de Espaço",
        value: "88%",
        subtext: "Ocupação de Salas",
        icon: LayoutGrid,
        color: "blue",
        path: "/dashboard/operacional/espacos"
    },
    {
        id: "secretaria",
        title: "SLA de Atendimento",
        value: "1.8 dias",
        subtext: "Secretaria",
        icon: Clock,
        color: "green",
        path: "/dashboard/operacional/secretaria"
    },
    {
        id: "manutencao",
        title: "Manutenção",
        value: "12 Tickets",
        subtext: "3 Críticos",
        icon: Wrench,
        color: "orange",
        path: "/dashboard/operacional/manutencao"
    },
    {
        id: "docentes",
        title: "Absenteísmo Docente",
        value: "2.4%",
        subtext: "Substituições",
        icon: UserX,
        color: "purple",
        path: "/dashboard/operacional/docentes"
    },
    {
        id: "ti",
        title: "Gestão de TI",
        value: "99.8%",
        subtext: "Uptime Rede/Wi-Fi",
        icon: Wifi,
        color: "cyan",
        path: "/dashboard/operacional/ti"
    },
    {
        id: "impressao",
        title: "Custos de Impressão",
        value: "R$ 12,50",
        subtext: "Custo Médio/Aluno",
        icon: Printer,
        color: "red",
        path: "/dashboard/operacional/impressao"
    },
    {
        id: "alimentacao",
        title: "Alimentação",
        value: "4.2%",
        subtext: "Taxa de Desperdício",
        icon: Utensils,
        color: "yellow",
        path: "/dashboard/operacional/alimentacao"
    },
    {
        id: "seguranca",
        title: "Segurança",
        value: "Normal",
        subtext: "Fluxo Controlado",
        icon: ShieldCheck,
        color: "emerald",
        path: "/dashboard/operacional/seguranca"
    },
];

// Mock Chart Data
// --- MOCK CHART DATA ---
const COST_HISTORY = [
    { month: 'Jan', energia: 12500, manutencao: 4200, insumos: 3100 },
    { month: 'Fev', energia: 14200, manutencao: 3800, insumos: 8500 }, // Volta às aulas (insumos up)
    { month: 'Mar', energia: 13800, manutencao: 2100, insumos: 4200 },
    { month: 'Abr', energia: 13500, manutencao: 5400, insumos: 3800 },
    { month: 'Mai', energia: 12900, manutencao: 3200, insumos: 3500 },
    { month: 'Jun', energia: 11800, manutencao: 2800, insumos: 3100 },
];

const TICKET_PERFORMANCE = [
    { name: 'Seg', abertos: 14, resolvidos: 12 },
    { name: 'Ter', abertos: 25, resolvidos: 20 },
    { name: 'Qua', abertos: 18, resolvidos: 18 },
    { name: 'Qui', abertos: 12, resolvidos: 15 }, // Resolveu backlog
    { name: 'Sex', abertos: 9, resolvidos: 11 },
];

export default function OperationalPage() {
    return (
        <div className="space-y-8 pb-10">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Operacional</h1>
                <p className="text-gray-500">Eficiência, Manutenção e Recursos</p>
            </header>

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {OPERATIONAL_KPIS.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <Link href={kpi.path} key={kpi.id} className="block group">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full hover:shadow-md transition-all hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl bg-${kpi.color}-50 text-${kpi.color}-600`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</h3>
                                    <p className={`text-xs mt-1 font-medium text-${kpi.color}-600`}>
                                        {kpi.subtext}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* CHARTS SECTION - UPGRADED */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Evolução de Custos (Area Chart) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Evolução de Custos Operacionais
                        </h3>
                        <select className="text-xs border-gray-200 rounded-lg text-gray-500 py-1">
                            <option>Últimos 6 meses</option>
                            <option>Ano Atual</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={COST_HISTORY} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                            <ComposedChart data={TICKET_PERFORMANCE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
