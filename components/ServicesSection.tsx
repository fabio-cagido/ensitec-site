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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ServicesSection() {
  return (
    <section className="bg-white text-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Título */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            O que fazemos
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ajudamos empresas a transformar dados em decisões claras,
            combinando estratégia, tecnologia e visão de negócio.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          
          {[
            {
              title: "Diagnóstico de Dados",
              text: "Analisamos suas fontes de dados, indicadores e processos para identificar oportunidades de melhoria e clareza.",
            },
            {
              title: "Dashboards Inteligentes",
              text: "Criamos dashboards objetivos, visuais e alinhados às decisões que realmente importam no dia a dia.",
            },
            {
              title: "Acompanhamento Contínuo",
              text: "Evoluímos seus indicadores ao longo do tempo, garantindo que os dados acompanhem o crescimento do negócio.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              className="border rounded-2xl p-8 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600">
                {item.text}
              </p>
            </motion.div>
          ))}

        </motion.div>
      </div>
    </section>
  );
}
