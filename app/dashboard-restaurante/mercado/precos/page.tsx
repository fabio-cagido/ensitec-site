"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

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
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{"An\u00e1lise de Pre\u00e7os"}</h1>
                <p className="text-gray-500">{"Distribui\u00e7\u00e3o de pre\u00e7os do card\u00e1pio na regi\u00e3o"}</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-amber-600">
                    <span className="text-xs font-bold text-gray-400 uppercase">{"Pre\u00e7o M\u00e9dio"}</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">R$ {loading ? '...' : kpis?.avgMenuPrice?.toFixed(2)}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-emerald-500">
                    <span className="text-xs font-bold text-gray-400 uppercase">{"Pre\u00e7o Original M\u00e9dio"}</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">R$ {loading ? '...' : kpis?.avgOriginalPrice?.toFixed(2)}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-orange-500">
                    <span className="text-xs font-bold text-gray-400 uppercase">{"Desconto M\u00e9dio"}</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '...' : `${kpis?.avgDiscount}%`}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{"Distribui\u00e7\u00e3o por Faixa de Pre\u00e7o"}</h3>
                <p className="text-xs text-gray-400 mb-4">{"Quantidade de itens por faixa"}</p>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={faixas}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="faixa" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                        <Bar dataKey="qtd" radius={[6, 6, 0, 0]}>
                            {faixas.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
