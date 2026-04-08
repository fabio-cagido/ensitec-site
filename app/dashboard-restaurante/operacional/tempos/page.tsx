"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Clock, Truck, Target } from "lucide-react";

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

const tempos = [
    { semana: "Sem 1", preparo: 18, entrega: 32 },
    { semana: "Sem 2", preparo: 16, entrega: 30 },
    { semana: "Sem 3", preparo: 17, entrega: 28 },
    { semana: "Sem 4", preparo: 15, entrega: 27 },
];

export default function TemposPage() {
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tempo de Preparo & Entrega</h1>
                <p className="text-gray-500">{"Evolução do SLA de cozinha e logística em tempo real"}</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-amber-600 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-bold text-gray-400 uppercase">{"Tempo Médio Preparo"}</span>
                        </div>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">15 min</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Dentro do SLA (Exemplo)</p>
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-orange-500 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-orange-500" />
                            <span className="text-xs font-bold text-gray-400 uppercase">{"Tempo Médio Entrega"}</span>
                        </div>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">27 min</p>
                    <p className="text-[10px] text-orange-600 font-bold uppercase tracking-tight">Abaixo da Meta (Exemplo)</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <MockOverlay text="SLA Kitchen — Integrar KDS" />
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{"Evolução Semanal (min)"}</h3>
                    <IntegrarBadge />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={tempos}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="semana" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                        <Legend />
                        <Line type="monotone" dataKey="preparo" name="Preparo" stroke="#D97706" strokeWidth={3} dot={{ r: 5 }} opacity={0.7} />
                        <Line type="monotone" dataKey="entrega" name="Entrega" stroke="#EA580C" strokeWidth={3} dot={{ r: 5 }} opacity={0.7} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
