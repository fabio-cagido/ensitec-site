"use client";

import { useState, useEffect } from "react";
import { ChevronDown, X, Calendar, Layers } from "lucide-react";

type FilterOption = {
    id: string;
    label: string;
};

type FilterState = {
    // Context Filters
    unidades: string[];
    segmentos: string[];
    materias: string[];
    turmas: string[];
    // Time Filters
    anos: string[];
    meses: string[];
    periodos: string[]; // Stores IDs like 'b1', 't1', 's1'
};

const MOCK_OPTIONS = {
    unidades: [
        { id: "u1", label: "Unidade Centro" },
        { id: "u2", label: "Unidade Norte" },
        { id: "u3", label: "Unidade Sul" },
    ],
    segmentos: [
        { id: "s1", label: "Ensino Fundamental I" },
        { id: "s2", label: "Ensino Fundamental II" },
        { id: "s3", label: "Ensino Médio" },
    ],
    materias: [
        { id: "m1", label: "Matemática" },
        { id: "m2", label: "Português" },
        { id: "m3", label: "História" },
        { id: "m4", label: "Geografia" },
        { id: "m5", label: "Física" },
    ],
    turmas: [
        { id: "t1", label: "9º Ano A" },
        { id: "t2", label: "9º Ano B" },
        { id: "t3", label: "3º Médio A" },
        { id: "t4", label: "3º Médio B" },
    ],
    anos: [
        { id: "2026", label: "2026" },
        { id: "2025", label: "2025" },
        { id: "2024", label: "2024" },
    ],
    meses: [
        { id: "jan", label: "Janeiro" }, { id: "fev", label: "Fevereiro" },
        { id: "mar", label: "Março" }, { id: "abr", label: "Abril" },
        { id: "mai", label: "Maio" }, { id: "jun", label: "Junho" },
        { id: "jul", label: "Julho" }, { id: "ago", label: "Agosto" },
        { id: "set", label: "Setembro" }, { id: "out", label: "Outubro" },
        { id: "nov", label: "Novembro" }, { id: "dez", label: "Dezembro" },
    ],
    periodos: [
        // Bimestres
        { id: "b1", label: "1º Bimestre" }, { id: "b2", label: "2º Bimestre" },
        { id: "b3", label: "3º Bimestre" }, { id: "b4", label: "4º Bimestre" },
        // Trimestres
        { id: "tr1", label: "1º Trimestre" }, { id: "tr2", label: "2º Trimestre" }, { id: "tr3", label: "3º Trimestre" },
        // Semestres
        { id: "sem1", label: "1º Semestre" }, { id: "sem2", label: "2º Semestre" },
    ]
};

export function FilterBar({
    onFilterChange,
}: {
    onFilterChange: (filters: FilterState) => void;
}) {
    // Current year/month logic
    const currentYear = new Date().getFullYear().toString();
    const currentMonthIndex = new Date().getMonth(); // 0 = Jan, 11 = Dez
    const currentMonthId = MOCK_OPTIONS.meses[currentMonthIndex]?.id || "";

    const [filters, setFilters] = useState<FilterState>({
        unidades: [],
        segmentos: [],
        materias: [],
        turmas: [],
        anos: ["2026"], // Default to 2026 as per user request/metadata
        meses: currentMonthId ? [currentMonthId] : [], // Pre-select current month
        periodos: [],
    });

    const [openDropdown, setOpenDropdown] = useState<keyof FilterState | null>(null);

    // Initial sync
    useEffect(() => {
        onFilterChange(filters);
    }, []); // Run once on mount to set default year

    const toggleSelection = (category: keyof FilterState, id: string) => {
        const current = filters[category];
        const newSelection = current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id];

        const newFilters = { ...filters, [category]: newSelection };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilter = (category: keyof FilterState) => {
        const newFilters = { ...filters, [category]: [] };
        // Don't clear year completely, revert to default if cleared? 
        // User asked for "pre selected", but "clear" usually implies empty. 
        // Let's keep it empty if user explicitly clears, or we can enforce one must be selected.
        // For standard UX, clearing selection simply clears it.
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const renderDropdown = (
        category: keyof FilterState,
        label: string,
        options: FilterOption[],
        icon?: React.ReactNode
    ) => {
        const isOpen = openDropdown === category;
        const selectedCount = filters[category].length;

        // Custom label logic for Year/Month to show selection
        let displayLabel = label;
        if (category === 'anos' && selectedCount === 1) {
            displayLabel = filters.anos[0];
        } else if (category === 'meses' && selectedCount === 1) {
            const selectedId = filters.meses[0];
            const option = options.find(o => o.id === selectedId);
            if (option) displayLabel = option.label;
        }

        return (
            <div className="relative">
                <button
                    onClick={() => setOpenDropdown(isOpen ? null : category)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${isOpen || selectedCount > 0
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    {icon}
                    {displayLabel}
                    {selectedCount > 0 && category !== 'anos' && (
                        <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {selectedCount}
                        </span>
                    )}
                    {category === 'anos' && selectedCount > 1 && (
                        <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            +{selectedCount - 1}
                        </span>
                    )}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDropdown(null)}
                        ></div>
                        <div className="absolute top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-20">
                            <div className="max-h-60 overflow-y-auto space-y-1">
                                {options.map((opt) => {
                                    const isSelected = filters[category].includes(opt.id);
                                    return (
                                        <div
                                            key={opt.id}
                                            onClick={() => toggleSelection(category, opt.id)}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm ${isSelected ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected
                                                    ? "bg-blue-600 border-blue-600"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                {isSelected && <span className="text-white text-xs">✓</span>}
                                            </div>
                                            {opt.label}
                                        </div>
                                    );
                                })}
                            </div>
                            {selectedCount > 0 && (
                                <div className="pt-2 mt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => clearFilter(category)}
                                        className="w-full text-center text-xs text-red-500 hover:text-red-700 font-medium"
                                    >
                                        Limpar Seleção
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    };

    const hasActiveFilters =
        filters.unidades.length > 0 ||
        filters.segmentos.length > 0 ||
        filters.materias.length > 0 ||
        filters.turmas.length > 0 ||
        filters.anos.length > 0 ||
        filters.meses.length > 0 ||
        filters.periodos.length > 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-4">

            {/* Top Row: General Time Filters */}
            <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mr-2 w-full sm:w-auto">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold text-gray-900">Período:</span>
                </div>
                {renderDropdown("anos", "Ano", MOCK_OPTIONS.anos)}
                {renderDropdown("periodos", "Bim/Tri/Sem", MOCK_OPTIONS.periodos)}
                {renderDropdown("meses", "Mês", MOCK_OPTIONS.meses)}
            </div>

            {/* Bottom Row: Context Context Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-gray-500 text-sm mr-2 w-full sm:w-auto">
                    <Layers className="w-4 h-4" />
                    <span className="font-semibold text-gray-900">Detalhar:</span>
                </div>
                {renderDropdown("unidades", "Unidade", MOCK_OPTIONS.unidades)}
                {renderDropdown("segmentos", "Segmento", MOCK_OPTIONS.segmentos)}
                {renderDropdown("materias", "Matéria", MOCK_OPTIONS.materias)}
                {renderDropdown("turmas", "Turma", MOCK_OPTIONS.turmas)}

                {hasActiveFilters && (
                    <button
                        onClick={() => {
                            // Reset to defaults: Current Year (2026) and Current Month
                            const currentMonthIndex = new Date().getMonth();
                            const currentMonthId = MOCK_OPTIONS.meses[currentMonthIndex]?.id || "";

                            const cleared = {
                                unidades: [], segmentos: [], materias: [], turmas: [],
                                anos: ["2026"], periodos: [], meses: currentMonthId ? [currentMonthId] : []
                            };
                            setFilters(cleared);
                            onFilterChange(cleared);
                        }}
                        className="ml-auto flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Limpar
                    </button>
                )}
            </div>
        </div>
    );
}
