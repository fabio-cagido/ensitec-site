"use client";
import { CreditCard } from "lucide-react";

const pagamentos = [
    { name: "PIX", valor: 71232, pct: 38, cor: "#8B5E3C" },
    { name: "Cr\u00e9dito", valor: 52486, pct: 28, cor: "#D97706" },
    { name: "D\u00e9bito", valor: 33741, pct: 18, cor: "#059669" },
    { name: "VA / VR", valor: 22494, pct: 12, cor: "#6366F1" },
    { name: "Dinheiro", valor: 7498, pct: 4, cor: "#64748B" },
];

export default function PagamentosPage() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Formas de Pagamento</h1>
                <p className="text-gray-500">{"Recebimento por m\u00e9todo e concilia\u00e7\u00e3o"}</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                {pagamentos.map((pg, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 hover:shadow-md transition-shadow" style={{ borderTopColor: pg.cor }}>
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-4 h-4" style={{ color: pg.cor }} />
                            <span className="text-xs font-bold text-gray-400 uppercase">{pg.name}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{pg.pct}%</p>
                        <p className="text-xs text-gray-400 mt-1">R$ {(pg.valor / 1000).toFixed(1)}k</p>
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{"Distribui\u00e7\u00e3o Visual"}</h3>
                <div className="space-y-4">
                    {pagamentos.map((pg, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-gray-700 font-medium">{pg.name}</span>
                                <span className="font-bold text-gray-900">{pg.pct}% <span className="text-gray-400 font-normal text-xs">(R$ {(pg.valor / 1000).toFixed(1)}k)</span></span>
                            </div>
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pg.pct}%`, backgroundColor: pg.cor }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
