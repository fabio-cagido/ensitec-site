"use client";
import Link from "next/link";
import { ArrowLeft, Utensils, TrendingDown, Users, AlertTriangle } from "lucide-react";

export default function AlimentacaoPage() {
    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/operacional" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Alimentação Escolar</h1>
                    <p className="text-gray-500">Controle da Cantina e Refeitório</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Refeições Servidas</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">450</h3>
                    <span className="text-xs text-gray-400 mt-2">Hoje</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Desperdício</p>
                    <h3 className="text-2xl font-bold text-red-500 mt-1">4.2%</h3>
                    <span className="text-xs text-red-500 mt-2">Acima da meta (3%)</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Custo Unitário</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">R$ 12,50</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Satisfação</p>
                    <h3 className="text-2xl font-bold text-yellow-500 mt-1">8.5</h3>
                    <span className="text-xs text-gray-400 mt-2">NPS</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Cardápio da Semana</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Segunda-feira</span>
                            <p className="font-medium text-gray-900">Arroz, Feijão, Frango Grelhado e Salada</p>
                        </div>
                        <span className="text-sm text-green-600 font-bold">Aprovado</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Terça-feira</span>
                            <p className="font-medium text-gray-900">Macarrão à Bolonhesa</p>
                        </div>
                        <span className="text-sm text-green-600 font-bold">Aprovado</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Quarta-feira</span>
                            <p className="font-medium text-gray-900">Peixe Assado com Legumes</p>
                        </div>
                        <span className="text-sm text-green-600 font-bold">Aprovado</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
