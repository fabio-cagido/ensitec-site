-- BI MIGRATION SCHEMA
-- Executar este script no Supabase SQL Editor para preparar o banco para a carga de dados.

-- 1. Atualizar tabela ALUNOS
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS latitude NUMERIC(10,8);
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS longitude NUMERIC(11,8);
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS data_matricula DATE;
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS data_evasao DATE;
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS cep TEXT; -- Adicionado para completude de cadastro
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS renda_familiar_sm TEXT; -- Atualizar para usar este campo se necessario, mas o app usa faixa_renda
-- garantir que colunas usadas no script existam ou sejam mapeadas

-- 2. Garantir existencias das tabelas de fatos (com base no supabase_schema.sql)

CREATE TABLE IF NOT EXISTS financeiro_despesas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria TEXT NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    data_despesa DATE NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS operacional_chamados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria TEXT NOT NULL,
    descricao TEXT NOT NULL,
    prioridade TEXT CHECK (prioridade IN ('Baixa', 'Média', 'Alta', 'Crítica')),
    status TEXT CHECK (status IN ('Aberto', 'Em Andamento', 'Resolvido')),
    data_abertura TIMESTAMP WITH TIME ZONE NOT NULL,
    data_resolucao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS metricas_mensais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mes_referencia DATE NOT NULL,
    tipo_metrica TEXT NOT NULL, 
    valor NUMERIC(10,2) NOT NULL,
    unidade TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_metricas_tipo ON metricas_mensais(tipo_metrica);
CREATE INDEX IF NOT EXISTS idx_chamados_status ON operacional_chamados(status);
