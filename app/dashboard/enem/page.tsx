"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Calculator, Users, Loader2, MessageSquare, BarChart2, MapPin, ChevronDown, Trophy, Building2, School } from "lucide-react";
import Link from "next/link";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LabelList
} from 'recharts';

// --- MOCK DADOS DA ESCOLA (BENCHMARK) ---
const SCHOOL_DATA = {
    nome: "Colégio Modelo",
    medias: {
        matematica: 468, // Reduzido ~20% (era 585)
        linguagens: 448, // Reduzido ~20% (era 560)
        humanas: 456,    // Reduzido ~20% (era 570)
        natureza: 440,   // Reduzido ~20% (era 550)
        redacao: 576,    // Reduzido ~20% (era 720)
        geral: 477       // Média ajustada
    },
    total_participantes: 85
};
// ----------------------------------------

interface EnemStats {
    total: number;
    medias: {
        matematica: number;
        linguagens: number;
        humanas: number;
        natureza: number;
        redacao: number;
    };
    counts: {
        matematica: number;
        linguagens: number;
        humanas: number;
        natureza: number;
        redacao: number;
    };
    areas: Array<{ area: string; sigla: string; media: number; count: number }>;
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

const COLORS = ['#6366f1', '#10b981']; // Nacional (Indigo), Escola (Verde)
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

// COMPONENTE CUSTOMIZADO PARA O RÓTULO (ÍCONE)
const CustomBarLabel = (props: any) => {
    const { x, y, width, value } = props;

    // O 'value' vem do dataKey="uf" do LabelList
    if (value === 'COL. MODELO') {
        return (
            <g>
                <School
                    x={x + width / 2 - 12}
                    y={y - 35} // Subimos um pouco mais para garantir que não sobreponha
                    width={24}
                    height={24}
                    color="#4f46e5"
                    fill="white" // Preenchimento branco para destacar sobre as linhas de grade se houver
                    strokeWidth={2}
                />
                <text
                    x={x + width / 2}
                    y={y - 10}
                    fill="#4f46e5"
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight="bold"
                >
                    Você
                </text>
            </g>
        );
    }
    return null;
};

// ----------------------------------------

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
        { subject: 'Matemática', value: stats.medias.matematica, school: SCHOOL_DATA.medias.matematica, fullMark: 1000 },
        { subject: 'Linguagens', value: stats.medias.linguagens, school: SCHOOL_DATA.medias.linguagens, fullMark: 1000 },
        { subject: 'Humanas', value: stats.medias.humanas, school: SCHOOL_DATA.medias.humanas, fullMark: 1000 },
        { subject: 'Natureza', value: stats.medias.natureza, school: SCHOOL_DATA.medias.natureza, fullMark: 1000 },
        { subject: 'Redação', value: stats.medias.redacao, school: SCHOOL_DATA.medias.redacao, fullMark: 1000 },
    ];

    // Combinar dados da escola nos gráficos de área
    const areaDataComparison = stats.areas.map(a => {
        let schoolVal = 0;
        if (a.sigla === 'MT') schoolVal = SCHOOL_DATA.medias.matematica;
        if (a.sigla === 'CH') schoolVal = SCHOOL_DATA.medias.humanas;
        if (a.sigla === 'CN') schoolVal = SCHOOL_DATA.medias.natureza;
        if (a.sigla === 'LC') schoolVal = SCHOOL_DATA.medias.linguagens;
        if (a.sigla === 'RED') schoolVal = SCHOOL_DATA.medias.redacao;
        return {
            ...a,
            escola: schoolVal
        };
    });

    // Injetar escola no gráfico de estados e ORDENAR por nota (descrescente)
    const stateChartData = [
        { uf: 'COL. MODELO', media_mt: SCHOOL_DATA.medias.matematica, isSchool: true },
        ...stats.estados
    ].sort((a, b) => b.media_mt - a.media_mt);

    // Calcula média nacional geral
    const mediaGeralNacional = Math.round((stats.medias.matematica + stats.medias.linguagens + stats.medias.humanas + stats.medias.natureza + stats.medias.redacao) / 5);

    return (
        <div className="space-y-8 pb-10">
            {/* INJEÇÃO DE ESTILO PARA ANIMAÇÃO DA BARRA */}
            <style jsx global>{`
                @keyframes blinkBlue {
                    0% { fill: #4f46e5; }
                    50% { fill: #c7d2fe; } /* Azul bem claro (quase branco) */
                    100% { fill: #4f46e5; }
                }
                .school-bar-anim {
                    animation: blinkBlue 1.5s infinite ease-in-out;
                }
            `}</style>

            {/* Cabeçalho */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">ENEM 2024</h1>
                    <p className="text-gray-500">Panorama Nacional e Comparativo Escolar</p>
                </div>
            </div>

            {/* KPIs Principais - NOVA GRID PARA 7 CARDS */}
            {/* Linha 1: Destaques Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Card 1: Total Inscritos (Usando count_redacao como proxy de inscritos ativos) */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-3xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-xl"><Users className="w-6 h-6" /></div>
                        <p className="text-indigo-100 text-sm font-medium">Participantes Ativos (Brasil)</p>
                    </div>
                    <h2 className="text-4xl font-bold">{stats.total.toLocaleString('pt-BR')}</h2>
                    <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-sm">
                        <span className="text-indigo-200">Colégio Modelo</span>
                        <span className="font-bold bg-white/20 px-2 py-1 rounded">{SCHOOL_DATA.total_participantes} Alunos</span>
                    </div>
                </div>

                {/* Card 2: Média Geral Nacional (Ponderada das áreas) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600" /></div>
                        <p className="text-sm font-medium text-gray-500">Média Geral Brasil (5 Áreas)</p>
                    </div>
                    <h3 className="text-4xl font-bold text-gray-900">{mediaGeralNacional}</h3>
                    <div className="flex items-center gap-2 mt-4 p-2 bg-gray-50 rounded-lg border border-gray-100 w-fit">
                        <School className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-gray-600">Sua Escola: <strong className="text-green-700 font-bold text-sm">{SCHOOL_DATA.medias.geral}</strong></span>
                    </div>
                </div>
            </div>

            {/* Linha 2: Indicadores por Área (5 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Matemática */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-purple-600 uppercase">Matemática</p>
                        <Calculator className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.medias.matematica}</h3>
                    <p className="text-[10px] text-gray-400 mt-1 mb-3">{stats.counts?.matematica?.toLocaleString()} participantes</p>
                    <div className="pt-2 border-t border-gray-50 flex justify-between items-center text-xs">
                        <span className="text-gray-500">Escola</span>
                        <span className="font-bold text-purple-700">{SCHOOL_DATA.medias.matematica}</span>
                    </div>
                </div>

                {/* Redação */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-pink-600 uppercase">Redação</p>
                        <MessageSquare className="w-4 h-4 text-pink-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.medias.redacao}</h3>
                    <p className="text-[10px] text-gray-400 mt-1 mb-3">{stats.counts?.redacao?.toLocaleString()} participantes</p>
                    <div className="pt-2 border-t border-gray-50 flex justify-between items-center text-xs">
                        <span className="text-gray-500">Escola</span>
                        <span className="font-bold text-pink-700">{SCHOOL_DATA.medias.redacao}</span>
                    </div>
                </div>

                {/* Linguagens */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-cyan-600 uppercase">Linguagens</p>
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.medias.linguagens}</h3>
                    <p className="text-[10px] text-gray-400 mt-1 mb-3">{stats.counts?.linguagens?.toLocaleString()} participantes</p>
                    <div className="pt-2 border-t border-gray-50 flex justify-between items-center text-xs">
                        <span className="text-gray-500">Escola</span>
                        <span className="font-bold text-cyan-700">{SCHOOL_DATA.medias.linguagens}</span>
                    </div>
                </div>

                {/* Humanas */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-amber-600 uppercase">Humanas</p>
                        <Users className="w-4 h-4 text-amber-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.medias.humanas}</h3>
                    <p className="text-[10px] text-gray-400 mt-1 mb-3">{stats.counts?.humanas?.toLocaleString()} participantes</p>
                    <div className="pt-2 border-t border-gray-50 flex justify-between items-center text-xs">
                        <span className="text-gray-500">Escola</span>
                        <span className="font-bold text-amber-700">{SCHOOL_DATA.medias.humanas}</span>
                    </div>
                </div>

                {/* Natureza */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-emerald-600 uppercase">Natureza</p>
                        <Trophy className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.medias.natureza}</h3>
                    <p className="text-[10px] text-gray-400 mt-1 mb-3">{stats.counts?.natureza?.toLocaleString()} participantes</p>
                    <div className="pt-2 border-t border-gray-50 flex justify-between items-center text-xs">
                        <span className="text-gray-500">Escola</span>
                        <span className="font-bold text-emerald-700">{SCHOOL_DATA.medias.natureza}</span>
                    </div>
                </div>
            </div>

            {/* Gráfico de Barras por Estado + Escola */}
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
                        <BarChart data={stateChartData} margin={{ top: 30, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis
                                dataKey="uf"
                                tick={({ x, y, payload }) => (
                                    <text x={x} y={y} dy={16} textAnchor="end" transform={`rotate(-45, ${x}, ${y})`} fill={payload.value === 'COL. MODELO' ? '#4f46e5' : '#6b7280'} fontWeight={payload.value === 'COL. MODELO' ? 'bold' : 'normal'} fontSize={11}>
                                        {payload.value}
                                    </text>
                                )}
                                axisLine={false}
                                tickLine={false}
                                height={60}
                            />
                            {/* Ajuste do Eixo Y para 'auto' ou range dinâmico para evitar achatamento */}
                            <YAxis
                                domain={[350, 'auto']} // Começa em 350 para amplificar as diferenças
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
                                formatter={(value: any, name: any, props: any) => [`${value} pts`, props.payload.uf === 'COL. MODELO' ? 'Sua Escola' : 'Média Estado']}
                                labelFormatter={(label) => UF_NAMES[label] || label}
                            />
                            <Bar dataKey="media_mt" radius={[6, 6, 0, 0]} animationDuration={1500}>
                                {stateChartData.map((entry: any, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.isSchool ? '#4f46e5' : BAR_COLORS[index % BAR_COLORS.length]}
                                        className={entry.isSchool ? 'school-bar-anim' : ''}
                                    />
                                ))}
                                {/* LabelList customizada: passamos o array de dados para o componente saber quem é quem */}
                                <LabelList dataKey="uf" content={(props: any) => <CustomBarLabel {...props} chartData={stateChartData} />} />
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

                        {/* Top 10 Cidades + ESCOLA FIXA */}
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
                                            <th className="pb-3">Localidade</th>
                                            <th className="pb-3 text-center">MT</th>
                                            <th className="pb-3 text-center">Redação</th>
                                            <th className="pb-3 text-center">LC</th>
                                            <th className="pb-3 text-center">CH</th>
                                            <th className="pb-3 text-center">CN</th>
                                            <th className="pb-3 text-right pr-4">Participantes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* LINHA DA ESCOLA (FIXA) */}
                                        <tr className="bg-indigo-500/20 border-b border-indigo-500/30">
                                            <td className="py-3 pl-4">
                                                <School className="w-5 h-5 text-indigo-400" />
                                            </td>
                                            <td className="py-3 text-white font-bold text-indigo-300">{SCHOOL_DATA.nome} <span className="text-xs font-normal opacity-70">(Você)</span></td>
                                            <td className="py-3 text-center font-bold text-white">{SCHOOL_DATA.medias.matematica}</td>
                                            <td className="py-3 text-center font-bold text-white">{SCHOOL_DATA.medias.redacao}</td>
                                            <td className="py-3 text-center font-bold text-white">{SCHOOL_DATA.medias.linguagens}</td>
                                            <td className="py-3 text-center font-bold text-white">{SCHOOL_DATA.medias.humanas}</td>
                                            <td className="py-3 text-center font-bold text-white">{SCHOOL_DATA.medias.natureza}</td>
                                            <td className="py-3 text-right pr-4 font-bold text-white">{SCHOOL_DATA.total_participantes}</td>
                                        </tr>

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
                                                    <span className="bg-white/10 text-white/80 px-2 py-1 rounded-lg">
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

            {/* Gráficos de Área Compataivos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Barras por Área (Agrupadas) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-indigo-500" />
                        Benchmark por Área do Conhecimento
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={areaDataComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="sigla" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 1000]} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any, name: number | string | undefined) => [`${value} pts`, name === 'media' ? 'Média Brasil' : 'Sua Escola']}
                                    labelFormatter={(label) => stats.areas.find(a => a.sigla === label)?.area || label}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="media" name="Média Brasil" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="escola" name="Sua Escola" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Radar Comparativo */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-6">Perfil: Escola vs Brasil</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={100} data={radarData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 1000]} tick={false} axisLine={false} />

                                <Radar
                                    name="Média Nacional"
                                    dataKey="value"
                                    stroke="#94a3b8"
                                    fill="#94a3b8"
                                    fillOpacity={0.3}
                                />
                                <Radar
                                    name="Sua Escola"
                                    dataKey="school"
                                    stroke="#4f46e5"
                                    fill="#4f46e5"
                                    fillOpacity={0.5}
                                />
                                <Legend />
                                <Tooltip formatter={(value: any) => [`${value} pts`, 'Média']} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
