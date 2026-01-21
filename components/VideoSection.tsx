"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function VideoSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Texto */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            BI para escolas, explicado de forma simples
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            Ao longo de mais de 10 anos atuando em escolas, aprendi que dados só
            fazem sentido quando ajudam a tomar decisões melhores no dia a dia.
          </p>

          <p className="text-lg text-gray-700">
            Neste vídeo, explico como o Business Intelligence pode apoiar a
            gestão pedagógica e financeira de forma prática e acessível.
          </p>
        </motion.div>

        {/* Vídeo */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl overflow-hidden shadow-lg border border-gray-200"
        >
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <video
              className="absolute top-0 left-0 w-full h-full object-cover"
              controls
              playsInline
            >
              <source src="/videos/school-bi-platform-introduction.mp4" type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
