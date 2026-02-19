"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    Sector
} from 'recharts';
import {
    Users,
    Fingerprint,
    CalendarDays,
    Wallet,
    MapPin,
    Map as MapIcon,
    GraduationCap,
    TrendingUp,
    Info
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { ClientFilterBar, ClientFilterState } from "../components/ClientFilterBar";
import { Loader2 } from "lucide-react";

// Importação dinâmica do mapa para evitar erros de SSR com Leaflet
const StudentMap = dynamic(() => import("../components/StudentMap"), {
    ssr: false,
    loading: () => (
        <div className="h-[500px] w-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center border border-gray-100">
            <p className="text-gray-400 font-medium">Carregando mapa interativo...</p>
        </div>
    )
});

const GENDER_COLORS = ["#3b82f6", "#ec4899"]; // Blue, Pink (Matching Clientes PIE_COLORS)
const RACE_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#a855f7"];

// Componente para renderizar o setor ativo da Pie com destaque
const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 8}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                cornerRadius={8}
            />
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius - 4}
                outerRadius={innerRadius - 2}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                opacity={0.3}
            />
        </g>
    );
};

export default function PerfilAlunoPage() {
    const [genderData, setGenderData] = useState<any[]>([]);
    const [raceData, setRaceData] = useState<any[]>([]);
    const [ageData, setAgeData] = useState<any[]>([]);
    const [incomeData, setIncomeData] = useState<any[]>([]);
    const [neighborhoodData, setNeighborhoodData] = useState<any[]>([]);
    const [locationData, setLocationData] = useState<any[]>([]);
    const [totalStudents, setTotalStudents] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ClientFilterState | null>(null);
    const [activeIndexGender, setActiveIndexGender] = useState(0);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const getParams = (metric: string, type?: string) => {
                const p = new URLSearchParams();
                p.append('metric', metric);
                if (type) p.append('type', type);
                if (filters) {
                    if (filters.unidades.length) p.append('unidades', filters.unidades.join(','));
                    if (filters.segmentos.length) p.append('segmentos', filters.segmentos.join(','));
                    if (filters.anos.length) p.append('anos', filters.anos.join(','));
                }
                return p.toString();
            };

            try {
                const [gRes, rRes, aRes, incRes, nRes, lRes, tRes] = await Promise.all([
                    fetch(`/api/dashboard/analytics?${getParams('demography', 'gender')}`),
                    fetch(`/api/dashboard/analytics?${getParams('demography', 'race')}`),
                    fetch(`/api/dashboard/analytics?${getParams('demography', 'age')}`),
                    fetch(`/api/dashboard/analytics?${getParams('demography', 'income')}`),
                    fetch(`/api/dashboard/analytics?${getParams('demography', 'neighborhood')}`),
                    fetch(`/api/dashboard/analytics?${getParams('locations')}`),
                    fetch(`/api/dashboard/analytics?${getParams('total-students')}`)
                ]);

                const [g, r, a, inc, n, l, t] = await Promise.all([
                    gRes.json(), rRes.json(), aRes.json(),
                    incRes.json(), nRes.json(), lRes.json(), tRes.json()
                ]);

                if (Array.isArray(g)) setGenderData(g);
                if (Array.isArray(r)) setRaceData(r);
                if (Array.isArray(a)) setAgeData([...a].sort((x, y) => y.value - x.value));
                if (Array.isArray(inc)) setIncomeData(inc);
                if (Array.isArray(n)) setNeighborhoodData(n);
                if (Array.isArray(l)) setLocationData(l);

                if (Array.isArray(t)) {
                    setTotalStudents(t.reduce((sum: number, item: any) => sum + item.value, 0));
                }
            } catch (err) {
                console.error("Error fetching student profile data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [filters]);

    if (loading && !filters) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-gray-600 font-medium">Carregando perfil do aluno...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <PageHeader
                title="Perfil do Aluno"
                subtitle="Análise demográfica, geográfica e socioeconômica"
                showLogo={true}
            />

            <ClientFilterBar onFilterChange={setFilters} />

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +2.4%
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mt-4">Total de Alunos</p>
                        <h3 className="text-3xl font-bold text-gray-900">{totalStudents.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <GraduationCap className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mt-4">Ponto de Equilíbrio</p>
                        <h3 className="text-3xl font-bold text-gray-900">11-14 anos</h3>
                        <p className="text-xs text-gray-400 mt-1">Faixa Etária Predominante</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <Wallet className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mt-4">Renda Familiar Modal</p>
                        <h3 className="text-3xl font-bold text-gray-900">2 - 5 SM</h3>
                        <p className="text-xs text-gray-400 mt-1">Salários Mínimos</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mt-4">Maior Concentração</p>
                        <h3 className="text-3xl font-bold text-gray-900">Centro</h3>
                        <p className="text-xs text-gray-400 mt-1">Bairro com mais alunos</p>
                    </div>
                </div>
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Gênero */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            <h3 className="font-bold text-gray-900">Perfil: Gênero</h3>
                        </div>
                    </div>
                    <div className="h-72 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <defs>
                                    <linearGradient id="colorMale" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={1} />
                                    </linearGradient>
                                    <linearGradient id="colorFemale" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#db2777" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <Pie
                                    activeIndex={activeIndexGender}
                                    activeShape={renderActiveShape}
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={5}
                                    dataKey="value"
                                    onMouseEnter={(_, index) => setActiveIndexGender(index)}
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={index === 0 ? "url(#colorMale)" : "url(#colorFemale)"}
                                            stroke="none"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-2xl font-black text-gray-900 leading-none">
                                {genderData[activeIndexGender]?.value ?
                                    Math.round((genderData[activeIndexGender].value / totalStudents) * 100) : 0}%
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                                {genderData[activeIndexGender]?.name}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-50">
                        {genderData.map((item, idx) => (
                            <div key={item.name} className="flex flex-col">
                                <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">{item.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-black text-gray-900 tracking-tighter">{item.value.toLocaleString()}</span>
                                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-md">
                                        {Math.round((item.value / totalStudents) * 100)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Diversidade */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Fingerprint className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-bold text-gray-900">Perfil: Cor/Raça</h3>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={raceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" name="Alunos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Pirâmide Etária */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <CalendarDays className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold text-gray-900">Distribuição Etária</h3>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ageData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" name="Alunos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Renda Familiar */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Wallet className="w-5 h-5 text-emerald-500" />
                        <h3 className="font-bold text-gray-900">Renda Familiar (Salários Mínimos)</h3>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={incomeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" name="Alunos" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Geographic Analysis Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <MapIcon size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-xl tracking-tight">Análise Geoespacial</h3>
                            <p className="text-sm text-gray-500 font-medium">Distribuição e densidade por regiões (Bairros)</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <div className="px-5 py-2 bg-white rounded-lg shadow-sm border border-gray-50 text-center">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Concentração</p>
                            <p className="text-base font-black text-gray-900 leading-none">{neighborhoodData[0]?.name || '---'}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Bairros Chart */}
                    <div className="xl:col-span-1 border-r border-gray-50 pr-6 hidden xl:block">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Densidade por Bairro</h4>
                            <Info className="w-3.5 h-3.5 text-gray-300" />
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={neighborhoodData.slice(0, 10)} margin={{ left: -20, right: 30 }}>
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 13, fontWeight: 800 }}
                                        width={110}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc', radius: 4 }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16}>
                                        {neighborhoodData.map((_, index) => (
                                            <Cell key={`c-${index}`} fill={index === 0 ? '#3b82f6' : '#e2e8f0'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-5 p-4 bg-blue-50/70 rounded-xl border border-blue-100">
                            <p className="text-[11px] text-blue-700 font-black leading-relaxed">
                                Curitiba Central e Batel concentram 45% do volume total de matrículas.
                            </p>
                        </div>
                    </div>

                    {/* Interactive Map */}
                    <div className="xl:col-span-3 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
                        <StudentMap locations={locationData} />
                    </div>
                </div>
            </div>

            {/* Insight Card - Standard Project Style */}
            <div className="bg-slate-900 p-8 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center shadow-lg">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-400">
                        <Info className="w-5 h-5" />
                        <h4 className="text-sm font-bold uppercase tracking-widest">Resumo Estratégico</h4>
                    </div>
                    <p className="text-lg font-medium max-w-2xl leading-relaxed">
                        A maior concentração de alunos está na faixa de <span className="text-blue-400 font-bold">2 a 5 salários mínimos</span> e residem no <span className="text-blue-400 font-bold">Centro</span>. Recomenda-se otimização das rotas de transporte escolar para este cluster.
                    </p>
                </div>
                <div className="text-right mt-6 md:mt-0 bg-white/5 p-6 rounded-2xl border border-white/10 min-w-[200px]">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Confiança da Amostra</p>
                    <p className="text-3xl font-black text-blue-400">98%</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Base Integrada CRM</p>
                </div>
            </div>
        </div>
    );
}
