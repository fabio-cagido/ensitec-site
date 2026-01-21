"use client";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Criamos versões "silenciadas" para o TypeScript não reclamar no build da Vercel
const Map: any = MapContainer;
const Tile: any = TileLayer;
const MarkerCircle: any = Circle;
const MarkerPopup: any = Popup;

const schoolPosition: [number, number] = [-22.9519, -43.1855];

const SEGMENTS = [
  { label: 'Infantil', minAge: 2, maxAge: 5, classes: ['Maternal', 'Pré I', 'Pré II'] },
  { label: 'Fund. I', minAge: 6, maxAge: 10, classes: ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano'] },
  { label: 'Fund. II', minAge: 11, maxAge: 14, classes: ['6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
  { label: 'Médio', minAge: 15, maxAge: 18, classes: ['1º Médio', '2º Médio', '3º Médio'] },
];

const NAMES = ["Miguel", "Ana", "Pedro", "Sofia", "Lucas", "Julia", "Gabriel", "Alice", "Matheus", "Laura", "Davi", "Manuela", "Heitor", "Isabella", "Arthur", "Luiza", "Bernardo", "Helena"];
const SURNAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins"];

const students = Array.from({ length: 100 }, (_, i) => {
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
      schoolPosition[0] + (Math.random() - 0.5) * 0.02,
      schoolPosition[1] + (Math.random() - 0.5) * 0.02,
    ] as [number, number],
  };
});

export default function MapComponent() {
  return (
    <Map
      center={schoolPosition}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <Tile url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerCircle
        center={schoolPosition}
        pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.3 }}
        radius={200}
      >
        <MarkerPopup>
          <div className="text-center">
            <h3 className="font-bold text-gray-900">Ensitec Matriz</h3>
            <p className="text-xs text-gray-500">Unidade Botafogo</p>
          </div>
        </MarkerPopup>
      </MarkerCircle>

      {students.map((student: any) => (
        <MarkerCircle
          key={student.id}
          center={student.pos}
          pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.6 }}
          radius={12}
        >
          <MarkerPopup>
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
          </MarkerPopup>
        </MarkerCircle>
      ))}
    </Map>
  );
}