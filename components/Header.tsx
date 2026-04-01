"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCircle, MessageCircle, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show header on login, sign-in, sign-up, cadastro or dashboard pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: "/bi-para-escolas", label: "BI para Escolas" },
    { href: "/bi-para-restaurantes", label: "BI para Restaurantes" },
    { href: "/bi-corporativo", label: "BI Corporativo" },
  ];

  return (
    <>
      <header className="w-full border-b border-gray-800 bg-black text-white sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="flex gap-6 items-center">
            <Link href="/" className="font-bold text-white text-lg" onClick={closeMobileMenu}>
              Ensitec
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex gap-6 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side: Desktop actions + Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <SignedOut>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white transition-colors border border-gray-700 rounded-lg hover:border-gray-500"
                >
                  <UserCircle size={18} />
                  Área do Gestor
                </Link>
              </SignedOut>

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

              <a href="#contato" className="text-xs font-bold text-gray-300 hover:text-white transition-colors">
                Contato
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
            />

            {/* Sidebar Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[280px] bg-black border-l border-gray-800 z-[60] md:hidden shadow-2xl flex flex-col p-6"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-bold text-white text-lg tracking-tight">Menu</span>
                <button onClick={closeMobileMenu} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="text-lg font-semibold text-gray-300 hover:text-white transition-colors border-b border-white/5 pb-3"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-6 flex flex-col gap-4">
                  <SignedOut>
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-gray-300 hover:text-white transition-colors border border-gray-700 rounded-xl hover:border-gray-500 bg-gray-900/50"
                    >
                      <UserCircle size={20} />
                      Área do Gestor
                    </Link>
                  </SignedOut>

                  <SignedIn>
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-900/50 rounded-xl border border-gray-800">
                      <Link
                        href="/dashboard"
                        onClick={closeMobileMenu}
                        className="text-sm font-bold text-gray-300 hover:text-white"
                      >
                        Dashboard
                      </Link>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>

                    <a
                      href="#contato"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold text-white bg-black rounded-xl hover:bg-gray-900 transition-all shadow-lg shadow-black/20 active:scale-95"
                    >
                      Contato
                    </a>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-white/5">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center font-medium">
                  &copy; {new Date().getFullYear()} Ensitec BI
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
