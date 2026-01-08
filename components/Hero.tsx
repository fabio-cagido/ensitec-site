"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function Hero() {
  return (
    <section className="min-h-[70vh] flex items-center bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-6 leading-tight text-gray-900"
        >
          Business Intelligence
          <br />
          para decisões melhores
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-xl text-gray-700 max-w-2xl mb-8"
        >
          Projetos de BI sob medida, com foco em clareza, impacto e
          adaptação à realidade da sua empresa — especialmente escolas.
        </motion.p>

        <motion.a
          href="/bi-para-escolas"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block bg-black text-white px-6 py-3 rounded-md"
        >
          BI para Escolas
        </motion.a>

      </div>
    </section>
  );
}
