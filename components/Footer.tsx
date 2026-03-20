"use client";

import { Instagram, Mail, MessageCircle, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Logo/Branding */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">Ensitec BI</h2>
            <p className="text-gray-400 mt-2 text-sm">
              Transformando dados em inteligência estratégica.
            </p>
          </div>

          {/* Contact Links */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-6">
              <a 
                href="https://www.instagram.com/ensitecbi/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition-colors"
                title="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="mailto:fabio.cagido@ensinetecnologia.com.br"
                className="hover:text-indigo-400 transition-colors"
                title="Email"
              >
                <Mail size={24} />
              </a>
              <a 
                href="https://www.linkedin.com/company/ensitec-bi/posts/?feedView=all" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="https://wa.me/5521998275770?text=Oi!+Tenho+interesse+em+implementar+o+Ensitec+BI+na+minha+institui%C3%A7%C3%A3o.+Gostaria+de+agendar+uma+demonstra%C3%A7%C3%A3o+r%C3%A1pida+para+ver+o+painel+funcionando+na+pr%C3%A1tica+e+entender+os+pr%C3%B3ximos+passos.+Como+podemos+seguir%3F" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle size={24} />
              </a>
            </div>
            <div className="text-sm text-gray-400">
              <p>fabio.cagido@ensinetecnologia.com.br</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Ensitec BI. Todos os direitos reservados.</p>
          </div>

        </div>
      </div>
    </footer>
  );
}
