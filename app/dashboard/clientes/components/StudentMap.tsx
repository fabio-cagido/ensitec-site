"use client";

import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { User, School, GraduationCap, Map as MapIcon, Layers, ChevronRight, ChevronLeft, Filter } from 'lucide-react';
import { useState } from 'react';

// Definindo o ícone customizado refinado
const createCustomIcon = (color: string) => {
    if (typeof window === 'undefined') return null;

    // Mapping colors to tailwind classes explicitly to prevent purging
    const glowClasses: Record<string, string> = {
        '#6366f1': 'bg-indigo-400',
        '#f59e0b': 'bg-amber-400',
        '#10b981': 'bg-emerald-400'
    };
    const glowClass = glowClasses[color] || 'bg-slate-400';

    return L.divIcon({
        html: `
            <div class="relative group">
                <div class="absolute inset-0 ${glowClass} rounded-full blur-sm opacity-40 group-hover:opacity-80 transition-opacity"></div>
                <div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); position: relative; z-index: 10;"></div>
            </div>
        `,
        className: 'custom-student-marker',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });
};

interface StudentLocation {
    id: string;
    lat: number;
    lng: number;
    segment: string;
    age: number;
}

export default function StudentMap({ locations }: { locations: StudentLocation[] }) {
    const center: [number, number] = [-25.4297, -49.2719];
    const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
    const [isMinimized, setIsMinimized] = useState(false);

    const filteredLocations = selectedSegment
        ? locations.filter(l => l.segment === selectedSegment)
        : locations;

    return (
        <div className="h-[520px] w-full relative group bg-slate-50">
            <MapContainer
                center={center}
                zoom={12}
                style={{ height: '100%', width: '100%', zIndex: 1, background: '#f8fafc' }}
                scrollWheelZoom={false}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <ZoomControl position="bottomright" />

                {filteredLocations.map((loc) => {
                    const color = loc.segment === 'Ensino Médio' ? '#6366f1' :
                        loc.segment === 'Fundamental II' ? '#f59e0b' :
                            '#10b981';
                    const icon = createCustomIcon(color);

                    if (!icon) return null;

                    return (
                        <Marker
                            key={loc.id}
                            position={[loc.lat, loc.lng]}
                            icon={icon}
                        >
                            <Popup className="premium-map-popup">
                                <div className="p-3 min-w-[180px]">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                                <User className="w-3.5 h-3.5 text-gray-400" />
                                            </div>
                                            <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">ID {loc.id}</p>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm`} style={{ backgroundColor: color }}>
                                            {loc.segment.split(' ')[0]}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-gray-400 font-bold uppercase tracking-widest">Idade</span>
                                            <span className="text-gray-900 font-black">{loc.age} anos</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-gray-400 font-bold uppercase tracking-widest">Distância</span>
                                            <span className="text-emerald-600 font-black">~ 2.4 km</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-gray-50 flex justify-center">
                                        <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                                            Ver dossiê completo →
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Sidebar Overlay - Legend & Filter (MINIMIZABLE) */}
            <div className={`absolute top-6 left-6 z-[1000] transition-all duration-300 transform ${isMinimized ? 'translate-x-[-10px]' : 'translate-x-0'}`}>
                {isMinimized ? (
                    <button
                        onClick={() => setIsMinimized(false)}
                        className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-2 group/btn border border-white/10"
                    >
                        <Filter className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest pr-1">Filtros</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                ) : (
                    <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/20 w-72 ring-1 ring-black/5 relative">
                        {/* Minimize Button */}
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="absolute -right-2 top-8 bg-white border border-gray-100 p-1 rounded-full shadow-md text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg">
                                <Layers className="w-5 h-5" />
                            </div>
                            <h4 className="font-black text-slate-900 text-base tracking-tight">Camadas</h4>
                        </div>

                        <div className="space-y-3">
                            {[
                                { id: 'Ensino Médio', label: 'Ensino Médio', color: 'indigo', icon: GraduationCap, count: locations.filter(l => l.segment === 'Ensino Médio').length },
                                { id: 'Fundamental II', label: 'Fundamental II', color: 'amber', icon: School, count: locations.filter(l => l.segment === 'Fundamental II').length },
                                { id: 'Infantil', label: 'Ensino Infantil', color: 'emerald', icon: MapIcon, count: locations.filter(l => l.segment === 'Infantil').length }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedSegment(selectedSegment === item.id ? null : item.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${selectedSegment === item.id
                                        ? `bg-${item.color}-50 border-${item.color}-100 ring-2 ring-${item.color}-500/20`
                                        : 'bg-white border-slate-100 hover:bg-slate-50 shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-${selectedSegment === item.id ? `${item.color}-100` : 'slate-50'} transition-colors`}>
                                            <item.icon className={`w-4 h-4 ${selectedSegment === item.id ? `text-${item.color}-600` : 'text-slate-400'}`} />
                                        </div>
                                        <div className="text-left leading-none">
                                            <p className={`text-[12px] font-black uppercase tracking-tight ${selectedSegment === item.id ? `text-${item.color}-700` : 'text-slate-600'}`}>
                                                {item.label}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-[12px] font-black ${selectedSegment === item.id ? `text-${item.color}-500` : 'text-slate-300'}`}>
                                        {item.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Mapeado</p>
                                <p className="text-xl font-black text-slate-900 leading-none">{locations.length}</p>
                            </div>
                            {selectedSegment && (
                                <button
                                    onClick={() => setSelectedSegment(null)}
                                    className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                                >
                                    Limpar Filtro
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Styles for Leaflet */}
            <style jsx global>{`
                .premium-map-popup .leaflet-popup-content-wrapper {
                    border-radius: 20px;
                    padding: 0;
                    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15);
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .premium-map-popup .leaflet-popup-content {
                    margin: 0;
                }
                .premium-map-popup .leaflet-popup-tip {
                    box-shadow: none;
                }
                .leaflet-container {
                    cursor: crosshair !important;
                }
            `}</style>
        </div>
    );
}
