"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Users, UserCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { ClientFilterBar, ClientFilterState } from "../components/ClientFilterBar";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import dynamic from 'next/dynamic';

// Importar Leaflet dinamicamente para evitar erro de SSR
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const CircleMarker = dynamic(
    () => import('react-leaflet').then((mod) => mod.CircleMarker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

// Dados Mock de Perfil do Aluno
const GENDER_DATA = [
    { name: 'Feminino', value: 650 },
    { name: 'Masculino', value: 600 },
];

const RACE_DATA = [
    { name: 'Branca', value: 500 },
    { name: 'Parda', value: 450 },
    { name: 'Preta', value: 200 },
    { name: 'Amarela', value: 80 },
    { name: 'Indígena', value: 20 },
];

const AGE_DATA = [
    { age: '2-5 anos', count: 150 },
    { age: '6-10 anos', count: 400 },
    { age: '11-14 anos', count: 320 },
    { age: '15-18 anos', count: 380 },
];

const INCOME_DATA = [
    { range: 'Até 3 SM', count: 200 },
    { range: '3-6 SM', count: 450 },
    { range: '6-10 SM', count: 350 },
    { range: '> 10 SM', count: 250 },
];

const GEO_DATA = [
    { name: 'Centro', value: 350 },
    { name: 'Jd. América', value: 280 },
    { name: 'Vila Nova', value: 200 },
    { name: 'Bela Vista', value: 150 },
    { name: 'Outros', value: 270 },
];

// Função para gerar coordenadas aleatórias próximas a um ponto central
// Função para gerar coordenadas aleatórias próximas a um ponto central
const generateStudentLocations = (count: number, center: { lat: number, lng: number }, spread: number) => {
    return Array.from({ length: count }).map(() => ({
        lat: center.lat + (Math.random() - 0.5) * spread,
        lng: center.lng + (Math.random() - 0.5) * spread,
        // Segmento aleatório para cor
        segment: Math.random() > 0.7 ? 'Médio' : Math.random() > 0.4 ? 'Fund. II' : 'Fund. I'
    }));
};

// Gerar ~500 pontos de alunos distribuídos em clusters (bairros fictícios de SP)
const RAW_POINTS = [
    ...generateStudentLocations(150, { lat: -23.5505, lng: -46.6333 }, 0.04), // Centro
    ...generateStudentLocations(120, { lat: -23.5670, lng: -46.6700 }, 0.03), // Jd. América
    ...generateStudentLocations(100, { lat: -23.5300, lng: -46.6100 }, 0.035), // Vila Nova
    ...generateStudentLocations(80, { lat: -23.5600, lng: -46.6400 }, 0.03), // Bela Vista
    ...generateStudentLocations(100, { lat: -23.5800, lng: -46.6200 }, 0.04), // Outros
];

const STUDENT_POINTS = RAW_POINTS.map((point, index) => ({
    ...point,
    id: index
}));

const SEGMENT_COLORS: Record<string, string> = {
    'Fund. I': '#3b82f6', // Blue
    'Fund. II': '#10b981', // Green
    'Médio': '#ec4899',   // Pink
};

const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];
const GENDER_COLORS = ['#ec4899', '#3b82f6']; // Pink, Blue

export default function PerfilAlunoPage() {
    const [filters, setFilters] = useState<ClientFilterState | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const totalStudents = 1250;

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/clientes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Perfil do Aluno</h1>
                    <p className="text-gray-500">Dados demográficos e geolocalização dos alunos</p>
                </div>
            </div>

            {/* Filtros */}
            <ClientFilterBar onFilterChange={setFilters} />

            {/* KPI Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 rounded-3xl shadow-lg text-white">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm font-medium">Total de Alunos</p>
                        <h2 className="text-5xl font-bold">{totalStudents.toLocaleString()}</h2>
                    </div>
                </div>
                <p className="text-blue-100">Matrículas ativas em todas as unidades</p>
            </div>



            {/* Gráficos - Primeira Linha */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gênero */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <UserCircle className="w-5 h-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900">Distribuição por Gênero</h3>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={GENDER_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    dataKey="value"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                >
                                    {GENDER_DATA.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={GENDER_COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Raça/Cor */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Distribuição por Raça/Cor</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={RACE_DATA} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip />
                                <Bar dataKey="value" name="Alunos" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Gráficos - Segunda Linha */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Faixa Etária */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Distribuição por Faixa Etária</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={AGE_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="age" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" name="Alunos" fill="#10b981" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Renda Familiar */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Renda Familiar (Salários Mínimos)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={INCOME_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" name="Famílias" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Gráfico de Distribuição Geográfica (Pizza) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6">Distribuição por Bairro</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={GEO_DATA}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                            >
                                {GEO_DATA.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Mapa de Distribuição de Alunos (Real) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <div>
                            <h3 className="font-bold text-gray-900">Mapa de Distribuição de Alunos</h3>
                            <p className="text-xs text-gray-500">Visualização pontual da residência dos alunos</p>
                        </div>
                    </div>
                    <div className="flex gap-3 text-xs">
                        {Object.entries(SEGMENT_COLORS).map(([seg, color]) => (
                            <div key={seg} className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                                <span className="text-gray-600">{seg}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-96 rounded-2xl overflow-hidden border border-gray-200 relative z-0">
                    {isClient && (
                        <MapContainer
                            center={[-23.5505, -46.6333]}
                            zoom={12}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            />
                            {STUDENT_POINTS.map((student) => (
                                <CircleMarker
                                    key={student.id}
                                    center={[student.lat, student.lng]}
                                    radius={3} // Pontos pequenos
                                    fillColor={SEGMENT_COLORS[student.segment]}
                                    fillOpacity={0.6}
                                    stroke={false}
                                >
                                    <Popup>
                                        <div className="text-xs">
                                            <strong>Aluno #{student.id}</strong><br />
                                            Segmento: {student.segment}
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    )}
                </div>
            </div>

            {/* Insights */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-3">💡 Insights</h3>
                <ul className="space-y-2 text-blue-800">
                    <li dangerouslySetInnerHTML={{ __html: "Distribuição de gênero <strong>equilibrada</strong> (52% feminino, 48% masculino)." }} />
                    <li dangerouslySetInnerHTML={{ __html: "Maior concentração de alunos na faixa <strong>6-10 anos</strong> (Fundamental I)." }} />
                    <li dangerouslySetInnerHTML={{ __html: "Predominância de famílias com renda de <strong>3-6 salários mínimos</strong>." }} />
                    <li dangerouslySetInnerHTML={{ __html: "Bairro <strong>Centro</strong> concentra 28% dos alunos." }} />
                </ul>
            </div>
        </div>
    );
}
