"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area, Legend } from "recharts";
import { Users, UserPlus, UserCheck, Heart, Star, MapPin, TrendingUp, TrendingDown } from "lucide-react";

const COLORS = { brown: "#8B5E3C", amber: "#D97706", emerald: "#059669", red: "#DC2626", indigo: "#6366F1", orange: "#EA580C" };
const PIE_COLORS = ["#059669", "#D97706", "#DC2626"];

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
const npsScore = 62 - 13; // = 49

const mockTicketPerfil = [
    { perfil: "Recorrente", ticket: 58.20 },
    { perfil: "Novo", ticket: 42.50 },
    { perfil: "Eventual", ticket: 35.80 },
    { perfil: "VIP (>10x)", ticket: 89.40 },
];

const mockAvaliacoes = [
    { nota: "5 â˜…", qtd: 485 },
    { nota: "4 â˜…", qtd: 312 },
    { nota: "3 â˜…", qtd: 128 },
    { nota: "2 â˜…", qtd: 45 },
    { nota: "1 â˜…", qtd: 22 },
];

const mockRegioes = [
    { bairro: "Centro", clientes: 420, ticketMedio: 52.30 },
    { bairro: "Zona Sul", clientes: 380, ticketMedio: 62.10 },
    { bairro: "Zona Norte", clientes: 310, ticketMedio: 44.80 },
    { bairro: "Zona Oeste", clientes: 250, ticketMedio: 38.50 },
    { bairro: "Barra", clientes: 195, ticketMedio: 71.20 },
    { bairro: "Outros", clientes: 830, ticketMedio: 45.60 },
];

export default function ClientesPage() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Clientes & Fidelização</h1>
                <p className="text-gray-500">Análise de retenção, perfil de consumo e satisfação</p>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4" style={{ borderTopColor: COLORS.brown }}>
                    <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4" style={{ color: COLORS.brown }} /><span className="text-xs font-bold text-gray-400 uppercase">Clientes Ativos</span></div>
                    <p className="text-3xl font-bold text-gray-900">2.385</p>
                    <p className="text-xs text-gray-400">Mês atual</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-emerald-500">
                    <div className="flex items-center gap-2 mb-1"><UserCheck className="w-4 h-4 text-emerald-500" /><span className="text-xs font-bold text-gray-400 uppercase">Taxa Retenção</span></div>
                    <p className="text-3xl font-bold text-gray-900">84.7%</p>
                    <div className="flex items-center gap-1 mt-1 text-xs"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /><span className="text-emerald-600 font-bold">+2.1%</span></div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-amber-600">
                    <div className="flex items-center gap-2 mb-1"><Heart className="w-4 h-4 text-amber-600" /><span className="text-xs font-bold text-gray-400 uppercase">NPS Score</span></div>
                    <p className="text-3xl font-bold text-gray-900">{npsScore}</p>
                    <p className="text-xs text-emerald-500 font-medium">Zona de Qualidade</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-indigo-500">
                    <div className="flex items-center gap-2 mb-1"><UserPlus className="w-4 h-4 text-indigo-500" /><span className="text-xs font-bold text-gray-400 uppercase">Novos Clientes</span></div>
                    <p className="text-3xl font-bold text-gray-900">365</p>
                    <p className="text-xs text-gray-400">15.3% do total</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Retenção */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Novos vs Recorrentes</h3>
                    <p className="text-xs text-gray-400 mb-4">Evolução mensal de clientes</p>
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
                            <Area type="monotone" dataKey="recorrentes" name="Recorrentes" stroke={COLORS.emerald} fill="url(#gRecor)" strokeWidth={2.5} />
                            <Area type="monotone" dataKey="novos" name="Novos" stroke={COLORS.amber} fill="url(#gNovos)" strokeWidth={2.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* NPS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">NPS â€” Satisfação</h3>
                    <p className="text-xs text-gray-400 mb-4">Score: <span className="font-bold text-emerald-600">{npsScore}</span></p>
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie data={mockNPS} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                                {mockNPS.map((e, i) => <Cell key={i} fill={e.cor} />)}
                            </Pie>
                            <Tooltip formatter={(v: any) => `${v}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                        {mockNPS.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.cor }} /><span className="text-gray-600">{item.name}</span></div>
                                <span className="font-bold text-gray-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Ticket por Perfil */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Ticket Médio por Perfil</h3>
                    <p className="text-xs text-gray-400 mb-4">Quanto cada segmento gasta</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={mockTicketPerfil}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="perfil" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis tickFormatter={(v) => `R$${v}`} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <Tooltip formatter={(v: any) => `R$ ${v.toFixed(2)}`} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                            <Bar dataKey="ticket" radius={[6, 6, 0, 0]}>
                                {mockTicketPerfil.map((_, i) => <Cell key={i} fill={[COLORS.brown, COLORS.amber, COLORS.orange, COLORS.emerald][i]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Perfil Geográfico */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Perfil Geográfico</h3>
                    <p className="text-xs text-gray-400 mb-4">Distribuição de clientes por região</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                                    <th className="pb-2 font-medium">Região</th>
                                    <th className="pb-2 font-medium text-right">Clientes</th>
                                    <th className="pb-2 font-medium text-right">Ticket Médio</th>
                                    <th className="pb-2 font-medium text-right">Share</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockRegioes.map((r, i) => {
                                    const total = mockRegioes.reduce((a, c) => a + c.clientes, 0);
                                    const share = ((r.clientes / total) * 100).toFixed(1);
                                    return (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors">
                                            <td className="py-2.5 font-medium text-gray-900 flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{r.bairro}</td>
                                            <td className="py-2.5 text-right text-gray-600">{r.clientes}</td>
                                            <td className="py-2.5 text-right font-medium text-gray-900">R$ {r.ticketMedio.toFixed(2)}</td>
                                            <td className="py-2.5 text-right"><span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">{share}%</span></td>
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

