"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { XCircle, Target } from "lucide-react";

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

const cancelamentos = [
    { motivo: "Atraso na entrega", qtd: 42 },
    { motivo: "Pedido errado", qtd: 28 },
    { motivo: "Cliente desistiu", qtd: 18 },
    { motivo: "Item indisponível", qtd: 15 },
    { motivo: "Qualidade", qtd: 8 },
];
const COLORS = ["#DC2626", "#EA580C", "#D97706", "#8B5E3C", "#64748B"];

export default function CancelamentosPage() {
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{"Cancelamento & Refação"}</h1>
                <p className="text-gray-500">{"Motivos de perda e desperdício em tempo real"}</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-red-500 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-xs font-bold text-gray-400 uppercase">Total Cancelamentos</span>
                        </div>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">111</p>
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">2,9% dos pedidos (Exemplo)</p>
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-amber-600 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase">{"Refações"}</span>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-1">34</p>
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tight">0,9% dos pedidos (Exemplo)</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <MockOverlay text="Perdas — Integrar PDV/Apps" />
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Motivos Principais</h3>
                    <IntegrarBadge />
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={cancelamentos} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis dataKey="motivo" type="category" width={140} tick={{ fill: '#374151', fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                        <Bar dataKey="qtd" radius={[0, 6, 6, 0]} opacity={0.7}>
                            {cancelamentos.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
