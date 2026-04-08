"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import { Target } from "lucide-react";

const MockOverlay = ({ text = "Dados de Exemplo — Conecte seu sistema" }) => (
    <div className="absolute top-3 right-3 z-10">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2 group cursor-help">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{text}</span>
            <button className="hidden group-hover:flex items-center gap-1 text-[9px] font-bold text-amber-600 border-l border-gray-200 pl-2 ml-1">
                <Target className="w-2.5 h-2.5" /> Como integrar?
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

const canais = [
    { name: "Salão", valor: 78730, pct: 42, cor: "#8B5E3C", ticket: 55.40 },
    { name: "iFood / Apps", valor: 65607, pct: 35, cor: "#D97706", ticket: 48.20 },
    { name: "Retirada", valor: 24369, pct: 13, cor: "#059669", ticket: 35.80 },
    { name: "Site Próprio", valor: 18745, pct: 10, cor: "#6366F1", ticket: 62.10 },
];

const evolucaoCanais = [
    { mes: "Out", salao: 65000, ifood: 50000, retirada: 22000, site: 12000 },
    { mes: "Nov", salao: 68000, ifood: 52000, retirada: 23000, site: 14000 },
    { mes: "Dez", salao: 82000, ifood: 60000, retirada: 25000, site: 16000 },
    { mes: "Jan", salao: 75000, ifood: 58000, retirada: 24000, site: 15000 },
    { mes: "Fev", salao: 72000, ifood: 55000, retirada: 23500, site: 14500 },
    { mes: "Mar", salao: 78730, ifood: 65607, retirada: 24369, site: 18745 },
];

const picosHorario = [
    { hora: "11h", salao: 12, delivery: 35 },
    { hora: "12h", salao: 45, delivery: 65 },
    { hora: "13h", salao: 52, delivery: 48 },
    { hora: "14h", salao: 25, delivery: 18 },
    { hora: "18h", salao: 18, delivery: 42 },
    { hora: "19h", salao: 35, delivery: 85 },
    { hora: "20h", salao: 65, delivery: 110 },
    { hora: "21h", salao: 48, delivery: 80 },
    { hora: "22h", salao: 22, delivery: 45 },
];

export default function CanaisPage() {
    return (
        <div className="space-y-6">
            <header className="mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mix de Canais</h1>
                <p className="text-gray-500">Distribuição do faturamento e comportamento por canal de venda</p>
            </header>

            {/* LINHA 1: PIE CHART E BARCHART DE TICKET */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center relative overflow-hidden">
                    <MockOverlay text="Mix de Vendas — Integrar PDV" />
                    <div className="w-full mb-4 flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Participação Mensal (%)</h3>
                            <p className="text-xs text-gray-400">Share of Wallet dos canais</p>
                        </div>
                        <IntegrarBadge />
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie 
                                data={canais} 
                                cx="50%" cy="50%" 
                                innerRadius={70} 
                                outerRadius={110} 
                                paddingAngle={5} 
                                dataKey="pct"
                                opacity={0.7}
                            >
                                {canais.map((e, i) => <Cell key={i} fill={e.cor} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 8 }} formatter={(v: any) => `${v}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                    <MockOverlay text="Ticket por Canal — Integrar Vendas" />
                    <div className="w-full mb-4 flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Ticket Médio por Canal</h3>
                            <p className="text-xs text-gray-400">Onde o cliente gasta mais por pedido?</p>
                        </div>
                        <IntegrarBadge />
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={canais} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" tickFormatter={(v) => `R$${v}`} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: 8 }} formatter={(v: any) => `R$ ${Number(v).toFixed(2)}`} />
                            <Bar dataKey="ticket" radius={[0, 6, 6, 0]} opacity={0.7}>
                                {canais.map((e, i) => <Cell key={i} fill={e.cor} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* LINHA 2: EVOLUÇÃO TEMPORAL E PICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Evolução de Canais — Integrar Histórico" />
                    <div className="w-full mb-4 flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Evolução do Faturamento por Canal</h3>
                            <p className="text-xs text-gray-400">Desempenho dos últimos 6 meses</p>
                        </div>
                        <IntegrarBadge />
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={evolucaoCanais}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="mes" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis tickFormatter={(v: any) => `${(v/1000)}k`} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: any) => `R$ ${Number(v).toLocaleString('pt-BR')}`} />
                            <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
                            <Area type="monotone" dataKey="salao" stackId="1" name="Salão" stroke="#8B5E3C" fill="#8B5E3C" opacity={0.7} />
                            <Area type="monotone" dataKey="ifood" stackId="1" name="iFood / Apps" stroke="#D97706" fill="#D97706" opacity={0.7} />
                            <Area type="monotone" dataKey="retirada" stackId="1" name="Retirada" stroke="#059669" fill="#059669" opacity={0.7} />
                            <Area type="monotone" dataKey="site" stackId="1" name="Site Próprio" stroke="#6366F1" fill="#6366F1" opacity={0.7} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Horários de Pico — Integrar Operacional" />
                    <div className="w-full mb-4 flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Comportamento Salão vs Delivery</h3>
                            <p className="text-xs text-gray-400">Volume de pedidos por faixa horária</p>
                        </div>
                        <IntegrarBadge />
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={picosHorario}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="hora" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                            <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
                            <Bar dataKey="salao" name="Salão" fill="#8B5E3C" radius={[4, 4, 0, 0]} opacity={0.7} />
                            <Bar dataKey="delivery" name="Delivery (iFood + Site)" fill="#D97706" radius={[4, 4, 0, 0]} opacity={0.7} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* LINHA 3: TABELA DETALHADA */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Detalhamento Financeiro do Mês</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                                <th className="pb-3 font-medium">Canal</th>
                                <th className="pb-3 font-medium text-right">Faturamento</th>
                                <th className="pb-3 font-medium text-right">Share (%)</th>
                                <th className="pb-3 font-medium text-right">Ticket Médio</th>
                                <th className="pb-3 font-medium text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {canais.map((c, i) => (
                                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 font-bold text-gray-800 flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.cor }} />
                                        {c.name}
                                    </td>
                                    <td className="py-3 text-right text-gray-600 font-medium">R$ {c.valor.toLocaleString('pt-BR')}</td>
                                    <td className="py-3 text-right">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-bold text-xs">{c.pct}%</span>
                                    </td>
                                    <td className="py-3 text-right font-medium text-emerald-600">R$ {c.ticket.toFixed(2)}</td>
                                    <td className="py-3 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                                            ${c.pct > 20 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {c.pct > 20 ? 'Forte' : 'Atenção'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
