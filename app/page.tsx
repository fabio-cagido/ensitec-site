import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import TechStackSection from "@/components/TechStackSection";
import VideoSection from "@/components/VideoSection";
import Link from "next/link";
import { UserCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="relative">
      {/* Container de Navegação para o Botão de Login */}
      <div className="relative w-full z-[100]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-end h-0 overflow-visible">
            {/* Abaixo, o '-mt-10' (margin-top negativa) puxa o botão para a faixa preta.
               Ajuste o valor (ex: -mt-8 ou -mt-12) até ficar centralizado na sua faixa.
            */}
            <Link 
              href="/login" 
              className="-mt-11 flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white hover:text-blue-400 transition-colors"
            >
              <UserCircle size={16} />
              Área do Gestor
            </Link>
          </div>
        </div>
      </div>

      <Hero />
      <VideoSection />
      <ServicesSection />
      <ProcessSection />
      <TechStackSection />
    </main>
  );
}