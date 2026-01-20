"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* SIDEBAR */}
            <aside className="w-64 bg-gray-900 text-white p-6 hidden md:flex flex-col border-r border-gray-800 fixed h-full">
                <h2 className="text-xl font-bold mb-10 text-blue-400">ENSITEC BI</h2>
                <nav className="flex-1 space-y-2 text-sm font-medium">
                    <Link
                        href="/dashboard"
                        className={`block w-full text-left py-2.5 px-4 rounded-lg transition ${isActive("/dashboard")
                            ? "bg-blue-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                    >
                        Visão Geral
                    </Link>
                    <div className="space-y-1">
                        <Link
                            href="/dashboard/academico"
                            className={`block w-full text-left py-2.5 px-4 rounded-lg transition ${pathname.startsWith("/dashboard/academico")
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                                }`}
                        >
                            Acadêmico
                        </Link>

                        {/* Submenu Acadêmico - Exibe apenas se estiver na seção acadêmico ou expansível */}
                        {pathname.startsWith("/dashboard/academico") && (
                            <div className="ml-4 space-y-1 border-l border-gray-700 pl-2 mt-1">
                                {[
                                    { name: "Histórico e Tendências", path: "/dashboard/academico/historico" },
                                    { name: "Média Global", path: "/dashboard/academico/media-global" },
                                    { name: "Taxa de Aprovação", path: "/dashboard/academico/aprovacao" },
                                    { name: "Frequência Média", path: "/dashboard/academico/frequencia" },
                                    { name: "Alunos em Risco", path: "/dashboard/academico/risco" },
                                    { name: "Entrega de Atividades", path: "/dashboard/academico/entregas" },
                                    { name: "Engajamento Digital", path: "/dashboard/academico/engajamento" },
                                    { name: "Eficiência Operacional", path: "/dashboard/academico/eficiencia" },
                                ].map((item) => (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`block w-full text-left py-1.5 px-4 rounded-lg text-xs transition ${isActive(item.path)
                                            ? "text-blue-400 font-bold bg-gray-800"
                                            : "text-gray-500 hover:text-gray-300"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Clientes */}
                    <div className="space-y-1">
                        <Link
                            href="/dashboard/clientes"
                            className={`block w-full text-left py-2.5 px-4 rounded-lg transition ${pathname.startsWith("/dashboard/clientes")
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                                }`}
                        >
                            Clientes
                        </Link>
                        {pathname.startsWith("/dashboard/clientes") && (
                            <div className="ml-4 space-y-1 border-l border-gray-700 pl-2 mt-1">
                                {[
                                    { name: "Total de Alunos", path: "/dashboard/clientes/total-alunos" },
                                    { name: "Perfil do Aluno", path: "/dashboard/clientes/perfil-aluno" },
                                    { name: "Taxa de Ocupação", path: "/dashboard/clientes/ocupacao" },
                                    { name: "Alunos Bolsistas", path: "/dashboard/clientes/bolsistas" },
                                    { name: "Health Score", path: "/dashboard/clientes/health-score" },
                                    { name: "Famílias com Irmãos", path: "/dashboard/clientes/irmaos" },
                                    { name: "Satisfação (NPS)", path: "/dashboard/clientes/nps" },
                                    { name: "Taxa de Evasão", path: "/dashboard/clientes/evasao" },
                                ].map((item) => (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`block w-full text-left py-1.5 px-4 rounded-lg text-xs transition ${isActive(item.path)
                                            ? "text-blue-400 font-bold bg-gray-800"
                                            : "text-gray-500 hover:text-gray-300"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <Link
                        href="/dashboard/financeiro"
                        className={`block w-full text-left py-2.5 px-4 rounded-lg transition ${isActive("/dashboard/financeiro")
                            ? "bg-blue-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                    >
                        Financeiro
                    </Link>
                    <Link
                        href="#"
                        className="block w-full text-left py-2.5 px-4 text-gray-400 hover:text-white hover:bg-gray-800 transition"
                    >
                        Operacional
                    </Link>
                </nav>
            </aside>

            {/* ÁREA PRINCIPAL */}
            <main className="flex-1 p-8 overflow-y-auto md:ml-64">
                {children}
            </main>
        </div>
    );
}
