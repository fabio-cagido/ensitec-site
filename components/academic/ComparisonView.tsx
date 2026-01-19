"use client";

import { useMemo } from "react";

type DataPoint = {
    id: string;
    label: string;
    value: number;
    trend?: number;
    color?: string;
};

type ComparisonViewProps = {
    title: string;
    data: DataPoint[]; // Data filtered by the selected criteria
    kpiUnit?: string;
    onItemClick?: (item: DataPoint) => void;
};

export function ComparisonView({ title, data, kpiUnit = "", onItemClick }: ComparisonViewProps) {

    // If no data or single item, show simple view. If multiple, show comparison.
    const isComparison = data.length > 1;

    // Calculate Average for comparison baseline
    const average = useMemo(() => {
        if (data.length === 0) return 0;
        return data.reduce((acc, curr) => acc + curr.value, 0) / data.length;
    }, [data]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-500">
                        {isComparison
                            ? `Comparando ${data.length} itens selecionados`
                            : "Visão Geral"}
                    </p>
                </div>
            </div>

            {/* Overview Cards Grid */}
            <div className={`grid gap-4 ${isComparison ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {data.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group"
                    >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.color || 'bg-blue-500'}`}></div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-700">{item.label}</h3>
                            {item.trend && (
                                <span
                                    className={`text-xs px-2 py-1 rounded-full font-bold ${item.trend > 0
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-red-50 text-red-600"
                                        }`}
                                >
                                    {item.trend > 0 ? "+" : ""}
                                    {item.trend}%
                                </span>
                            )}
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl font-bold text-gray-900">
                                {item.value}
                                <span className="text-base font-normal text-gray-400 ml-1">{kpiUnit}</span>
                            </span>
                        </div>
                        {isComparison && (
                            <div className="mt-2 text-xs text-gray-400">
                                {item.value > average ? (
                                    <span className="text-emerald-600 font-medium">Acima da média ({average.toFixed(1)})</span>
                                ) : (
                                    <span className="text-orange-600 font-medium">Abaixo da média ({average.toFixed(1)})</span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Comparison Chart Area */}
            {isComparison && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">Comparativo Visual</h3>

                    {/* Vertical Bar Chart (Column Chart) Implementation */}
                    <div className="h-72 w-full flex items-end justify-center gap-4 sm:gap-8 px-4 pb-2 border-b border-gray-200">
                        {data.map((item) => {
                            const maxValue = Math.max(...data.map(d => d.value)) * 1.1; // 10% buffering
                            const heightPercentage = Math.min((item.value / maxValue) * 100, 100);

                            return (
                                <div
                                    key={item.id}
                                    className={`group flex flex-col items-center justify-end w-full h-full max-w-[80px] ${onItemClick ? 'cursor-pointer' : ''}`}
                                    onClick={() => onItemClick && onItemClick(item)}
                                >
                                    {/* Tooltip */}
                                    <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap z-10">
                                        {item.value}{kpiUnit}
                                    </div>

                                    {/* Bar */}
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-700 ease-out hover:brightness-110 relative ${item.color || 'bg-blue-500'}`}
                                        style={{ height: `${heightPercentage}%` }}
                                    >
                                        {/* Click Hint */}
                                        {onItemClick && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-30 bg-white">
                                                <span className="text-[10px] font-bold text-black">Ver Histórico</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Value Label (always visible below) */}
                                    <span className="text-sm font-bold text-gray-700 mt-2">{item.value}{kpiUnit}</span>
                                </div>
                            );
                        })}
                    </div>
                    {/* X-Axis Labels */}
                    <div className="flex justify-center gap-4 sm:gap-8 px-4 mt-2">
                        {data.map((item) => (
                            <div key={item.id} className="w-full max-w-[80px] text-center">
                                <p className="text-xs text-gray-500 font-medium truncate" title={item.label}>
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
