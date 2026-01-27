"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Calculator, Users, Loader2, MessageSquare, BarChart2, MapPin, ChevronDown, Trophy, Building2 } from "lucide-react";
import Link from "next/link";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

interface EnemStats {
    total: number;
    medias: {
        matematica: number;
        linguagens: number;
        humanas: number;
        natureza: number;
        redacao: number;
    };
    areas: Array<{ area: string; sigla: string; media: number }>;
    estados: Array<{ uf: string; media_mt: number; media_redacao: number; total_alunos: number }>;
    listaUFs: string[];
}

interface CidadeData {
    cidade: string;
    media_mt: number;
    media_cn: number;
    media_ch: number;
    media_lc: number;
    media_redacao: number;
    total_alunos: number;
}

interface EstadoDetail {
    uf: string;
    estado: {
        media_mt: number;
        media_cn: number;
        media_ch: number;
        media_lc: number;
        media_redacao: number;
        total_alunos: number;
    } | null;
    topCidades: CidadeData[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];
const BAR_COLORS = [
    '#6366f1', '#7c3aed', '#8b5cf6', '#a855f7', '#c026d3',
    '#d946ef', '#e879f9', '#ec4899', '#f43f5e', '#fb7185',
    '#f97316', '#fbbf24', '#facc15', '#a3e635', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
    '#2563eb', '#4f46e5', '#6366f1', '#7c3aed', '#8b5cf6',
    '#9333ea', '#a855f7'
];

const UF_NAMES: Record<string, string> = {
    'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
    'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
    'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
    'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
    'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
    'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
    'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
};

export default function EnemPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<EnemStats | null>(null);
    const [selectedUF, setSelectedUF] = useState<string>("");
    const [estadoDetail, setEstadoDetail] = useState<EstadoDetail | null>(null);
    const [loadingCidades, setLoadingCidades] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/enem/stats');
                if (!res.ok) throw new Error('Falha ao conectar com servidor');
                const data = await res.json();

                if (data.error) throw new Error(data.details || 'Erro ao processar dados');
                setStats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Fetch dados do estado quando selecionado
    useEffect(() => {
        if (!selectedUF) {
            setEstadoDetail(null);
            return;
        }

        async function fetchCidades() {
            setLoadingCidades(true);
            try {
                const res = await fetch(`/api/enem/cidades?uf=${selectedUF}`);
                if (!res.ok) throw new Error('Falha ao carregar cidades');
                const data = await res.json();
                setEstadoDetail(data);
            } catch (err) {
                console.error('Erro ao carregar cidades:', err);
            } finally {
                setLoadingCidades(false);
            }
        }
        fetchCidades();
    }, [selectedUF]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-gray-600 font-medium">Carregando dados do ENEM...</p>
                <p className="text-xs text-gray-400">Consultando tabelas agregadas</p>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-lg text-center">
                    <h2 className="text-red-700 font-bold text-xl mb-2">Falha no Carregamento</h2>
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const radarData = [
        { subject: 'Matemática', value: stats.medias.matematica, fullMark: 1000 },
        { subject: 'Linguagens', value: stats.medias.linguagens, fullMark: 1000 },
        { subject: 'Humanas', value: stats.medias.humanas, fullMark: 1000 },
        { subject: 'Natureza', value: stats.medias.natureza, fullMark: 1000 },
        { subject: 'Redação', value: stats.medias.redacao, fullMark: 1000 },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Cabeçalho */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">ENEM 2024</h1>
                    <p className="text-gray-500">Panorama Nacional ({stats.total.toLocaleString('pt-BR')} participantes)</p>
                </div>
            </div>

            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-3xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-xl"><Users className="w-6 h-6" /></div>
                        <p className="text-indigo-100 text-sm font-medium">Total de Participantes</p>
                    </div>
                    <h2 className="text-3xl font-bold">{stats.total.toLocaleString('pt-BR')}</h2>
                    <p className="text-xs text-indigo-200 mt-2">Dados agregados por região</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg"><Calculator className="w-5 h-5 text-purple-600" /></div>
                        <p className="text-sm font-medium text-gray-500">Matemática</p>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.medias.matematica}</h3>
                    <p className="text-xs text-gray-400 mt-1">Média Nacional</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-pink-50 rounded-lg"><MessageSquare className="w-5 h-5 text-pink-600" /></div>
                        <p className="text-sm font-medium text-gray-500">Redação</p>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.medias.redacao}</h3>
                    <p className="text-xs text-gray-400 mt-1">Média Nacional</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600" /></div>
                        <p className="text-sm font-medium text-gray-500">Média Geral</p>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">
                        {Math.round((stats.medias.matematica + stats.medias.linguagens + stats.medias.humanas + stats.medias.natureza + stats.medias.redacao) / 5)}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Considerando 5 áreas</p>
                </div>
            </div>

            {/* Gráfico de Barras por Estado */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-indigo-500" />
                        Média de Matemática por Estado
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        {stats.estados?.length || 0} estados
                    </span>
                </div>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.estados} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis
                                dataKey="uf"
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis
                                domain={[400, 600]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    padding: '12px'
                                }}
                                formatter={(value: any) => [`${value} pts`, 'Média MT']}
                                labelFormatter={(label) => UF_NAMES[label] || label}
                            />
                            <Bar dataKey="media_mt" radius={[6, 6, 0, 0]} animationDuration={1500}>
                                {stats.estados?.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Drill-down por Estado */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-400" />
                        Análise por Estado (Drill-down)
                    </h3>
                    <div className="relative">
                        <select
                            value={selectedUF}
                            onChange={(e) => setSelectedUF(e.target.value)}
                            className="appearance-none bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer min-w-[200px]"
                        >
                            <option value="" className="bg-slate-800">Selecione um estado...</option>
                            {stats.listaUFs?.map((uf) => (
                                <option key={uf} value={uf} className="bg-slate-800">
                                    {uf} - {UF_NAMES[uf] || uf}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                    </div>
                </div>

                {!selectedUF && (
                    <div className="text-center py-12 text-white/60">
                        <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Selecione um estado para ver o ranking das cidades</p>
                    </div>
                )}

                {loadingCidades && (
                    <div className="flex items-center justify-center py-12 gap-3">
                        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                        <p className="text-white/60">Carregando cidades...</p>
                    </div>
                )}

                {selectedUF && !loadingCidades && estadoDetail && (
                    <div className="space-y-6">
                        {/* KPIs do Estado */}
                        {estadoDetail.estado && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="bg-white/10 rounded-xl p-4">
                                    <p className="text-xs text-indigo-300 mb-1">Matemática</p>
                                    <p className="text-2xl font-bold text-white">{estadoDetail.estado.media_mt}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4">
                                    <p className="text-xs text-pink-300 mb-1">Redação</p>
                                    <p className="text-2xl font-bold text-white">{estadoDetail.estado.media_redacao}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4">
                                    <p className="text-xs text-cyan-300 mb-1">Linguagens</p>
                                    <p className="text-2xl font-bold text-white">{estadoDetail.estado.media_lc}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4">
                                    <p className="text-xs text-amber-300 mb-1">Humanas</p>
                                    <p className="text-2xl font-bold text-white">{estadoDetail.estado.media_ch}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4">
                                    <p className="text-xs text-green-300 mb-1">Participantes</p>
                                    <p className="text-2xl font-bold text-white">{estadoDetail.estado.total_alunos.toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                        )}

                        {/* Top 10 Cidades */}
                        <div>
                            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                Top 10 Cidades - {UF_NAMES[selectedUF] || selectedUF}
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-white/60 border-b border-white/10">
                                            <th className="pb-3 pl-4">#</th>
                                            <th className="pb-3">Cidade</th>
                                            <th className="pb-3 text-center">MT</th>
                                            <th className="pb-3 text-center">Redação</th>
                                            <th className="pb-3 text-center">LC</th>
                                            <th className="pb-3 text-center">CH</th>
                                            <th className="pb-3 text-center">CN</th>
                                            <th className="pb-3 text-right pr-4">Participantes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {estadoDetail.topCidades.map((cidade, index) => (
                                            <tr
                                                key={cidade.cidade}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="py-3 pl-4">
                                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-amber-500 text-white' :
                                                        index === 1 ? 'bg-gray-400 text-white' :
                                                            index === 2 ? 'bg-amber-700 text-white' :
                                                                'bg-white/10 text-white/60'
                                                        }`}>
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-white font-medium">{cidade.cidade}</td>
                                                <td className="py-3 text-center">
                                                    <span className="bg-indigo-500/30 text-indigo-300 px-2 py-1 rounded-lg font-semibold">
                                                        {cidade.media_mt}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-center text-white/80">{cidade.media_redacao}</td>
                                                <td className="py-3 text-center text-white/80">{cidade.media_lc}</td>
                                                <td className="py-3 text-center text-white/80">{cidade.media_ch}</td>
                                                <td className="py-3 text-center text-white/80">{cidade.media_cn}</td>
                                                <td className="py-3 text-right pr-4 text-white/60">{cidade.total_alunos.toLocaleString('pt-BR')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Gráficos de Área */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Barras por Área */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-indigo-500" />
                        Médias por Área do Conhecimento
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.areas} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="sigla" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 1000]} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [`${value} pts`, 'Média']}
                                    labelFormatter={(label) => stats.areas.find(a => a.sigla === label)?.area || label}
                                />
                                <Bar dataKey="media" radius={[8, 8, 0, 0]} animationDuration={1500}>
                                    {stats.areas.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Radar */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-6">Perfil de Desempenho Nacional</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={100} data={radarData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 1000]} tick={false} axisLine={false} />
                                <Radar
                                    name="Média Nacional"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    fill="#6366f1"
                                    fillOpacity={0.6}
                                />
                                <Tooltip formatter={(value: any) => [`${value} pts`, 'Média']} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
