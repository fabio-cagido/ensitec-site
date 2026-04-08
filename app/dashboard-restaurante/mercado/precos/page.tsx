"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Target } from "lucide-react";

export default function PrecosPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard-restaurante/overview')
            .then(res => res.json())
            .then(json => { setData(json); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const kpis = data?.kpis;
    const faixas = [
        { faixa: "R$ 10-20", qtd: 380 },
        { faixa: "R$ 20-30", qtd: 520 },
        { faixa: "R$ 30-40", qtd: 410 },
        { faixa: "R$ 40-50", qtd: 290 },
        { faixa: "R$ 50+", qtd: 186 },
    ];
    const COLORS = ["#8B5E3C", "#D97706", "#059669", "#EA580C", "#6366F1"];

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{"Análise de Preços"}</h1>
                <p className="text-gray-500">{"Distribuição de preços do cardápio na região"}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-amber-600">
                    <span className="text-xs font-bold text-gray-400 uppercase">{"Preço Médio"}</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">R$ {loading ? '...' : (kpis?.avgMenuPrice || 0).toFixed(2)}</p>
                    <p className="text-[10px] text-amber-600 font-bold uppercase mt-1 tracking-tight">DADO REAL (MERCADO)</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-emerald-500">
                    <span className="text-xs font-bold text-gray-400 uppercase">{"Preço Original Médio"}</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">R$ {loading ? '...' : (kpis?.avgOriginalPrice || 0).toFixed(2)}</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1 tracking-tight">DADO REAL (MERCADO)</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-orange-500">
                    <span className="text-xs font-bold text-gray-400 uppercase">{"Desconto Médio"}</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '...' : `${kpis?.avgDiscount || 0}%`}</p>
                    <p className="text-[10px] text-orange-600 font-bold uppercase mt-1 tracking-tight">DADO REAL (MERCADO)</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{"Distribuição por Faixa de Preço"}</h3>
                    <p className="text-xs text-gray-400 mb-4">{"Quantidade de itens por faixa de preço encontrados no mercado local"}</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={faixas}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="faixa" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                        <Bar dataKey="qtd" radius={[6, 6, 0, 0]}>
                            {faixas.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                    <Target className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-indigo-900">Como usar esta informação?</h4>
                    <p className="text-xs text-indigo-800/80 mt-1 leading-relaxed">
                        Compare as faixas de preço mais comuns do mercado (acima) com os seus itens no cardápio. Itens em faixas com pouca oferta podem representar nichos de oportunidade ou exclusividade.
                    </p>
                </div>
            </div>
        </div>
    );
}
