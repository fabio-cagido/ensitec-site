"use client";
import { CreditCard, Target } from "lucide-react";

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

const pagamentos = [
    { name: "PIX", valor: 71232, pct: 38, cor: "#8B5E3C" },
    { name: "Crédito", valor: 52486, pct: 28, cor: "#D97706" },
    { name: "Débito", valor: 33741, pct: 18, cor: "#059669" },
    { name: "VA / VR", valor: 22494, pct: 12, cor: "#6366F1" },
    { name: "Dinheiro", valor: 7498, pct: 4, cor: "#64748B" },
];

export default function PagamentosPage() {
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Formas de Pagamento</h1>
                <p className="text-gray-500">{"Recebimento por método e conciliação"}</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                {pagamentos.map((pg, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 hover:shadow-md transition-shadow relative overflow-hidden" style={{ borderTopColor: pg.cor }}>
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" style={{ color: pg.cor }} />
                                <span className="text-xs font-bold text-gray-400 uppercase">{pg.name}</span>
                            </div>
                            <IntegrarBadge />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{pg.pct}%</p>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-tighter font-bold opacity-30">Exemplo</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <MockOverlay text="Fluxo de Caixa — Integrar TEF/PDV" />
                <h3 className="text-lg font-bold text-gray-900 mb-4">{"Distribuição Visual"}</h3>
                <div className="space-y-4 opacity-70 grayscale-[0.3]">
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

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                    <Target className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-amber-900">Como estes dados são coletados?</h4>
                    <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
                        Para visualizar o faturamento real por forma de pagamento, é necessário integrar o seu sistema de frente de caixa (PDV) ou TEF com o Ensitec BI. Nossa API suporta os principais players do mercado.
                    </p>
                </div>
            </div>
        </div>
    );
}
