"use client";

import { useState } from "react";
import { ChevronDown, Calendar, Settings2, X } from "lucide-react";

export interface FilterState {
    anos: string[];
    periodo: string;  // bim, tri, sem
    meses: string[];
    unidades: string[];
    segmentos: string[];
    materias: string[];
    turmas: string[];
}

interface AcademicFiltersProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

const ANOS = ["2024", "2025", "2026"];
const PERIODOS = [
    { value: "bim", label: "Bim/Tri/Sem" },
];
const MESES = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
];
const UNIDADES = [
    { value: "u1", label: "Unidade Centro" },
    { value: "u3", label: "Unidade Sul" },
];
const SEGMENTOS = [
    { value: "s1", label: "Infantil" },
    { value: "s2", label: "Fund. II" },
    { value: "s3", label: "Ensino Médio" },
];
const MATERIAS = [
    { value: "m1", label: "Matemática" },
    { value: "m2", label: "Português" },
    { value: "m3", label: "História" },
    { value: "m5", label: "Física" },
];
const TURMAS = [
    { value: "t1", label: "9º Ano A" },
    { value: "t2", label: "9º Ano B" },
    { value: "t3", label: "3º Médio A" },
    { value: "t5", label: "8º Ano A" },
    { value: "t6", label: "1º Médio A" },
];

export const defaultFilters: FilterState = {
    anos: ["2026"],
    periodo: "bim",
    meses: [],
    unidades: [],
    segmentos: [],
    materias: [],
    turmas: [],
};

export default function AcademicFilters({ filters, onFilterChange }: AcademicFiltersProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const handleCheckboxChange = (category: keyof FilterState, value: string) => {
        const current = filters[category];
        if (Array.isArray(current)) {
            const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            onFilterChange({ ...filters, [category]: updated });
        }
    };

    const clearFilters = () => {
        onFilterChange(defaultFilters);
    };

    const activeCount = filters.anos.length + filters.meses.length + filters.unidades.length +
        filters.segmentos.length + filters.materias.length + filters.turmas.length;

    const DropdownButton = ({
        label,
        filterKey,
        options,
        isActive
    }: {
        label: string;
        filterKey: keyof FilterState;
        options: { value: string; label: string }[];
        isActive: boolean;
    }) => {
        const selectedCount = (filters[filterKey] as string[]).length;
        return (
            <div className="relative">
                <button
                    onClick={() => toggleDropdown(filterKey)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all
                        ${isActive ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}
                    `}
                >
                    {label} {selectedCount > 0 && <span className="bg-white/20 px-1.5 rounded text-xs">{selectedCount}</span>}
                    <ChevronDown size={14} className={`transition-transform ${openDropdown === filterKey ? "rotate-180" : ""}`} />
                </button>
                {openDropdown === filterKey && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-30 min-w-[200px] p-3 space-y-1 max-h-[280px] overflow-y-auto">
                        {options.map((opt) => (
                            <label key={opt.value} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <input
                                    type="checkbox"
                                    checked={(filters[filterKey] as string[]).includes(opt.value)}
                                    onChange={() => handleCheckboxChange(filterKey, opt.value)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
            {/* Linha 1: Período */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-gray-500 mr-2">
                    <Calendar size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Período:</span>
                </div>
                <DropdownButton
                    label={filters.anos.length > 0 ? filters.anos.join(", ") : "Ano"}
                    filterKey="anos"
                    options={ANOS.map(a => ({ value: a, label: a }))}
                    isActive={filters.anos.length > 0}
                />
                <DropdownButton
                    label="Bim/Tri/Sem"
                    filterKey="periodo"
                    options={PERIODOS}
                    isActive={false}
                />
                <DropdownButton
                    label={filters.meses.length > 0 ? `${filters.meses.length} meses` : "Mês"}
                    filterKey="meses"
                    options={MESES}
                    isActive={filters.meses.length > 0}
                />
            </div>

            {/* Linha 2: Detalhar */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-500 mr-2">
                    <Settings2 size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Detalhar:</span>
                </div>
                <DropdownButton
                    label="Unidade"
                    filterKey="unidades"
                    options={UNIDADES}
                    isActive={filters.unidades.length > 0}
                />
                <DropdownButton
                    label="Segmento"
                    filterKey="segmentos"
                    options={SEGMENTOS}
                    isActive={filters.segmentos.length > 0}
                />
                <DropdownButton
                    label="Matéria"
                    filterKey="materias"
                    options={MATERIAS}
                    isActive={filters.materias.length > 0}
                />
                <DropdownButton
                    label="Turma"
                    filterKey="turmas"
                    options={TURMAS}
                    isActive={filters.turmas.length > 0}
                />

                {activeCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all ml-auto"
                    >
                        <X size={14} />
                        Limpar
                    </button>
                )}
            </div>
        </div>
    );
}

// Mapeamento de IDs para Labels
export const LABEL_MAP: Record<string, string> = {
    u1: "Unidade Centro",
    u3: "Unidade Sul",
    s1: "Infantil",
    s2: "Fund. II",
    s3: "Ensino Médio",
    m1: "Matemática",
    m2: "Português",
    m3: "História",
    m5: "Física",
    t1: "9º Ano A",
    t2: "9º Ano B",
    t3: "3º Médio A",
    t5: "8º Ano A",
    t6: "1º Médio A",
};

// Cores para séries comparativas
export const COMPARISON_COLORS = [
    "#6366f1", // Indigo
    "#f59e0b", // Amber
    "#10b981", // Emerald
    "#f43f5e", // Rose
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
];
