"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corrigindo o ícone padrão do Leaflet que quebra no Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapComponent() {
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/map')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLocations(data);
        }
      })
      .catch(err => console.error("Map fetch error:", err));
  }, []);

  return (
    <MapContainer
      center={[-22.9068, -43.1729]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        <Marker key={loc.id} position={loc.position as [number, number]} icon={icon}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-gray-900">{loc.name}</h3>
              <p className="text-sm text-gray-600">{loc.students} Alunos</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
