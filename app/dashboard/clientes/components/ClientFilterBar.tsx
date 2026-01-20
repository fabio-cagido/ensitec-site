"use client";

import { useState, useEffect } from "react";
import { ChevronDown, X, Calendar, Layers, Users } from "lucide-react";

type FilterOption = {
    id: string;
    label: string;
};

export type ClientFilterState = {
    // Context Filters
    unidades: string[];
    segmentos: string[];
    tiposMatricula: string[]; // [NEW] Bolsista vs Pagante
    // Time Filters
    anos: string[];
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
    tiposMatricula: [
        { id: "pagante", label: "Pagante Integral" },
        { id: "bolsista_parcial", label: "Bolsista Parcial" },
        { id: "bolsista_integral", label: "Bolsista Integral" },
    ],
    anos: [
        { id: "2026", label: "2026" },
        { id: "2025", label: "2025" },
        { id: "2024", label: "2024" },
    ],
};

export function ClientFilterBar({
    onFilterChange,
}: {
    onFilterChange: (filters: ClientFilterState) => void;
}) {
    const [filters, setFilters] = useState<ClientFilterState>({
        unidades: [],
        segmentos: [],
        tiposMatricula: [],
        anos: ["2026"], // Default
    });

    const [openDropdown, setOpenDropdown] = useState<keyof ClientFilterState | null>(null);

    // Initial sync
    useEffect(() => {
        onFilterChange(filters);
    }, []);

    const toggleSelection = (category: keyof ClientFilterState, id: string) => {
        const current = filters[category];
        const newSelection = current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id];

        const newFilters = { ...filters, [category]: newSelection };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilter = (category: keyof ClientFilterState) => {
        const newFilters = { ...filters, [category]: [] };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const renderDropdown = (
        category: keyof ClientFilterState,
        label: string,
        options: FilterOption[],
        icon?: React.ReactNode
    ) => {
        const isOpen = openDropdown === category;
        const selectedCount = filters[category].length;

        // Custom label logic
        let displayLabel = label;
        if (category === 'anos' && selectedCount === 1) {
            displayLabel = filters.anos[0];
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
        filters.tiposMatricula.length > 0 ||
        filters.anos.length > 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-gray-500 text-sm mr-2 w-full sm:w-auto">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold text-gray-900">Período:</span>
                </div>
                {renderDropdown("anos", "Ano Letivo", MOCK_OPTIONS.anos)}

                <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mr-2 w-full sm:w-auto">
                    <Layers className="w-4 h-4" />
                    <span className="font-semibold text-gray-900">Filtros:</span>
                </div>
                {renderDropdown("unidades", "Unidade", MOCK_OPTIONS.unidades)}
                {renderDropdown("segmentos", "Segmento", MOCK_OPTIONS.segmentos)}
                {renderDropdown("tiposMatricula", "Tipo de Matrícula", MOCK_OPTIONS.tiposMatricula, <Users className="w-4 h-4" />)}

                {hasActiveFilters && (
                    <button
                        onClick={() => {
                            const cleared = {
                                unidades: [], segmentos: [], tiposMatricula: [],
                                anos: ["2026"]
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
