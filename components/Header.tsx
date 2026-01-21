"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Don't show header on login or dashboard pages
  if (pathname === "/login" || pathname?.startsWith("/dashboard")) {
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
        </div>

        <Link
          href="/login"
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white transition-colors border border-gray-700 rounded-lg hover:border-gray-500"
        >
          <UserCircle size={18} />
          Área do Gestor
        </Link>
      </nav>
    </header>
  );
}
