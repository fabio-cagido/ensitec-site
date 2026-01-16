"use client";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const schoolPosition: [number, number] = [-22.9519, -43.1855];

const students = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  pos: [
    schoolPosition[0] + (Math.random() - 0.5) * 0.02,
    schoolPosition[1] + (Math.random() - 0.5) * 0.02,
  ] as [number, number],
}));

export default function MapComponent() {
  return (
    <MapContainer 
      center={schoolPosition} 
      zoom={15} 
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Circle 
        center={schoolPosition} 
        pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.3 }} 
        radius={200} 
      />
      {students.map((student) => (
        <Circle 
          key={student.id} 
          center={student.pos} 
          pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.6 }} 
          radius={12} 
        />
      ))}
    </MapContainer>
  );
}