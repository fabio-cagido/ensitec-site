"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, Legend, ZAxis } from "recharts";
import { UtensilsCrossed, TrendingUp, TrendingDown, Star, AlertTriangle, Award } from "lucide-react";

const COLORS = { brown: "#8B5E3C", amber: "#D97706", emerald: "#059669", red: "#DC2626", indigo: "#6366F1", orange: "#EA580C" };

// Matriz BCG Mock - Estrela, Vaca Leiteira, Interrogação, Abacaxi
const matrizBCG = [
    { name: "Picanha Grelhada", vendas: 320, margem: 42, tipo: "estrela" },
    { name: "Filé de Frango", vendas: 280, margem: 38, tipo: "estrela" },
    { name: "Cerveja Chopp", vendas: 450, margem: 55, tipo: "estrela" },
    { name: "Refrigerante", vendas: 380, margem: 60, tipo: "vaca" },
    { name: "Ãgua Mineral", vendas: 200, margem: 65, tipo: "vaca" },
    { name: "Risoto Camarão", vendas: 85, margem: 35, tipo: "interrogacao" },
    { name: "Salada Caesar", vendas: 60, margem: 30, tipo: "interrogacao" },
    { name: "Sobremesa Brownie", vendas: 45, margem: 50, tipo: "interrogacao" },
    { name: "Carpaccio", vendas: 30, margem: 15, tipo: "abacaxi" },
    { name: "Sopa do Dia", vendas: 22, margem: 12, tipo: "abacaxi" },
];

const topItens = [
    { name: "Cerveja Chopp 600ml", vendas: 450, receita: 9450, cmv: 28 },
    { name: "Refrigerante Lata", vendas: 380, receita: 2660, cmv: 35 },
    { name: "Picanha Grelhada", vendas: 320, receita: 22400, cmv: 38 },
    { name: "Filé de Frango", vendas: 280, receita: 7840, cmv: 32 },
    { name: "Combo Executivo", vendas: 245, receita: 8575, cmv: 40 },
    { name: "Ãgua Mineral", vendas: 200, receita: 1200, cmv: 20 },
    { name: "Batata Frita (P)", vendas: 195, receita: 3510, cmv: 25 },
    { name: "Suco Natural", vendas: 170, receita: 2210, cmv: 30 },
    { name: "Sobremesa Brownie", vendas: 45, receita: 900, cmv: 35 },
    { name: "Carpaccio", vendas: 30, receita: 1350, cmv: 55 },
];

const cmvResumo = { cmvMedio: 33.4, meta: 30, custoTotal: 62580, receitaTotal: 187450 };

const getColor = (tipo: string) => {
    if (tipo === 'estrela') return COLORS.amber;
    if (tipo === 'vaca') return COLORS.emerald;
    if (tipo === 'interrogacao') return COLORS.indigo;
    return COLORS.red;
};

export default function CardapioPage() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Engenharia de Cardápio</h1>
                <p className="text-gray-500">Análise de rentabilidade por item e otimização de mix de produtos</p>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-amber-600">
                    <span className="text-xs font-bold text-gray-400 uppercase">CMV Médio</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{cmvResumo.cmvMedio}%</p>
                    <p className="text-xs text-amber-600 font-medium">Meta: {cmvResumo.meta}%</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-emerald-500">
                    <span className="text-xs font-bold text-gray-400 uppercase">Margem Bruta</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{(100 - cmvResumo.cmvMedio).toFixed(1)}%</p>
                    <p className="text-xs text-emerald-500 font-medium">R$ {((cmvResumo.receitaTotal - cmvResumo.custoTotal)/1000).toFixed(0)}k de lucro bruto</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4" style={{ borderTopColor: COLORS.brown }}>
                    <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Estrelas</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{matrizBCG.filter(i => i.tipo === 'estrela').length}</p>
                    <p className="text-xs text-gray-400">Itens alta venda + alta margem</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-red-500">
                    <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Abacaxis</span>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{matrizBCG.filter(i => i.tipo === 'abacaxi').length}</p>
                    <p className="text-xs text-gray-400">Baixa venda + baixa margem</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Matriz BCG */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Matriz BCG (Engenharia de Menu)</h3>
                    <p className="text-xs text-gray-400 mb-4">Vendas (X) vs Margem % (Y) â€” tamanho = receita</p>
                    <ResponsiveContainer width="100%" height={320}>
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="vendas" name="Vendas" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis dataKey="margem" name="Margem %" unit="%" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <ZAxis dataKey="vendas" range={[80, 400]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                            <Scatter data={matrizBCG}>
                                {matrizBCG.map((item, i) => <Cell key={i} fill={getColor(item.tipo)} />)}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS.amber}} />Estrela</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS.emerald}} />Vaca Leiteira</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS.indigo}} />Interrogação</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS.red}} />Abacaxi</span>
                    </div>
                </div>

                {/* Ranking de Itens */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Ranking de Itens</h3>
                    <p className="text-xs text-gray-400 mb-4">Top vendas vs CMV</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                                    <th className="pb-2 font-medium">#</th>
                                    <th className="pb-2 font-medium">Item</th>
                                    <th className="pb-2 font-medium text-right">Vendas</th>
                                    <th className="pb-2 font-medium text-right">Receita</th>
                                    <th className="pb-2 font-medium text-right">CMV</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topItens.map((item, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors">
                                        <td className="py-2.5 font-bold text-gray-400">{i + 1}</td>
                                        <td className="py-2.5 font-medium text-gray-900 text-xs">{item.name}</td>
                                        <td className="py-2.5 text-right text-gray-600">{item.vendas}</td>
                                        <td className="py-2.5 text-right font-medium text-gray-900">R$ {(item.receita/1000).toFixed(1)}k</td>
                                        <td className="py-2.5 text-right">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.cmv > 40 ? 'bg-red-50 text-red-600' : item.cmv > 30 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                                {item.cmv}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

