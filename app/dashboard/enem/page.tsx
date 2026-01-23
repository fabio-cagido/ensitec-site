"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Calculator, Users, Loader2, MessageSquare, BarChart2 } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
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
    extremos: {
        max_matematica: number;
        max_redacao: number;
    };
    areas: Array<{ area: string; sigla: string; media: number }>;
}

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

export default function EnemPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<EnemStats | null>(null);

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-gray-600 font-medium">Calculando médias nacionais...</p>
                <p className="text-xs text-gray-400">Processando notas de ~4.3 milhões de candidatos</p>
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
            {/* Cabeçalho com Logo */}
            <PageHeader
                title={`ENEM 2024`}
                subtitle={`Panorama Nacional (${stats.total.toLocaleString('pt-BR')} registros)`}
                showLogo={true}
            />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-3xl shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-xl"><Users className="w-6 h-6" /></div>
                        <p className="text-indigo-100 text-sm font-medium">Total de Provas</p>
                    </div>
                    <h2 className="text-3xl font-bold">{stats.total.toLocaleString('pt-BR')}</h2>
                    <p className="text-xs text-indigo-200 mt-2">Dados oficiais consolidados</p>
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

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Barras */}
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
                    <h3 className="font-bold text-gray-900 text-lg mb-6">Perfil de Desempenho</h3>
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
