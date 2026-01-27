-- 1. Criação das Tabelas

-- Tabela: escolas
CREATE TABLE IF NOT EXISTS escolas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado CHAR(2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: alunos
CREATE TABLE IF NOT EXISTS alunos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escola_id UUID REFERENCES escolas(id) ON DELETE CASCADE,
    nome_completo TEXT NOT NULL,
    data_nascimento DATE NOT NULL,
    genero TEXT CHECK (genero IN ('M', 'F', 'Outro')),
    turma TEXT NOT NULL,
    status_matricula TEXT CHECK (status_matricula IN ('Ativo', 'Inadimplente', 'Evadido')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: desempenho_academico
CREATE TABLE IF NOT EXISTS desempenho_academico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    disciplina TEXT NOT NULL,
    media_final NUMERIC(4,2) CHECK (media_final >= 0 AND media_final <= 10),
    percentual_presenca NUMERIC(5,2) CHECK (percentual_presenca >= 0 AND percentual_presenca <= 100),
    ano_letivo INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: financeiro_mensalidades
CREATE TABLE IF NOT EXISTS financeiro_mensalidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
    mes_referencia DATE NOT NULL, -- Ex: 2026-01-01 para representar Janeiro/26
    valor NUMERIC(10,2) NOT NULL,
    status_pagamento TEXT CHECK (status_pagamento IN ('Pago', 'Pendente', 'Atrasado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_alunos_escola_id ON alunos(escola_id);
CREATE INDEX IF NOT EXISTS idx_desempenho_aluno_id ON desempenho_academico(aluno_id);
CREATE INDEX IF NOT EXISTS idx_financeiro_aluno_id ON financeiro_mensalidades(aluno_id);
