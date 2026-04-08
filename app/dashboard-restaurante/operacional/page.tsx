"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from "recharts";
import { Clock, Truck, XCircle, RotateCcw, AlertTriangle, CheckCircle, Utensils, TrendingUp } from "lucide-react";

const COLORS = { brown: "#8B5E3C", amber: "#D97706", emerald: "#059669", red: "#DC2626", orange: "#EA580C", indigo: "#6366F1" };

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

const mockHeatmap = [
    { hora: "11h", seg: 12, ter: 15, qua: 18, qui: 14, sex: 22, sab: 35, dom: 30 },
    { hora: "12h", seg: 28, ter: 32, qua: 35, qui: 30, sex: 45, sab: 55, dom: 48 },
    { hora: "13h", seg: 22, ter: 25, qua: 28, qui: 24, sex: 38, sab: 45, dom: 40 },
    { hora: "14h", seg: 10, ter: 12, qua: 14, qui: 11, sex: 18, sab: 25, dom: 22 },
    { hora: "18h", seg: 15, ter: 18, qua: 20, qui: 16, sex: 30, sab: 42, dom: 38 },
    { hora: "19h", seg: 35, ter: 38, qua: 42, qui: 36, sex: 55, sab: 65, dom: 58 },
    { hora: "20h", seg: 42, ter: 45, qua: 48, qui: 40, sex: 62, sab: 72, dom: 65 },
    { hora: "21h", seg: 30, ter: 32, qua: 35, qui: 28, sex: 48, sab: 55, dom: 50 },
    { hora: "22h", seg: 18, ter: 20, qua: 22, qui: 17, sex: 35, sab: 40, dom: 35 },
];

const mockTempos = [
    { semana: "Sem 1", preparo: 18, entrega: 32 },
    { semana: "Sem 2", preparo: 16, entrega: 30 },
    { semana: "Sem 3", preparo: 17, entrega: 28 },
    { semana: "Sem 4", preparo: 15, entrega: 27 },
];

const mockCancelamentos = [
    { motivo: "Atraso na entrega", qtd: 42 },
    { motivo: "Pedido errado", qtd: 28 },
    { motivo: "Cliente desistiu", qtd: 18 },
    { motivo: "Item indisponível", qtd: 15 },
    { motivo: "Qualidade", qtd: 8 },
];

export default function OperacionalPage() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Operacional & Logística</h1>
                <p className="text-gray-500">Eficiência de cozinha, tempos de entrega e controle de perdas</p>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-amber-600">
                    <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-600" /><span className="text-xs font-bold text-gray-400 uppercase">Tempo Médio Preparo</span></div>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">16 min</p>
                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" /> Dentro do SLA
                    </p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-orange-500">
                    <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-orange-500" /><span className="text-xs font-bold text-gray-400 uppercase">Tempo Médio Entrega</span></div>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">28 min</p>
                    <p className="text-[10px] text-orange-600 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" /> Pico detectado
                    </p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-red-500">
                    <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /><span className="text-xs font-bold text-gray-400 uppercase">Cancelamentos</span></div>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">103</p>
                    <p className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                        <RotateCcw className="w-2.5 h-2.5" /> +2% vs. sem. ant.
                    </p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-emerald-500">
                    <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /><span className="text-xs font-bold text-gray-400 uppercase">Taxa de Sucesso</span></div>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">97.4%</p>
                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <TrendingUp className="w-2.5 h-2.5" /> Performance Alta
                    </p>
                </div>
            </div>

            {/* Mapa de Calor */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
                <MockOverlay text="Fluxo Operacional — Integrar Monitoramento de Cozinha" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Mapa de Calor — Pedidos por Horário</h3>
                <p className="text-xs text-gray-400 mb-4">Picos operacionais recomendados</p>
                <div className="overflow-x-auto opacity-50">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs text-gray-400 uppercase">
                                <th className="pb-3 text-left font-medium">Hora</th>
                                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => <th key={d} className="pb-3 font-medium">{d}</th>)}
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
                                                <div className={`mx-auto w-10 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${intensity}`}>{val}</div>
                                            </td>
                                         );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Evolução dos Tempos */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Histórico de Tempos — Integrar API iFood/Apps" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Evolução SLA (Semanas)</h3>
                    <p className="text-xs text-gray-400 mb-4">Tempos médios reais</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={mockTempos}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="semana" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                            <Legend />
                            <Line type="monotone" dataKey="preparo" name="Preparo" stroke={COLORS.amber} strokeWidth={3} dot={{ r: 5 }} opacity={0.6} />
                            <Line type="monotone" dataKey="entrega" name="Entrega" stroke={COLORS.orange} strokeWidth={3} dot={{ r: 5 }} opacity={0.6} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Motivos de Cancelamento */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Perdas — Integrar Relatório de Motivos" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Motivos de Cancelamento</h3>
                    <p className="text-xs text-gray-400 mb-4">Análise de perdas reais</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={mockCancelamentos} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis dataKey="motivo" type="category" width={130} tick={{ fill: '#374151', fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                            <Bar dataKey="qtd" radius={[0, 6, 6, 0]} opacity={0.6}>
                                {mockCancelamentos.map((_, i) => <Cell key={i} fill={COLORS.brown} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}
