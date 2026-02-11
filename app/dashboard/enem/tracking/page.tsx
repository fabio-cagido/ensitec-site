"use client";

import { useState, useMemo } from "react";
import {
    ArrowLeft,
    Search,
    User,
    TrendingUp,
    Target,
    CheckCircle2,
    XCircle,
    AlertCircle,
    GraduationCap,
    BarChart3,
    BookOpen,
    Brain,
    Globe,
    PenTool,
    Calculator as CalcIcon,
    ChevronRight,
    Filter
} from "lucide-react";
import Link from "next/link";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Cell
} from "recharts";

// --- MOCK DATA ---

const COURSES = [
    { id: "med", name: "Medicina", cutoff: 810, areas: { MT: 800, LC: 750, CH: 750, CN: 820, RED: 900 } },
    { id: "eng", name: "Engenharia de Software", cutoff: 760, areas: { MT: 820, LC: 680, CH: 650, CN: 740, RED: 800 } },
    { id: "dir", name: "Direito", cutoff: 740, areas: { MT: 650, LC: 780, CH: 780, CN: 620, RED: 850 } },
    { id: "adm", name: "Administração", cutoff: 680, areas: { MT: 680, LC: 680, CH: 700, CN: 640, RED: 750 } },
    { id: "enf", name: "Enfermagem", cutoff: 710, areas: { MT: 680, LC: 700, CH: 700, CN: 720, RED: 800 } },
];

const STUDENTS = Array.from({ length: 85 }, (_, i) => {
    const names = ["Carlos Eduardo Silva", "Mariana Oliveira", "João Pedro Santos", "Ana Beatriz Costa", "Lucas Ferreira", "Beatriz Rocha", "Guilherme Almeida"];
    const name = i < names.length ? names[i] : `Aluno ${i + 1}`;
    const choice1 = COURSES[Math.floor(Math.random() * COURSES.length)];
    const choice2 = COURSES.filter(c => c.id !== choice1.id)[Math.floor(Math.random() * (COURSES.length - 1))];

    // Generate simulation progress
    const baseScore = 600 + Math.random() * 200;
    const simulations = ["Simulado 1", "Simulado 2", "Simulado 3", "Simulado 4"].map((name, idx) => {
        const progress = idx * 25;
        const rand = () => Math.floor(baseScore + progress + (Math.random() * 40 - 20));
        return {
            name,
            scores: {
                MT: Math.min(990, rand() + (Math.random() * 40 - 20)),
                LC: Math.min(990, rand() + (Math.random() * 40 - 20)),
                CH: Math.min(990, rand() + (Math.random() * 40 - 20)),
                CN: Math.min(990, rand() + (Math.random() * 40 - 20)),
                RED: Math.min(1000, rand() + 100 + (Math.random() * 40 - 20)),
            }
        };
    });

    const latest = simulations[3].scores;
    const avg = Math.round((latest.MT + latest.LC + latest.CH + latest.CN + latest.RED) / 5);

    return {
        id: i + 1,
        name: name,
        choices: [choice1, choice2],
        simulations: simulations.map(s => ({
            ...s,
            avg: Math.round((s.scores.MT + s.scores.LC + s.scores.CH + s.scores.CN + s.scores.RED) / 5)
        })),
        latestAvg: avg
    };
});

// -----------------

export default function StudentTrackingPage() {
    const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(1); // Pre-seleciona o Carlos Eduardo

    // Filtered data for global view
    const globalStats = useMemo(() => {
        const stats = COURSES.map(course => {
            const studentsForCourse = STUDENTS.filter(s => s.choices[0].id === course.id);
            const passed1st = studentsForCourse.filter(s => s.latestAvg >= course.cutoff).length;
            const passed2nd = STUDENTS.filter(s => s.choices[1].id === course.id && s.latestAvg >= course.cutoff).length;
            const wanting = studentsForCourse.length;
            const notPassed = wanting - (studentsForCourse.filter(s => s.latestAvg >= s.choices[0].cutoff || s.latestAvg >= s.choices[1].cutoff).length);

            return {
                name: course.name,
                "Passou 1ª Opção": studentsForCourse.filter(s => s.latestAvg >= s.choices[0].cutoff).length,
                "Passou 2ª Opção": STUDENTS.filter(s => s.choices[1].id === course.id && s.latestAvg >= s.choices[1].cutoff && s.latestAvg < s.choices[0].cutoff).length,
                "Não Alcançou": studentsForCourse.filter(s => s.latestAvg < s.choices[0].cutoff && s.latestAvg < s.choices[1].cutoff).length,
                total: wanting
            };
        });

        if (selectedCourseId !== "all") {
            return stats.filter(s => COURSES.find(c => c.id === selectedCourseId)?.name === s.name);
        }
        return stats;
    }, [selectedCourseId]);

    const selectedStudent = useMemo(() => {
        return STUDENTS.find(s => s.id === selectedStudentId);
    }, [selectedStudentId]);

    const filteredStudents = useMemo(() => {
        return STUDENTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5);
    }, [searchTerm]);

    const studentRadarData = useMemo(() => {
        if (!selectedStudent) return [];
        const latest = selectedStudent.simulations[3].scores;
        const target = selectedStudent.choices[0].areas;
        return [
            { subject: 'Matemática', A: latest.MT, B: target.MT, fullMark: 1000 },
            { subject: 'Linguagens', A: latest.LC, B: target.LC, fullMark: 1000 },
            { subject: 'Ciências Humanas', A: latest.CH, B: target.CH, fullMark: 1000 },
            { subject: 'Ciências Natureza', A: latest.CN, B: target.CN, fullMark: 1000 },
            { subject: 'Redação', A: latest.RED, B: target.RED, fullMark: 1000 },
        ];
    }, [selectedStudent]);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/enem" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-500" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Tracking de Alunos</h1>
                                <p className="text-sm text-gray-500">Acompanhamento individual e meta de aprovação</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex flex-col items-end mr-4">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Escola</span>
                                <span className="text-sm font-bold text-indigo-600">Colégio Modelo</span>
                            </div>
                            <div className="p-2 bg-indigo-50 rounded-xl">
                                <GraduationCap className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

                {/* Global Manager View */}
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Visão Geral de Aprovação</h2>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                            <Filter className="w-4 h-4 text-gray-400 ml-2" />
                            <select
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                className="bg-transparent text-sm font-semibold text-gray-700 outline-none pr-4 cursor-pointer"
                            >
                                <option value="all">Todos os Cursos</option>
                                {COURSES.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={globalStats} layout="vertical" margin={{ left: 40, right: 30 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} width={120} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend verticalAlign="top" align="right" />
                                        <Bar dataKey="Passou 1ª Opção" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={40} />
                                        <Bar dataKey="Passou 2ª Opção" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="Não Alcançou" stackId="a" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <h3 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> Resumo do Ciclo
                                    </h3>
                                    <div className="space-y-4">
                                        {globalStats.length === 1 ? (
                                            <>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Total de Alunos</span>
                                                    <span className="text-lg font-bold text-gray-900">{globalStats[0].total}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Aptos (1ª Opção)</span>
                                                    <span className="text-lg font-bold text-emerald-600">{globalStats[0]["Passou 1ª Opção"]}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                    <div
                                                        className="bg-emerald-500 h-2 rounded-full"
                                                        style={{ width: `${(globalStats[0]["Passou 1ª Opção"] / globalStats[0].total) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-10 text-gray-500 italic text-sm">
                                                Selecione um curso para ver dados detalhados de conversão.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="w-4 h-4 text-amber-500" />
                                        <span className="text-xs font-bold text-gray-500 uppercase">Insights</span>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {selectedCourseId === "all"
                                            ? "Medicina continua sendo o curso com maior concorrência interna, com apenas 15% dos alunos acima da nota de corte atual."
                                            : `Para ${COURSES.find(c => c.id === selectedCourseId)?.name}, observamos uma evolução média de 12 pts em relação ao último simulado.`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Individual Student Search & Analysis */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Search className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Análise Individual de Alunos</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Search and List */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar aluno..."
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                {searchTerm === "" && filteredStudents.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <User className="w-8 h-8 mx-auto text-gray-200 mb-2" />
                                        <p className="text-xs text-gray-400">Digite um nome para carregar os dados</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        <div className="bg-gray-50/50 px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                            {searchTerm === "" ? "Sugestões / Recentes" : "Resultados da Busca"}
                                        </div>
                                        {filteredStudents.map(student => (
                                            <button
                                                key={student.id}
                                                onClick={() => setSelectedStudentId(student.id)}
                                                className={`w-full text-left p-4 hover:bg-indigo-50 transition-colors flex items-center justify-between group ${selectedStudentId === student.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
                                            >
                                                <div>
                                                    <p className={`text-sm font-bold ${selectedStudentId === student.id ? 'text-indigo-700' : 'text-gray-900'}`}>{student.name}</p>
                                                    <p className="text-[10px] text-gray-500">{student.choices[0].name}</p>
                                                </div>
                                                <ChevronRight className={`w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-transform ${selectedStudentId === student.id ? 'translate-x-1 text-indigo-400' : ''}`} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detailed Analysis Panel */}
                        <div className="lg:col-span-3">
                            {!selectedStudent ? (
                                <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-300">
                                    <div className="p-4 bg-gray-50 rounded-full mb-4">
                                        <User className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-gray-900 font-bold">Nenhum aluno selecionado</h3>
                                    <p className="text-gray-500 text-sm max-w-xs text-center">
                                        Selecione um aluno da lista ao lado para ver sua evolução e chances de aprovação.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Student Header Card */}
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
                                                {selectedStudent.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100 uppercase tracking-tight">
                                                        1ª: {selectedStudent.choices[0].name}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-full border border-gray-100 uppercase tracking-tight">
                                                        2ª: {selectedStudent.choices[1].name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                                            <div className="text-center">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Última Média</p>
                                                <p className="text-2xl font-black text-gray-900">{selectedStudent.latestAvg}</p>
                                            </div>
                                            <div className="text-center pl-6 border-l border-gray-100">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Distância Meta</p>
                                                <div className="flex items-center gap-1">
                                                    {selectedStudent.latestAvg >= selectedStudent.choices[0].cutoff ? (
                                                        <span className="text-2xl font-black text-emerald-500 flex items-center gap-1">
                                                            Passou
                                                        </span>
                                                    ) : (
                                                        <span className="text-2xl font-black text-red-500">
                                                            -{selectedStudent.choices[0].cutoff - selectedStudent.latestAvg}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Evolution Chart */}
                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                                                    Evolução nos Simulados
                                                </h4>
                                                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full uppercase">Meta: {selectedStudent.choices[0].cutoff}</span>
                                            </div>
                                            <div className="h-[250px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={selectedStudent.simulations}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                                        <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                                        />
                                                        {/* Reference line for target cutoff */}
                                                        <Line
                                                            name="Sua Nota"
                                                            type="monotone"
                                                            dataKey="avg"
                                                            stroke="#6366f1"
                                                            strokeWidth={4}
                                                            dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                                            activeDot={{ r: 8 }}
                                                        />
                                                        <Line
                                                            name="Corte 1ª Opção"
                                                            type="monotone"
                                                            dataKey={() => selectedStudent.choices[0].cutoff}
                                                            stroke="#e2e8f0"
                                                            strokeDasharray="5 5"
                                                            strokeWidth={2}
                                                            dot={false}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Radar Analysis vs Target */}
                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 font-sans">
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                                    <Target className="w-4 h-4 text-red-500" />
                                                    Equilíbrio por Área
                                                </h4>
                                            </div>
                                            <div className="h-[250px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={studentRadarData}>
                                                        <PolarGrid stroke="#e5e7eb" />
                                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 9, fontWeight: 600 }} />
                                                        <PolarRadiusAxis angle={30} domain={[0, 1000]} tick={false} axisLine={false} />
                                                        <Radar
                                                            name="Meta do Curso"
                                                            dataKey="B"
                                                            stroke="#94a3b8"
                                                            fill="#94a3b8"
                                                            fillOpacity={0.1}
                                                        />
                                                        <Radar
                                                            name="Sua Nota Atual"
                                                            dataKey="A"
                                                            stroke="#6366f1"
                                                            fill="#6366f1"
                                                            fillOpacity={0.4}
                                                        />
                                                        <Tooltip />
                                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Breakdown por Matéria */}
                                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                        {[
                                            { label: 'MT', full: 'Matemática', val: selectedStudent.simulations[3].scores.MT, target: selectedStudent.choices[0].areas.MT, icon: <CalcIcon className="w-4 h-4" /> },
                                            { label: 'LC', full: 'Linguagens', val: selectedStudent.simulations[3].scores.LC, target: selectedStudent.choices[0].areas.LC, icon: <Globe className="w-4 h-4" /> },
                                            { label: 'CH', full: 'Humanas', val: selectedStudent.simulations[3].scores.CH, target: selectedStudent.choices[0].areas.CH, icon: <BookOpen className="w-4 h-4" /> },
                                            { label: 'CN', full: 'Natureza', val: selectedStudent.simulations[3].scores.CN, target: selectedStudent.choices[0].areas.CN, icon: <Brain className="w-4 h-4" /> },
                                            { label: 'RED', full: 'Redação', val: selectedStudent.simulations[3].scores.RED, target: selectedStudent.choices[0].areas.RED, icon: <PenTool className="w-4 h-4" /> },
                                        ].map((item) => {
                                            const diff = item.val - item.target;
                                            return (
                                                <div key={item.label} className="bg-white p-4 rounded-2xl border border-gray-100">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="p-1 px-2 bg-gray-50 text-gray-500 rounded text-[10px] font-bold">{item.label}</div>
                                                        <div className="text-gray-300">{item.icon}</div>
                                                    </div>
                                                    <div className="flex items-end gap-2">
                                                        <span className="text-lg font-black text-gray-900">{Math.round(item.val)}</span>
                                                        <span className={`text-[10px] font-bold mb-1 ${diff >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                                                            {diff >= 0 ? `+${Math.round(diff)}` : Math.round(diff)}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${diff >= 0 ? 'bg-emerald-500' : 'bg-red-400'}`}
                                                            style={{ width: `${(item.val / 1000) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-tight">Meta: {item.target}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
