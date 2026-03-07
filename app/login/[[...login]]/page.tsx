"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative">
            <Link
                href="/"
                className="absolute top-6 left-6 text-slate-500 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors"
            >
                <span>←</span> Voltar para o site
            </Link>

            <div className="w-full max-w-[420px] flex flex-col items-center">
                <div className="text-center mb-8 flex flex-col items-center">
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-blue-700 to-blue-500 bg-clip-text text-transparent">
                        ENSITEC BI
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">
                        Área Restrita do Gestor
                    </p>
                </div>

                {/* Componente de Login do Clerk */}
                <div className="w-full flex justify-center">
                    <SignIn appearance={{
                        elements: {
                            rootBox: 'w-full',
                            card: 'shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 w-full rounded-3xl bg-white m-0',
                            headerTitle: 'hidden',
                            headerSubtitle: 'hidden',
                            socialButtonsBlockButton: 'rounded-xl border-slate-200 hover:bg-slate-50 transition-colors h-11',
                            socialButtonsBlockButtonText: 'font-semibold text-slate-600',
                            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 font-semibold h-11 transition-all',
                            formFieldInput: 'rounded-xl bg-slate-50 border-slate-200 h-11 transition-all focus:bg-white text-slate-800',
                            formFieldLabel: 'font-semibold text-slate-600',
                            footerAction: 'text-slate-500 font-medium text-sm',
                            footerActionLink: 'text-blue-600 hover:text-blue-700 font-semibold',
                            organizationSwitcherTrigger: 'hidden',
                            dividerText: 'text-slate-400 font-medium',
                            dividerLine: 'bg-slate-200'
                        }
                    }} />
                </div>
            </div>
        </div>
    );
}
