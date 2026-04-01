"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Clock, Truck } from "lucide-react";

const tempos = [
    { semana: "Sem 1", preparo: 18, entrega: 32 },
    { semana: "Sem 2", preparo: 16, entrega: 30 },
    { semana: "Sem 3", preparo: 17, entrega: 28 },
    { semana: "Sem 4", preparo: 15, entrega: 27 },
];

export default function TemposPage() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tempo de Preparo & Entrega</h1>
                <p className="text-gray-500">{"Evolu\u00e7\u00e3o do SLA de cozinha e log\u00edstica"}</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-amber-600">
                    <div className="flex items-center gap-2 mb-1"><Clock className="w-4 h-4 text-amber-600" /><span className="text-xs font-bold text-gray-400 uppercase">{"Tempo M\u00e9dio Preparo"}</span></div>
                    <p className="text-3xl font-bold text-gray-900">15 min</p>
                    <p className="text-xs text-emerald-500">Meta atingida!</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-orange-500">
                    <div className="flex items-center gap-2 mb-1"><Truck className="w-4 h-4 text-orange-500" /><span className="text-xs font-bold text-gray-400 uppercase">{"Tempo M\u00e9dio Entrega"}</span></div>
                    <p className="text-3xl font-bold text-gray-900">27 min</p>
                    <p className="text-xs text-amber-500">Meta: 25 min</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{"Evolu\u00e7\u00e3o Semanal (min)"}</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={tempos}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="semana" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                        <Legend />
                        <Line type="monotone" dataKey="preparo" name="Preparo" stroke="#D97706" strokeWidth={3} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="entrega" name="Entrega" stroke="#EA580C" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
