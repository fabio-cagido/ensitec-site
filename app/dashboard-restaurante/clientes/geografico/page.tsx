"use client";
import { useState } from "react";
import { MapPin, Target, Layers } from "lucide-react";
import dynamic from "next/dynamic";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Sector, PieChart, Pie } from "recharts";

const MapWithNoSSR = dynamic(() => import("../../map-component"), {
    ssr: false,
    loading: () => <div className="h-[400px] flex justify-center items-center bg-gray-50 rounded-2xl border border-gray-100"><p className="text-gray-400 font-medium">Carregando mapa interativo...</p></div>,
});

const regioes = [
    { bairro: "Barra da Tijuca", clientes: 1120, ticketMedio: 82.50, color: "#8B5E3C" },
    { bairro: "Zona Sul", clientes: 860, ticketMedio: 75.10, color: "#D97706" },
    { bairro: "Centro", clientes: 620, ticketMedio: 55.30, color: "#059669" },
    { bairro: "Zona Norte", clientes: 410, ticketMedio: 44.80, color: "#EA580C" },
    { bairro: "Copacabana", clientes: 380, ticketMedio: 68.90, color: "#6366F1" },
    { bairro: "Outros", clientes: 530, ticketMedio: 48.60, color: "#64748B" },
];

export default function GeograficoPage() {
    const [mapType, setMapType] = useState<"points" | "heatmap">("heatmap");
    const total = regioes.reduce((a, c) => a + c.clientes, 0);

    return (
        <div className="space-y-6">
            <header className="mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Perfil Geográfico</h1>
                <p className="text-gray-500">Distribuição geográfica dos clientes, concorrentes e zonas quentes</p>
            </header>

            {/* LINHA 1: MAPA GIGANTE E CONTROLES */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Análise Espacial de Mercado</h3>
                        <p className="text-xs text-gray-400">Identificação de áreas de alta densidade e de oportunidades em branco</p>
                    </div>
                    
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setMapType("heatmap")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${mapType === "heatmap" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            <Layers className="w-4 h-4" />
                            Mapa de Calor
                        </button>
                        <button 
                            onClick={() => setMapType("points")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${mapType === "points" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            <Target className="w-4 h-4" />
                            Dispersão (Pontos)
                        </button>
                    </div>
                </div>

                <div className="h-[450px] rounded-2xl overflow-hidden border border-gray-200">
                    <MapWithNoSSR type={mapType} />
                </div>
            </div>

            {/* LINHA 2: GRÁFICOS COMPLEMENTARES BRANCOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* GRÁFICO 1: VOLUME POR BAIRRO */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Pedidos por Região de Entrega</h3>
                        <p className="text-xs text-gray-400">Volume absoluto de clientes / pedidos</p>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={regioes} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="bairro" tick={{ fill: '#94a3b8', fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                            <Bar dataKey="clientes" radius={[4, 4, 0, 0]}>
                                {regioes.map((e, i) => <Cell key={i} fill={e.color} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* GRÁFICO 2: SHARE E TICKET MEDIO DA REGIAO */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Ticket Médio e Relevância</h3>
                        <div className="space-y-4">
                            {regioes.map((r, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700 font-medium flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                                            {r.bairro}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-emerald-600">R$ {r.ticketMedio.toFixed(2)}</span>
                                            <span className="text-xs font-bold text-gray-900 min-w-[40px] text-right">{((r.clientes / total) * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(r.clientes / total) * 100}%`, backgroundColor: r.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
