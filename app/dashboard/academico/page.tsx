import Link from "next/link";

export default function AcademicoPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Acadêmico</h1>
                <p className="text-gray-500">Gestão Pedagógica e Performance Educacional</p>
            </header>

            {/* KPI GRID - 9 Indicadores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Média Global */}
                <Link href="/dashboard/academico/media-global" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Média Global</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">7.8</h3>
                            </div>
                            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-bold">+0.2%</span>
                        </div>
                        <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full w-[78%]"></div>
                        </div>
                    </div>
                </Link>

                {/* 2. Taxa de Aprovação */}
                <Link href="/dashboard/academico/aprovacao" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Taxa de Aprovação</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">94.2%</h3>
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-full font-bold">+1.5%</span>
                        </div>
                        <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[94.2%]"></div>
                        </div>
                    </div>
                </Link>

                {/* 3. Frequência Média */}
                <Link href="/dashboard/academico/frequencia" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Frequência Média</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">88.5%</h3>
                            </div>
                            <span className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded-full font-bold">-0.5%</span>
                        </div>
                        <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full w-[88.5%]"></div>
                        </div>
                    </div>
                </Link>

                {/* 4. Alunos em Risco */}
                <Link href="/dashboard/academico/risco" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Alunos em Risco</p>
                                <h3 className="text-3xl font-bold text-red-600 mt-2">24</h3>
                            </div>
                            <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full font-bold">Crítico</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Notas vermelhas ou baixa frequência</p>
                    </div>
                </Link>

                {/* 5. Taxa de Evasão */}
                <Link href="/dashboard/academico/evasao" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Taxa de Evasão</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">1.2%</h3>
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-full font-bold">Baixa</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Dentro da meta esperada (&lt; 2%)</p>
                    </div>
                </Link>

                {/* 6. NPS (Satisfação) */}
                <Link href="/dashboard/academico/nps" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">NPS (Satisfação)</p>
                                <h3 className="text-3xl font-bold text-purple-600 mt-2">72</h3>
                            </div>
                            <span className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-full font-bold">Zona de Qualidade</span>
                        </div>
                        <div className="mt-4 flex gap-1">
                            <div className="h-1.5 flex-1 bg-gray-200 rounded-l-full"></div>
                            <div className="h-1.5 flex-1 bg-gray-200"></div>
                            <div className="h-1.5 flex-1 bg-purple-500"></div>
                            <div className="h-1.5 flex-1 bg-gray-200 rounded-r-full"></div>
                        </div>
                    </div>
                </Link>

                {/* 7. Entrega de Atividades */}
                <Link href="/dashboard/academico/entregas" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Entrega de Atividades</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">91%</h3>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Trabalhos e TPC</p>
                    </div>
                </Link>

                {/* 8. Engajamento Digital */}
                <Link href="/dashboard/academico/engajamento" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Engajamento Digital</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">68%</h3>
                            </div>
                            <span className="bg-yellow-50 text-yellow-600 text-xs px-2 py-1 rounded-full font-bold">Atenção</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Acessos semanais ao portal</p>
                    </div>
                </Link>

                {/* 9. Eficiência Operacional */}
                <Link href="/dashboard/academico/eficiencia" className="block transition-transform hover:scale-105">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Correcão de Provas</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">2.5 dias</h3>
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-full font-bold">Rápido</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Tempo médio de feedback</p>
                    </div>
                </Link>
            </div>

            {/* SEÇÃO VISUAL E GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Histograma de Notas */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Distribuição de Notas</h3>
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                        {/* Mock Bars */}
                        {[5, 12, 25, 40, 60, 85, 55, 30, 15, 5].map((h, i) => (
                            <div key={i} className="w-full bg-blue-100 rounded-t-lg relative group">
                                <div
                                    className="bg-blue-500 rounded-t-lg absolute bottom-0 w-full transition-all duration-500 group-hover:bg-blue-600"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
                        <span>0-1</span>
                        <span>5</span>
                        <span>10</span>
                    </div>
                </div>

                {/* Desempenho por Disciplina */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Desempenho por Disciplina</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Matemática", val: 6.5, color: "bg-red-500" },
                            { name: "Português", val: 7.8, color: "bg-blue-500" },
                            { name: "História", val: 8.2, color: "bg-emerald-500" },
                            { name: "Geografia", val: 8.0, color: "bg-emerald-500" },
                            { name: "Física", val: 6.8, color: "bg-yellow-500" },
                        ].map((d) => (
                            <div key={d.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{d.name}</span>
                                    <span className="font-bold text-gray-900">{d.val}</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div className={`${d.color} h-full rounded-full`} style={{ width: `${d.val * 10}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Evolução Histórica (Mock Line Chart using CSS clip-path or simple SVG) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Evolução da Média Geral (6 Meses)</h3>
                        <select className="text-sm border-gray-200 rounded-lg text-gray-500">
                            <option>Semestre 1 - 2024</option>
                        </select>
                    </div>
                    <div className="h-64 w-full bg-gray-50 rounded-xl relative overflow-hidden flex items-end px-10 pb-10">
                        {/* Simple SVG Line Chart */}
                        <svg className="absolute inset-0 w-full h-full p-6" preserveAspectRatio="none">
                            <path
                                d="M0,200 Q150,100 300,150 T600,50 T900,100 T1200,80"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                vectorEffect="non-scaling-stroke"
                            />
                            {/* Area under curve gradient could go here */}
                        </svg>

                        {/* Points */}
                        <div className="absolute inset-0 flex justify-between items-end px-6 pb-6 pointer-events-none">
                            {["Fev", "Mar", "Abr", "Mai", "Jun", "Jul"].map((m) => (
                                <div key={m} className="flex flex-col items-center gap-2">
                                    <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full z-10"></div>
                                    <span className="text-xs text-gray-400">{m}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
