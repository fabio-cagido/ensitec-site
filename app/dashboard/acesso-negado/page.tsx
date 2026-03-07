"use client";

import { ShieldX, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function AcessoNegadoPage() {
    const { user, isLoaded } = useUser();
    const userRole = user?.publicMetadata?.role as string | null;

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            {/* Ícone */}
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <ShieldX className="w-10 h-10 text-red-500" />
            </div>

            {/* Título */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Acesso Negado
            </h1>

            {/* Descrição */}
            <p className="text-gray-500 max-w-md mb-4 leading-relaxed">
                Não tens permissão para aceder a esta secção.
                Contacta o administrador da plataforma caso precises de acesso mais elevado.
            </p>

            {/* Bloco Informativo das Permissões (DEBUG / CLAREZA) */}
            {isLoaded ? (
                <div className="mb-8 p-4 bg-gray-100/80 rounded-xl border border-gray-200 text-sm inline-block min-w-[280px]">
                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-gray-500 font-medium">A tua permissão atual é:</span>
                        <span className="px-3 py-1 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-sm">
                            {userRole ? String(userRole).toUpperCase() : "AGUARDANDO APROVAÇÃO"}
                        </span>
                    </div>
                    {userRole === 'manager' && (
                        <p className="mt-3 text-xs text-blue-600 max-w-xs text-center mx-auto">
                            Como Manager podes aceder aos Dashboards. Se estiveres a ver este erro, tenta fechar este browser e tentar de novo ou voltar para o início.
                        </p>
                    )}
                </div>
            ) : (
                <div className="mb-8 h-20"></div> // Placeholder enquanto carrega
            )}

            {/* Botão Voltar */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200 active:scale-95"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Início do Dashboard
            </Link>
        </div>
    );
}

