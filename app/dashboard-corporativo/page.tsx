"use client";
import { Building2, TrendingUp, Users, Wallet, ArrowRight } from "lucide-react";

export default function DashboardCorporativoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans p-8">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Módulo Corporativo</h1>
        </div>
        <p className="text-gray-500">Gestão integrada da holding e inteligência empresarial.</p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center -mt-20">
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-2xl text-center">
                <div className="inline-flex items-center justify-center p-4 bg-emerald-50 rounded-2xl text-emerald-600 mb-6">
                    <TrendingUp className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Em Desenvolvimento</h2>
                <p className="text-gray-600 mb-8">
                    Estamos preparando uma visão consolidada de **DRE, Fluxo de Caixa Global e Gestão de Talentos**. Este módulo conectará todas as suas unidades em uma única fonte de verdade corporativa.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center">
                        <Wallet className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-[10px] uppercase font-bold text-gray-400">Financeiro</span>
                        <div className="w-12 h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-emerald-500 w-2/3 animate-pulse"></div>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center">
                        <Users className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-[10px] uppercase font-bold text-gray-400">Pessoas & RH</span>
                        <div className="w-12 h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-blue-500 w-1/3 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <a href="/dashboard-hub" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
                    Voltar ao Hub <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
}
