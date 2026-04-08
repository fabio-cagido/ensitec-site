import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ================================================================
// PERSONAS: Analistas de Tomada de Decisão por Nicho
// ================================================================
const NICHE_PERSONAS: Record<string, string> = {
    restaurante: `Você é o EnsiTec AI Analyst — analista de dados sênior especializado em gestão de restaurantes e food service no Brasil.

SEU PAPEL:
Você ajuda o gestor a entender os dados do dashboard, tomar decisões estratégicas e identificar oportunidades e riscos. Você não é um chatbot genérico — você é um consultor especializado que lê os números e traduz em ação.

ESTILO DE RESPOSTA:
- Seja direto, objetivo e crítico. Se um dado está ruim, diga claramente.
- Sempre que possível, ligue o número à ação: "seu CMV está em X% → isso significa Y → ação recomendada: Z"
- Use benchmarks reais do setor brasileiro: CMV ideal ≤ 30%, ticket médio typical, margem operacional saudável 15-25%, cancelamento < 2%, NPS > 8.0
- Quando o usuário compartilhar dados da tela, analise-os especificamente — não responda genericamente
- Explique o que cada métrica significa para um gestor que não é especialista em finanças
- Responda sempre em português do Brasil
- Use Markdown: **negrito** para números críticos, listas para ações, tabelas para comparações

RESTRIÇÕES:
- Fale APENAS sobre restaurantes, gastronomia, food service, gestão de operações de alimentação
- Nunca discuta escolas, corporações ou outros segmentos
- Se perguntado fora do escopo, redirecione educadamente`,

    escola: `Você é o EnsiTec AI Analyst — analista de dados sênior especializado em gestão educacional e administração de escolas privadas no Brasil.

SEU PAPEL:
Você ajuda o gestor escolar a entender os indicadores do dashboard, tomar decisões estratégicas e identificar riscos de inadimplência, evasão e performance acadêmica. Você traduz números em decisões concretas.

ESTILO DE RESPOSTA:
- Seja direto, objetivo e crítico. Se a inadimplência está alta, diga o impacto financeiro real.
- Ligue o número à ação: "sua taxa de evasão está em X% → isso representa Y alunos → impacto de R$ Z → ação recomendada"
- Use benchmarks reais: inadimplência saudável < 5%, retenção alvo > 90%, frequência mínima > 85%, NPS > 8.5
- Quando o usuário compartilhar dados da tela, analise-os especificamente
- Explique o que cada métrica significa para um gestor que não é especialista em dados
- Responda sempre em português do Brasil
- Use Markdown: **negrito** para números críticos, listas para ações, tabelas quando útil

RESTRIÇÕES:
- Fale APENAS sobre escolas, educação, gestão pedagógica, matrículas, inadimplência escolar, ENEM, frequência
- Nunca discuta restaurantes, corporações ou outros segmentos`,

    corporativo: `Você é o EnsiTec AI Analyst — analista de dados sênior especializado em inteligência corporativa, KPIs e performance organizacional.

SEU PAPEL:
Você ajuda o gestor corporativo a entender os dados do dashboard, identificar gargalos, avaliar performance de times e tomar decisões estratégicas baseadas em dados. Você traduz KPIs em decisões de negócio.

ESTILO DE RESPOSTA:
- Seja direto, objetivo e crítico. Aponte riscos sem minimizá-los.
- Ligue o número à ação: "sua margem está em X% → abaixo do benchmark de Y% → ação recomendada: Z"
- Use benchmarks corporativos: crescimento saudável > 15% a.a., margem operacional > 20%, churn de colaboradores < 15%
- Quando o usuário compartilhar dados da tela, analise-os especificamente
- Explique o que cada métrica significa para gestores não especialistas em dados
- Responda sempre em português do Brasil
- Use Markdown: **negrito** para números críticos, listas para ações, tabelas para comparações

RESTRIÇÕES:
- Fale APENAS sobre gestão corporativa, KPIs, performance de times, finanças empresariais
- Nunca discuta restaurantes, escolas ou outros segmentos`,
};

// ================================================================
// FALLBACK: Respostas inteligentes sem chave (sempre baseadas na pergunta)
// ================================================================
function buildFallbackResponse(message: string, niche: string, pageContext: Record<string, any>): string {
    const hasContext = pageContext && Object.keys(pageContext).length > 2;
    const lowerMsg = message.toLowerCase();

    const contextNote = hasContext
        ? `\n\n*📊 Dados da sua tela foram detectados. Cadastre sua chave OpenAI ou Gemini nas ⚙️ Configurações para receber uma análise específica e personalizada desses números.*`
        : `\n\n*💡 Sem chave de IA cadastrada. Vá em ⚙️ Configurações no chat para cadastrar sua chave OpenAI ou Gemini e receber análises personalizadas dos seus dados reais.*`;

    // Restaurante
    if (niche === 'restaurante') {
        if (lowerMsg.match(/cmv|custo|insumo|estoque|fornece/)) {
            return `**CMV — O que significa e o que fazer**\n\n**CMV (Custo de Mercadoria Vendida)** é a porcentagem do faturamento que vai para pagar os insumos.\n\n| Faixa de CMV | Situação |\n|---|---|\n| **≤ 28%** | 🟢 Excelente |\n| **28% – 35%** | 🟡 Aceitável |\n| **35% – 45%** | 🔴 Crítico |\n| **> 45%** | 🚨 Insustentável |\n\n**Ações práticas para reduzir CMV:**\n1. Revisar fichas técnicas de todos os pratos\n2. Negociar contratos trimestrais com fornecedores (redução média de 8-12%)\n3. Eliminar itens com CMV > 45% do cardápio\n4. Implantar controle de estoque semanal${contextNote}`;
        }
        if (lowerMsg.match(/ticket|fatur|receita|venda/)) {
            return `**Ticket Médio & Faturamento — O que significa**\n\n**Ticket Médio** = Faturamento Total ÷ Número de Pedidos. É o valor médio gasto por cliente por visita.\n\n**Benchmarks no Brasil:**\n- 🍔 Fast food / lanchonete: **R$ 25 – 45**\n- 🍽️ Restaurante casual: **R$ 55 – 90**\n- 🥂 Alta gastronomia: **R$ 120+**\n\n**Para aumentar o Ticket Médio:**\n1. Treinamento de equipe em **upsell** (sugerir bebida, sobremesa)\n2. Criar combos estratégicos com itens de alta margem\n3. Reduzir itens de baixo valor — eles puxam a média para baixo${contextNote}`;
        }
        if (lowerMsg.match(/concorr|mercado|position|posi/)) {
            return `**Posicionamento de Mercado — O que significa**\n\nEste indicador mostra **onde seu restaurante está na escala de preços** comparado aos concorrentes na sua região.\n\n- **Abaixo do mercado**: Pode estar deixando margem na mesa. Clientes pagam por qualidade percebida.\n- **Alinhado ao mercado**: Posição saudável. Foque em diferenciação por qualidade e serviço.\n- **Acima do mercado**: Precisa justificar com experiência premium, ou corre risco de perder volume.\n\n**Decisão recomendada:**\nSe estiver abaixo do mercado, um ajuste de 8-12% no preço médio geralmente não impacta elasticidade de demanda em restaurantes estabelecidos.${contextNote}`;
        }
        return `**Análise do seu Dashboard de Restaurante**\n\nEstou aqui para ajudar você a entender os dados e tomar decisões melhores. Posso analisar:\n\n- 📊 **CMV e custos** — se seus insumos estão consumindo margem\n- 💰 **Faturamento e ticket médio** — se você está cobrando o valor certo\n- 🎯 **Posição no mercado** — como você está vs. concorrentes\n- ⏱️ **Operacional** — picos de venda, eficiência de entrega\n- 👥 **Clientes** — retenção e comportamento\n\nFaça uma pergunta específica ou clique em uma das sugestões rápidas abaixo.${contextNote}`;
    }

    // Escola
    if (niche === 'escola') {
        if (lowerMsg.match(/inadimp|devedor|cobran|pagar|mensali/)) {
            return `**Inadimplência Escolar — O que significa e o que fazer**\n\n**Taxa de Inadimplência** = Alunos com mensalidade vencida ÷ Total de alunos ativos.\n\n| Faixa | Situação |\n|---|---|\n| **< 5%** | 🟢 Saudável |\n| **5% – 10%** | 🟡 Atenção |\n| **10% – 20%** | 🔴 Crítico |\n| **> 20%** | 🚨 Risco de caixa |\n\n**Ações imediatas:**\n1. Contato proativo **15 dias antes** do vencimento (reduz inadimplência em 30-40%)\n2. Oferecer parcelamento antes da inadimplência formar\n3. Identificar quais séries ou turmas concentram o problema\n4. Implementar desconto por pontualidade (ex: 5% para pagamento até dia 5)${contextNote}`;
        }
        if (lowerMsg.match(/evas|abandon|saiu|cancelo|transferiu|reten/)) {
            return `**Evasão & Retenção — O que significa**\n\n**Taxa de Evasão** = Alunos que saíram ÷ Alunos no início do período. **Meta: < 10% ao ano.**\n\n**O custo real da evasão:**\n- Cada aluno perdido = 1 mensalidade × 12 meses de receita perdida\n- Mais o custo de captação para substituí-lo (3-5x o valor de uma mensalidade)\n- Turmas com baixa ocupação criam custo fixo proporcional maior\n\n**Como reduzir evasão:**\n1. Identificar os primeiros sinais: **faltas acima de 15%** são o maior preditor de evasão\n2. Contato ativo com responsáveis de alunos com baixa frequência\n3. Pesquisa de NPS semestral para detectar insatisfação antes da saída${contextNote}`;
        }
        return `**Análise do seu Dashboard Escolar**\n\nEstou aqui para ajudar você a entender os dados e tomar decisões melhores. Posso analisar:\n\n- 💳 **Inadimplência** — impacto no fluxo de caixa e ações de cobrança\n- 📉 **Evasão & retenção** — quem está em risco de sair\n- 🎓 **Performance acadêmica** — notas, frequência e ENEM\n- 📊 **Financeiro** — receita, projeções e faturamento\n\nFaça uma pergunta específica sobre qualquer dado que estiver vendo na tela.${contextNote}`;
    }

    // Corporativo
    return `**Análise do seu Dashboard Corporativo**\n\nEstou aqui para ajudar você a entender os KPIs e tomar decisões estratégicas. Posso analisar qualquer dado visível na tela.\n\nFaça uma pergunta específica sobre seus indicadores.${contextNote}`;
}

// ================================================================
// CHAMADAS DE IA REAL
// ================================================================
async function callOpenAI(apiKey: string, messages: any[]): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            max_tokens: 1200,
            temperature: 0.2, // Baixo para análises mais precisas e consistentes
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenAI ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
        throw new Error('OpenAI: resposta vazia ou inesperada');
    }
    return data.choices[0].message.content;
}

async function callGemini(apiKey: string, systemPrompt: string, history: any[], userMessage: string): Promise<string> {
    // Gemini usa formato diferente do OpenAI — conversão correta do histórico
    const contents = [
        ...history.map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        })),
        { role: 'user', parts: [{ text: userMessage }] },
    ];

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents,
                generationConfig: {
                    maxOutputTokens: 1200,
                    temperature: 0.2,
                },
            }),
        }
    );

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Gemini ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Gemini: resposta vazia ou inesperada');
    }
    return data.candidates[0].content.parts[0].text;
}

// ================================================================
// HANDLER PRINCIPAL
// ================================================================
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            message,
            niche,
            pageContext,
            history,
            apiKey,
            aiProvider,
        } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Mensagem inválida.' }, { status: 400 });
        }

        const validNiches = ['restaurante', 'escola', 'corporativo'];
        const safeNiche = validNiches.includes(niche) ? niche : 'restaurante';
        const systemPrompt = NICHE_PERSONAS[safeNiche];

        // Contexto de dados da tela — sempre incluso na mensagem do usuário quando disponível
        let userMessageWithContext = message;
        if (pageContext && Object.keys(pageContext).length > 2) {
            userMessageWithContext = `[DADOS DA TELA DO GESTOR]\n${JSON.stringify(pageContext, null, 2)}\n\n[PERGUNTA DO GESTOR]\n${message}`;
        }

        // Histórico seguro (5 últimas trocas = 10 mensagens)
        const safeHistory = Array.isArray(history) ? history.slice(-10) : [];

        // ===== MODO COM CHAVE REAL =====
        const hasKey = apiKey && typeof apiKey === 'string' && apiKey.trim().length > 20;

        if (hasKey) {
            const cleanKey = apiKey.trim();
            const isGemini = aiProvider === 'gemini' || cleanKey.startsWith('AI');

            try {
                let reply: string;

                if (isGemini) {
                    reply = await callGemini(cleanKey, systemPrompt, safeHistory, userMessageWithContext);
                } else {
                    // OpenAI: monta array completo de mensagens incluindo histórico
                    const openAIMessages = [
                        { role: 'system', content: systemPrompt },
                        ...safeHistory,
                        { role: 'user', content: userMessageWithContext },
                    ];
                    reply = await callOpenAI(cleanKey, openAIMessages);
                }

                return NextResponse.json({
                    reply,
                    mode: 'ai',
                    provider: isGemini ? 'gemini' : 'openai',
                });

            } catch (aiError: any) {
                // Erro com chave — informa ao usuário em vez de cair no fallback silencioso
                console.error('[EnsiTec AI] Erro com chave real:', aiError.message);

                const errorReply = `⚠️ **Erro ao conectar com a IA**\n\n${aiError.message?.includes('401') || aiError.message?.includes('403')
                    ? 'Sua chave de API parece **inválida ou sem crédito**. Verifique em ⚙️ Configurações.'
                    : aiError.message?.includes('429')
                        ? 'Você atingiu o **limite de requisições** da sua chave. Aguarde alguns instantes e tente novamente.'
                        : 'Não foi possível conectar à IA no momento. Verifique sua chave nas ⚙️ Configurações ou tente novamente.'
                }`;

                return NextResponse.json({ reply: errorReply, mode: 'error' }, { status: 200 });
            }
        }

        // ===== MODO FALLBACK (sem chave) =====
        const fallbackReply = buildFallbackResponse(message, safeNiche, pageContext || {});

        return NextResponse.json({
            reply: fallbackReply,
            mode: 'demo',
        });

    } catch (error: any) {
        console.error('[EnsiTec AI] Erro interno:', error);
        return NextResponse.json(
            { error: 'Erro interno. Tente novamente.' },
            { status: 500 }
        );
    }
}
