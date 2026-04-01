"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import {
    Menu,
    X,
    ChevronDown,
    LayoutDashboard,
    TrendingUp,
    DollarSign,
    UtensilsCrossed,
    Truck,
    Users,
    ChevronLeft,
    ChevronRight,
    LogOut
} from "lucide-react";

// ============================================
// MENUS DO RESTAURANTE
// ============================================
const MENU_ITEMS = [
    {
        id: "visao-geral",
        name: "Vis\u00e3o Geral",
        path: "/dashboard-restaurante",
        icon: LayoutDashboard,
        exactMatch: true,
        subpages: [],
    },
    {
        id: "mercado",
        name: "Intelig\u00eancia de Mercado",
        path: "/dashboard-restaurante/mercado",
        icon: TrendingUp,
        exactMatch: false,
        subpages: [
            { name: "Mapa de Concorrentes", path: "/dashboard-restaurante/mercado" },
            { name: "An\u00e1lise de Pre\u00e7os", path: "/dashboard-restaurante/mercado/precos" },
            { name: "Categorias & Nichos", path: "/dashboard-restaurante/mercado/categorias" },
        ],
    },
    {
        id: "faturamento",
        name: "Vendas & Faturamento",
        path: "/dashboard-restaurante/faturamento",
        icon: DollarSign,
        exactMatch: false,
        subpages: [
            { name: "Receita & Ticket M\u00e9dio", path: "/dashboard-restaurante/faturamento" },
            { name: "Mix de Canais", path: "/dashboard-restaurante/faturamento/canais" },
            { name: "Formas de Pagamento", path: "/dashboard-restaurante/faturamento/pagamentos" },
        ],
    },
    {
        id: "cardapio",
        name: "Engenharia de Card\u00e1pio",
        path: "/dashboard-restaurante/cardapio",
        icon: UtensilsCrossed,
        exactMatch: false,
        subpages: [
            { name: "Matriz BCG (Curva ABC)", path: "/dashboard-restaurante/cardapio" },
            { name: "Ranking de Itens", path: "/dashboard-restaurante/cardapio/ranking" },
            { name: "CMV Simulado", path: "/dashboard-restaurante/cardapio/cmv" },
        ],
    },
    {
        id: "operacional",
        name: "Operacional & Log\u00edstica",
        path: "/dashboard-restaurante/operacional",
        icon: Truck,
        exactMatch: false,
        subpages: [
            { name: "Mapa de Calor (Picos)", path: "/dashboard-restaurante/operacional" },
            { name: "Tempo de Preparo & Entrega", path: "/dashboard-restaurante/operacional/tempos" },
            { name: "Cancelamento & Refa\u00e7\u00e3o", path: "/dashboard-restaurante/operacional/cancelamentos" },
        ],
    },
    {
        id: "clientes",
        name: "Clientes & Fideliza\u00e7\u00e3o",
        path: "/dashboard-restaurante/clientes",
        icon: Users,
        exactMatch: false,
        subpages: [
            { name: "Reten\u00e7\u00e3o & CAC", path: "/dashboard-restaurante/clientes" },
            { name: "NPS & Avalia\u00e7\u00f5es", path: "/dashboard-restaurante/clientes/nps" },
            { name: "Perfil Geogr\u00e1fico", path: "/dashboard-restaurante/clientes/geografico" },
        ],
    },
];

export default function DashboardRestauranteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUser();
    const { signOut } = useClerk();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

    useEffect(() => {
        MENU_ITEMS.forEach(item => {
            if (item.subpages.length > 0 && pathname.startsWith(item.path) && pathname !== item.path) {
                setExpandedMenus(prev =>
                    prev.includes(item.id) ? prev : [...prev, item.id]
                );
            }
        });
    }, [pathname]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const isMenuActive = (item: typeof MENU_ITEMS[0]) => {
        if (item.exactMatch) return pathname === item.path;
        return pathname.startsWith(item.path);
    };

    const isSubpageActive = (path: string) => pathname === path;

    const handleMenuClick = (item: typeof MENU_ITEMS[0], e: React.MouseEvent) => {
        if (item.subpages.length > 0) {
            e.preventDefault();
            setExpandedMenus(prev =>
                prev.includes(item.id)
                    ? prev.filter(id => id !== item.id)
                    : [...prev, item.id]
            );
            router.push(item.path);
        }
    };

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
                                ? "bg-gradient-to-r from-amber-700 to-amber-800 text-white shadow-lg shadow-amber-900/40"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }
                            ${collapsed ? "justify-center" : ""}
                        `}
                    >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-amber-200" : "text-gray-500 group-hover:text-white"}`} />
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

                    {collapsed && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                            {item.name}
                        </div>
                    )}
                </div>

                {!collapsed && hasSubpages && isExpanded && (
                    <div className="ml-4 space-y-0.5 border-l-2 border-amber-800/40 pl-3">
                        {item.subpages.map((sub) => (
                            <Link
                                key={sub.path}
                                href={sub.path}
                                className={`block py-1.5 px-3 rounded-lg text-xs transition-all duration-150
                                    ${isSubpageActive(sub.path)
                                        ? "text-amber-400 font-bold bg-gray-800/70"
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

    const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
        <>
            <div className={`flex items-center gap-3 mb-6 pb-4 border-b border-gray-800 ${collapsed ? "flex-col" : ""}`}>
                <div className="rounded-full overflow-hidden bg-gradient-to-br from-amber-700 to-amber-900 shadow-lg ring-2 ring-amber-500/30 flex-shrink-0 flex items-center justify-center w-10 h-10">
                    <UtensilsCrossed className="w-5 h-5 text-amber-200" />
                </div>
                {!collapsed && (
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold text-amber-400 truncate">ENSITEC BI</h2>
                        <p className="text-[9px] text-gray-500 uppercase tracking-wider">Restaurantes</p>
                    </div>
                )}
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
                {MENU_ITEMS.map((item) => (
                    <MenuItem key={item.id} item={item} collapsed={collapsed} />
                ))}
            </nav>

            <div className={`border-t border-gray-800 pt-4 mt-4 ${collapsed ? "flex flex-col items-center" : ""}`}>
                <div className={`flex items-center gap-3 px-2 py-2 rounded-xl transition-colors ${collapsed ? "justify-center" : ""}`}>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: 'w-9 h-9 ring-2 ring-gray-800 shadow-md',
                                userButtonPopoverCard: 'bg-gray-900 border border-gray-700 text-white shadow-2xl',
                                userButtonPopoverActionButton: 'text-gray-300 hover:text-white hover:bg-gray-800',
                                userButtonPopoverActionButtonText: 'text-gray-300',
                                userButtonPopoverActionButtonIcon: 'text-gray-400',
                                userButtonPopoverFooter: 'hidden',
                            },
                        }}
                    />
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Gestor</p>
                            <p className="text-[10px] text-gray-400 truncate">Restaurante</p>
                        </div>
                    )}
                </div>
                {!collapsed && (
                    <div className="w-full px-2 pb-2">
                        <button
                            onClick={() => signOut({ redirectUrl: '/' })}
                            className="w-full mt-2 flex items-center justify-center gap-2 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-medium border border-red-500/20"
                        >
                            <LogOut className="w-4 h-4" />
                            Sair da Conta
                        </button>
                    </div>
                )}
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="fixed top-4 left-4 z-50 md:hidden p-2.5 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-gray-800 transition-colors"
                aria-label="Abrir menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white p-5 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" aria-label="Fechar menu">
                    <X className="w-5 h-5" />
                </button>
                <SidebarContent collapsed={false} />
            </aside>

            <aside className={`hidden md:flex flex-col bg-gray-900 text-white border-r border-gray-800 h-full shrink-0 relative transition-all duration-300 ease-in-out ${sidebarCollapsed ? "w-20 p-3" : "w-64 p-5"}`}>
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute -right-3 top-8 z-20 w-6 h-6 bg-amber-700 hover:bg-amber-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 border-2 border-gray-900"
                    aria-label={sidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
                >
                    {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                <SidebarContent collapsed={sidebarCollapsed} />
            </aside>

            <main className="flex-1 overflow-y-auto h-full">
                <div className="p-6 md:p-8 pt-16 md:pt-8 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
