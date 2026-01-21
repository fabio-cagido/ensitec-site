"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function TechStackSection() {
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
            Tecnologia sem amarras
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Utilizamos a ferramenta mais adequada ao seu contexto,
            respeitando a maturidade dos dados e os objetivos do negócio.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8"
        >
          {[
            { name: "Looker Studio", color: "from-blue-500 to-cyan-400" },
            { name: "Power BI", color: "from-yellow-500 to-orange-500" },
            { name: "Ensitec BI", color: "from-red-600 to-rose-500" },
            { name: "Tableau", color: "from-indigo-500 to-purple-500" },
            { name: "Dashboards em Python", color: "from-emerald-500 to-teal-400" },
          ].map((tech) => (
            <motion.div
              key={tech.name}
              variants={itemVariants}
              className="
                group
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-8
                text-center
                transition-all
                duration-300
                ease-out
                hover:-translate-y-2
                hover:shadow-xl
              "
            >
              {/* Linha superior */}
              <div
                className={`
                  h-1
                  w-[80%]
                  mx-auto
                  mb-6
                  rounded-full
                  bg-gradient-to-r
                  ${tech.color}
                  opacity-70
                  transition-all
                  duration-300
                  ease-out
                  group-hover:w-[90%]
                  group-hover:opacity-100
                `}
              />

              <span className="text-lg font-semibold text-gray-900">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
