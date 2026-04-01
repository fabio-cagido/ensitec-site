export default function BiRestaurantesPage() {
  return (
    <main className="bg-white font-sans">
      {/* HERO */}
      <section className="py-28 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Business Intelligence para Restaurantes
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Transforme dados de vendas, inteligência de mercado e engenharia de cardápio em decisões mais claras, rápidas e altamente lucrativas.
          </p>
        </div>
      </section>

      {/* VÍDEO EXPLICATIVO */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Texto */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                BI para restaurantes, explicado de forma simples
              </h2>

              <p className="text-lg text-gray-700 mb-6">
                No mercado extremamente competitivo de Food Service, intuição não enche o salão. Dados só fazem sentido quando ajudam a otimizar cada prato e cada pedido no seu dia a dia.
              </p>

              <p className="text-lg text-gray-700 mb-8">
                Neste vídeo, explico como um painel de Business Intelligence pode apoiar a gestão financeira e o monitoramento brutal da concorrência de forma prática.
              </p>

              <ul className="space-y-4">
                {[
                  "Visão exata do Ticket Médio e Mix de Canais",
                  "Radar de Concorrentes com Posicionamento de Mercado",
                  "Menos achismo, mais lucro líquido comprovado",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-amber-600 flex-shrink-0" />
                    <span className="text-gray-800 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vídeo YouTube - Mantido original */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl ring-4 ring-amber-50">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/ZqCc_IituTs"
                title="Apresentação BI"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Botão de WhatsApp Centralizado */}
          <div className="mt-16 flex justify-center">
            <a
              href="https://wa.me/5521998275770?text=Oi!+Tenho+interesse+em+implementar+o+Ensitec+BI+no+meu+restaurante.+Gostaria+de+agendar+uma+demonstra%C3%A7%C3%A3o+r%C3%A1pida+para+ver+o+painel+funcionando+na+pr%C3%A1tica+e+entender+os+pr%C3%B3ximos+passos.+Como+podemos+seguir%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-700 text-white font-bold px-8 py-4 rounded-xl hover:bg-amber-800 transition shadow-lg shadow-amber-900/20 active:scale-95"
            >
            Quero dominar meu mercado
            </a>
          </div>
        </div>
      </section>

      {/* DORES */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Desafios comuns no Food Service
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Vendas fragmentadas",
                text: "Relatórios de delivery, salão e iFood que não conversam entre si e nunca batem no fim do dia.",
              },
              {
                title: "Concorrência invisível",
                text: "Precificação às cegas. Dificuldade de saber onde seu preço e qualidade estão em relação à região.",
              },
              {
                title: "Caixa no escuro",
                text: "Acompanhar o fluxo de caixa gerencial sem uma visão rápida de ticket médio e horários de pico.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-amber-50/50 border border-amber-100 rounded-2xl p-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Como o BI Ensitec ajuda seu negócio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Engenharia de cardápio e mapa de Calor",
              "Posicionamento e Monitoramento de Concorrentes",
              "Mix de Canais (Delivery vs Salão)",
              "Acompanhamento de Cancelamentos SLA",
            ].map((benefit) => (
              <div
                key={benefit}
                className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-xl transition-all"
              >
                <div className="w-10 h-1 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-600" />
                <p className="text-gray-900 font-bold">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDICADORES */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Indicadores que escalam sua operação
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "Evolução de Faturamento",
              "Ticket Médio por Plataforma",
              "Risco Relacionado a Concorrentes",
              "Preço Médio Praticado no Bairro",
              "Taxa de Cancelamento de Pedidos",
              "Saturação de Nichos Gastronômicos",
            ].map((kpi) => (
              <div
                key={kpi}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center hover:border-amber-300 transition"
              >
                <span className="text-gray-900 font-bold">{kpi}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CONTATO */}
      <section id="contato" className="py-24 bg-gray-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Dados precisos. Restaurante cheio.
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            Apoiamos empreendedores da gastronomia com painéis executivos poderosos.
          </p>

          <div className="flex flex-col items-center gap-8">
            <a
              href="https://wa.me/5521998275770?text=Oi!+Tenho+interesse+em+implementar+o+Ensitec+BI+no+meu+restaurante.+Gostaria+de+agendar+uma+demonstra%C3%A7%C3%A3o+r%C3%A1pida+para+ver+o+painel+funcionando+na+pr%C3%A1tica+e+entender+os+pr%C3%B3ximos+passos.+Como+podemos+seguir%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-amber-50 transition shadow-lg shadow-white/10 active:scale-95"
            >
              Falar com a Ensitec
            </a>

            <div className="flex gap-6 text-gray-400 mt-4">
              <a href="https://www.instagram.com/ensitecbi/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors font-medium">Instagram</a>
              <a href="https://www.linkedin.com/company/ensitec-bi/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors font-medium">LinkedIn</a>
              <a href="mailto:fabio.cagido@ensinetecnologia.com.br" className="hover:text-amber-500 transition-colors font-medium">Email</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
