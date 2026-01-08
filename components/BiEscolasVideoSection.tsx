"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
export default function BiEscolasVideoSection() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Vídeo */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.youtube.com/embed/j-3fA5U_JSE"
              title="Apresentação BI para Escolas"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Conteúdo */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              BI pensado para a realidade das escolas
            </h2>

            <p className="text-lg text-gray-700 mb-8">
              Transformamos dados acadêmicos, financeiros e operacionais
              em informações claras para apoiar decisões pedagógicas e estratégicas.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Indicadores pedagógicos em tempo real",
                "Visão clara de inadimplência e faturamento",
                "Dashboards simples para coordenação e direção",
                "Sem dependência de ferramentas engessadas",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                  <span className="text-gray-800">{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="/contato"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-white font-semibold hover:bg-blue-700 transition"
            >
              Solicitar demonstração
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
