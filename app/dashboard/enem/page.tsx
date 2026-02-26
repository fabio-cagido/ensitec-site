"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Calculator, Users, Loader2, MessageSquare, BarChart2, MapPin, ChevronDown, Trophy, Building2, School, Printer } from "lucide-react";
import Link from "next/link";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LabelList
} from 'recharts';

// --- MOCK DADOS DA ESCOLA (BENCHMARK) ---
const SCHOOL_DATA = {
    nome: "Colégio Modelo",
    medias: {
        matematica: 622, // Ajustado (-5%)
        linguagens: 596, // Ajustado (-5%)
        humanas: 606,    // Ajustado (-5%)
        natureza: 585,   // Ajustado (-5%)
        redacao: 766,    // Ajustado (-5%)
        geral: 635       // Média ajustada
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
    estados: Array<{ uf: string; media_mt: number; media_cn: number; media_ch: number; media_lc: number; media_redacao: number; total_alunos: number }>;
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

interface BairroData {
    bairro: string;
    media_mt: number;
    media_cn: number;
    media_ch: number;
    media_lc: number;
    media_redacao: number;
    media_geral: number;
    total_alunos: number;
}

interface EscolaData {
    escola: string;
    bairro: string;
    media_mt: number;
    media_cn: number;
    media_ch: number;
    media_lc: number;
    media_redacao: number;
    media_geral: number;
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
    '#6366f1', '#7c3aed', '#8b5cf6', '#a855f7', '#c026d3', '#a855f7', '#8b5cf6', '#7c3aed', '#6366f1'
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

// Função utilitária para impressão de ranking em PDF
function printSection({
    title,
    subtitle,
    columns,
    rows,
}: {
    title: string;
    subtitle: string;
    columns: string[];
    rows: (string | number)[][];
}) {
    const rowsHtml = rows
        .map(
            (row, i) => `
        <tr style="background:${i % 2 === 0 ? '#f9fafb' : '#ffffff'}">
            ${row
                    .map(
                        (cell, ci) =>
                            `<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;${ci === 0 ? 'font-weight:600;color:#1f2937' : 'color:#374151'};${ci === row.length - 1 ? 'text-align:right' : ''};${ci > 1 && ci < row.length - 1 ? 'text-align:center' : ''}">${cell}</td>`
                    )
                    .join('')}
        </tr>`
        )
        .join('');

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background: #fff; padding: 32px; }
    .header { border-bottom: 3px solid #4f46e5; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { font-size: 22px; font-weight: 800; color: #1e1b4b; }
    .header p { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .badge { display:inline-block; background:#ede9fe; color:#5b21b6; font-size:11px; font-weight:700; padding:2px 10px; border-radius:999px; margin-top:6px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
    thead th { background: #1e1b4b; color: #e0e7ff; padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
    thead th:last-child { text-align: right; }
    thead th:not(:first-child):not(:last-child) { text-align: center; }
    tfoot td { background:#f3f4f6; font-size:11px; color:#9ca3af; padding:8px 12px; text-align:center; border-top:2px solid #e5e7eb; }
    @media print {
      body { padding: 16px; }
      @page { margin: 12mm; size: A4 landscape; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ENEM 2024 — ${title}</h1>
    <p>${subtitle}</p>
    <span class="badge">Ensitec Dashboard · ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
  </div>
  <table>
    <thead><tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${rowsHtml}</tbody>
    <tfoot><tr><td colspan="${columns.length}">Dados ENEM 2024 · INEP/MEC · Gerado em ${new Date().toLocaleString('pt-BR')}</td></tr></tfoot>
  </table>
</body>
</html>`;

    const w = window.open('', '_blank', 'width=1000,height=700');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.onload = () => { w.focus(); w.print(); };
}

// ----------------------------------------

export default function EnemPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<EnemStats | null>(null);
    const [selectedUF, setSelectedUF] = useState<string>("");
    const [schoolType, setSchoolType] = useState<string>("Todas");
    const [estadoDetail, setEstadoDetail] = useState<EstadoDetail | null>(null);
    const [loadingCidades, setLoadingCidades] = useState(false);
    const [minParticipants, setMinParticipants] = useState<number>(0);

    // --- Drill-down: Cidade → Bairro ---
    const [selectedCidadeBairro, setSelectedCidadeBairro] = useState<string>("");
    const [bairros, setBairros] = useState<BairroData[]>([]);
    const [loadingBairros, setLoadingBairros] = useState(false);
    const [minParticipantsBairro, setMinParticipantsBairro] = useState<number>(0);

    // --- Drill-down: Bairro → Escola ---
    const [selectedBairros, setSelectedBairros] = useState<Set<string>>(new Set());
    const [escolas, setEscolas] = useState<EscolaData[]>([]);
    const [loadingEscolas, setLoadingEscolas] = useState(false);

    // Helper: toggle bairro na seleção
    const toggleBairro = (bairro: string) => {
        setSelectedBairros(prev => {
            const next = new Set(prev);
            if (next.has(bairro)) next.delete(bairro);
            else next.add(bairro);
            return next;
        });
    };

    // Helper: selecionar/desselecionar todos os bairros visíveis
    const toggleTodos = (bairrosVisiveis: BairroData[]) => {
        const todosIds = bairrosVisiveis.map(b => b.bairro);
        const todosSelecionados = todosIds.every(id => selectedBairros.has(id));
        if (todosSelecionados) {
            setSelectedBairros(new Set());
        } else {
            setSelectedBairros(new Set(todosIds));
        }
    };

    useEffect(() => {
        async function fetchData() {
            setLoading(true); // Reinicia loading ao trocar o filtro
            try {
                // Adiciona o param tp_escola na query
                const res = await fetch(`/api/enem/stats?tp_escola=${schoolType}`);
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
    }, [schoolType]); // Re-executa quando schoolType muda

    // Fetch dados do estado quando selecionado
    useEffect(() => {
        if (!selectedUF) {
            setEstadoDetail(null);
            return;
        }

        async function fetchCidades() {
            setLoadingCidades(true);
            try {
                // Passa o filtro de escola para a API de cidades (para corrigir o KPI do estado)
                const res = await fetch(`/api/enem/cidades?uf=${selectedUF}&tp_escola=${schoolType}`);
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
    }, [selectedUF, schoolType]);

    // Fetch bairros quando selecionada cidade no drill-down
    useEffect(() => {
        // Reset downstream ao trocar cidade
        setSelectedBairros(new Set());
        setEscolas([]);
        setBairros([]);
        if (!selectedUF || !selectedCidadeBairro) return;

        async function fetchBairros() {
            setLoadingBairros(true);
            try {
                // Normaliza para maiúsculas para garantir match com o banco
                const res = await fetch(
                    `/api/enem/bairros?uf=${encodeURIComponent(selectedUF.toUpperCase())}&cidade=${encodeURIComponent(selectedCidadeBairro.toUpperCase())}`
                );
                if (!res.ok) throw new Error('Falha ao carregar bairros');
                const data = await res.json();
                setBairros(data.bairros || []);
            } catch (err) {
                console.error('Erro ao carregar bairros:', err);
            } finally {
                setLoadingBairros(false);
            }
        }
        fetchBairros();
    }, [selectedUF, selectedCidadeBairro]);

    // Fetch escolas quando seleção de bairros muda
    useEffect(() => {
        setEscolas([]);
        if (!selectedUF || !selectedCidadeBairro || selectedBairros.size === 0) return;

        async function fetchEscolas() {
            setLoadingEscolas(true);
            try {
                // Monta query string com múltiplos bairros, normalizados em maiúsculas
                const params = new URLSearchParams({
                    uf: selectedUF.toUpperCase(),
                    cidade: selectedCidadeBairro.toUpperCase(),
                });
                selectedBairros.forEach(b => params.append('bairros', b.toUpperCase()));

                const res = await fetch(`/api/enem/escolas?${params.toString()}`);
                if (!res.ok) throw new Error('Falha ao carregar escolas');
                const data = await res.json();
                setEscolas(data.escolas || []);
            } catch (err) {
                console.error('Erro ao carregar escolas:', err);
            } finally {
                setLoadingEscolas(false);
            }
        }
        fetchEscolas();
    }, [selectedUF, selectedCidadeBairro, selectedBairros]);

    // Reset drill-downs dependentes ao trocar estado
    useEffect(() => {
        setSelectedCidadeBairro("");
        setSelectedBairros(new Set());
        setBairros([]);
        setEscolas([]);
    }, [selectedUF]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-gray-600 font-medium">Carregando dados do ENEM...</p>
                <p className="text-xs text-gray-400">
                    {schoolType === 'Todas' ? 'Consolidando dados nacionais...' : `Filtrando por escolas ${schoolType.toLowerCase()}s...`}
                </p>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-lg text-center">
                    <h2 className="text-red-700 font-bold text-xl mb-2">Falha no Carregamento</h2>
                    <p className="text-red-600 text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        Tentar Novamente
                    </button>
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
        { uf: 'COL. MODELO', media_total: SCHOOL_DATA.medias.geral, isSchool: true },
        ...stats.estados.map(e => ({
            ...e,
            media_total: Math.round((e.media_mt + e.media_cn + e.media_ch + e.media_lc + e.media_redacao) / 5)
        }))
    ].sort((a, b) => b.media_total - a.media_total);

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

            {/* Cabeçalho com Filtro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">ENEM 2024</h1>
                        <p className="text-gray-500">Panorama Nacional e Comparativo Escolar</p>
                    </div>
                </div>

                {/* Filtro de Tipo de Escola */}
                <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <School className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tipo de Escola</label>
                        <select
                            value={schoolType}
                            onChange={(e) => setSchoolType(e.target.value)}
                            className="bg-transparent font-bold text-gray-700 text-sm outline-none cursor-pointer min-w-[140px]"
                        >
                            <option value="Todas">Todas as Escolas</option>
                            <option value="Pública">Pública</option>
                            <option value="Privada">Privada</option>
                        </select>
                    </div>
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
                        <Link href="/dashboard/enem/tracking" className="font-bold bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors cursor-pointer">
                            {SCHOOL_DATA.total_participantes} Alunos
                        </Link>
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
                        Média Geral por Estado
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
                                formatter={(value: any, name: any, props: any) => [`${value} pts`, props.payload.uf === 'COL. MODELO' ? 'Sua Escola' : 'Média Geral Estado']}
                                labelFormatter={(label) => UF_NAMES[label] || label}
                            />
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#9333ea" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1} />
                                </linearGradient>
                                <linearGradient id="schoolGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#818cf8" stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <Bar dataKey="media_total" radius={[6, 6, 0, 0]} animationDuration={1500}>
                                {stateChartData.map((entry: any, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.isSchool ? 'url(#schoolGradient)' : 'url(#barGradient)'}
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

                        {/* Cidades + ESCOLA FIXA */}
                        <div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <h4 className="text-white font-semibold flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-amber-400" />
                                    Ranking de Cidades - {UF_NAMES[selectedUF] || selectedUF}
                                </h4>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                                        <Users className="w-4 h-4 text-indigo-400" />
                                        <div className="flex flex-col">
                                            <label className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Mín. Alunos</label>
                                            <select
                                                value={minParticipants}
                                                onChange={(e) => setMinParticipants(Number(e.target.value))}
                                                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                                            >
                                                <option value={0} className="bg-slate-800">Todos</option>
                                                <option value={10} className="bg-slate-800">10+ alunos</option>
                                                <option value={50} className="bg-slate-800">50+ alunos</option>
                                                <option value={100} className="bg-slate-800">100+ alunos</option>
                                                <option value={500} className="bg-slate-800">500+ alunos</option>
                                                <option value={1000} className="bg-slate-800">1000+ alunos</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* Botão Imprimir PDF - Ranking de Cidades */}
                                    <button
                                        onClick={() => printSection({
                                            title: `Ranking de Cidades — ${UF_NAMES[selectedUF] || selectedUF}`,
                                            subtitle: `Estado: ${UF_NAMES[selectedUF] || selectedUF} · Mínimo ${minParticipants} participantes`,
                                            columns: ['#', 'Cidade', 'MT', 'Redação', 'LC', 'CH', 'CN', 'Participantes'],
                                            rows: estadoDetail!.topCidades
                                                .filter(c => c.total_alunos >= minParticipants)
                                                .map((c, i) => [i + 1, c.cidade, c.media_mt, c.media_redacao, c.media_lc, c.media_ch, c.media_cn, c.total_alunos.toLocaleString('pt-BR')]),
                                        })}
                                        title="Imprimir ranking em PDF"
                                        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 px-3 py-1.5 rounded-xl transition-all text-xs font-medium"
                                    >
                                        <Printer className="w-3.5 h-3.5" />
                                        PDF
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-slate-800 z-10 shadow-sm">
                                        <tr className="text-left text-white/60 border-b border-white/10">
                                            <th className="py-3 pl-4 bg-slate-800">#</th>
                                            <th className="py-3 bg-slate-800">Localidade</th>
                                            <th className="py-3 text-center bg-slate-800">MT</th>
                                            <th className="py-3 text-center bg-slate-800">Redação</th>
                                            <th className="py-3 text-center bg-slate-800">LC</th>
                                            <th className="py-3 text-center bg-slate-800">CH</th>
                                            <th className="py-3 text-center bg-slate-800">CN</th>
                                            <th className="py-3 text-right pr-4 bg-slate-800">Participantes</th>
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

                                        {estadoDetail.topCidades
                                            .filter(c => c.total_alunos >= minParticipants)
                                            .map((cidade, index) => (
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

            {/* ===== DRILL-DOWN: CIDADE → BAIRRO ===== */}
            <div className="bg-gradient-to-br from-violet-900 to-indigo-900 p-6 rounded-3xl shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-violet-300" />
                        Análise por Cidade — Ranking de Bairros
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {/* Seletor de Cidade (populado pelos dados do drill-down de estado) */}
                        <div className="relative">
                            <select
                                value={selectedCidadeBairro}
                                onChange={(e) => setSelectedCidadeBairro(e.target.value)}
                                disabled={!selectedUF || !estadoDetail}
                                className="appearance-none bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer min-w-[220px] disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <option value="" className="bg-violet-900">
                                    {!selectedUF ? 'Selecione um estado acima...' : 'Selecione uma cidade...'}
                                </option>
                                {estadoDetail?.topCidades?.map((c) => (
                                    <option key={c.cidade} value={c.cidade} className="bg-violet-900">
                                        {c.cidade}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                        </div>

                        {/* Filtro mínimo de participantes */}
                        {bairros.length > 0 && (
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                                <Users className="w-4 h-4 text-violet-300" />
                                <div className="flex flex-col">
                                    <label className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Mín. Alunos</label>
                                    <select
                                        value={minParticipantsBairro}
                                        onChange={(e) => setMinParticipantsBairro(Number(e.target.value))}
                                        className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                                    >
                                        <option value={0} className="bg-violet-900">Todos</option>
                                        <option value={5} className="bg-violet-900">5+ alunos</option>
                                        <option value={10} className="bg-violet-900">10+ alunos</option>
                                        <option value={50} className="bg-violet-900">50+ alunos</option>
                                        <option value={100} className="bg-violet-900">100+ alunos</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Estado vazio */}
                {!selectedUF && (
                    <div className="text-center py-12 text-white/50">
                        <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Selecione um estado no componente acima para desbloquear esta análise</p>
                    </div>
                )}

                {selectedUF && !selectedCidadeBairro && (
                    <div className="text-center py-12 text-white/50">
                        <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Selecione uma cidade para ver o ranking dos bairros</p>
                    </div>
                )}

                {loadingBairros && (
                    <div className="flex items-center justify-center py-12 gap-3">
                        <Loader2 className="w-6 h-6 text-violet-300 animate-spin" />
                        <p className="text-white/60">Carregando bairros...</p>
                    </div>
                )}

                {selectedCidadeBairro && !loadingBairros && bairros.length === 0 && (
                    <div className="text-center py-10 text-white/50">
                        <p className="text-sm">Nenhum bairro encontrado para <strong className="text-white/80">{selectedCidadeBairro}</strong></p>
                        <p className="text-xs mt-1 opacity-60">Os dados de bairro podem não estar disponíveis para esta cidade</p>
                    </div>
                )}

                {selectedCidadeBairro && !loadingBairros && bairros.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-semibold flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                Ranking de Bairros — {selectedCidadeBairro}
                            </h4>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">
                                    {bairros.filter(b => b.total_alunos >= minParticipantsBairro).length} bairros
                                </span>
                                {/* Botão Imprimir PDF - Ranking de Bairros */}
                                <button
                                    onClick={() => printSection({
                                        title: `Ranking de Bairros \u2014 ${selectedCidadeBairro}`,
                                        subtitle: `Cidade: ${selectedCidadeBairro} \u00b7 ${UF_NAMES[selectedUF] || selectedUF} \u00b7 M\u00ednimo ${minParticipantsBairro} participantes`,
                                        columns: ['#', 'Bairro', 'Geral', 'MT', 'Reda\u00e7\u00e3o', 'LC', 'CH', 'CN', 'Participantes'],
                                        rows: bairros
                                            .filter(b => b.total_alunos >= minParticipantsBairro)
                                            .sort((a, b) => b.media_geral - a.media_geral)
                                            .map((b, i) => [i + 1, b.bairro, b.media_geral, b.media_mt, b.media_redacao, b.media_lc, b.media_ch, b.media_cn, b.total_alunos.toLocaleString('pt-BR')]),
                                    })}
                                    title="Imprimir ranking em PDF"
                                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 px-3 py-1.5 rounded-xl transition-all text-xs font-medium"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                    PDF
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto max-h-[480px] overflow-y-auto pr-2">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 z-10 shadow-sm">
                                    <tr className="text-left text-white/60 border-b border-white/10">
                                        <th className="py-3 pl-3 bg-indigo-900">
                                            {/* Checkbox selecionar todos */}
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded accent-violet-400 cursor-pointer"
                                                checked={
                                                    bairros.filter(b => b.total_alunos >= minParticipantsBairro).length > 0 &&
                                                    bairros.filter(b => b.total_alunos >= minParticipantsBairro).every(b => selectedBairros.has(b.bairro))
                                                }
                                                onChange={() => toggleTodos(bairros.filter(b => b.total_alunos >= minParticipantsBairro))}
                                                title="Selecionar todos"
                                            />
                                        </th>
                                        <th className="py-3 bg-indigo-900">#</th>
                                        <th className="py-3 bg-indigo-900">Bairro</th>
                                        <th className="py-3 text-center bg-indigo-900 text-violet-300">⭐ Geral</th>
                                        <th className="py-3 text-center bg-indigo-900">MT</th>
                                        <th className="py-3 text-center bg-indigo-900">Redação</th>
                                        <th className="py-3 text-center bg-indigo-900">LC</th>
                                        <th className="py-3 text-center bg-indigo-900">CH</th>
                                        <th className="py-3 text-center bg-indigo-900">CN</th>
                                        <th className="py-3 text-right pr-4 bg-indigo-900">Participantes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bairros
                                        .filter(b => b.total_alunos >= minParticipantsBairro)
                                        .sort((a, b) => b.media_geral - a.media_geral)
                                        .map((b, index) => (
                                            <tr
                                                key={b.bairro}
                                                onClick={() => toggleBairro(b.bairro)}
                                                className={`border-b border-white/5 cursor-pointer transition-colors ${selectedBairros.has(b.bairro)
                                                    ? 'bg-violet-500/20 border-violet-400/30'
                                                    : 'hover:bg-white/5'
                                                    }`}
                                            >
                                                <td className="py-3 pl-3" onClick={e => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBairros.has(b.bairro)}
                                                        onChange={() => toggleBairro(b.bairro)}
                                                        className="w-4 h-4 rounded accent-violet-400 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="py-3">
                                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-amber-500 text-white' :
                                                        index === 1 ? 'bg-gray-400 text-white' :
                                                            index === 2 ? 'bg-amber-700 text-white' :
                                                                'bg-white/10 text-white/60'
                                                        }`}>
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-white font-medium">
                                                    {b.bairro}
                                                </td>
                                                <td className="py-3 text-center">
                                                    <span className="bg-violet-500/30 text-violet-200 font-bold px-2 py-1 rounded-lg">
                                                        {b.media_geral}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <span className="bg-white/10 text-white/80 px-2 py-1 rounded-lg">{b.media_mt}</span>
                                                </td>
                                                <td className="py-3 text-center text-white/80">{b.media_redacao}</td>
                                                <td className="py-3 text-center text-white/80">{b.media_lc}</td>
                                                <td className="py-3 text-center text-white/80">{b.media_ch}</td>
                                                <td className="py-3 text-center text-white/80">{b.media_cn}</td>
                                                <td className="py-3 text-right pr-4 text-white/60">{b.total_alunos.toLocaleString('pt-BR')}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-white/30 mt-3 text-center">
                            Marque um ou mais bairros para ver o ranking de escolas abaixo
                        </p>
                    </div>
                )}
            </div>

            {/* ===== DRILL-DOWN: BAIRRO → ESCOLA ===== */}
            <div className="bg-gradient-to-br from-emerald-900 to-teal-900 p-6 rounded-3xl shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <School className="w-5 h-5 text-emerald-300" />
                        Análise por Bairro — Ranking de Escolas
                    </h3>
                    {selectedBairros.size > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-white/50 text-xs">Bairros:</span>
                            {Array.from(selectedBairros).map(bairro => (
                                <span
                                    key={bairro}
                                    className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold"
                                >
                                    {bairro}
                                    <button
                                        onClick={() => toggleBairro(bairro)}
                                        className="text-emerald-400/60 hover:text-emerald-200 transition-colors leading-none"
                                        title={`Remover ${bairro}`}
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                            <button
                                onClick={() => setSelectedBairros(new Set())}
                                className="text-white/30 hover:text-white/70 transition-colors text-xs border border-white/10 px-2 py-1 rounded-full"
                            >
                                Limpar todos
                            </button>
                        </div>
                    )}
                </div>

                {selectedBairros.size === 0 && (
                    <div className="text-center py-12 text-white/50">
                        <School className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Marque um ou mais bairros na tabela acima para ver o ranking de escolas</p>
                    </div>
                )}

                {loadingEscolas && (
                    <div className="flex items-center justify-center py-12 gap-3">
                        <Loader2 className="w-6 h-6 text-emerald-300 animate-spin" />
                        <p className="text-white/60">Carregando escolas...</p>
                    </div>
                )}

                {selectedBairros.size > 0 && !loadingEscolas && escolas.length === 0 && (
                    <div className="text-center py-10 text-white/50">
                        <p className="text-sm">Nenhuma escola encontrada nos bairros selecionados</p>
                        <p className="text-xs mt-1 opacity-60">Verifique se os dados de escola estão disponíveis para esses bairros</p>
                    </div>
                )}

                {selectedBairros.size > 0 && !loadingEscolas && escolas.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-semibold flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                Ranking de Escolas — {selectedCidadeBairro}
                            </h4>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">
                                    {escolas.length} escola{escolas.length !== 1 ? 's' : ''} · {selectedBairros.size} bairro{selectedBairros.size !== 1 ? 's' : ''}
                                </span>
                                {/* Botão Imprimir PDF - Ranking de Escolas */}
                                <button
                                    onClick={() => printSection({
                                        title: `Ranking de Escolas \u2014 ${selectedCidadeBairro}`,
                                        subtitle: `Bairros: ${Array.from(selectedBairros).join(', ')} \u00b7 ${UF_NAMES[selectedUF] || selectedUF}`,
                                        columns: ['#', 'Escola', 'Bairro', 'Geral', 'MT', 'Reda\u00e7\u00e3o', 'LC', 'CH', 'CN', 'Participantes'],
                                        rows: escolas.map((e, i) => [i + 1, e.escola, e.bairro, e.media_geral, e.media_mt, e.media_redacao, e.media_lc, e.media_ch, e.media_cn, e.total_alunos.toLocaleString('pt-BR')]),
                                    })}
                                    title="Imprimir ranking em PDF"
                                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 px-3 py-1.5 rounded-xl transition-all text-xs font-medium"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                    PDF
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto max-h-[480px] overflow-y-auto pr-2">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 z-10 shadow-sm">
                                    <tr className="text-left text-white/60 border-b border-white/10">
                                        <th className="py-3 pl-4 bg-teal-900">#</th>
                                        <th className="py-3 bg-teal-900">Escola</th>
                                        <th className="py-3 text-center bg-teal-900 text-emerald-300">⭐ Geral</th>
                                        <th className="py-3 text-center bg-teal-900">MT</th>
                                        <th className="py-3 text-center bg-teal-900">Redação</th>
                                        <th className="py-3 text-center bg-teal-900">LC</th>
                                        <th className="py-3 text-center bg-teal-900">CH</th>
                                        <th className="py-3 text-center bg-teal-900">CN</th>
                                        <th className="py-3 text-right pr-4 bg-teal-900">Participantes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {escolas.map((e, index) => (
                                        <tr
                                            key={`${e.escola}-${e.bairro}`}
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
                                            <td className="py-3">
                                                <p className="text-white font-medium leading-tight">{e.escola}</p>
                                                {selectedBairros.size > 1 && (
                                                    <p className="text-[10px] text-emerald-400/60 mt-0.5">{e.bairro}</p>
                                                )}
                                                {selectedBairros.size === 1 && (
                                                    <p className="text-[10px] text-white/40 mt-0.5">{e.bairro}</p>
                                                )}
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-1 rounded-lg">{e.media_geral}</span>
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className="bg-white/10 text-white/80 px-2 py-1 rounded-lg">{e.media_mt}</span>
                                            </td>
                                            <td className="py-3 text-center text-white/80">{e.media_redacao}</td>
                                            <td className="py-3 text-center text-white/80">{e.media_lc}</td>
                                            <td className="py-3 text-center text-white/80">{e.media_ch}</td>
                                            <td className="py-3 text-center text-white/80">{e.media_cn}</td>
                                            <td className="py-3 text-right pr-4 text-white/60">{e.total_alunos.toLocaleString('pt-BR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
