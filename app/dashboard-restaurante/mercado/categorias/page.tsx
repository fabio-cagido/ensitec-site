"use client";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Tag, Target } from "lucide-react";

const COLORS = ["#8B5E3C", "#D97706", "#059669", "#EA580C", "#6366F1", "#DC2626", "#A0785C", "#F59E0B", "#10B981", "#64748B"];

export default function CategoriasPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard-restaurante/overview')
            .then(res => res.json())
            .then(json => { setData(json); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const categories = data?.categories || [];

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Categorias & Nichos</h1>
                <p className="text-gray-500">{"Saturação por tipo de culinária e oportunidades de mercado baseadas em dados reais"}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-900">{"Distribuição por Categoria"}</h3>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase">Dado de Mercado</span>
                    </div>
                    {!loading && categories.length > 0 && (
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie data={categories.slice(0, 10)} cx="50%" cy="50%" outerRadius={120} dataKey="total" nameKey="main_category" label={(e: any) => e.main_category}>
                                    {categories.slice(0, 10).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: any) => `${value} restaurantes`} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Volume por Nicho</h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {categories.map((cat: any, i: number) => (
                            <div key={i} className="flex justify-between items-center group hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">{cat.main_category || "Sem Categoria"}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">{cat.total || 0}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                    <Target className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-indigo-900">Como identificar oportunidades?</h4>
                    <p className="text-xs text-indigo-800/80 mt-1 leading-relaxed">
                        Categorias com baixo volume de restaurantes mas alta demanda de buscas são "Oceanos Azuis". Esta tela ajuda a entender para onde o capital está fluindo na sua região.
                    </p>
                </div>
            </div>
        </div>
    );
}
