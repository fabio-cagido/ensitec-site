"use client";
import { AlertTriangle, CheckCircle, Target } from "lucide-react";

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

const cmvItens = [
    { name: "Cerveja Chopp 600ml", custo: 3.20, venda: 21.00, cmv: 15.2 },
    { name: "Picanha Grelhada", custo: 26.60, venda: 70.00, cmv: 38.0 },
    { name: "Filé de Frango", custo: 8.96, venda: 28.00, cmv: 32.0 },
    { name: "Combo Executivo", custo: 14.00, venda: 35.00, cmv: 40.0 },
    { name: "Carpaccio", custo: 24.75, venda: 45.00, cmv: 55.0 },
    { name: "Risoto Camarão", custo: 28.00, venda: 68.00, cmv: 41.2 },
    { name: "Sobremesa Brownie", custo: 7.00, venda: 20.00, cmv: 35.0 },
    { name: "Suco Natural", custo: 3.90, venda: 13.00, cmv: 30.0 },
];

export default function CMVPage() {
    const cmvMedio = (cmvItens.reduce((a, c) => a + c.cmv, 0) / cmvItens.length).toFixed(1);
    
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">CMV Simulado</h1>
                <p className="text-gray-500">{"Custo de Mercadoria Vendida — análise por item"}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-amber-600 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase">{"CMV Médio (Exemplo)"}</span>
                        <IntegrarBadge />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{cmvMedio}%</p>
                    <p className="text-xs text-amber-600 font-medium">Meta Sugerida: 30%</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-emerald-500">
                    <span className="text-xs font-bold text-gray-400 uppercase">Margem Bruta Est.</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{(100 - parseFloat(cmvMedio)).toFixed(1)}%</p>
                    <p className="text-xs text-gray-400">Baseado em preços de mercado</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <MockOverlay text="CMV Real — Integrar Insumos/Estoque" />
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Detalhamento por Item (Simulado)</h3>
                    <IntegrarBadge />
                </div>
                <div className="overflow-x-auto opacity-70">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                                <th className="pb-3 font-medium">Item</th>
                                <th className="pb-3 font-medium text-right">Custo</th>
                                <th className="pb-3 font-medium text-right">Venda</th>
                                <th className="pb-3 font-medium text-right">CMV</th>
                                <th className="pb-3 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cmvItens.map((item, i) => (
                                <tr key={i} className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors">
                                    <td className="py-3 font-medium text-gray-900">{item.name}</td>
                                    <td className="py-3 text-right text-gray-600">R$ {item.custo.toFixed(2)}</td>
                                    <td className="py-3 text-right text-gray-900 font-medium">R$ {item.venda.toFixed(2)}</td>
                                    <td className="py-3 text-right">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.cmv > 40 ? 'bg-red-50 text-red-600' : item.cmv > 30 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{item.cmv}%</span>
                                    </td>
                                    <td className="py-3 text-right">
                                        {item.cmv <= 30 ? <CheckCircle className="w-4 h-4 text-emerald-500 inline" /> : <AlertTriangle className="w-4 h-4 text-amber-500 inline" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
