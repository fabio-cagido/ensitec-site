"use client";
import { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ScatterChart, Scatter, Cell
} from "recharts";
import { MapPin, Target, Crosshair, Star } from "lucide-react";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("../map-component"), {
    ssr: false,
    loading: () => <div className="h-[400px] flex justify-center items-center bg-gray-50 rounded-2xl border border-gray-100"><p className="text-gray-400 font-medium">Carregando mapa interativo...</p></div>,
});

const COLORS = ["#8B5E3C", "#D97706", "#059669", "#EA580C", "#6366F1", "#DC2626", "#A0785C", "#F59E0B"];

export default function MercadoPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard-restaurante/overview')
            .then(res => res.json())
            .then(json => { setData(json); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const kpis = data?.kpis;
    const categories = data?.categories || [];
    const topRestaurants = data?.topRestaurants || [];

    // Formatar dados para a Dispersão (precisam ser x e y e z)
    const priceScatter = topRestaurants.map((r: any) => ({
        name: r.name,
        x: parseFloat(r.user_rating),
        y: parseInt(r.user_rating_count, 10),
        z: 100 // Tamanho da bolha padrão
    }));

    return (
        <div className="space-y-6">
            <header className="mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mapa de Concorrentes</h1>
                <p className="text-gray-500">Radar de mercado, distribuição espacial e posicionamento competitivo</p>
            </header>

            {/* KPIs Rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-amber-600">
                    <span className="text-xs font-bold text-gray-400 uppercase">Monitorados na Região</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '...' : kpis?.totalRestaurants?.toLocaleString('pt-BR')}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4" style={{ borderLeftColor: '#8B5E3C' }}>
                    <span className="text-xs font-bold text-gray-400 uppercase">Nota Média (Região)</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '...' : kpis?.avgRating}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-emerald-500">
                    <span className="text-xs font-bold text-gray-400 uppercase">Preço Médio Prato</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">R$ {loading ? '...' : kpis?.avgMenuPrice?.toFixed(2)}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-orange-500">
                    <span className="text-xs font-bold text-gray-400 uppercase">Meu Posicionamento</span>
                    <p className="text-3xl font-bold text-blue-600 mt-1">Abaixo Média</p>
                    <p className="text-[10px] text-gray-400">Preço competitivo</p>
                </div>
            </div>

            {/* O MAPA PRINCIPAL */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Crosshair className="w-5 h-5 text-amber-700" />
                            Raio-X Geográfico — Mapa de Concorrentes
                        </h3>
                        <p className="text-xs text-gray-400">Sua unidade comparada a todos os concorrentes num raio próximo</p>
                    </div>
                </div>

                <div className="h-[450px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                    <MapWithNoSSR type="points" />
                </div>
            </div>

            {/* Gráficos em Fundo Branco */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Dispersão Nota x Avaliações */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Radar: Nota vs Volume de Avaliações</h3>
                        <p className="text-xs text-gray-400">Marcas isoladas no top-right são referências locais indestrutíveis</p>
                    </div>
                    {!loading && priceScatter.length > 0 && (
                        <ResponsiveContainer width="100%" height={280}>
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="x" name="Nota" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[3.5, 5.0]} />
                                <YAxis type="number" dataKey="y" name="Avaliações" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip 
                                    cursor={{ strokeDasharray: '3 3' }} 
                                    contentStyle={{ borderRadius: 12, fontSize: 12 }} 
                                    formatter={(value, name, props) => [value, name === 'x' ? 'Nota' : 'Qtd. Avaliações']}
                                    labelFormatter={(label) => ''} 
                                />
                                <Scatter name="Restaurantes" data={priceScatter} fill="#8B5E3C">
                                    {priceScatter.map((_: any, i: number) => (
                                         <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Saturação Vertical */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Saturação por Categoria</h3>
                        <p className="text-xs text-gray-400">Identificação de nichos vazios e vermelhos</p>
                    </div>
                    {!loading && (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={categories.slice(0, 6)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis dataKey="main_category" type="category" width={110} tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }} />
                                <Tooltip cursor={{fill: '#f8fafc'}} formatter={(v: any) => [`${v} restaurantes`, 'Saturação']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                                    {categories.slice(0, 6).map((_: any, i: number) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Raio-X: Principais Ofensores</h3>
                        <p className="text-xs text-gray-400">A elite da região onde o seu restaurante atua</p>
                    </div>
                    <Target className="w-5 h-5 text-gray-400" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                                <th className="pb-3 font-medium">Nome</th>
                                <th className="pb-3 font-medium">Categoria</th>
                                <th className="pb-3 font-medium text-center">Risco Competitivo</th>
                                <th className="pb-3 font-medium text-right">Nota / Avaliações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topRestaurants.slice(0, 5).map((r: any, i: number) => (
                                <tr key={i} className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors">
                                    <td className="py-3 font-bold text-gray-900">{r.name}</td>
                                    <td className="py-3"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{r.main_category}</span></td>
                                    <td className="py-3 text-center">
                                         <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase">Alto</span>
                                    </td>
                                    <td className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-1.5 font-bold">
                                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                            <span className="text-gray-900">{parseFloat(r.user_rating).toFixed(1)}</span>
                                            <span className="text-xs text-gray-400 font-normal">({r.user_rating_count})</span>
                                        </div>
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
