"use client";

import React from "react";

interface TrendChartProps {
    data: { month: string; value: number; label?: string }[];
    title?: string;
    lineColor?: string;
    unit?: string;
}

export function TrendChart({ data, title, lineColor = "#3b82f6", unit = "" }: TrendChartProps) {
    if (!data || data.length === 0) return <div>Sem dados para gráfico.</div>;

    // 1. Determine dimensions and scale
    const height = 300;
    const width = 800; // ViewBox width
    const padding = 40;

    const values = data.map(d => d.value);
    const minVal = Math.min(...values) * 0.9; // 10% buffering
    const maxVal = Math.max(...values) * 1.1;

    // Y-Axis mapping
    const getY = (val: number) => {
        const range = maxVal - minVal;
        if (range === 0) return height / 2;
        const normalized = (val - minVal) / range;
        // SVG Y coordinates go Top-Down, so 1 - normalized
        return padding + (1 - normalized) * (height - 2 * padding);
    };

    // X-Axis mapping
    const getX = (index: number) => {
        const step = (width - 2 * padding) / (data.length - 1);
        return padding + index * step;
    };

    // Build SVG Path
    const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(" ");

    // Build Area Path (closed loop)
    const areaPoints = `${points} ${getX(data.length - 1)},${height - padding} ${getX(0)},${height - padding}`;

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {title && <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>}

            <div className="relative w-full aspect-[21/9] min-h-[300px]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    {/* Grid Lines (Horizontal) */}
                    {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                        const y = padding + tick * (height - 2 * padding);
                        return (
                            <line
                                key={tick}
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="#f3f4f6"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Left Area (Gradient) */}
                    <defs>
                        <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
                        </linearGradient>
                    </defs>
                    <path
                        d={`M ${areaPoints} Z`}
                        fill="url(#gradientArea)"
                        stroke="none"
                    />

                    {/* The Line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke={lineColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data Points */}
                    {data.map((d, i) => (
                        <g key={i} className="group">
                            <circle
                                cx={getX(i)}
                                cy={getY(d.value)}
                                r="4"
                                fill="white"
                                stroke={lineColor}
                                strokeWidth="2"
                                className="transition-all duration-300 group-hover:r-6"
                            />
                            {/* Simple Tooltip on Hover */}
                            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                <rect
                                    x={getX(i) - 30}
                                    y={getY(d.value) - 35}
                                    width="60"
                                    height="25"
                                    rx="4"
                                    fill="#1f2937"
                                />
                                <text
                                    x={getX(i)}
                                    y={getY(d.value) - 18}
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="12"
                                    fontWeight="bold"
                                >
                                    {d.value}{unit}
                                </text>
                            </g>
                        </g>
                    ))}

                    {/* X-Axis Labels */}
                    {data.map((d, i) => (
                        <text
                            key={i}
                            x={getX(i)}
                            y={height - 10}
                            textAnchor="middle"
                            fill="#9ca3af"
                            fontSize="12"
                        >
                            {d.month}
                        </text>
                    ))}
                </svg>
            </div>

            <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>Janeiro {new Date().getFullYear()}</span>
                <span>Dezembro {new Date().getFullYear()}</span>
            </div>
        </div>
    );
}
