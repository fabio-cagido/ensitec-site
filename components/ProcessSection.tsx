"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ProcessSection() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Título */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Como funciona nosso processo
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Um método estruturado, simples e adaptável à maturidade de dados da
            sua organização.
          </p>
        </motion.div>

        {/* Etapas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              step: "01",
              title: "Entendimento do negócio",
              text: "Compreendemos os objetivos, desafios e decisões que realmente importam para a gestão.",
            },
            {
              step: "02",
              title: "Modelagem e visualização",
              text: "Estruturamos os dados e criamos dashboards claros, objetivos e acionáveis.",
            },
            {
              step: "03",
              title: "Evolução contínua",
              text: "Acompanhamos o uso e ajustamos os indicadores conforme o negócio evolui.",
            },
          ].map((item) => (
            <motion.div
              key={item.step}
              variants={itemVariants}
              className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition"
            >
              <span className="text-sm font-semibold text-gray-400">
                {item.step}
              </span>
              <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-700">
                {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
