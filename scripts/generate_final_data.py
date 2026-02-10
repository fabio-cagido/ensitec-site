
import csv
import uuid
import random
from datetime import datetime, timedelta, date
from faker import Faker

# Init Faker
fake = Faker('pt_BR')
Faker.seed(42)
random.seed(42)

# Configuration matching App Schema
UNIDADES = ['Centro', 'Sul', 'Norte']
SEGMENTOS = ['Infantil', 'Fundamental I', 'Fundamental II', 'Ensino Médio']
TURMAS = {
    'Infantil': ['G1', 'G2', 'G3'],
    'Fundamental I': ['1A', '1B', '2A', '2B', '3A', '4A', '5A'],
    'Fundamental II': ['6A', '6B', '7A', '7B', '8A', '9A'],
    'Ensino Médio': ['1EM-A', '2EM-A', '3EM-A']
}
DISCIPLINAS = {
    'Infantil': ['Desenv. Cognitivo', 'Socialização'],
    'Fundamental I': ['Português', 'Matemática', 'Ciências', 'História', 'Geografia'],
    'Fundamental II': ['Português', 'Matemática', 'Ciências', 'História', 'Geografia', 'Inglês', 'Ed. Física'],
    'Ensino Médio': ['Português', 'Matemática', 'Física', 'Química', 'Biologia', 'História', 'Sociologia', 'Inglês']
}
COORDS = {
    'Centro': (-23.5505, -46.6333),
    'Sul': (-23.6505, -46.7000),
    'Norte': (-23.4805, -46.6000)
}

TOTAL_ALUNOS = 480
START_DATE = date(2025, 2, 1)
END_DATE = date(2026, 3, 1) # Including current year data
CURRENT_DATE = date(2026, 2, 15)

# Generate Escola ID (We need at least one to link)
ESCOLA_ID = str(uuid.uuid4())
escolas_cnt = [{
    'id': ESCOLA_ID,
    'nome': 'Ensitec School',
    'cidade': 'São Paulo',
    'estado': 'SP'
}]

# Helper para gerar dados acadêmicos realistas
def get_academic_performance(is_studious):
    if is_studious:
        nota = random.uniform(6.0, 10)
        presenca = random.uniform(85, 100)
        entrega = random.uniform(90, 100)
    else:
        nota = random.uniform(2, 7.5)
        presenca = random.uniform(60, 90)
        entrega = random.uniform(40, 85)
    return nota, presenca, entrega

# 1. ALUNOS (Table: alunos)
alunos = []
print("Generating Alunos...")

for _ in range(TOTAL_ALUNOS):
    unidade = random.choice(UNIDADES)
    segmento = random.choice(SEGMENTOS)
    turma = random.choice(TURMAS[segmento])
    
    status_roll = random.random()
    status = 'Ativo'
    dt_evasao = ''
    
    if status_roll < 0.20:
        status = 'Evadido'
        dt_evasao = (START_DATE + timedelta(days=random.randint(30, 300))).isoformat()
    elif status_roll < 0.34:
        status = 'Inadimplente'
        
    lat, lon = COORDS[unidade]
    
    alunos.append({
        'id': str(uuid.uuid4()),
        'escola_id': ESCOLA_ID,
        'nome_completo': fake.name(),
        'data_nascimento': fake.date_of_birth(minimum_age=4, maximum_age=18).isoformat(),
        'genero': random.choice(['M', 'F']),
        'turma': turma,
        'segmento': segmento,
        'unidade': unidade, # Added Unidade
        'status_matricula': status,
        'cor_raca': random.choice(['Branca', 'Parda', 'Preta', 'Amarela', 'Indígena']),
        'faixa_renda': random.choice(['Até 3 SM', '3-6 SM', '6-10 SM', 'Acima de 10 SM']),
        'bolsista': str(random.random() < 0.15).lower(), # Postgres boolean
        'tem_irmaos': str(random.random() < 0.30).lower(),
        'cidade_aluno': 'São Paulo',
        'latitude': lat + random.uniform(-0.02, 0.02),
        'longitude': lon + random.uniform(-0.02, 0.02),
        'data_matricula': (START_DATE - timedelta(days=random.randint(0, 60))).isoformat(),
        'data_evasao': dt_evasao
    })

# 2. DESEMPENHO (Table: desempenho_academico)
desempenho = []
print("Generating Desempenho...")
for aluno in alunos:
    if aluno['status_matricula'] == 'Evadido': continue
    
    is_studious = random.random() > 0.25

    # 2025: 4 Bimestres
    for bim in range(1, 4): 
        for disc in DISCIPLINAS[aluno['segmento']]:
            nota, presenca, entrega = get_academic_performance(is_studious)
            
            desempenho.append({
                'id': str(uuid.uuid4()),
                'aluno_id': aluno['id'],
                'disciplina': disc,
                'media_final': round(nota, 1),
                'percentual_presenca': round(presenca, 1),
                'taxa_entrega_atividades': round(entrega, 1),
                'bimestre': bim,
                'ano_letivo': 2025
            })

    # 2026: 1 Bimestre (only)
    if aluno['status_matricula'] != 'Evadido' or (aluno['data_evasao'] and aluno['data_evasao'] > '2026-02-01'):
         for disc in DISCIPLINAS[aluno['segmento']]:
            nota, presenca, entrega = get_academic_performance(is_studious)
            desempenho.append({
                'id': str(uuid.uuid4()),
                'aluno_id': aluno['id'],
                'disciplina': disc,
                'media_final': round(nota, 1),
                'percentual_presenca': round(presenca, 1),
                'taxa_entrega_atividades': round(entrega, 1),
                'bimestre': 1,
                'ano_letivo': 2026
            })

# 3. FINANCEIRO (Table: financeiro_mensalidades)
mensalidades = []
print("Generating Mensalidades...")
curr = START_DATE
while curr < CURRENT_DATE:
    for aluno in alunos:
        if aluno['data_evasao'] and curr.isoformat() > aluno['data_evasao']: continue
        if aluno['bolsista'] == 'true': continue
        
        status_pg = 'Pago'
        if aluno['status_matricula'] == 'Inadimplente' and random.random() < 0.7:
             status_pg = 'Atrasado'
        if curr.month == 2 and curr.year == 2026: # Current month
             status_pg = 'Pendente'

        mensalidades.append({
            'id': str(uuid.uuid4()),
            'aluno_id': aluno['id'],
            'mes_referencia': curr.replace(day=1).isoformat(),
            'valor': 1500.00,
            'status_pagamento': status_pg
        })
    
    if curr.month == 12: curr = date(curr.year + 1, 1, 1)
    else: curr = date(curr.year, curr.month + 1, 1)

# 3b. DESPESAS OMITTED in original but requested to ensure volume
# Adding simple expense generation to ensure 2026 isn't empty on charts if they use expenses
despesas = []
print("Generating Despesas...")
curr = START_DATE
while curr <= CURRENT_DATE:
    for _ in range(random.randint(10, 20)): # volume
        despesas.append({
             'id': str(uuid.uuid4()),
             'categoria': random.choice(['Pessoal', 'Infraestrutura', 'Tecnologia', 'Marketing', 'Alimentação']),
             'descricao': fake.sentence(nb_words=4),
             'valor': round(random.uniform(100.0, 5000.0), 2),
             'data_despesa': (curr + timedelta(days=random.randint(0, 27))).isoformat(),
             'status': 'Pago'
        })
    
    if curr.month == 12: curr = date(curr.year + 1, 1, 1)
    else: curr = date(curr.year, curr.month + 1, 1)

# 4. OPERACIONAL (Table: operacional_chamados)
chamados = []
print("Generating Chamados...")
for _ in range(200):
    dt_open = fake.date_between(start_date=START_DATE, end_date=CURRENT_DATE)
    chamados.append({
        'id': str(uuid.uuid4()),
        'categoria': random.choice(['Manutenção', 'TI', 'Limpeza', 'Secretaria']),
        'descricao': fake.sentence(),
        'prioridade': random.choice(['Baixa', 'Média', 'Alta']),
        'status': random.choice(['Resolvido', 'Resolvido', 'Aberto']),
        'data_abertura': dt_open.isoformat(),
        'data_resolucao': (dt_open + timedelta(days=random.randint(1, 5))).isoformat()
    })

# 5. METRICAS MENSAIS (Table: metricas_mensais)
metricas = []
print("Generating Metricas (Per Unit)...")
curr = START_DATE
while curr <= CURRENT_DATE:
    mes_str = curr.replace(day=1).isoformat()
    
    for unidade in UNIDADES:
        # Base factor/modifiers per unit
        factor = 1.0
        if unidade == 'Sul': factor = 0.8
        if unidade == 'Norte': factor = 0.6

        # NPS & Health Score
        metricas.append({'id': str(uuid.uuid4()), 'mes_referencia': mes_str, 'unidade_escolar': unidade, 'tipo_metrica': 'nps', 'valor': random.randint(70, 95), 'unidade': 'score'})
        metricas.append({'id': str(uuid.uuid4()), 'mes_referencia': mes_str, 'unidade_escolar': unidade, 'tipo_metrica': 'health_score', 'valor': round(random.uniform(7.5, 9.8), 1), 'unidade': 'score'})
        
        # Resources
        metricas.append({'id': str(uuid.uuid4()), 'mes_referencia': mes_str, 'unidade_escolar': unidade, 'tipo_metrica': 'consumo_energia', 'valor': round(random.uniform(2000, 3000) * factor, 2), 'unidade': 'kwh'})
        metricas.append({'id': str(uuid.uuid4()), 'mes_referencia': mes_str, 'unidade_escolar': unidade, 'tipo_metrica': 'absenteismo_docentes', 'valor': round(random.uniform(1, 4), 1), 'unidade': '%'})
        metricas.append({'id': str(uuid.uuid4()), 'mes_referencia': mes_str, 'unidade_escolar': unidade, 'tipo_metrica': 'taxa_desperdicio', 'valor': round(random.uniform(2, 5), 1), 'unidade': '%'})
        
        # New Food metrics
        refeicoes = int(random.uniform(2500, 4000) * factor)
        custo_unit = round(random.uniform(12.50, 16.00), 2)
        
        metricas.append({'id': str(uuid.uuid4()), 'mes_referencia': mes_str, 'unidade_escolar': unidade, 'tipo_metrica': 'refeicoes_servidas', 'valor': refeicoes, 'unidade': 'qtd'})
        metricas.append({'id': str(uuid.uuid4()), 'mes_referencia': mes_str, 'unidade_escolar': unidade, 'tipo_metrica': 'custo_refeicao', 'valor': custo_unit, 'unidade': 'BRL'})
        
        # Uptime TI (Global or Per unit, putting per unit for consistency)
        metricas.append({'id': str(uuid.uuid4()), 'mes_referencia': mes_str, 'unidade_escolar': unidade, 'tipo_metrica': 'uptime_ti', 'valor': random.choice([99.9, 99.5, 100.0]), 'unidade': '%'})

    if curr.month == 12: curr = date(curr.year + 1, 1, 1)
    else: curr = date(curr.year, curr.month + 1, 1)


# WRITING CSVs
def write_csv(filename, data):
    if not data: return
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
    print(f"Generated {filename} ({len(data)} rows)")

write_csv('escolas.csv', escolas_cnt)
write_csv('alunos.csv', alunos)
write_csv('desempenho_academico.csv', desempenho)
write_csv('financeiro_mensalidades.csv', mensalidades)
write_csv('financeiro_despesas.csv', despesas)
write_csv('operacional_chamados.csv', chamados)
write_csv('metricas_mensais.csv', metricas)
