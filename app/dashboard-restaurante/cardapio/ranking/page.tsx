"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Award } from "lucide-react";

const COLORS = ["#D97706", "#8B5E3C", "#059669", "#EA580C", "#6366F1"];

const topItens = [
    { name: "Cerveja Chopp 600ml", vendas: 450 },
    { name: "Refrigerante Lata", vendas: 380 },
    { name: "Picanha Grelhada", vendas: 320 },
    { name: "Fil\u00e9 de Frango", vendas: 280 },
    { name: "Combo Executivo", vendas: 245 },
    { name: "\u00c1gua Mineral", vendas: 200 },
    { name: "Batata Frita (P)", vendas: 195 },
    { name: "Suco Natural", vendas: 170 },
    { name: "Sobremesa Brownie", vendas: 45 },
    { name: "Carpaccio", vendas: 30 },
];

export default function RankingPage() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Ranking de Itens</h1>
                <p className="text-gray-500">{"Classifica\u00e7\u00e3o dos itens por volume de vendas"}</p>
            </header>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Top 10 — Mais Vendidos</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topItens} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis dataKey="name" type="category" width={150} tick={{ fill: '#374151', fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                        <Bar dataKey="vendas" radius={[0, 6, 6, 0]}>
                            {topItens.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
