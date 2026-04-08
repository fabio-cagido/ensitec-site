"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Award, Target } from "lucide-react";

const MockOverlay = ({ text = "Dados de Exemplo — Conecte seu sistema" }) => (
    <div className="absolute top-3 right-3 z-10">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2 group cursor-help">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{text}</span>
            <button className="hidden group-hover:flex items-center gap-1 text-[9px] font-bold text-amber-600 border-l border-gray-200 pl-2 ml-1">
                <Target className="w-2.5 h-2.5" /> Como integrar?
            </button>
        </div>
    </div>
);

const IntegrarBadge = () => (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-50 text-[9px] font-bold text-gray-400 border border-gray-100 cursor-help">
        <div className="w-1 h-1 rounded-full bg-gray-300 animate-pulse" />
        INTEGRAR
    </span>
);

const COLORS = ["#D97706", "#8B5E3C", "#059669", "#EA580C", "#6366F1"];

const topItens = [
    { name: "Cerveja Chopp 600ml", vendas: 450 },
    { name: "Refrigerante Lata", vendas: 380 },
    { name: "Picanha Grelhada", vendas: 320 },
    { name: "Filé de Frango", vendas: 280 },
    { name: "Combo Executivo", vendas: 245 },
    { name: "Água Mineral", vendas: 200 },
    { name: "Batata Frita (P)", vendas: 195 },
    { name: "Suco Natural", vendas: 170 },
    { name: "Sobremesa Brownie", vendas: 45 },
    { name: "Carpaccio", vendas: 30 },
];

export default function RankingPage() {
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Ranking de Itens</h1>
                <p className="text-gray-500">{"Classificação dos itens por volume de vendas e popularidade"}</p>
            </header>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
                <MockOverlay text="Top Vendas — Integrar PDV/ERP" />
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Top 10 — Mais Vendidos (Exemplo)</h3>
                    <IntegrarBadge />
                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topItens} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis dataKey="name" type="category" width={150} tick={{ fill: '#374151', fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                        <Bar dataKey="vendas" radius={[0, 6, 6, 0]} opacity={0.7}>
                            {topItens.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                    <Award className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-amber-900">Importância desta análise</h4>
                    <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
                        Entender quais itens têm maior giro permite otimizar o estoque, negociar melhor com fornecedores e planejar promoções estratégicas baseadas no comportamento real de consumo.
                    </p>
                </div>
            </div>
        </div>
    );
}
