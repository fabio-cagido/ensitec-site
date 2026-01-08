export default function BiEscolasPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Business Intelligence para Escolas
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Transforme dados acadêmicos, financeiros e operacionais em decisões
            mais claras, rápidas e estratégicas.
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
                BI para escolas, explicado de forma simples
              </h2>

              <p className="text-lg text-gray-700 mb-6">
                Ao longo de mais de 10 anos atuando em escolas, aprendi que dados
                só fazem sentido quando ajudam a tomar decisões melhores no dia a dia.
              </p>

              <p className="text-lg text-gray-700 mb-8">
                Neste vídeo, explico como o Business Intelligence pode apoiar a
                gestão pedagógica e financeira de forma prática e acessível.
              </p>

              <ul className="space-y-4">
                {[
                  "Visão clara para coordenação e direção",
                  "Indicadores pedagógicos e financeiros no mesmo lugar",
                  "Menos planilhas, mais decisões",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-gray-700 flex-shrink-0" />
                    <span className="text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vídeo YouTube */}
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
          </div>
        </div>
      </section>

      {/* DORES */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Desafios comuns na gestão escolar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Dados espalhados",
                text: "Informações acadêmicas, financeiras e administrativas em sistemas que não conversam entre si.",
              },
              {
                title: "Decisões tardias",
                text: "Relatórios manuais que chegam tarde demais para apoiar ações estratégicas.",
              },
              {
                title: "Falta de visão clara",
                text: "Dificuldade em acompanhar indicadores-chave de evasão, desempenho e sustentabilidade financeira.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-8"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
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
            Como o BI ajuda sua escola
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Acompanhamento de evasão e retenção",
              "Análise de desempenho acadêmico",
              "Gestão financeira e inadimplência",
              "Indicadores operacionais em tempo real",
            ].map((benefit) => (
              <div
                key={benefit}
                className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition"
              >
                <div className="w-10 h-1 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-orange-500" />
                <p className="text-gray-900 font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDICADORES */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Indicadores que fazem a diferença
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "Taxa de evasão",
              "Inadimplência",
              "Média de desempenho por turma",
              "Ocupação de vagas",
              "Receita por aluno",
              "Indicadores pedagógicos e administrativos",
            ].map((kpi) => (
              <div
                key={kpi}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center"
              >
                <span className="text-gray-900 font-semibold">{kpi}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Dados claros. Decisões melhores.
          </h2>
          <p className="text-lg text-gray-300 mb-10">
            Desenvolvemos soluções de BI sob medida para a realidade da sua
            instituição de ensino.
          </p>

          <a
            href="/contato"
            className="inline-block bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition"
          >
            Falar com a Ensitec
          </a>
        </div>
      </section>
    </main>
  );
}
