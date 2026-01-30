"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Link from "next/link"; // Adicionar import Link
import PageHeader from "@/components/dashboard/PageHeader";

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

  const [data, setData] = useState({
    academic: null as any,
    financial: null as any,
    clients: null as any,
    operational: null as any,
    enem: null as any,
    map: [] as any[]
  });

  useEffect(() => {
    setIsMounted(true);

    // Fetch summary data from all APIs
    const fetchData = async () => {
      try {
        const [academicRes, financialRes, clientRes, operationalRes, enemRes, mapRes] = await Promise.all([
          fetch('/api/dashboard/academico'),
          fetch('/api/dashboard/financeiro'),
          fetch('/api/dashboard/clientes'),
          fetch('/api/dashboard/operacional'),
          fetch('/api/enem/stats'),
          fetch('/api/dashboard/map')
        ]);

        const academic = await academicRes.json();
        const financial = await financialRes.json();
        const clients = await clientRes.json();
        const operational = await operationalRes.json();
        const enem = await enemRes.json();
        const map = await mapRes.json();

        setData({ academic, financial, clients, operational, enem, map: Array.isArray(map) ? map : [] });
      } catch (error) {
        console.error("Dashboard overview fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <PageHeader
        title="Dashboard Executivo"
        subtitle="Monitoramento estratégico Ensitec"
        showLogo={true}
      />

      {/* INDICADORES (Cards Dynamicos) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">

        {/* Card Acadêmico - Link para dashboard */}
        <Link href="/dashboard/academico" className="block hover:scale-105 transition-transform">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-blue-500 h-full">
            <span className="text-xs font-bold text-gray-400 uppercase">Acadêmico</span>
            <div className="text-3xl font-bold mt-2 text-gray-900">
              {data.academic ? `${data.academic.kpis.attendance}%` : '...'}
            </div>
            <p className="text-xs text-blue-500 font-medium mb-1">Frequência Geral</p>
            <div className="mt-4 pt-4 border-t border-gray-50 text-[11px]">
              <div className="flex justify-between mb-1 text-gray-500">
                <span>Média Gl.</span>
                <span className="text-blue-600 font-bold">{data.academic ? data.academic.kpis.mediaGlobal : '-'}</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: data.academic ? `${data.academic.kpis.mediaGlobal * 10}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </Link>

        {/* Card Financeiro */}
        <Link href="/dashboard/financeiro" className="block hover:scale-105 transition-transform">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-emerald-500 h-full">
            <span className="text-xs font-bold text-gray-400 uppercase">Financeiro</span>
            <div className="text-3xl font-bold mt-2 text-gray-900">
              {data.financial ? `R$ ${(data.financial.kpis.receitaTotal / 1000).toFixed(0)}k` : '...'}
            </div>
            <p className="text-xs text-emerald-500 font-medium mb-1">Faturamento Total</p>
            <div className="mt-4 pt-4 border-t border-gray-50 text-[11px]">
              <div className="flex justify-between mb-1 text-gray-500">
                <span>Inadimplência</span>
                <span className="text-emerald-600 font-bold">{data.financial ? `${data.financial.kpis.inadimplencia}%` : '-'}</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: data.financial ? `${100 - data.financial.kpis.inadimplencia}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </Link>

        {/* Card Clientes */}
        <Link href="/dashboard/clientes" className="block hover:scale-105 transition-transform">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-orange-500 h-full">
            <span className="text-xs font-bold text-gray-400 uppercase">Clientes</span>
            <div className="text-3xl font-bold mt-2 text-gray-900">
              {data.clients ? data.clients.kpis.totalStudents : '...'}
            </div>
            <p className="text-xs text-orange-500 font-medium mb-1">Total de Alunos</p>
            <div className="mt-4 pt-4 border-t border-gray-50 text-[11px]">
              <div className="flex justify-between mb-1 text-gray-500">
                <span>NPS</span>
                <span className="text-orange-600 font-bold">{data.clients ? data.clients.kpis.nps : '-'}</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full" style={{ width: data.clients ? `${data.clients.kpis.nps}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </Link>

        {/* Card Operacional */}
        <Link href="/dashboard/operacional" className="block hover:scale-105 transition-transform">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-purple-500 h-full">
            <span className="text-xs font-bold text-gray-400 uppercase">Operacional</span>
            <div className="text-3xl font-bold mt-2 text-gray-900">
              {data.operational ? data.operational.kpis.manutencao.split(' ')[0] : '...'}
            </div>
            <p className="text-xs text-purple-500 font-medium mb-1">Chamados Ativos</p>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
              <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[60%]"></div>
              </div>
              <span className="text-[10px] font-bold text-purple-600">RESOLUÇÃO EM DIA</span>
            </div>
          </div>
        </Link>

        {/* Card ENEM */}
        <Link href="/dashboard/enem" className="block transition-transform hover:scale-105">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-indigo-500 h-full cursor-pointer hover:shadow-md">
            <span className="text-xs font-bold text-gray-400 uppercase">Enem</span>
            <div className="text-3xl font-bold mt-2 text-gray-900">
              {data.enem && !data.enem.error ?
                Math.round((data.enem.medias.matematica + data.enem.medias.linguagens + data.enem.medias.humanas + data.enem.medias.natureza + data.enem.medias.redacao) / 5)
                : '685'}
            </div>
            <p className="text-xs text-indigo-500 font-medium mb-1">Média Geral (TRI)</p>
            <div className="mt-4 pt-4 border-t border-gray-50 text-[11px]">
              <div className="flex justify-between mb-1 text-gray-500">
                <span>Total Participantes</span>
                <span className="text-indigo-600 font-bold">
                  {data.enem && !data.enem.error ? data.enem.total.toLocaleString('pt-BR') : '-'}
                </span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ÁREA DO MAPA */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
        <div className="mb-6 flex justify-between items-center text-gray-900">
          <h3 className="text-xl font-bold">Geolocalização de Unidades</h3>
          <div className="flex gap-2">
            {data.map.length > 0 ? data.map.map((school: any) => (
              <span key={school.id} className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{school.city}</span>
            )) : (
              <>
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Rio de Janeiro</span>
                <span className="text-xs font-bold bg-green-50 text-green-600 px-3 py-1 rounded-full">São Paulo</span>
                <span className="text-xs font-bold bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full">Curitiba</span>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200">
          {isMounted && <MapWithNoSSR />}
        </div>
      </div>
    </>
  );
}