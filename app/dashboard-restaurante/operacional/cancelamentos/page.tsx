"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { XCircle } from "lucide-react";

const cancelamentos = [
    { motivo: "Atraso na entrega", qtd: 42 },
    { motivo: "Pedido errado", qtd: 28 },
    { motivo: "Cliente desistiu", qtd: 18 },
    { motivo: "Item indispon\u00edvel", qtd: 15 },
    { motivo: "Qualidade", qtd: 8 },
];
const COLORS = ["#DC2626", "#EA580C", "#D97706", "#8B5E3C", "#64748B"];

export default function CancelamentosPage() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{"Cancelamento & Refa\u00e7\u00e3o"}</h1>
                <p className="text-gray-500">{"Motivos de perda e desperd\u00edcio"}</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-red-500">
                    <div className="flex items-center gap-2 mb-1"><XCircle className="w-4 h-4 text-red-500" /><span className="text-xs font-bold text-gray-400 uppercase">Total Cancelamentos</span></div>
                    <p className="text-3xl font-bold text-gray-900">111</p>
                    <p className="text-xs text-red-500 font-medium">2,9% dos pedidos</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-amber-600">
                    <span className="text-xs font-bold text-gray-400 uppercase">{"Refa\u00e7\u00f5es"}</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">34</p>
                    <p className="text-xs text-amber-600 font-medium">0,9% dos pedidos</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Motivos Principais</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={cancelamentos} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis dataKey="motivo" type="category" width={140} tick={{ fill: '#374151', fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                        <Bar dataKey="qtd" radius={[0, 6, 6, 0]}>
                            {cancelamentos.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
