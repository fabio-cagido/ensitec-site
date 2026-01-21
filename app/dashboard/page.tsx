"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Link from "next/link"; // Adicionar import Link

// 1. Criamos um componente de carregamento simples
const MapPlaceholder = () => (
  <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-2xl">
    <p className="text-gray-400 animate-pulse">Carregando mapa geográfico...</p>
  </div>
);

// 2. Importamos o mapa SEM tipagem complexa para não travar o build da Vercel
const MapWithNoSSR = dynamic(
  () => import("./map-component"), // Vamos criar este arquivo abaixo
  {
    ssr: false,
    loading: () => <MapPlaceholder />
  }
);

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Executivo</h1>
        <p className="text-gray-500">Monitoramento estratégico Ensitec</p>
      </header>

      {/* INDICADORES (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {/* Card Acadêmico */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-blue-500">
          <span className="text-xs font-bold text-gray-400 uppercase">Acadêmico</span>
          <div className="text-3xl font-bold mt-2 text-gray-900">94.2%</div>
          <p className="text-xs text-blue-500 font-medium mb-1">Frequência Geral</p> {/* Legenda Adicionada */}
          <div className="mt-4 pt-4 border-t border-gray-50 text-[11px]">
            <div className="flex justify-between mb-1 text-gray-500"><span>Média Gl.</span><span className="text-blue-600 font-bold">7.8</span></div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[78%]"></div></div>
          </div>
        </div>
        {/* Card Financeiro */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-emerald-500">
          <span className="text-xs font-bold text-gray-400 uppercase">Financeiro</span>
          <div className="text-3xl font-bold mt-2 text-gray-900">12.5%</div>
          <p className="text-xs text-emerald-500 font-medium mb-1">Margem Líquida</p> {/* Legenda Adicionada */}
          <div className="mt-4 pt-4 border-t border-gray-50 text-[11px]">
            <div className="flex justify-between mb-1 text-gray-500"><span>Execução</span><span className="text-emerald-600 font-bold">64%</span></div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[64%]"></div></div>
          </div>
        </div>
        {/* Card Clientes */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-orange-500">
          <span className="text-xs font-bold text-gray-400 uppercase">Clientes</span>
          <div className="text-3xl font-bold mt-2 text-gray-900">450</div>
          <p className="text-xs text-orange-500 font-medium mb-1">Total de Alunos</p> {/* Legenda Adicionada */}
          <div className="mt-4 pt-4 border-t border-gray-50 text-[11px]">
            <div className="flex justify-between mb-1 text-gray-500"><span>Bolsistas</span><span className="text-orange-600 font-bold">18%</span></div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="bg-orange-500 h-full w-[18%]"></div></div>
          </div>
        </div>
        {/* Card Operacional */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-purple-500">
          <span className="text-xs font-bold text-gray-400 uppercase">Operacional</span>
          <div className="text-3xl font-bold mt-2 text-gray-900">24</div>
          <p className="text-xs text-purple-500 font-medium mb-1">Chamados Abertos</p> {/* Legenda Adicionada */}
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
            <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="bg-purple-500 h-full w-[40%]"></div></div>
            <span className="text-[10px] font-bold text-purple-600">40% CRÍTICOS</span>
          </div>
        </div>


        {/* Card ENEM (Novo) */}
        <Link href="/dashboard/enem" className="block transition-transform hover:scale-105">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-indigo-500 h-full cursor-pointer hover:shadow-md">
            <span className="text-xs font-bold text-gray-400 uppercase">Enem</span>
            <div className="text-3xl font-bold mt-2 text-gray-900">685</div>
            <p className="text-xs text-indigo-500 font-medium mb-1">Média Geral (TRI)</p> {/* Legenda Adicionada */}
            <div className="mt-4 pt-4 border-t border-gray-50 text-[11px]">
              <div className="flex justify-between mb-1 text-gray-500"><span>Aprovação</span><span className="text-indigo-600 font-bold">82%</span></div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full w-[82%]"></div></div>
            </div>
          </div>
        </Link>
      </div>

      {/* ÁREA DO MAPA */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
        <div className="mb-6 flex justify-between items-center text-gray-900">
          <h3 className="text-xl font-bold">Geolocalização de Alunos</h3>
          <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Rio de Janeiro, RJ</span>
        </div>
        <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200">
          {isMounted && <MapWithNoSSR />}
        </div>
      </div>
    </>
  );
}