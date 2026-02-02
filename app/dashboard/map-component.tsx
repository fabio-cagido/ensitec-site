"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

// Coordenadas da escola (Botafogo, RJ)
const SCHOOL_POSITION: LatLngExpression = [-22.9519, -43.1855];

const SEGMENTS = [
  { label: 'Infantil', minAge: 2, maxAge: 5, classes: ['Maternal', 'Pré I', 'Pré II'] },
  { label: 'Fund. I', minAge: 6, maxAge: 10, classes: ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'] },
  { label: 'Fund. II', minAge: 11, maxAge: 14, classes: ['6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { label: 'Médio', minAge: 15, maxAge: 18, classes: ['1º Médio', '2º Médio', '3º Médio'] },
];

const NAMES = ["Miguel", "Ana", "Pedro", "Sofia", "Lucas", "Julia", "Gabriel", "Alice", "Matheus", "Laura", "Davi", "Manuela", "Heitor", "Isabella", "Arthur", "Luiza", "Bernardo", "Helena"];
const SURNAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins"];

// Tipagem para os alunos
interface Student {
  id: number;
  name: string;
  segment: string;
  class: string;
  age: number;
  pos: LatLngExpression;
}

// Gerar dados mockados apenas uma vez (fora do componente para evitar recriação em re-renders simples, ou useMemo dentro)
// Como é mock fixo, pode ficar fora ou dentro com useMemo. Deixando fora para estabilidade.
const generateStudents = (): Student[] => {
  return Array.from({ length: 100 }, (_, i) => {
    const segment = SEGMENTS[Math.floor(Math.random() * SEGMENTS.length)];
    const age = Math.floor(Math.random() * (segment.maxAge - segment.minAge + 1)) + segment.minAge;
    const className = segment.classes[Math.floor(Math.random() * segment.classes.length)] + ` ${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}`;
    const firstName = NAMES[Math.floor(Math.random() * NAMES.length)];
    const lastName = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];

    return {
      id: i,
      name: `${firstName} ${lastName}`,
      segment: segment.label,
      class: className,
      age: age,
      pos: [
        (SCHOOL_POSITION as [number, number])[0] + (Math.random() - 0.5) * 0.02,
        (SCHOOL_POSITION as [number, number])[1] + (Math.random() - 0.5) * 0.02,
      ] as LatLngExpression,
    };
  });
};

const students = generateStudents();

export default function MapComponent() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Carregando mapa...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative isolate z-0">
      <MapContainer
        center={SCHOOL_POSITION}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full rounded-2xl"
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador da Escola (Azul) */}
        <Circle
          center={SCHOOL_POSITION}
          pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.3 }}
          radius={200}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-gray-900">Ensitec Matriz</h3>
              <p className="text-xs text-gray-500">Unidade Botafogo</p>
            </div>
          </Popup>
        </Circle>

        {/* Marcadores dos Alunos (Vermelho) */}
        {students.map((student) => (
          <Circle
            key={student.id}
            center={student.pos}
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.6 }}
            radius={12}
          >
            <Popup>
              <div className="min-w-[150px]">
                <h4 className="font-bold text-gray-900 mb-1">{student.name}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Turma:</span>
                    <span className="font-medium text-gray-800">{student.class}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Segmento:</span>
                    <span className="font-medium text-gray-800">{student.segment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Idade:</span>
                    <span className="font-medium text-gray-800">{student.age} anos</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}