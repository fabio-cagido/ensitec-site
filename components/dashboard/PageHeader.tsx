import Image from "next/image";

interface PageHeaderProps {
    title: string;
    subtitle: string;
    showLogo?: boolean; // Controla se a logo aparece (apenas páginas principais)
}

/**
 * Componente de Header reutilizável para páginas do Dashboard
 * 
 * ONDE EU ALTERO?
 * - Para mudar a logo: substitua /school-logo-example.png na pasta public
 * - Para mudar o nome da escola: altere o texto "Colégio Modelo" abaixo
 * 
 * COMO EU TESTO?
 * - Navegue até qualquer página principal do dashboard (Acadêmico, Clientes, etc.)
 * - A logo deve aparecer no canto superior direito
 * 
 * PONTOS DE ATENÇÃO:
 * - showLogo=true apenas em páginas principais
 * - Subpáginas devem ter showLogo=false ou não passar o parâmetro
 */
export default function PageHeader({ title, subtitle, showLogo = false }: PageHeaderProps) {
    return (
        <header className="flex justify-between items-start mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
                <p className="text-gray-500">{subtitle}</p>
            </div>

            {/* LOGO DA ESCOLA - Aparece apenas nas páginas principais */}
            {showLogo && (
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shadow-inner border border-gray-100 flex-shrink-0">
                        <Image
                            src="/school-logo-example.png"
                            alt="Logo da Escola"
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">Colégio Modelo</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Cliente EnsiTec BI</p>
                    </div>
                </div>
            )}
        </header>
    );
}
