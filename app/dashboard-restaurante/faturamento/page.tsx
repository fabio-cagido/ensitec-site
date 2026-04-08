"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";
import { DollarSign, TrendingUp, CreditCard, ShoppingBag, ArrowUpRight, ArrowDownRight } from "lucide-react";

const COLORS = { brown: "#8B5E3C", amber: "#D97706", emerald: "#059669", orange: "#EA580C", indigo: "#6366F1", red: "#DC2626" };

const MockOverlay = ({ text = "Dados de Exemplo — Conecte seu sistema" }) => (
    <div className="absolute top-3 right-3 z-10">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2 group cursor-help">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{text}</span>
        </div>
    </div>
);

const IntegrarBadge = () => (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-50 text-[9px] font-bold text-gray-400 border border-gray-100 cursor-help">
        <div className="w-1 h-1 rounded-full bg-gray-300 animate-pulse" />
        INTEGRAR
    </span>
);

const mockResumoMensal = [
    { mes: "Out", bruto: 158000, liquido: 134000 },
    { mes: "Nov", bruto: 165000, liquido: 140000 },
    { mes: "Dez", bruto: 195000, liquido: 168000 },
    { mes: "Jan", bruto: 178000, liquido: 152000 },
    { mes: "Fev", bruto: 172000, liquido: 148000 },
    { mes: "Mar", bruto: 187450, liquido: 162300 },
];

const mockCanais = [
    { name: "Salão", valor: 78730, pct: 42, cor: COLORS.brown },
    { name: "iFood / Apps", valor: 65607, pct: 35, cor: COLORS.amber },
    { name: "Retirada / Balcão", valor: 24369, pct: 13, cor: COLORS.emerald },
    { name: "Site Próprio", valor: 18745, pct: 10, cor: COLORS.indigo },
];

const mockPagamentos = [
    { name: "PIX", valor: 71232, pct: 38 },
    { name: "Crédito", valor: 52486, pct: 28 },
    { name: "Débito", valor: 33741, pct: 18 },
    { name: "VA / VR", valor: 22494, pct: 12 },
    { name: "Dinheiro", valor: 7498, pct: 4 },
];

const mockDiaSemana = [
    { dia: "Seg", pedidos: 410 }, { dia: "Ter", pedidos: 445 },
    { dia: "Qua", pedidos: 480 }, { dia: "Qui", pedidos: 460 },
    { dia: "Sex", pedidos: 620 }, { dia: "Sáb", pedidos: 785 },
    { dia: "Dom", pedidos: 647 },
];

const PIE_COLORS = ["#8B5E3C", "#D97706", "#059669", "#6366F1"];

export default function FaturamentoPage() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Vendas & Faturamento</h1>
                <p className="text-gray-500">Indicadores financeiros e análise de canais de venda</p>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-amber-600">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase">Faturamento Bruto</span>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-1">R$ 187.450,00</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-600 font-medium whitespace-nowrap">
                        <ArrowUpRight className="w-3.5 h-3.5" /> +8.9% este mês
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-emerald-500">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase">Faturamento Líquido</span>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-1">R$ 162.300,00</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-600 font-medium whitespace-nowrap">
                        <ArrowUpRight className="w-3.5 h-3.5" /> Margem: 86.5%
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4" style={{ borderTopColor: COLORS.brown }}>
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase">Ticket Médio</span>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-1">R$ 48,70</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-red-500 font-medium whitespace-nowrap">
                        <ArrowDownRight className="w-3.5 h-3.5" /> -1.2% vs. fev
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-indigo-500">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase">Total Pedidos</span>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-1">3.849</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-600 font-medium whitespace-nowrap">
                        <TrendingUp className="w-3.5 h-3.5" /> +12.5% em volume
                    </div>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Histórico Financeiro — Integrar Balanço" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Evolução Bruto vs Líquido</h3>
                    <p className="text-xs text-gray-400 mb-4">Análise mensal de performance</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={mockResumoMensal}>
                            <defs>
                                <linearGradient id="gBruto" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.amber} stopOpacity={0.3} /><stop offset="95%" stopColor={COLORS.amber} stopOpacity={0} /></linearGradient>
                                <linearGradient id="gLiquido" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.3} /><stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0} /></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="mes" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip formatter={(v: any) => `R$ ${v.toLocaleString('pt-BR')}`} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                            <Legend />
                            <Area type="monotone" dataKey="bruto" name="Bruto" stroke={COLORS.amber} fill="url(#gBruto)" strokeWidth={2.5} />
                            <Area type="monotone" dataKey="liquido" name="Líquido" stroke={COLORS.emerald} fill="url(#gLiquido)" strokeWidth={2.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Canais — Integrar PDV" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Canais de Venda</h3>
                    <p className="text-xs text-gray-400 mb-4">Distribuição do faturamento</p>
                    <ResponsiveContainer width="100%" height={170}>
                        <PieChart>
                            <Pie data={mockCanais} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="pct">
                                {mockCanais.map((e, i) => <Cell key={i} fill={e.cor} />)}
                            </Pie>
                            <Tooltip formatter={(v: any) => `${v}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                        {mockCanais.map((c, i) => (
                            <div key={i} className="flex justify-between items-center text-xs opacity-60">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.cor }} />
                                    <span className="text-gray-600">{c.name}</span>
                                </div>
                                <span className="font-bold text-gray-900">R$ {c.valor.toLocaleString('pt-BR')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Pagamentos — Integrar Forma de Recebimento" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Formas de Pagamento</h3>
                    <p className="text-xs text-gray-400 mb-4">Recebimento por método</p>
                    <div className="space-y-4">
                        {mockPagamentos.map((pg, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1 opacity-60">
                                    <span className="text-gray-700 font-medium">{pg.name}</span>
                                    <span className="font-bold text-gray-900">{pg.pct}%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-indigo-500/50" style={{ width: `${pg.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Sazonalidade — Integrar Registro de Caixa" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Pedidos por Dia da Semana</h3>
                    <p className="text-xs text-gray-400 mb-4">Distribuição semanal</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={mockDiaSemana}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="dia" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                            <Bar dataKey="pedidos" radius={[6, 6, 0, 0]}>
                                {mockDiaSemana.map((_, i) => <Cell key={i} fill={COLORS.brown} opacity={0.6} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}

