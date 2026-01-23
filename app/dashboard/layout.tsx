"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    LogOut,
    Menu,
    X,
    ChevronDown,
    LayoutDashboard,
    GraduationCap,
    Users,
    FileText,
    DollarSign,
    Settings,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

// Definição dos menus com subpáginas
const MENU_ITEMS = [
    {
        id: "visao-geral",
        name: "Visão Geral",
        path: "/dashboard",
        icon: LayoutDashboard,
        exactMatch: true, // Só fica ativo quando está exatamente nessa rota
        subpages: []
    },
    {
        id: "academico",
        name: "Acadêmico",
        path: "/dashboard/academico",
        icon: GraduationCap,
        exactMatch: false,
        subpages: [
            { name: "Histórico e Tendências", path: "/dashboard/academico/historico" },
            { name: "Média Global", path: "/dashboard/academico/media-global" },
            { name: "Taxa de Aprovação", path: "/dashboard/academico/aprovacao" },
            { name: "Frequência Média", path: "/dashboard/academico/frequencia" },
            { name: "Alunos em Risco", path: "/dashboard/academico/risco" },
            { name: "Entrega de Atividades", path: "/dashboard/academico/entregas" },
            { name: "Engajamento Digital", path: "/dashboard/academico/engajamento" },
            { name: "Eficiência Operacional", path: "/dashboard/academico/eficiencia" },
        ]
    },
    {
        id: "clientes",
        name: "Clientes",
        path: "/dashboard/clientes",
        icon: Users,
        exactMatch: false,
        subpages: [
            { name: "Total de Alunos", path: "/dashboard/clientes/total-alunos" },
            { name: "Perfil do Aluno", path: "/dashboard/clientes/perfil-aluno" },
            { name: "Taxa de Ocupação", path: "/dashboard/clientes/ocupacao" },
            { name: "Alunos Bolsistas", path: "/dashboard/clientes/bolsistas" },
            { name: "Health Score", path: "/dashboard/clientes/health-score" },
            { name: "Famílias com Irmãos", path: "/dashboard/clientes/irmaos" },
            { name: "Satisfação (NPS)", path: "/dashboard/clientes/nps" },
            { name: "Taxa de Evasão", path: "/dashboard/clientes/evasao" },
        ]
    },
    {
        id: "enem",
        name: "Enem",
        path: "/dashboard/enem",
        icon: FileText,
        exactMatch: true,
        subpages: []
    },
    {
        id: "financeiro",
        name: "Financeiro",
        path: "/dashboard/financeiro",
        icon: DollarSign,
        exactMatch: true,
        subpages: []
    },
    {
        id: "operacional",
        name: "Operacional",
        path: "/dashboard/operacional",
        icon: Settings,
        exactMatch: false,
        subpages: [
            { name: "Ocupação de Espaços", path: "/dashboard/operacional/espacos" },
            { name: "SLA Secretaria", path: "/dashboard/operacional/secretaria" },
            { name: "Manutenção e Zeladoria", path: "/dashboard/operacional/manutencao" },
            { name: "Docentes (Absenteísmo)", path: "/dashboard/operacional/docentes" },
            { name: "Gestão de TI", path: "/dashboard/operacional/ti" },
            { name: "Custos de Impressão", path: "/dashboard/operacional/impressao" },
            { name: "Alimentação", path: "/dashboard/operacional/alimentacao" },
            { name: "Segurança e Acesso", path: "/dashboard/operacional/seguranca" },
        ]
    },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    // Estados para controle da sidebar
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop: collapsed/expanded
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile: drawer
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]); // Submenus abertos

    // Detecta se está em uma subpágina e expande o menu correspondente
    useEffect(() => {
        MENU_ITEMS.forEach(item => {
            if (item.subpages.length > 0 && pathname.startsWith(item.path) && pathname !== item.path) {
                setExpandedMenus(prev =>
                    prev.includes(item.id) ? prev : [...prev, item.id]
                );
            }
        });
    }, [pathname]);

    // Fecha mobile menu quando navegar
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Verifica se está ativo (exato ou seção)
    const isMenuActive = (item: typeof MENU_ITEMS[0]) => {
        if (item.exactMatch) {
            return pathname === item.path;
        }
        return pathname.startsWith(item.path);
    };

    const isSubpageActive = (path: string) => pathname === path;

    // Toggle expansão de submenu
    const handleMenuClick = (item: typeof MENU_ITEMS[0], e: React.MouseEvent) => {
        if (item.subpages.length > 0) {
            e.preventDefault();
            // Toggle o submenu
            setExpandedMenus(prev =>
                prev.includes(item.id)
                    ? prev.filter(id => id !== item.id)
                    : [...prev, item.id]
            );
            // Navega para a página principal da seção
            router.push(item.path);
        }
    };

    // Componente do menu item
    const MenuItem = ({ item, collapsed = false }: { item: typeof MENU_ITEMS[0], collapsed?: boolean }) => {
        const Icon = item.icon;
        const hasSubpages = item.subpages.length > 0;
        const isExpanded = expandedMenus.includes(item.id);
        const isActive = isMenuActive(item);

        return (
            <div className="space-y-1">
                <div className="relative group">
                    <Link
                        href={item.path}
                        onClick={(e) => handleMenuClick(item, e)}
                        className={`flex items-center gap-3 w-full py-2.5 px-3 rounded-xl transition-all duration-200
                            ${isActive
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }
                            ${collapsed ? "justify-center" : ""}
                        `}
                    >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`} />

                        {!collapsed && (
                            <>
                                <span className="flex-1 text-sm font-medium">{item.name}</span>
                                {hasSubpages && (
                                    <div className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                )}
                            </>
                        )}
                    </Link>

                    {/* Tooltip quando collapsed */}
                    {collapsed && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                            {item.name}
                        </div>
                    )}
                </div>

                {/* Subpáginas - só mostra se não estiver collapsed e se o menu estiver expandido */}
                {!collapsed && hasSubpages && isExpanded && (
                    <div className="ml-4 space-y-0.5 border-l-2 border-gray-700 pl-3">
                        {item.subpages.map((sub) => (
                            <Link
                                key={sub.path}
                                href={sub.path}
                                className={`block py-1.5 px-3 rounded-lg text-xs transition-all duration-150
                                    ${isSubpageActive(sub.path)
                                        ? "text-blue-400 font-bold bg-gray-800/70"
                                        : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                                    }
                                `}
                            >
                                {sub.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Conteúdo da sidebar
    const SidebarContent = ({ collapsed = false, showToggle = false }: { collapsed?: boolean, showToggle?: boolean }) => (
        <>
            {/* LOGO DA ESCOLA + TOGGLE */}
            <div className={`flex items-center gap-3 mb-6 pb-4 border-b border-gray-800 ${collapsed ? "flex-col" : ""}`}>
                <div className={`rounded-full overflow-hidden bg-white shadow-lg ring-2 ring-blue-500/30 flex-shrink-0 ${collapsed ? "w-10 h-10" : "w-10 h-10"}`}>
                    <Image
                        src="/school-logo-example.png"
                        alt="Logo da Escola"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                    />
                </div>
                {!collapsed && (
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold text-blue-400 truncate">ENSITEC BI</h2>
                        <p className="text-[9px] text-gray-500 uppercase tracking-wider">Colégio Modelo</p>
                    </div>
                )}
            </div>

            {/* NAVEGAÇÃO */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
                {MENU_ITEMS.map((item) => (
                    <MenuItem key={item.id} item={item} collapsed={collapsed} />
                ))}
            </nav>

            {/* PERFIL & LOGOUT */}
            <div className={`border-t border-gray-800 pt-4 mt-4 ${collapsed ? "flex flex-col items-center" : ""}`}>
                <Link
                    href="/login"
                    className={`flex items-center gap-3 text-gray-400 hover:text-red-400 hover:bg-gray-800 px-3 py-2.5 rounded-xl transition-all text-sm font-medium group mb-3
                        ${collapsed ? "justify-center w-10 h-10 p-0" : "w-full"}
                    `}
                    title={collapsed ? "Sair da Conta" : undefined}
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-400" />
                    {!collapsed && <span>Sair da Conta</span>}
                </Link>

                <div className={`flex items-center gap-3 px-2 py-2 rounded-xl transition-colors
                    ${collapsed ? "justify-center" : ""}
                `}>
                    <div className="w-9 h-9 min-w-[2.25rem] rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md ring-2 ring-gray-800">
                        AD
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Administrador</p>
                            <p className="text-[10px] text-gray-400 truncate">Diretor Pedagógico</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">

            {/* BOTÃO MOBILE - Hamburguer (fixo no canto) */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="fixed top-4 left-4 z-50 md:hidden p-2.5 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-gray-800 transition-colors"
                aria-label="Abrir menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* OVERLAY MOBILE */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* SIDEBAR MOBILE (Drawer) */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white p-5 flex flex-col
                transform transition-transform duration-300 ease-in-out md:hidden
                ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                {/* Botão Fechar */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Fechar menu"
                >
                    <X className="w-5 h-5" />
                </button>

                <SidebarContent collapsed={false} />
            </aside>

            {/* SIDEBAR DESKTOP */}
            <aside className={`
                hidden md:flex flex-col bg-gray-900 text-white border-r border-gray-800 h-full shrink-0 relative
                transition-all duration-300 ease-in-out
                ${sidebarCollapsed ? "w-20 p-3" : "w-64 p-5"}
            `}>
                {/* BOTÃO TOGGLE - Sempre visível no desktop */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute -right-3 top-8 z-20 w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 border-2 border-gray-900"
                    aria-label={sidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>

                <SidebarContent collapsed={sidebarCollapsed} />
            </aside>

            {/* ÁREA PRINCIPAL - Ocupa toda a tela disponível */}
            <main className="flex-1 overflow-y-auto h-full">
                <div className="p-6 md:p-8 pt-16 md:pt-8 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
