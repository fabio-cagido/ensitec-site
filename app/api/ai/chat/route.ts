import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ================================================================
// NICHE SYSTEM PROMPTS — Isolamento total entre nichos
// ================================================================
const NICHE_PERSONAS: Record<string, string> = {
    restaurante: `Você é o EnsiTec AI Analyst — um analista de dados sênior especializado em gestão de restaurantes, food service e operações gastronômicas.

REGRAS ABSOLUTAS:
- Responda APENAS sobre restaurantes, gastronomia, food service e temas diretamente relacionados.
- NUNCA discuta escolas, faculdades, educação, corporações ou outros segmentos.
- Se perguntado sobre outros segmentos, recuse educadamente e redirecione.
- Seja CRÍTICO e DIRETO. Se um número está ruim, diga claramente. Não suavize problemas.
- Cite sempre benchmarks do setor: CMV ideal ≤ 30%, ticket médio, taxa de cancelamento saudável < 2%, NPS > 8.0.
- Use dados do cliente fornecidos como âncora principal em todas as respostas.
- Respostas em português do Brasil, tom profissional mas direto.
- Formatação em Markdown: use **negrito**, listas, e tabelas quando útil.`,

    escola: `Você é o EnsiTec AI Analyst — um analista de dados sênior especializado em gestão educacional, indicadores acadêmicos e administração escolar.

REGRAS ABSOLUTAS:
- Responda APENAS sobre escolas, educação, gestão pedagógica, matrículas, inadimplência escolar e temas diretamente relacionados.
- NUNCA discuta restaurantes, food service, corporações ou outros segmentos.
- Se perguntado sobre outros segmentos, recuse educadamente e redirecione.
- Seja CRÍTICO e DIRETO. Se a inadimplência está alta ou a evasão cresceu, aponte sem rodeios.
- Cite benchmarks: inadimplência saudável < 5%, taxa de retenção alvo > 90%, NPS escolar > 8.5.
- Use dados do cliente fornecidos como âncora principal em todas as respostas.
- Respostas em português do Brasil, tom profissional mas direto.
- Formatação em Markdown: use **negrito**, listas, e tabelas quando útil.`,

    corporativo: `Você é o EnsiTec AI Analyst — um analista de dados sênior especializado em inteligência corporativa, KPIs empresariais e performance organizacional.

REGRAS ABSOLUTAS:
- Responda APENAS sobre gestão corporativa, KPIs, performance de times, finanças empresariais e temas diretamente relacionados.
- NUNCA discuta restaurantes, escolas ou outros segmentos não-corporativos.
- Se perguntado sobre outros segmentos, recuse educadamente e redirecione.
- Seja CRÍTICO e DIRETO. Aponte gargalos operacionais e riscos sem minimizá-los.
- Use dados do cliente fornecidos como âncora principal em todas as respostas.
- Respostas em português do Brasil, tom profissional mas direto.
- Formatação em Markdown: use **negrito**, listas, e tabelas quando útil.`,
};

// ================================================================
// FALLBACK RESPONSES (sem chave de IA cadastrada)
// ================================================================
const FALLBACK_RESPONSES: Record<string, string[]> = {
    restaurante: [
        "**Análise Crítica — CMV:**\nSem os dados reais do seu sistema, utilizo benchmarks do setor:\n- 🔴 CMV acima de **40%** é crítico em restaurantes\n- 🟡 Entre 30-40% requer atenção\n- 🟢 Abaixo de 30% é o alvo ideal\n\nPara reduzir CMV: revise fichas técnicas, negocie sazonalmente com fornecedores e elimine itens de baixo giro com alta complexidade de insumo.",
        "**Análise Crítica — Ticket Médio:**\nO ticket médio saudável para um restaurante intermediário no Brasil oscila entre **R$ 45 e R$ 80**. Se o seu está abaixo disso, o problema geralmente está em:\n1. Ausência de estratégia de **upsell** (entradas, sobremesas, bebidas)\n2. Mix de produtos desequilibrado — itens baratos vendendo mais que itens rentáveis\n3. Promoções que canibalizam a margem\n\nQual dos gráficos dessa tela você quer que eu analise especificamente?",
        "**Alerta de Eficiência:**\nBaseado em padrões do setor, taxas de cancelamento acima de **2%** indicam gargalos de cozinha ou logística. Para identificar a causa raiz, precisamos cruzar o horário dos cancelamentos com o volume de pedidos por hora.",
    ],
    escola: [
        "**Análise Crítica — Inadimplência:**\nA taxa de inadimplência saudável para escolas privadas brasileiras é abaixo de **5%**. Acima de 8% pode comprometer o fluxo de caixa em menos de 3 meses sem reserva.\n\nAções imediatas para redução:\n1. **Comunicação antecipada** — contato 15 dias antes do vencimento\n2. **Parcelamento** — oferta de renegociação antes da inadimplência\n3. **Identificação de padrão** — quais turmas ou séries têm maior concentração?",
        "**Análise Crítica — Retenção:**\nTaxa de retenção alvo acima de **90%**. Cada aluno perdido representa não apenas a mensalidade, mas também o custo de captação (geralmente 3-5x o valor de uma mensalidade) para substituí-lo.\n\nOs dados desta tela mostram algum padrão de evasão por série ou período do ano?",
    ],
    corporativo: [
        "**Análise Crítica — Performance:**\nSem os dados específicos da sua operação, utilizo benchmarks corporativos:\n- Revenue Growth saudável: **>15% a.a.**\n- Margem operacional alvo: **>20%**\n- Churn de colaboradores saudável: **<15% a.a.**\n\nQual KPI dessa tela apresenta maior desvio das metas?",
    ],
};

// ================================================================
// LÓGICA DE IA REAL (com chave do usuário)
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
            max_tokens: 1000,
            temperature: 0.3,
        }),
    });
    if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
}

async function callGemini(apiKey: string, messages: any[]): Promise<string> {
    const lastMessage = messages[messages.length - 1].content;
    const systemPrompt = messages[0].content;
    
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ role: 'user', parts: [{ text: lastMessage }] }],
                generationConfig: { maxOutputTokens: 1000, temperature: 0.3 },
            }),
        }
    );
    if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// ================================================================
// HANDLER PRINCIPAL
// ================================================================
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            message,           // Mensagem do usuário
            niche,             // 'restaurante' | 'escola' | 'corporativo'
            pageContext,       // Dados da tela atual (opcional)
            history,           // Histórico da conversa
            apiKey,            // Chave do usuário (OpenAI ou Gemini)
            aiProvider,        // 'openai' | 'gemini' (padrão: fallback)
        } = body;

        // Validação de niche
        const validNiches = ['restaurante', 'escola', 'corporativo'];
        const safeNiche = validNiches.includes(niche) ? niche : 'restaurante';
        
        const systemPrompt = NICHE_PERSONAS[safeNiche];

        // Monta contexto de dados do cliente (sempre incluso quando disponível)
        let contextBlock = '';
        if (pageContext && Object.keys(pageContext).length > 0) {
            contextBlock = `\n\n📊 **DADOS ATUAIS DO CLIENTE (use como base primária):**\n\`\`\`json\n${JSON.stringify(pageContext, null, 2)}\n\`\`\`\n`;
        }

        const messages = [
            { role: 'system', content: systemPrompt },
            // Inclui histórico da sessão (últimas 8 mensagens para economizar tokens)
            ...(history || []).slice(-8),
            { role: 'user', content: `${contextBlock}${message}` },
        ];

        // MODO COM CHAVE DE IA REAL
        if (apiKey && apiKey.length > 10) {
            try {
                let reply: string;
                if (aiProvider === 'gemini' || apiKey.startsWith('AI')) {
                    reply = await callGemini(apiKey, messages);
                } else {
                    reply = await callOpenAI(apiKey, messages);
                }
                return NextResponse.json({ 
                    reply, 
                    mode: 'ai',
                    provider: aiProvider || 'openai'
                });
            } catch (aiError: any) {
                // Fallback se a chave falhar
                console.error('AI API Error:', aiError.message);
                // Continua para o fallback abaixo
            }
        }

        // MODO FALLBACK (sem chave — respostas de alta qualidade pré-programadas)
        const fallbacks = FALLBACK_RESPONSES[safeNiche] || FALLBACK_RESPONSES['restaurante'];
        const keywordsMap: Record<string, number> = {
            cmv: 0, custo: 0, insumo: 0,
            ticket: 1, margem: 1, faturamento: 1,
            cancelamento: 2, cancelar: 2, perda: 2,
            inadimplência: 0, inadimplente: 0,
            retenção: 1, evasão: 1, churn: 1,
        };
        
        const lowerMsg = message.toLowerCase();
        let bestIdx = Math.floor(Math.random() * fallbacks.length);
        for (const [keyword, idx] of Object.entries(keywordsMap)) {
            if (lowerMsg.includes(keyword) && idx < fallbacks.length) {
                bestIdx = idx;
                break;
            }
        }

        const fallbackReply = fallbacks[bestIdx] + 
            '\n\n---\n*💡 Modo Demo — Cadastre sua chave OpenAI ou Gemini nas configurações para análises personalizadas com seus dados reais.*';

        return NextResponse.json({ 
            reply: fallbackReply,
            mode: 'demo'
        });

    } catch (error: any) {
        console.error('AI Chat Error:', error);
        return NextResponse.json(
            { error: 'Erro interno ao processar sua pergunta.' },
            { status: 500 }
        );
    }
}
