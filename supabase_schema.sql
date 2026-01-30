
-- 1. Criação das Tabelas Existentes (Mantidas)
CREATE TABLE IF NOT EXISTS escolas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado CHAR(2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alunos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escola_id UUID REFERENCES escolas(id) ON DELETE CASCADE,
    nome_completo TEXT NOT NULL,
    data_nascimento DATE NOT NULL,
    genero TEXT CHECK (genero IN ('M', 'F', 'Outro')),
    turma TEXT NOT NULL,
    status_matricula TEXT CHECK (status_matricula IN ('Ativo', 'Inadimplente', 'Evadido')),
    cor_raca TEXT CHECK (cor_raca IN ('Branca', 'Preta', 'Parda', 'Amarela', 'Indígena', 'Não declarado')),
    faixa_renda TEXT CHECK (faixa_renda IN ('Até 3 SM', '3-6 SM', '6-10 SM', 'Acima de 10 SM')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS desempenho_academico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    disciplina TEXT NOT NULL,
    media_final NUMERIC(4,2) CHECK (media_final >= 0 AND media_final <= 10),
    percentual_presenca NUMERIC(5,2) CHECK (percentual_presenca >= 0 AND percentual_presenca <= 100),
    ano_letivo INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financeiro_mensalidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    mes_referencia DATE NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    status_pagamento TEXT CHECK (status_pagamento IN ('Pago', 'Pendente', 'Atrasado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Novas Tabelas para Cobertura Total dos Gráficos

-- Tabela: financeiro_despesas
-- Cobre: Gráfico de Distribuição de Despesas (Financeiro) e Custos Operacionais (Operacional - Energia/Manutenção)
CREATE TABLE IF NOT EXISTS financeiro_despesas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria TEXT NOT NULL, -- Ex: 'Pessoal', 'Marketing', 'Energia', 'Manutenção', 'Insumos'
    valor NUMERIC(10,2) NOT NULL,
    data_despesa DATE NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: operacional_chamados
-- Cobre: Gráfico de Performance de Atendimento (Operacional) e KPI 'Manutenção'
CREATE TABLE IF NOT EXISTS operacional_chamados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria TEXT NOT NULL, -- Ex: 'Manutenção', 'TI', 'Limpeza'
    descricao TEXT NOT NULL,
    prioridade TEXT CHECK (prioridade IN ('Baixa', 'Média', 'Alta', 'Crítica')),
    status TEXT CHECK (status IN ('Aberto', 'Em Andamento', 'Resolvido')),
    data_abertura TIMESTAMP WITH TIME ZONE NOT NULL,
    data_resolucao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: metricas_mensais
-- Cobre: KPIs variados que são medições mensais (NPS, SLA Secretaria, Absenteísmo Docente, Uptime TI, etc)
CREATE TABLE IF NOT EXISTS metricas_mensais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mes_referencia DATE NOT NULL,
    tipo_metrica TEXT NOT NULL, -- Ex: 'nps', 'sla_secretaria', 'absenteismo_docentes', 'uptime_ti', 'desperdicio_alimentacao'
    valor NUMERIC(10,2) NOT NULL,
    unidade TEXT, -- Ex: '%', 'dias', 'score'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_alunos_escola_id ON alunos(escola_id);
CREATE INDEX IF NOT EXISTS idx_desempenho_aluno_id ON desempenho_academico(aluno_id);
CREATE INDEX IF NOT EXISTS idx_financeiro_aluno_id ON financeiro_mensalidades(aluno_id);
CREATE INDEX IF NOT EXISTS idx_mes_referencia_despesas ON financeiro_despesas(data_despesa);
CREATE INDEX IF NOT EXISTS idx_metricas_tipo_mes ON metricas_mensais(tipo_metrica, mes_referencia);
