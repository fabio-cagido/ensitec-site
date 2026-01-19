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
            className={`block w-full text-left py-2.5 px-4 rounded-lg transition ${
              isActive("/dashboard")
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            Visão Geral
          </Link>
          <Link
            href="/dashboard/academico"
            className={`block w-full text-left py-2.5 px-4 rounded-lg transition ${
              isActive("/dashboard/academico")
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            Acadêmico
          </Link>
          <Link
            href="#"
            className="block w-full text-left py-2.5 px-4 text-gray-400 hover:text-white hover:bg-gray-800 transition"
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
