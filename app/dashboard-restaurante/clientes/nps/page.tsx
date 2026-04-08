"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Heart, Star, Target } from "lucide-react";

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

const npsData = [
    { name: "Promotores", value: 62, cor: "#059669" },
    { name: "Neutros", value: 25, cor: "#D97706" },
    { name: "Detratores", value: 13, cor: "#DC2626" },
];

const avaliacoes = [
    { nota: "5 ★", qtd: 485, cor: "#059669" },
    { nota: "4 ★", qtd: 312, cor: "#10B981" },
    { nota: "3 ★", qtd: 128, cor: "#D97706" },
    { nota: "2 ★", qtd: 45, cor: "#EA580C" },
    { nota: "1 ★", qtd: 22, cor: "#DC2626" },
];

export default function NPSPage() {
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{"NPS & Avaliações"}</h1>
                <p className="text-gray-500">{"Satisfação do cliente e feedback em tempo real"}</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-amber-200" />
                            <span className="text-sm font-medium text-amber-200">NPS Score</span>
                        </div>
                        <IntegrarBadge />
                    </div>
                    <p className="text-5xl font-bold">49</p>
                    <p className="text-xs text-amber-200/70 mt-2">Zona de Qualidade (Dados de Exemplo)</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <MockOverlay text="Satisfação — Integrar Pesquisa" />
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-900">{"Distribuição NPS"}</h3>
                        <IntegrarBadge />
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={npsData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" opacity={0.7}>
                                {npsData.map((e, i) => <Cell key={i} fill={e.cor} />)}
                            </Pie>
                            <Tooltip formatter={(value: any) => `${value}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                        {npsData.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.cor }} /><span className="text-gray-600">{item.name}</span></div>
                                <span className="font-bold text-gray-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <MockOverlay text="Avaliações — Integrar iFood/Google" />
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{"Distribuição de Notas"}</h3>
                    <IntegrarBadge />
                </div>
                <div className="space-y-4 opacity-70 cursor-not-allowed">
                    {avaliacoes.map((av, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1"><span className="text-gray-700 font-medium">{av.nota}</span><span className="font-bold text-gray-900">{av.qtd}</span></div>
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(av.qtd / 485) * 100}%`, backgroundColor: av.cor }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
