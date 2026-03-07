"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();

  // Don't show header on login, sign-in, sign-up, cadastro or dashboard pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="w-full border-b border-gray-800 bg-black text-white">
      <nav className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <div className="flex gap-6 items-center">
          <Link href="/" className="font-bold text-white text-lg">
            Ensitec
          </Link>

          <Link href="/bi-para-escolas" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            BI para Escolas
          </Link>

          <Link href="/bi-corporativo" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            BI Corporativo
          </Link>
        </div>

        {/* Utilizador não autenticado: mostra link para sign-in */}
        <SignedOut>
          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white transition-colors border border-gray-700 rounded-lg hover:border-gray-500"
          >
            <UserCircle size={18} />
            Área do Gestor
          </Link>
        </SignedOut>

        {/* Utilizador autenticado: mostra UserButton do Clerk */}
        <SignedIn>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </nav>
    </header>
  );
}
