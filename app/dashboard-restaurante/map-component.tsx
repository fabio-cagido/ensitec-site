"use client";
import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Filter } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface RestaurantPoint {
    name: string;
    lat: number;
    lng: number;
    category: string;
    rating: number;
    district: string;
}

export default function RestaurantMap({ type = "points" }: { type?: "points" | "heatmap" }) {
    const [points, setPoints] = useState<RestaurantPoint[]>([]);
    const [center, setCenter] = useState<[number, number]>([-22.97, -43.60]); // RIO DE JANEIRO DEFAULT
    const [segmentation, setSegmentation] = useState<"nota" | "categoria">("nota");

    useEffect(() => {
        fetch('/api/dashboard-restaurante/map')
            .then(res => res.json())
            .then(data => {
                if (data.points && data.points.length > 0) {
                    setPoints(data.points);
                } else {
                    // Fallback local se a API falhar
                    generateMockPoints();
                }
            })
            .catch(() => {
                generateMockPoints();
            });
    }, []);

    const generateMockPoints = () => {
        const centerLat = -22.97;
        const centerLng = -43.60;
        const demoCategories = ["Hambúrguer", "Pizza", "Japonesa", "Saudável", "Italiana", "Brasileira"];
        const demoDistricts = ["Barra da Tijuca", "Recreio", "Jacarepaguá", "Botafogo", "Leblon"];
        
        const mockPoints = Array.from({ length: 40 }).map((_, i) => ({
            name: `Concorrente Exemplo ${i + 1}`,
            lat: centerLat + (Math.random() - 0.5) * 0.12,
            lng: centerLng + (Math.random() - 0.5) * 0.35,
            category: demoCategories[Math.floor(Math.random() * demoCategories.length)],
            rating: 3.8 + Math.random() * 1.2,
            district: demoDistricts[Math.floor(Math.random() * demoDistricts.length)],
        }));
        setPoints(mockPoints);
    };

    // Calcula Top Categorias para colorir
    const topCategories = useMemo(() => {
        const counts: { [key: string]: number } = {};
        points.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1);
        return Object.keys(counts)
            .sort((a, b) => counts[b] - counts[a])
            .slice(0, 5); // Pega as 5 maiores
    }, [points]);

    const CATEGORY_COLORS = ["#8B5E3C", "#6366F1", "#EA580C", "#059669", "#D97706"];

    const getCatColor = (cat: string) => {
        const idx = topCategories.indexOf(cat);
        if (idx >= 0) return CATEGORY_COLORS[idx];
        return "#94A3B8"; // Cinza para "Outros"
    };

    const getNotaColor = (rating: number) => {
        if (rating >= 4.5) return "#059669"; // Verde
        if (rating >= 3.8) return "#D97706"; // Âmbar
        if (rating >= 3.0) return "#EA580C"; // Laranja
        return "#DC2626"; // Vermelho
    };

    const getFillColor = (point: RestaurantPoint) => {
        if (type === "heatmap") return "#EA580C";
        if (segmentation === "categoria") return getCatColor(point.category);
        return getNotaColor(point.rating);
    };

    return (
        <div className="relative w-full h-full group">
            <MapContainer
                center={center}
                zoom={12}
                style={{ height: "100%", width: "100%", minHeight: "350px", borderRadius: "12px", zIndex: 0 }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {points.map((point, i) => {
                    const radius = type === "heatmap" ? 18 : 6;
                    const opacity = type === "heatmap" ? 0.3 : 0.8;
                    const weight = type === "heatmap" ? 0 : 2;

                    return (
                        <CircleMarker
                            key={`${i}-${segmentation}`}
                            center={[point.lat, point.lng]}
                            radius={radius}
                            fillColor={getFillColor(point)}
                            fillOpacity={opacity}
                            stroke={type === "points"}
                            color="#ffffff"
                            weight={weight}
                        >
                            {type === "points" && (
                                <Popup>
                                    <div className="text-xs font-sans min-w-[150px]">
                                        <p className="font-bold text-gray-900 text-sm mb-1">{point.name}</p>
                                        <p className="text-gray-500 mb-0.5"><span className="font-medium text-gray-700">Categoria:</span> {point.category}</p>
                                        <p className="text-gray-500 mb-1"><span className="font-medium text-gray-700">Bairro:</span> {point.district}</p>
                                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded inline-block">
                                            <span className="text-amber-700 font-bold">Nota: {point.rating.toFixed(1)}</span>
                                            <span className="text-amber-500">★</span>
                                        </div>
                                    </div>
                                </Popup>
                            )}
                        </CircleMarker>
                    );
                })}

                {/* MEU RESTAURANTE */}
                {type === "points" && (
                    <CircleMarker
                        center={center}
                        radius={12}
                        fillColor="#2563EB"
                        fillOpacity={1}
                        stroke={true}
                        color="#ffffff"
                        weight={3}
                    >
                        <Popup>
                            <div className="text-xs font-sans min-w-[120px]">
                                <p className="font-bold text-blue-700 text-sm mb-1">Meu Restaurante</p>
                                <p className="text-gray-500 mb-0.5">Sua Base de Operações</p>
                                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded inline-block mt-1">
                                    <span className="text-blue-700 font-bold">Nota: 4.8</span>
                                    <span className="text-blue-500">★</span>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                )}

            </MapContainer>

            {/* CONTROLES OVERLAY: Segmentação (Apenas se points) */}
            {type === "points" && (
                <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm p-1.5 rounded-xl shadow-md border border-gray-100 flex items-center gap-1">
                    <div className="px-2 py-1 text-xs text-gray-400 font-bold uppercase flex items-center gap-1">
                        <Filter className="w-3 h-3" /> Ver por:
                    </div>
                    <button 
                        onClick={() => setSegmentation("nota")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${segmentation === "nota" ? "bg-amber-100 text-amber-800 shadow-sm" : "hover:bg-gray-100 text-gray-500"}`}
                    >
                        Notas
                    </button>
                    <button 
                        onClick={() => setSegmentation("categoria")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${segmentation === "categoria" ? "bg-amber-100 text-amber-800 shadow-sm" : "hover:bg-gray-100 text-gray-500"}`}
                    >
                        Categorias
                    </button>
                </div>
            )}

            {/* LEGENDA NO CANTO INFERIOR BASEADO NA SEGMENTAÇÃO */}
            {type === "points" ? (
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-100 z-[1000] text-xs max-h-[80%] overflow-y-auto min-w-[160px]">
                    <p className="font-bold text-gray-900 mb-2">
                        {segmentation === "nota" ? "Segmentação (Nota)" : "Top Categorias"}
                    </p>
                    
                    {segmentation === "nota" ? (
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#059669] shrink-0" /> <span className="text-gray-600 truncate">4.5 a 5.0 (Ouro)</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#D97706] shrink-0" /> <span className="text-gray-600 truncate">3.8 a 4.4 (Bom)</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#EA580C] shrink-0" /> <span className="text-gray-600 truncate">3.0 a 3.7 (Regular)</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#DC2626] shrink-0" /> <span className="text-gray-600 truncate">Menor 3.0 (Crítico)</span></div>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {topCategories.map((cat, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[idx] }} /> 
                                    <span className="text-gray-600 truncate" title={cat}>{cat}</span>
                                </div>
                            ))}
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#94A3B8] shrink-0" /> <span className="text-gray-600">Outros</span></div>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#2563EB] shrink-0 border border-white" />
                        <span className="font-bold text-blue-700 uppercase text-[10px]">Meu Restaurante</span>
                    </div>
                </div>
            ) : (
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-100 z-[1000] text-xs">
                    <p className="font-bold text-gray-900 mb-2">Densidade (Calor)</p>
                    <div className="flex items-center gap-2">
                         <div className="w-16 h-3 rounded-full bg-gradient-to-r from-orange-200 to-orange-600" />
                         <span className="text-gray-600">Alta Concentração</span>
                    </div>
                </div>
            )}
        </div>
    );
}
