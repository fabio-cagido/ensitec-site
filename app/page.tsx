import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import TechStackSection from "@/components/TechStackSection";
import VideoSection from "@/components/VideoSection";


export default function Home() {
  return (
    <main className="relative">


      <Hero />
      <VideoSection />
      <ServicesSection />
      <ProcessSection />
      <TechStackSection />

      {/* CTA Section */}
      <section id="contato" className="py-24 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Vamos transformar seus dados em decisões?
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            Fale conosco agora e descubra como o BI pode elevar o patamar da sua gestão.
          </p>

          <div className="flex flex-col items-center gap-8">
            <a
              href="https://wa.me/5521998275770?text=Oi!+Tenho+interesse+em+implementar+o+Ensitec+BI+na+minha+institui%C3%A7%C3%A3o.+Gostaria+de+agendar+uma+demonstra%C3%A7%C3%A3o+r%C3%A1pida+para+ver+o+painel+funcionando+na+pr%C3%A1tica+e+entender+os+pr%C3%B3ximos+passos.+Como+podemos+seguir%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition shadow-lg shadow-white/10 active:scale-95"
            >
              Falar com a Ensitec
            </a>

            <div className="flex gap-8 text-gray-400">
              <a href="https://www.instagram.com/ensitecbi/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://www.linkedin.com/company/ensitec-bi/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="mailto:fabio.cagido@ensinetecnologia.com.br" className="hover:text-white transition-colors">Email</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}