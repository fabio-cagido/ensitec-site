"use client";
import { useState } from "react";
import { Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificação das credenciais
    if (username === "admin" && password === "ensitec2026") {
      // 1. Grava o COOKIE (O Middleware precisa disso para te deixar passar)
      document.cookie = "isLoggedIn=true; path=/; max-age=3600"; 
      
      // 2. Redireciona usando window.location para garantir que o cookie seja lido
      window.location.href = "/dashboard";
    } else {
      setError("Credenciais inválidas. Tente admin / ensitec2026");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight text-blue-600">ENSITEC BI</h2>
          <p className="text-gray-500 mt-2 font-medium">Área Restrita do Gestor</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold text-center border border-red-100">
              {error}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition text-gray-900"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition text-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            Entrar no Painel <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}