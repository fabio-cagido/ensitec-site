"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
    X, Send, ChevronDown, Copy, Check, AlertTriangle,
    Zap, Settings, RotateCcw, Maximize2, Minimize2, Cpu
} from "lucide-react";

// ================================================================
// ÍCONE CUSTOMIZADO: Metade Cérebro Orgânico | Metade Circuito
// ================================================================
function NeuroChipIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* ===== LADO ESQUERDO: CÉREBRO ORGÂNICO ===== */}
            <path
                d="M16 6 C13 6 10.5 7.5 9.5 9.5 C8 9 6.5 9.8 6 11.2 C4.5 11.5 3.5 13 4 14.5 C3 15.5 3 17.5 4.5 18.5 C4.5 20.5 6 22 8 22 C9 23.5 11 24 13 23.5 C14 24.5 15 25 16 25 L16 6Z"
                fill="currentColor"
                opacity="0.9"
            />
            <path d="M8.5 12 C9.5 10.5 11 10 12 10.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            <path d="M6 15 C7 14 8.5 14 9.5 15" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            <path d="M7.5 18 C8.5 17 10 17 11 18" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            <path d="M10 21 C11 20 12.5 20 13 21" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />

            {/* LINHA DIVISÓRIA central */}
            <line x1="16" y1="5" x2="16" y2="27" stroke="white" strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.4" />

            {/* ===== LADO DIREITO: CIRCUITO ===== */}
            {/* chip central */}
            <rect x="18" y="13" width="7" height="7" rx="1" fill="currentColor" opacity="0.9" />
            <rect x="19.5" y="14.5" width="4" height="4" rx="0.5" fill="white" opacity="0.25" />

            {/* trilhas horizontais */}
            <line x1="16" y1="14.5" x2="18" y2="14.5" stroke="currentColor" strokeWidth="1.2" />
            <line x1="16" y1="16.5" x2="18" y2="16.5" stroke="currentColor" strokeWidth="1.2" />
            <line x1="16" y1="18.5" x2="18" y2="18.5" stroke="currentColor" strokeWidth="1.2" />
            <line x1="25" y1="14.5" x2="28" y2="14.5" stroke="currentColor" strokeWidth="1.2" />
            <line x1="25" y1="16.5" x2="28" y2="16.5" stroke="currentColor" strokeWidth="1.2" />
            <line x1="25" y1="18.5" x2="28" y2="18.5" stroke="currentColor" strokeWidth="1.2" />

            {/* trilhas verticais */}
            <line x1="20" y1="20" x2="20" y2="23" stroke="currentColor" strokeWidth="1.2" />
            <line x1="23" y1="20" x2="23" y2="23" stroke="currentColor" strokeWidth="1.2" />
            <line x1="20" y1="10" x2="20" y2="13" stroke="currentColor" strokeWidth="1.2" />
            <line x1="23" y1="10" x2="23" y2="13" stroke="currentColor" strokeWidth="1.2" />

            {/* nós */}
            <circle cx="20" cy="10" r="1.2" fill="currentColor" />
            <circle cx="23" cy="10" r="1.2" fill="currentColor" />
            <circle cx="20" cy="23" r="1.2" fill="currentColor" />
            <circle cx="23" cy="23" r="1.2" fill="currentColor" />
            <circle cx="28" cy="14.5" r="1" fill="currentColor" />
            <circle cx="28" cy="16.5" r="1" fill="currentColor" />
            <circle cx="28" cy="18.5" r="1" fill="currentColor" />
        </svg>
    );
}

// ================================================================
// TIPOS
// ================================================================
interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    mode?: "ai" | "demo" | "error";
    timestamp: Date;
}

interface AISettings {
    apiKey: string;
    provider: "openai" | "gemini";
    usePageContext: boolean;
}

// ================================================================
// CONSTANTES POR NICHO
// ================================================================
const NICHE_CONFIG: Record<string, {
    niche: string;
    label: string;
    colorClass: string;
    gradientClass: string;
    borderClass: string;
    bgClass: string;
    textClass: string;
    quickActions: { label: string; prompt: string; icon: string }[];
}> = {
    restaurante: {
        niche: "restaurante",
        label: "Restaurante",
        colorClass: "bg-amber-700",
        gradientClass: "from-amber-800 to-amber-950",
        borderClass: "border-amber-700/30",
        bgClass: "bg-amber-50",
        textClass: "text-amber-700",
        quickActions: [
            { label: "Situação do CMV", prompt: "Analise criticamente meu CMV atual e compare com o benchmark do setor.", icon: "📉" },
            { label: "Maior risco agora", prompt: "Com base nos dados visíveis, qual é o meu maior risco operacional ou financeiro neste momento?", icon: "⚡" },
            { label: "Oportunidades", prompt: "Quais oportunidades de receita estou deixando passar com base nesses dados?", icon: "🎯" },
            { label: "Auditoria rápida", prompt: "Faça uma auditoria completa dos dados desta tela: aponte pontos críticos, positivos e as 3 recomendações mais urgentes.", icon: "🔍" },
        ],
    },
    escola: {
        niche: "escola",
        label: "Escola",
        colorClass: "bg-indigo-700",
        gradientClass: "from-indigo-800 to-indigo-950",
        borderClass: "border-indigo-700/30",
        bgClass: "bg-indigo-50",
        textClass: "text-indigo-700",
        quickActions: [
            { label: "Inadimplência", prompt: "Analise criticamente o nível de inadimplência atual e os riscos para o fluxo de caixa.", icon: "📉" },
            { label: "Risco de evasão", prompt: "Com base nos dados, qual o risco de evasão escolar nos próximos 30 dias?", icon: "⚡" },
            { label: "Retenção de alunos", prompt: "O que estou fazendo certo ou errado em termos de retenção de alunos?", icon: "🎯" },
            { label: "Auditoria rápida", prompt: "Faça uma auditoria completa dos dados desta tela: pontos críticos, positivos e 3 recomendações urgentes.", icon: "🔍" },
        ],
    },
    corporativo: {
        niche: "corporativo",
        label: "Corporativo",
        colorClass: "bg-slate-700",
        gradientClass: "from-slate-800 to-slate-950",
        borderClass: "border-slate-700/30",
        bgClass: "bg-slate-50",
        textClass: "text-slate-700",
        quickActions: [
            { label: "KPIs críticos", prompt: "Quais KPIs desta tela estão fora do benchmark e representam risco imediato?", icon: "📉" },
            { label: "Maior risco", prompt: "Qual é o maior risco estratégico identificado nos dados atuais?", icon: "⚡" },
            { label: "Oportunidades", prompt: "Quais oportunidades de melhoria de performance estou ignorando?", icon: "🎯" },
            { label: "Auditoria rápida", prompt: "Faça uma auditoria completa dos dados: pontos críticos, positivos e 3 recomendações de alta prioridade.", icon: "🔍" },
        ],
    },
};

const DEFAULT_CONFIG = NICHE_CONFIG["restaurante"];

// ================================================================
// HELPERS
// ================================================================
function detectNiche(pathname: string): typeof NICHE_CONFIG[string] | null {
    // Escola: rota /dashboard (sem sufixo)
    if (pathname.startsWith("/dashboard") && 
        !pathname.startsWith("/dashboard-restaurante") && 
        !pathname.startsWith("/dashboard-corporativo") &&
        !pathname.startsWith("/dashboard-hub")) {
        return NICHE_CONFIG["escola"];
    }
    // Restaurante
    if (pathname.startsWith("/dashboard-restaurante")) {
        return NICHE_CONFIG["restaurante"];
    }
    // Corporativo
    if (pathname.startsWith("/dashboard-corporativo")) {
        return NICHE_CONFIG["corporativo"];
    }
    // Hub, landing pages, sign-in, etc — nao mostrar o chat
    return null;
}

function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function parseMarkdown(text: string): string {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800">$1</code>')
        .replace(/^### (.*$)/gm, '<h3 class="text-sm font-bold text-gray-900 mt-3 mb-1">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-sm font-bold text-gray-900 mt-3 mb-1">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 class="text-sm font-bold text-gray-900 mt-3 mb-1">$1</h1>')
        .replace(/^- (.*$)/gm, '<li class="ml-3 flex gap-1.5 text-sm text-gray-700"><span class="text-gray-400 mt-1 text-xs">•</span><span>$1</span></li>')
        .replace(/^\d+\. (.*$)/gm, '<li class="ml-3 text-sm text-gray-700">$1</li>')
        .replace(/---/g, '<hr class="border-gray-200 my-2">')
        .replace(/\n\n/g, '<div class="mb-2"></div>')
        .replace(/\n/g, "<br>");
}

// ================================================================
// COMPONENTE PRINCIPAL
// ================================================================
export default function AIChat() {
    const pathname = usePathname();
    const config = detectNiche(pathname || "");
    // safeConfig: usado nas hooks (não pode usar early return antes dos hooks)
    const safeConfig = config ?? NICHE_CONFIG["restaurante"];

    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [alerts, setAlerts] = useState(0);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [settings, setSettings] = useState<AISettings>({
        apiKey: "",
        provider: "openai",
        usePageContext: true,
    });
    const [tempKey, setTempKey] = useState("");
    const [tempProvider, setTempProvider] = useState<"openai" | "gemini">("openai");

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatPanelRef = useRef<HTMLDivElement>(null);

    // Load settings from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem("ensitec-ai-settings");
            if (stored) {
                const parsed = JSON.parse(stored);
                setSettings(parsed);
                setTempKey(parsed.apiKey || "");
                setTempProvider(parsed.provider || "openai");
            }
        } catch {}
    }, []);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isSettingsOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isSettingsOpen]);

    // Reset chat on niche change
    useEffect(() => {
        setMessages([]);
        setAlerts(0);
    }, [safeConfig.niche]);

    // Simulated alert detection
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setAlerts(prev => (prev === 0 ? Math.floor(Math.random() * 3) + 1 : 0));
            }, 8000);
            return () => clearTimeout(timer);
        } else {
            setAlerts(0);
        }
    }, [isOpen, pathname]);

    const getPageContext = useCallback(() => {
        if (!settings.usePageContext) return {};
        try {
            const kpiElements = document.querySelectorAll("[data-kpi]");
            const context: Record<string, string> = {
                page: pathname || "unknown",
                niche: safeConfig.niche,
            };
            kpiElements.forEach(el => {
                const key = el.getAttribute("data-kpi");
                if (key) context[key] = el.textContent?.trim() || "";
            });
            return context;
        } catch {
            return { page: pathname || "unknown", niche: safeConfig.niche };
        }
    }, [settings.usePageContext, pathname, safeConfig.niche]);

    const sendMessage = useCallback(async (messageText?: string) => {
        const text = (messageText || input).trim();
        if (!text || isLoading) return;

        const userMessage: Message = {
            id: generateId(),
            role: "user",
            content: text,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        const historyForAPI = messages.slice(-8).map(m => ({
            role: m.role,
            content: m.content,
        }));

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    niche: safeConfig.niche,
                    pageContext: getPageContext(),
                    history: historyForAPI,
                    apiKey: settings.apiKey || undefined,
                    aiProvider: settings.provider,
                }),
            });

            const data = await res.json();
            const reply = data.reply || data.error || "Não foi possível processar sua pergunta.";

            const assistantMessage: Message = {
                id: generateId(),
                role: "assistant",
                content: reply,
                mode: data.mode,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch {
            const errorMessage: Message = {
                id: generateId(),
                role: "assistant",
                content: "Erro de conexão. Verifique sua internet e tente novamente.",
                mode: "demo",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages, safeConfig.niche, getPageContext, settings]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const copyMessage = (id: string, content: string) => {
        navigator.clipboard.writeText(content.replace(/<[^>]+>/g, ""));
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const saveSettings = () => {
        const newSettings = { ...settings, apiKey: tempKey, provider: tempProvider };
        setSettings(newSettings);
        localStorage.setItem("ensitec-ai-settings", JSON.stringify(newSettings));
        setIsSettingsOpen(false);
    };

    // Só mostra nos dashboards internos (escola, restaurante, corporativo)
    // Oculta em: hub, landing pages, sign-in, sign-up, home
    if (!config) return null;

    // A partir daqui, config é garantidamente não-null
    const C = config;
    const panelWidth = isExpanded ? "w-[480px]" : "w-[380px]";
    const panelHeight = isExpanded ? "h-[640px]" : "h-[520px]";

    return (
        <>
            {/* ===== BOTÃO FLUTUANTE ===== */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
                {!isOpen && (
                    <button
                        id="ai-chat-toggle"
                        onClick={() => setIsOpen(true)}
                        className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${C.gradientClass} text-white shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group`}
                        aria-label="Abrir EnsiTec AI Analyst"
                    >
                        {/* Pulsing ring */}
                        <span className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${C.gradientClass} animate-ping opacity-20`} />
                        <NeuroChipIcon />

                        {/* Alert badge */}
                        {alerts > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg border-2 border-white animate-bounce">
                                {alerts}
                            </span>
                        )}

                        {/* Tooltip */}
                        <span className="absolute right-full mr-3 whitespace-nowrap bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg pointer-events-none">
                            EnsiTec AI Analyst
                        </span>
                    </button>
                )}

                {/* ===== JANELA DO CHAT ===== */}
                {isOpen && (
                    <div
                        ref={chatPanelRef}
                        className={`${panelWidth} ${panelHeight} bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300`}
                        style={{
                            animation: "chatIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                        }}
                    >
                        {/* === HEADER === */}
                        <div className={`bg-gradient-to-r ${C.gradientClass} px-4 py-3 flex items-center gap-3 flex-shrink-0`}>
                            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                                <NeuroChipIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-white leading-none">EnsiTec AI Analyst</h3>
                                <p className="text-[10px] text-white/60 mt-0.5 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    {C.label} · {settings.apiKey ? "IA Ativa" : "Modo Demo"}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                {/* Context toggle */}
                                <button
                                    onClick={() => setSettings(s => ({ ...s, usePageContext: !s.usePageContext }))}
                                    title={settings.usePageContext ? "Contexto da tela: ativado" : "Contexto da tela: desativado"}
                                    className={`p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors ${settings.usePageContext ? "bg-white/20" : ""}`}
                                >
                                    <Cpu className="w-3.5 h-3.5" />
                                </button>
                                {/* Settings */}
                                <button
                                    onClick={() => setIsSettingsOpen(true)}
                                    className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <Settings className="w-3.5 h-3.5" />
                                </button>
                                {/* Expand/Shrink */}
                                <button
                                    onClick={() => setIsExpanded(e => !e)}
                                    className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                                </button>
                                {/* Close */}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* === SETTINGS PANEL === */}
                        {isSettingsOpen && (
                            <div className="flex-1 flex flex-col bg-gray-50 p-5 overflow-y-auto">
                                <div className="flex items-center gap-2 mb-5">
                                    <button onClick={() => setIsSettingsOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                                        <ChevronDown className="w-4 h-4 text-gray-500 rotate-90" />
                                    </button>
                                    <h4 className="text-sm font-bold text-gray-900">Configurar IA</h4>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Provedor de IA</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setTempProvider("openai")}
                                                className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all ${tempProvider === "openai" ? `${C.colorClass} text-white border-transparent shadow-md` : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"}`}
                                            >
                                                OpenAI (GPT)
                                            </button>
                                            <button
                                                onClick={() => setTempProvider("gemini")}
                                                className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all ${tempProvider === "gemini" ? `${C.colorClass} text-white border-transparent shadow-md` : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"}`}
                                            >
                                                Google Gemini
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                                            Sua Chave de API ({tempProvider === "openai" ? "sk-..." : "AI..."})
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={tempKey}
                                                onChange={e => setTempKey(e.target.value)}
                                                placeholder={tempProvider === "openai" ? "sk-proj-..." : "AI..."}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 bg-white"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1.5">
                                            A chave é salva apenas localmente no seu navegador. Nunca enviada para nossos servidores.
                                        </p>
                                    </div>

                                    <div className={`${C.bgClass} ${C.borderClass} border rounded-xl p-3`}>
                                        <p className={`text-xs font-bold ${C.textClass} mb-0.5`}>Sem chave?</p>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            O sistema funciona em <strong>Modo Demo</strong> com respostas analíticas pré-programadas de alta qualidade, sem nenhum custo.
                                        </p>
                                    </div>

                                    <div className="pt-2 flex gap-2">
                                        <button
                                            onClick={saveSettings}
                                            className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold ${C.colorClass} hover:opacity-90 transition-opacity`}
                                        >
                                            Salvar Configurações
                                        </button>
                                        <button
                                            onClick={() => setIsSettingsOpen(false)}
                                            className="px-4 py-2.5 rounded-xl text-gray-600 text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* === MESSAGES AREA === */}
                        {!isSettingsOpen && (
                            <>
                                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                                    {messages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-6">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${C.gradientClass} flex items-center justify-center shadow-lg`}>
                                                <NeuroChipIcon className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">EnsiTec AI Analyst</p>
                                                <p className="text-xs text-gray-500 mt-1 max-w-[240px] leading-relaxed">
                                                    Analista crítico de dados do seu {C.label.toLowerCase()}. Faça uma pergunta ou escolha uma análise rápida abaixo.
                                                </p>
                                            </div>
                                            {alerts > 0 && (
                                                <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2 text-left w-full">
                                                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-bold text-red-700">{alerts} alerta{alerts > 1 ? "s" : ""} detectado{alerts > 1 ? "s" : ""}</p>
                                                        <p className="text-[10px] text-red-600 mt-0.5">Peça uma auditoria para ver os detalhes.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                            {msg.role === "assistant" && (
                                                <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${C.gradientClass} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md`}>
                                                    <NeuroChipIcon className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            )}
                                            <div className={`max-w-[85%] group relative`}>
                                                <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                                                    msg.role === "user"
                                                        ? `bg-gradient-to-br ${C.gradientClass} text-white rounded-tr-sm`
                                                        : "bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-sm"
                                                }`}>
                                                    {msg.role === "assistant" ? (
                                                        <div
                                                            className="prose-custom"
                                                            dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
                                                        />
                                                    ) : (
                                                        msg.content
                                                    )}
                                                </div>
                                                {/* Actions row */}
                                                <div className={`flex items-center gap-2 mt-1 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                                    <span className="text-[9px] text-gray-400 font-medium">
                                                        {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                                    </span>
                                                    {msg.role === "assistant" && (
                                                        <>
                                                            {msg.mode === "demo" && !settings.apiKey && (
                                                                <span className="text-[9px] font-bold text-orange-500 uppercase">Demo</span>
                                                            )}
                                                            {msg.mode === "error" && (
                                                                <span className="text-[9px] font-bold text-red-500 uppercase">⚠ Erro</span>
                                                            )}
                                                            {msg.mode === "ai" && (
                                                                <span className="text-[9px] font-bold text-emerald-600 uppercase flex items-center gap-0.5">
                                                                    <Zap className="w-2.5 h-2.5" />IA Ativa
                                                                </span>
                                                            )}
                                                            <button
                                                                onClick={() => copyMessage(msg.id, msg.content)}
                                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                                                title="Copiar resposta"
                                                            >
                                                                {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Typing indicator */}
                                    {isLoading && (
                                        <div className="flex gap-2.5">
                                            <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${C.gradientClass} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                                <NeuroChipIcon className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* === QUICK ACTIONS === */}
                                {messages.length === 0 && (
                                    <div className="px-4 pb-2 flex gap-2 overflow-x-auto hide-scrollbar flex-shrink-0">
                                        {config.quickActions.map((action, i) => (
                                            <button
                                                key={i}
                                                onClick={() => sendMessage(action.prompt)}
                                                disabled={isLoading}
                                                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${C.bgClass} ${C.textClass} border ${C.borderClass} text-xs font-bold hover:shadow-sm transition-all whitespace-nowrap`}
                                            >
                                                <span>{action.icon}</span>
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Context indicator */}
                                {settings.usePageContext && (
                                    <div className="px-4 py-1 flex items-center gap-1.5 flex-shrink-0">
                                        <Cpu className={`w-3 h-3 ${C.textClass}`} />
                                        <span className={`text-[10px] font-bold ${C.textClass}`}>Dados da tela ativados</span>
                                    </div>
                                )}

                                {/* === INPUT AREA === */}
                                <div className="px-3 pb-3 pt-1 border-t border-gray-100 flex-shrink-0">
                                    <div className="flex gap-2 items-end bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-100 transition-all px-3 py-2">
                                        <textarea
                                            ref={inputRef}
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Pergunte algo crítico sobre seus dados..."
                                            rows={1}
                                            disabled={isLoading}
                                            className="flex-1 bg-transparent resize-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none leading-relaxed max-h-28 disabled:opacity-50"
                                            style={{ fieldSizing: "content" } as any}
                                        />
                                        {messages.length > 0 && (
                                            <button
                                                onClick={() => setMessages([])}
                                                title="Limpar conversa"
                                                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => sendMessage()}
                                            disabled={!input.trim() || isLoading}
                                            className={`w-8 h-8 rounded-xl ${C.colorClass} text-white flex items-center justify-center flex-shrink-0 hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md`}
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-gray-400 text-center mt-1.5">
                                        Enter para enviar · Shift+Enter para quebrar linha
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* CSS animation */}
            <style jsx global>{`
                @keyframes chatIn {
                    from { opacity: 0; transform: scale(0.8) translateY(20px); transform-origin: bottom right; }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </>
    );
}
