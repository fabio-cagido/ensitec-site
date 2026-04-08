"use client";
import { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, Legend, LineChart, Line
} from "recharts";
import {
    TrendingUp, TrendingDown, Star, Clock, DollarSign,
    MapPin, UtensilsCrossed, Users, Truck, ShoppingBag,
    CreditCard, Percent, Target, Flame, CheckCircle, XCircle
} from "lucide-react";
import dynamic from "next/dynamic";

// Mapa SSR-safe
const MapWithNoSSR = dynamic(() => import("./map-component"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-2xl">
            <p className="text-gray-400 animate-pulse">Carregando mapa...</p>
        </div>
    ),
});

// ============================================
// COMPONENTES DE APOIO
// ============================================
const MockOverlay = ({ text = "Dados de Exemplo — Conecte seu sistema" }) => (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-2xl border-2 border-dashed border-gray-200 m-1 group">
        <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center gap-1 transform group-hover:scale-105 transition-transform">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{text}</span>
            <button className="text-[10px] font-bold text-amber-600 hover:text-amber-700 underline flex items-center gap-1">
                <Target className="w-3 h-3" /> Como coletar estes dados?
            </button>
        </div>
    </div>
);

const IntegrarBadge = ({ tooltip = "Integração necessária" }) => (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-50 text-[9px] font-bold text-gray-400 border border-gray-100 cursor-help" title={tooltip}>
        <div className="w-1 h-1 rounded-full bg-gray-300 animate-pulse" />
        INTEGRAR
    </span>
);

// ============================================
// PALETA DE CORES
// ============================================
const COLORS = {
    brown: "#8B5E3C",
    brownLight: "#A0785C",
    brownDark: "#5C3D2E",
    amber: "#D97706",
    amberLight: "#F59E0B",
    emerald: "#059669",
    emeraldLight: "#10B981",
    red: "#DC2626",
    orange: "#EA580C",
    slate: "#64748B",
    indigo: "#6366F1",
};

const PIE_COLORS = ["#8B5E3C", "#D97706", "#059669", "#EA580C", "#6366F1", "#DC2626", "#A0785C", "#F59E0B", "#10B981", "#64748B"];

// ============================================
// MOCK DATA — PDV (futuro banco real)
// ============================================
const mockFaturamentoHoje = 12480;
const mockFaturamentoOntem = 11200;
const variacaoHoje = (((mockFaturamentoHoje - mockFaturamentoOntem) / mockFaturamentoOntem) * 100).toFixed(1);

const mockTicketSparkline = [
    { v: 42 }, { v: 45 }, { v: 43 }, { v: 48 }, { v: 46 }, { v: 50 }, { v: 48 }, { v: 52 }, { v: 49 }, { v: 48.7 },
];

const mockPedidosHoje = { concluidos: 256, cancelados: 8 };
const taxaCancelamento = ((mockPedidosHoje.cancelados / (mockPedidosHoje.concluidos + mockPedidosHoje.cancelados)) * 100).toFixed(1);

const mockCanais = [
    { name: "Salão", value: 42, cor: COLORS.brown },
    { name: "iFood", value: 35, cor: COLORS.amber },
    { name: "Retirada", value: 13, cor: COLORS.emerald },
    { name: "Site Próprio", value: 10, cor: COLORS.indigo },
];

const mockPagamentos = [
    { name: "PIX", value: 38 },
    { name: "Crédito", value: 28 },
    { name: "Débito", value: 18 },
    { name: "VA/VR", value: 12 },
    { name: "Dinheiro", value: 4 },
];

const mockFaturamentoMensal = [
    { mes: "Set", valor: 142000 },
    { mes: "Out", valor: 158000 },
    { mes: "Nov", valor: 165000 },
    { mes: "Dez", valor: 195000 },
    { mes: "Jan", valor: 178000 },
    { mes: "Fev", valor: 172000 },
    { mes: "Mar", valor: 187450 },
];

const mockHeatmap = [
    { hora: "11h", seg: 12, ter: 15, qua: 18, qui: 14, sex: 22, sab: 35, dom: 30 },
    { hora: "12h", seg: 28, ter: 32, qua: 35, qui: 30, sex: 45, sab: 55, dom: 48 },
    { hora: "13h", seg: 22, ter: 25, qua: 28, qui: 24, sex: 38, sab: 45, dom: 40 },
    { hora: "18h", seg: 15, ter: 18, qua: 20, qui: 16, sex: 30, sab: 42, dom: 38 },
    { hora: "19h", seg: 35, ter: 38, qua: 42, qui: 36, sex: 55, sab: 65, dom: 58 },
    { hora: "20h", seg: 42, ter: 45, qua: 48, qui: 40, sex: 62, sab: 72, dom: 65 },
    { hora: "21h", seg: 30, ter: 32, qua: 35, qui: 28, sex: 48, sab: 55, dom: 50 },
];

export default function DashboardRestauranteOverview() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const fetchData = async () => {
            try {
                const res = await fetch('/api/dashboard-restaurante/overview');
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const kpis = data?.kpis;
    const categories = data?.categories || [];
    const topRestaurants = data?.topRestaurants || [];

    // Indicador de posição no mercado
    const isValidPrice = kpis && kpis.avgMenuPrice && !isNaN(kpis.avgMenuPrice) && kpis.avgMenuPrice > 0;
    const posicaoMercado = isValidPrice ? ((kpis.avgMenuPrice - 36.85) / kpis.avgMenuPrice * 100).toFixed(1) : null;

    return (
        <>
            {/* HEADER */}
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Executivo</h1>
                    <p className="text-gray-500">{"Inteligência de Mercado & Operações — Restaurantes"}</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-amber-700 to-amber-900 shadow-inner flex items-center justify-center flex-shrink-0">
                        <UtensilsCrossed className="w-6 h-6 text-amber-200" />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">Ensitec BI</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Restaurantes</p>
                    </div>
                </div>
            </header>

            {/* ============================================ */}
            {/* LINHA 1: 4 CARDS MESTRES */}
            {/* ============================================ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* Card 1: Faturamento Hoje (Mock) */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-amber-600 hover:shadow-lg hover:scale-[1.03] transition-all duration-200 cursor-default">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-400 uppercase">Faturamento Hoje</span>
                            <IntegrarBadge tooltip="Conecte seu PDV para ver este dado" />
                        </div>
                        <DollarSign className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                        R$ {mockFaturamentoHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-[11px] text-emerald-600 font-bold">{variacaoHoje}%</span>
                        <span className="text-[11px] text-gray-400">vs. ontem</span>
                    </div>
                </div>

                {/* Card 2: Ticket Médio com Sparkline (Mock) */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-emerald-500 hover:shadow-lg hover:scale-[1.03] transition-all duration-200 cursor-default">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-400 uppercase">Ticket Médio</span>
                            <IntegrarBadge tooltip="Cálculo automático via PDV" />
                        </div>
                        <ShoppingBag className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-gray-900">R$ 48,70</div>
                        <div className="w-24 h-10 opacity-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockTicketSparkline}>
                                    <Line type="monotone" dataKey="v" stroke={COLORS.emerald} strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-[11px] text-emerald-600 font-bold">+5.2%</span>
                        <span className="text-[11px] text-gray-400">este mês</span>
                    </div>
                </div>

                {/* Card 3: Pedidos Concluídos vs Cancelados (Mock) */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 hover:shadow-lg hover:scale-[1.03] transition-all duration-200 cursor-default" style={{ borderTopColor: COLORS.brown }}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-400 uppercase">Pedidos Hoje</span>
                            <IntegrarBadge tooltip="Status de pedidos em tempo real" />
                        </div>
                        <CheckCircle className="w-4 h-4" style={{ color: COLORS.brown }} />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">{mockPedidosHoje.concluidos}</span>
                        <span className="text-sm text-gray-400">/</span>
                        <div className="flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-lg font-bold text-red-500">{mockPedidosHoje.cancelados}</span>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${100 - parseFloat(taxaCancelamento)}%` }} />
                        </div>
                        <div className="flex justify-between mt-1 text-[11px]">
                            <span className="text-emerald-600 font-medium">Sucesso: {(100 - parseFloat(taxaCancelamento)).toFixed(1)}%</span>
                            <span className="text-gray-400">Taxa de erro: {taxaCancelamento}%</span>
                        </div>
                    </div>
                </div>

                {/* Card 4: Posição no Mercado (Real do Supabase) */}
                <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-200 cursor-default text-white">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-amber-200 uppercase">{"Posição no Mercado"}</span>
                        <Target className="w-4 h-4 text-amber-200" />
                    </div>
                    <div className="text-3xl font-bold">
                        {loading ? '...' : posicaoMercado ? `${posicaoMercado}%` : 'S/ Dados'}
                    </div>
                    <p className="text-xs text-amber-100/80 mt-1">
                        {loading ? '...' : posicaoMercado 
                            ? (parseFloat(posicaoMercado) > 0 
                                ? `Seu preço médio está ${posicaoMercado}% abaixo da região` 
                                : `Seu preço médio está ${Math.abs(parseFloat(posicaoMercado))}% acima da região`)
                            : 'Cadastre seu cardápio no sistema PDV para comparar'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-200/70">
                        <MapPin className="w-3 h-3" />
                        <span>{loading ? '...' : `${kpis?.totalRestaurants?.toLocaleString('pt-BR')} concorrentes monitorados`}</span>
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* LINHA 2: Faturamento Mensal + Mix de Canais */}
            {/* ============================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Evolução Financeira — Integrar Sistema de Caixa" />
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{"Evolução do Faturamento"}</h3>
                            <p className="text-xs text-gray-400">{"Histórico de vendas reais"}</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={mockFaturamentoMensal}>
                            <defs>
                                <linearGradient id="fatGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.amber} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={COLORS.amber} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="mes" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis tickFormatter={(v: any) => `${(v / 1000).toFixed(0)}k`} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip
                                formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Faturamento']}
                                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                            />
                            <Area type="monotone" dataKey="valor" stroke={COLORS.amber} fill="url(#fatGradient)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Mix de Canais — Integrar PDV" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Mix de Canais</h3>
                    <p className="text-xs text-gray-400 mb-4">{"Distribuição de vendas"}</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={mockCanais} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                                {mockCanais.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                            </Pie>
                            <Tooltip formatter={(value: any) => `${value}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                        {mockCanais.map((canal, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: canal.cor }} />
                                    <span className="text-gray-600 font-medium">{canal.name}</span>
                                </div>
                                <span className="font-bold text-gray-900">{canal.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* LINHA 3: Top Categorias + Formas de Pagamento */}
            {/* ============================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Top Categorias do Mercado</h3>
                            <p className="text-xs text-gray-400">{"Culinárias mais populares na região"}</p>
                        </div>
                        <Flame className="w-5 h-5 text-orange-500" />
                    </div>
                    {!loading && categories.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={categories.slice(0, 8)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis dataKey="main_category" type="category" width={120} tick={{ fill: '#374151', fontSize: 11 }} />
                                <Tooltip formatter={(value: any) => [`${value} restaurantes`, 'Total']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                                <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                                    {categories.slice(0, 8).map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[280px] flex items-center justify-center">
                            <p className="text-gray-400 animate-pulse">Carregando dados do mercado...</p>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Pagamentos — Integrar Forma de Recebimento" />
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Formas de Pagamento</h3>
                            <p className="text-xs text-gray-400">{"Distribuição do mês atual"}</p>
                        </div>
                        <CreditCard className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="space-y-4">
                        {mockPagamentos.map((pg, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1.5 grayscale opacity-50">
                                    <span className="text-gray-700 font-medium">{pg.name}</span>
                                    <span className="font-bold text-gray-900">{pg.value}%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-gray-300" style={{ width: `${pg.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* LINHA 4: Mapa de Concorrentes (Real) + KPIs */}
            {/* ============================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{"Mapa de Concorrentes"}</h3>
                            <p className="text-xs text-gray-400">{"Geolocalização dos restaurantes na região"}</p>
                        </div>
                        <MapPin className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="h-[350px] rounded-2xl overflow-hidden border border-gray-200">
                        {isMounted && <MapWithNoSSR />}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-5 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <Percent className="w-4 h-4 text-amber-200" />
                            <span className="text-xs font-medium text-amber-200 uppercase">Desconto Médio</span>
                        </div>
                        <p className="text-3xl font-bold">{loading ? '...' : `${kpis?.avgDiscount}%`}</p>
                        <p className="text-xs text-amber-200/70 mt-1">{"Promoções ativas no mercado"}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <UtensilsCrossed className="w-4 h-4 text-amber-700" />
                            <span className="text-xs font-medium text-gray-400 uppercase">{"Preço Médio Cardápio"}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">R$ {loading ? '...' : kpis?.avgMenuPrice?.toFixed(2)}</p>
                        <p className="text-xs text-gray-400 mt-1">{loading ? '...' : `${kpis?.totalMenuItems?.toLocaleString('pt-BR')} itens analisados`}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-medium text-gray-400 uppercase">{"Nota Média Mercado"}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : kpis?.avgRating}</p>
                            <div className="flex">
                                {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= Math.round(kpis?.avgRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{loading ? '...' : `${kpis?.totalCities} cidades monitoradas`}</p>
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* LINHA 5: Top Restaurantes (Real) */}
            {/* ============================================ */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Restaurantes Melhores Avaliados</h3>
                        <p className="text-xs text-gray-400">{"Benchmark de excelência na região"}</p>
                    </div>
                    <Target className="w-5 h-5" style={{ color: COLORS.brown }} />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                                <th className="pb-3 font-medium">#</th>
                                <th className="pb-3 font-medium">Restaurante</th>
                                <th className="pb-3 font-medium">Categoria</th>
                                <th className="pb-3 font-medium">{"Localização"}</th>
                                <th className="pb-3 font-medium text-right">Nota</th>
                                <th className="pb-3 font-medium text-right">{"Avaliações"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && topRestaurants.map((r: any, i: number) => (
                                <tr key={i} className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors">
                                    <td className="py-3 text-gray-400 font-bold">{i + 1}</td>
                                    <td className="py-3 font-medium text-gray-900">{r.name}</td>
                                    <td className="py-3">
                                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">{r.main_category}</span>
                                    </td>
                                    <td className="py-3 text-gray-500 text-xs">
                                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.district}, {r.city}</div>
                                    </td>
                                    <td className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            <span className="font-bold text-gray-900">{parseFloat(r.user_rating).toFixed(1)}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-right text-gray-500">{r.user_rating_count}</td>
                                </tr>
                            ))}
                            {loading && (
                                <tr><td colSpan={6} className="py-8 text-center text-gray-400 animate-pulse">Carregando ranking...</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ============================================ */}
            {/* LINHA 6: Mapa de Calor por Horário (Mock) */}
            {/* ============================================ */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
                <MockOverlay text="Mapa de Calor — Integrar Status de Pedidos" />
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{"Mapa de Calor — Pedidos por Horário"}</h3>
                        <p className="text-xs text-gray-400">{"Identifique seus horários de pico"}</p>
                    </div>
                    <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div className="overflow-x-auto opacity-40">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs text-gray-400 uppercase">
                                <th className="pb-3 text-left font-medium">Hora</th>
                                <th className="pb-3 font-medium">Seg</th>
                                <th className="pb-3 font-medium">Ter</th>
                                <th className="pb-3 font-medium">Qua</th>
                                <th className="pb-3 font-medium">Qui</th>
                                <th className="pb-3 font-medium">Sex</th>
                                <th className="pb-3 font-medium">{"Sáb"}</th>
                                <th className="pb-3 font-medium">Dom</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockHeatmap.map((row, i) => (
                                <tr key={i}>
                                    <td className="py-2 font-medium text-gray-700">{row.hora}</td>
                                    {['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].map((dia) => {
                                        const val = (row as any)[dia];
                                        const intensity = val > 60 ? 'bg-orange-600 text-white' : 
                                                         val > 45 ? 'bg-orange-400 text-white' :
                                                         val > 30 ? 'bg-orange-200 text-orange-900' : 'bg-orange-50 text-orange-300';
                                        return (
                                            <td key={dia} className="py-2 text-center">
                                                <div className={`mx-auto w-10 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${intensity}`}>
                                                    {val}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
