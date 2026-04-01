"use client";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Tag } from "lucide-react";

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
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Categorias & Nichos</h1>
                <p className="text-gray-500">{"Satura\u00e7\u00e3o por tipo de culin\u00e1ria e oportunidades de mercado"}</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{"Distribui\u00e7\u00e3o por Categoria"}</h3>
                    {!loading && categories.length > 0 && (
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie data={categories.slice(0, 10)} cx="50%" cy="50%" outerRadius={120} dataKey="total" nameKey="main_category" label={(e: any) => e.main_category}>
                                    {categories.slice(0, 10).map((_: any, i: number) => <Cell key={i} fill={COLORS[i]} />)}
                                </Pie>
                                <Tooltip formatter={(value: any) => `${value} restaurantes`} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Todas as Categorias</h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {categories.map((cat: any, i: number) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-sm text-gray-700">{cat.main_category}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{cat.total}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
