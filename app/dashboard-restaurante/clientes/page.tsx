"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area, Legend } from "recharts";
import { Users, UserPlus, UserCheck, Heart, Star, MapPin, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

const COLORS = { brown: "#8B5E3C", amber: "#D97706", emerald: "#059669", red: "#DC2626", indigo: "#6366F1", orange: "#EA580C" };

const MockOverlay = ({ text = "Dados de Exemplo — Conecte seu sistema" }) => (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-2xl border-2 border-dashed border-gray-200 m-1 group text-center">
        <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center gap-1 transform group-hover:scale-105 transition-transform">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{text}</span>
            <button className="text-[9px] font-bold text-amber-600 hover:text-amber-700 underline">
                Aprenda a conectar
            </button>
        </div>
    </div>
);

const IntegrarBadge = () => (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-50 text-[9px] font-bold text-gray-400 border border-gray-100 cursor-help">
        <div className="w-1 h-1 rounded-full bg-gray-300 animate-pulse" />
        INTEGRAR
    </span>
);

const mockRetencao = [
    { mes: "Out", novos: 320, recorrentes: 1850, total: 2170 },
    { mes: "Nov", novos: 345, recorrentes: 1920, total: 2265 },
    { mes: "Dez", novos: 410, recorrentes: 2100, total: 2510 },
    { mes: "Jan", novos: 380, recorrentes: 2050, total: 2430 },
    { mes: "Fev", novos: 350, recorrentes: 1980, total: 2330 },
    { mes: "Mar", novos: 365, recorrentes: 2020, total: 2385 },
];

const mockNPS = [
    { name: "Promotores", value: 62, cor: COLORS.emerald },
    { name: "Neutros", value: 25, cor: COLORS.amber },
    { name: "Detratores", value: 13, cor: COLORS.red },
];
const npsScore = 62 - 13;

const mockTicketPerfil = [
    { perfil: "Recorrente", ticket: 58.20 },
    { perfil: "Novo", ticket: 42.50 },
    { perfil: "Eventual", ticket: 35.80 },
    { perfil: "VIP (>10x)", ticket: 89.40 },
];

export default function ClientesPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard-restaurante/overview')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Analisando inteligência geográfica...</p>
            </div>
        );
    }

    const geoDistribution = data?.geoDistribution || [];
    const totalMarket = geoDistribution.reduce((acc: number, cur: any) => acc + parseInt(cur.value), 0);

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Clientes & Fidelização</h1>
                <p className="text-gray-500">Análise de retenção (PDV) e inteligência geográfica de mercado</p>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4" style={{ borderTopColor: COLORS.brown }}>
                    <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2"><Users className="w-4 h-4" style={{ color: COLORS.brown }} /><span className="text-xs font-bold text-gray-400 uppercase">Clientes Ativos</span></div>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">--</p>
                    <p className="text-[10px] text-gray-400 font-medium">Extraído do PDV/CRM</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-emerald-500">
                    <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2"><UserCheck className="w-4 h-4 text-emerald-500" /><span className="text-xs font-bold text-gray-400 uppercase">Taxa Retenção</span></div>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">--%</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px]"><span className="text-gray-400 italic">Requer base histórica</span></div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-amber-600">
                    <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-amber-600" /><span className="text-xs font-bold text-gray-400 uppercase">NPS Score</span></div>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">--</p>
                    <p className="text-[10px] text-gray-400 font-medium italic">Aguardando pesquisas</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-indigo-500">
                    <div className="flex items-center gap-2 mb-1"><MapPin className="w-4 h-4 text-indigo-500" /><span className="text-xs font-bold text-gray-400 uppercase">Bairros Monitorados</span></div>
                    <p className="text-3xl font-bold text-gray-900">{geoDistribution.length}</p>
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tight">DADO REAL (MERCADO)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Retenção */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Retenção de Clientes — Integrar Base de Vendas" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Novos vs Recorrentes (Dashboard Interno)</h3>
                    <p className="text-xs text-gray-400 mb-4">Evolução de lealdade</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={mockRetencao}>
                            <defs>
                                <linearGradient id="gNovos" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.amber} stopOpacity={0.3} /><stop offset="95%" stopColor={COLORS.amber} stopOpacity={0} /></linearGradient>
                                <linearGradient id="gRecor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.3} /><stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0} /></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="mes" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                            <Legend />
                            <Area type="monotone" dataKey="recorrentes" name="Recorrentes" stroke={COLORS.emerald} fill="url(#gRecor)" strokeWidth={2.5} opacity={0.3} />
                            <Area type="monotone" dataKey="novos" name="Novos" stroke={COLORS.amber} fill="url(#gNovos)" strokeWidth={2.5} opacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* NPS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Satisfação — Integrar Pesquisa NPS" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">NPS — Satisfação</h3>
                    <p className="text-xs text-gray-400 mb-4">Sentimento do cliente</p>
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie data={mockNPS} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value" opacity={0.2}>
                                {mockNPS.map((e, i) => <Cell key={i} fill={COLORS.brown} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Ticket por Perfil */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Segmentação — Integrar CRM" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Ticket Médio por Perfil</h3>
                    <p className="text-xs text-gray-400 mb-4">Hábitos de consumo</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={mockTicketPerfil}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="perfil" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis tickFormatter={(v) => `R$${v}`} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <Tooltip formatter={(v: any) => `R$ ${v.toFixed(2)}`} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                            <Bar dataKey="ticket" radius={[6, 6, 0, 0]} opacity={0.3}>
                                {mockTicketPerfil.map((_, i) => <Cell key={i} fill={COLORS.brown} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Perfil Geográfico Real */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Inteligência Geográfica</h3>
                    <p className="text-xs text-gray-400 mb-4">Distribuição real de estabelecimentos monitorados por bairro</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                                    <th className="pb-2 font-medium">Bairro</th>
                                    <th className="pb-2 font-medium text-right">Estabelecimentos</th>
                                    <th className="pb-2 font-medium text-right">Nota Média</th>
                                    <th className="pb-2 font-medium text-right">Share Market</th>
                                </tr>
                            </thead>
                            <tbody>
                                {geoDistribution.map((r: any, i: number) => {
                                    const share = ((parseInt(r.value) / totalMarket) * 100).toFixed(1);
                                    return (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors">
                                            <td className="py-2.5 font-medium text-gray-900 flex items-center gap-1 text-[11px]"><MapPin className="w-3 h-3 text-gray-400" />{r.name}</td>
                                            <td className="py-2.5 text-right text-gray-600">{r.value}</td>
                                            <td className="py-2.5 text-right font-medium text-gray-900 text-xs">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                    {r.avg_rating}
                                                </div>
                                            </td>
                                            <td className="py-2.5 text-right"><span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold">{share}%</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
