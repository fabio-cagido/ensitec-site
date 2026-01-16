"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false });

const schoolPosition: [number, number] = [-22.9519, -43.1855];

const students = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  pos: [
    schoolPosition[0] + (Math.random() - 0.5) * 0.02,
    schoolPosition[1] + (Math.random() - 0.5) * 0.02,
  ] as [number, number],
}));

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando Dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <aside className="w-64 bg-gray-900 text-white p-6 hidden md:flex flex-col border-r border-gray-800">
        <h2 className="text-xl font-bold mb-10 text-blue-400">ENSITEC BI</h2>
        <nav className="flex-1 space-y-2">
          <button className="w-full text-left py-2.5 px-4 bg-blue-600 rounded-lg text-white font-medium shadow-lg">Visão Geral</button>
          <button className="w-full text-left py-2.5 px-4 text-gray-400 hover:text-white transition">Acadêmico</button>
          <button className="w-full text-left py-2.5 px-4 text-gray-400 hover:text-white transition">Financeiro</button>
          <button className="w-full text-left py-2.5 px-4 text-gray-400 hover:text-white transition">Operacional</button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Executivo</h1>
          <p className="text-gray-500">Monitoramento estratégico Ensitec</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-blue-500">
            <span className="text-xs font-bold text-gray-400 uppercase">Acadêmico</span>
            <div className="text-3xl font-bold mt-2">94.2%</div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-gray-500 font-medium">Média Global</span>
                <span className="text-blue-600 font-bold">7.8</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[78%]"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-emerald-500">
            <span className="text-xs font-bold text-gray-400 uppercase">Financeiro</span>
            <div className="text-3xl font-bold mt-2">12.5%</div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-gray-500 font-medium">Orçamento Gasto</span>
                <span className="text-emerald-600 font-bold">64%</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[64%]"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-orange-500">
            <span className="text-xs font-bold text-gray-400 uppercase">Clientes</span>
            <div className="text-3xl font-bold mt-2">450</div>
            <span className="text-xs text-gray-500">Total de Alunos Ativos</span>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-gray-500 font-medium">Bolsistas (100%)</span>
                <span className="text-orange-600 font-bold">18%</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden text-orange-600">
                <div className="bg-orange-500 h-full w-[18%]"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-purple-500">
            <span className="text-xs font-bold text-gray-400 uppercase">Operacional</span>
            <div className="text-3xl font-bold mt-2">24</div>
            <div className="mt-4 pt-4 border-t border-gray-50">
               <div className="flex items-center gap-2">
                 <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[40%]"></div>
                 </div>
                 <span className="text-[10px] font-bold text-purple-600 uppercase">40% Críticos</span>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-[600px] flex flex-col relative z-0">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Geolocalização de Alunos</h3>
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200">
            <MapContainer center={schoolPosition} zoom={15} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Circle center={schoolPosition} pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.3 }} radius={200} />
              {students.map((student) => (
                <Circle key={student.id} center={student.pos} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.6 }} radius={12} />
              ))}
            </MapContainer>
          </div>
        </div>
      </main>
    </div>
  );
}