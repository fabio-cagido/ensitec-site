"use client";
import Link from "next/link";
import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import { LayoutDashboard, UtensilsCrossed, Building2, LogOut } from "lucide-react";

export default function DashboardHubPage() {
    const { user } = useUser();
    const { signOut } = useClerk();

    const allowedNiches = user?.publicMetadata?.nicho 
        ? typeof user.publicMetadata.nicho === 'string'
            ? user.publicMetadata.nicho.split(',').map(n => n.trim().toLowerCase())
            : Array.isArray(user.publicMetadata.nicho) 
                ? user.publicMetadata.nicho 
                : ['escola']
        : ['escola']; // Padrão

    const isAdmin = allowedNiches.includes('admin');

    const hasEscola = isAdmin || allowedNiches.includes('escola');
    const hasRestaurante = isAdmin || allowedNiches.includes('restaurante');
    const hasCorporativo = isAdmin || allowedNiches.includes('corporativo');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Nav do Hub */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        E
                    </div>
                    <span className="font-bold text-gray-900 tracking-tight text-xl">ENSITEC BI</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600 hidden sm:block">
                        Olá, {user?.firstName || 'Gestor'}
                    </span>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </nav>

            {/* Conteúdo Central */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 mt-[-60px]">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Bem-vindo ao Ensitec BI</h1>
                    <p className="text-gray-500">Selecione qual módulo você deseja acessar no momento.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                    
                    {/* ESCOLA */}
                    {hasEscola ? (
                        <Link href="/dashboard" className="group flex flex-col p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                                <LayoutDashboard className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Escolas & Cursos</h2>
                            <p className="text-sm text-gray-500 flex-1">Gestão acadêmica, acompanhamento financeiro, inadimplência e performance do Enem.</p>
                            <div className="mt-6 text-sm font-bold text-blue-600 group-hover:text-blue-700">Acessar Dashboard →</div>
                        </Link>
                    ) : (
                        <div className="flex flex-col p-8 rounded-3xl bg-gray-50 border border-gray-200 opacity-60 grayscale cursor-not-allowed">
                            <div className="w-16 h-16 rounded-2xl bg-gray-200 text-gray-400 flex items-center justify-center mb-6">
                                <LayoutDashboard className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Escolas & Cursos</h2>
                            <p className="text-sm text-gray-500">Módulo indisponível para o seu usuário.</p>
                        </div>
                    )}

                    {/* RESTAURANTE */}
                    {hasRestaurante ? (
                        <Link href="/dashboard-restaurante" className="group flex flex-col p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                                <UtensilsCrossed className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Restaurantes</h2>
                            <p className="text-sm text-gray-500 flex-1">Inteligência de mercado, engenharia de cardápio, logística de ponta e mapa de concorrentes.</p>
                            <div className="mt-6 text-sm font-bold text-amber-600 group-hover:text-amber-700">Acessar Dashboard →</div>
                        </Link>
                    ) : (
                        <div className="flex flex-col p-8 rounded-3xl bg-gray-50 border border-gray-200 opacity-60 grayscale cursor-not-allowed">
                            <div className="w-16 h-16 rounded-2xl bg-gray-200 text-gray-400 flex items-center justify-center mb-6">
                                <UtensilsCrossed className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Restaurantes</h2>
                            <p className="text-sm text-gray-500">Módulo indisponível para o seu usuário.</p>
                        </div>
                    )}

                    {/* CORPORATIVO */}
                    {hasCorporativo ? (
                        <Link href="/dashboard-corporativo" className="group flex flex-col p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Corporativo</h2>
                            <p className="text-sm text-gray-500 flex-1">Gestão empresarial, RH, fluxo de caixa, DRE gerencial e alocação de recursos corporativos.</p>
                            <div className="mt-6 text-sm font-bold text-emerald-600 group-hover:text-emerald-700">Acessar Dashboard →</div>
                        </Link>
                    ) : (
                        <div className="flex flex-col p-8 rounded-3xl bg-gray-50 border border-gray-200 opacity-60 grayscale cursor-not-allowed">
                            <div className="w-16 h-16 rounded-2xl bg-gray-200 text-gray-400 flex items-center justify-center mb-6">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Corporativo</h2>
                            <p className="text-sm text-gray-500">Módulo indisponível para o seu usuário.</p>
                        </div>
                    )}

                </div>
                
                <button onClick={() => signOut({ redirectUrl: '/' })} className="mt-12 text-sm text-gray-500 hover:text-red-500 font-medium flex items-center gap-2 transition-colors">
                    <LogOut className="w-4 h-4" /> Finalizar Sessão
                </button>
            </div>
        </div>
    );
}
