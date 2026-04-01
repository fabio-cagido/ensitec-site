"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Heart, Star } from "lucide-react";

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
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{"NPS & Avalia\u00e7\u00f5es"}</h1>
                <p className="text-gray-500">{"Satisfa\u00e7\u00e3o do cliente e feedback"}</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex items-center gap-2 mb-2"><Heart className="w-5 h-5 text-amber-200" /><span className="text-sm font-medium text-amber-200">NPS Score</span></div>
                    <p className="text-5xl font-bold">49</p>
                    <p className="text-xs text-amber-200/70 mt-2">Zona de Qualidade</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{"Distribui\u00e7\u00e3o NPS"}</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={npsData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{"Distribui\u00e7\u00e3o de Notas"}</h3>
                <div className="space-y-4">
                    {avaliacoes.map((av, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1"><span className="text-gray-700 font-medium">{av.nota}</span><span className="font-bold text-gray-900">{av.qtd}</span></div>
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${(av.qtd / 485) * 100}%`, backgroundColor: av.cor }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
