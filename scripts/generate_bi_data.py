
import csv
import uuid
import random
from datetime import datetime, timedelta, date
from faker import Faker

# Init Faker
fake = Faker('pt_BR')
Faker.seed(42)
random.seed(42)

# Constants
UNIDADES = ['Centro', 'Sul', 'Norte']
SEGMENTOS = ['Infantil', 'Fundamental I', 'Fundamental II', 'Ensino Médio']
TURMAS = {
    'Infantil': ['G1', 'G2', 'G3'],
    'Fundamental I': ['1A', '1B', '2A', '2B', '3A', '4A', '5A'],
    'Fundamental II': ['6A', '6B', '7A', '7B', '8A', '9A'],
    'Ensino Médio': ['1EM-A', '2EM-A', '3EM-A']
}
DISCIPLINAS = {
    'Infantil': ['Desenv. Cognitivo', 'Desenv. Motor', 'Socialização'],
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

# Dates
START_DATE = date(2025, 2, 1)
END_DATE = date(2026, 2, 28)
CURRENT_DATE = date(2026, 2, 15)

# Helper functions
def random_date(start, end):
    days = (end - start).days
    return start + timedelta(days=random.randint(0, days))

def generate_coords(center_lat, center_lon, radius=0.02):
    return (
        center_lat + random.uniform(-radius, radius),
        center_lon + random.uniform(-radius, radius)
    )

# 1. Generate ALUNOS
alunos = []
print("Generating Alunos...")

for _ in range(TOTAL_ALUNOS):
    unidade = random.choice(UNIDADES)
    segmento = random.choice(SEGMENTOS)
    turma = random.choice(TURMAS[segmento])
    
    # Perfil Demographic
    genero = random.choice(['M', 'F'])
    nome = fake.name_male() if genero == 'M' else fake.name_female()
    raca = random.choices(['Branca', 'Parda', 'Preta', 'Amarela', 'Indígena'], weights=[0.4, 0.4, 0.15, 0.04, 0.01])[0]
    renda = random.choices(['Até 3', '3-6', '6-10', 'Acima de 10'], weights=[0.2, 0.4, 0.3, 0.1])[0]
    
    # Matricula logic
    dt_matricula = random_date(date(2024, 11, 1), date(2025, 1, 31))
    
    # Status logic (Evasao 20%, Inadimplente 14%)
    status_roll = random.random()
    status = 'Ativo'
    dt_evasao = ''
    
    if status_roll < 0.20:
        status = 'Evadido'
        # Evasion happens AFTER classes start
        dt_evasao = random_date(START_DATE, CURRENT_DATE).isoformat()
    elif status_roll < 0.34:
        status = 'Inadimplente'
    
    lat, lon = generate_coords(*COORDS[unidade])
    
    alunos.append({
        'id': str(uuid.uuid4()),
        'nome_completo': nome,
        'data_nascimento': fake.date_of_birth(minimum_age=4, maximum_age=18).isoformat(),
        'genero': genero,
        'cor_raca': raca,
        'unidade': unidade,
        'segmento': segmento,
        'turma': turma,
        'status_matricula': status,
        'data_matricula': dt_matricula.isoformat(),
        'data_evasao': dt_evasao,
        'bolsista': random.random() < 0.15,
        'possui_irmaos': random.random() < 0.30,
        'renda_familiar_sm': renda,
        'bairro': fake.bairro(),
        'cidade': 'São Paulo',
        'latitude': lat,
        'longitude': lon
    })

# Write dim_alunos
with open('dim_alunos.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=alunos[0].keys())
    writer.writeheader()
    writer.writerows(alunos)

# 2. Generate ACADEMICO
notas = []
print("Generating Academico...")

for aluno in alunos:
    if aluno['status_matricula'] == 'Evadido':
        active_bimestres = random.randint(1, 2) # Dropout early
    else:
        active_bimestres = 4
        
    grade_profile = 'high' if random.random() > 0.3 else 'low' # 30% bad students
    
    for bim in range(1, active_bimestres + 1):
        year = 2025
        
        for disc in DISCIPLINAS[aluno['segmento']]:
            # Grade logic
            if grade_profile == 'high':
                nota = random.uniform(6.5, 10)
                presenca = random.uniform(75, 100)
                entrega = random.uniform(80, 100)
            else:
                nota = random.uniform(2, 7)
                presenca = random.uniform(50, 80)
                entrega = random.uniform(40, 80)
            
            notas.append({
                'id': str(uuid.uuid4()),
                'aluno_id': aluno['id'],
                'disciplina': disc,
                'bimestre': bim,
                'ano': year,
                'nota_bimestral': round(nota, 2),
                'faltas': int((100 - presenca) / 2), # approx
                'percentual_presenca': round(presenca, 2),
                'taxa_entrega_atividades': round(entrega, 2)
            })

with open('fact_academico.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=notas[0].keys())
    writer.writeheader()
    writer.writerows(notas)

# 3. Generate FINANCEIRO
financeiro = []
print("Generating Financeiro...")

MENSALIDADE_BASE = 1500

for aluno in alunos:
    # Enrollment date check
    dt_mat = datetime.fromisoformat(aluno['data_matricula']).date()
    # Generate months from Feb 2025 to Feb 2026
    current_date_iter = START_DATE
    
    while current_date_iter <= CURRENT_DATE:
        # Check if student was active this month
        if aluno['data_evasao']:
            evasao_dt = datetime.fromisoformat(aluno['data_evasao']).date()
            if current_date_iter > evasao_dt:
                break
        
        # Monthly Fee
        vencimento = current_date_iter.replace(day=10)
        status_pg = 'Pago'
        dt_pg = ''
        
        # Inadimplencia Logic
        is_bad_payer = (aluno['status_matricula'] == 'Inadimplente')
        if is_bad_payer and random.random() < 0.6:
            status_pg = 'Atrasado'
        elif not is_bad_payer and random.random() < 0.05:
             status_pg = 'Atrasado' # Occasional slip
             
        if status_pg == 'Pago':
            # Paid between 1st and 15th
            dt_pg = (vencimento + timedelta(days=random.randint(-5, 5))).isoformat()
            
        financeiro.append({
            'id': str(uuid.uuid4()),
            'aluno_id': aluno['id'],
            'tipo': 'Receita',
            'categoria': 'Mensalidade',
            'valor': MENSALIDADE_BASE if not aluno['bolsista'] else 0,
            'data_vencimento': vencimento.isoformat(),
            'data_pagamento': dt_pg,
            'status': status_pg,
            'mes_referencia': current_date_iter.isoformat(),
            'ano_referencia': current_date_iter.year
        })
        
        # Next month
        if current_date_iter.month == 12:
            current_date_iter = date(current_date_iter.year + 1, 1, 1)
        else:
            current_date_iter = date(current_date_iter.year, current_date_iter.month + 1, 1)

# Generate Expenses
EXPENSES_CATS = ['Energia', 'Água', 'Salários', 'Manutenção', 'Marketing', 'Materiais']
# ~1.8M total expenses vs ~2.5M revenue
current_date_iter = START_DATE
while current_date_iter <= CURRENT_DATE:
    for cat in EXPENSES_CATS:
        val = random.uniform(5000, 50000)
        financeiro.append({
            'id': str(uuid.uuid4()),
            'aluno_id': '',
            'tipo': 'Despesa',
            'categoria': cat,
            'valor': round(val, 2),
            'data_vencimento': current_date_iter.replace(day=20).isoformat(),
            'data_pagamento': current_date_iter.replace(day=20).isoformat(),
            'status': 'Pago',
            'mes_referencia': current_date_iter.isoformat(),
            'ano_referencia': current_date_iter.year
        })
    if current_date_iter.month == 12:
        current_date_iter = date(current_date_iter.year + 1, 1, 1)
    else:
         current_date_iter = date(current_date_iter.year, current_date_iter.month + 1, 1)

with open('fact_financeiro.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=financeiro[0].keys())
    writer.writeheader()
    writer.writerows(financeiro)

# 4. Generate OPERACIONAL TICKETS
tickets = []
print("Generating Tickets...")

# Uniform distribution between Aug 2025 and Jan 2026 (or wider as requested)
ticket_start = date(2025, 2, 1)
total_days = (CURRENT_DATE - ticket_start).days

for _ in range(300): # 300 tickets
    open_dt = ticket_start + timedelta(days=random.randint(0, total_days))
    
    # Resolution SLA (avg 1.8 days)
    sla_days = max(0.1, random.gauss(1.8, 1.0))
    resolve_dt = open_dt + timedelta(days=sla_days)
    
    status = 'Resolvido'
    if resolve_dt > CURRENT_DATE:
        status = 'Aberto'
        resolve_dt_str = ''
    else:
        resolve_dt_str = resolve_dt.isoformat()
        
    tickets.append({
        'id': str(uuid.uuid4()),
        'unidade': random.choice(UNIDADES),
        'setor': random.choice(['TI', 'Manutenção', 'Secretaria', 'Segurança', 'Limpeza']),
        'assunto': 'Solicitação de serviço padrão',
        'prioridade': random.choice(['Baixa', 'Média', 'Alta']),
        'status': status,
        'data_abertura': open_dt.isoformat(),
        'data_resolucao': resolve_dt_str,
        'horas_ate_resolucao': round(sla_days * 24, 2) if status == 'Resolvido' else 0
    })

with open('fact_operacional_tickets.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=tickets[0].keys())
    writer.writeheader()
    writer.writerows(tickets)


# 5. Generate OPERACIONAL CONSUMO (for 2025-2026)
recursos = []
print("Generating Recursos...")

current_date_iter = START_DATE
while current_date_iter <= CURRENT_DATE:
    for unit in UNIDADES:
        base_size = 1.0 if unit == 'Centro' else 0.7
        
        recursos.append({
            'id': str(uuid.uuid4()),
            'unidade': unit,
            'mes_referencia': current_date_iter.isoformat(),
            'custo_impressao': round(random.uniform(500, 1500) * base_size, 2),
            'consumo_energia_kwh': round(random.uniform(2000, 4000) * base_size, 2),
            'consumo_agua_m3': round(random.uniform(100, 300) * base_size, 2),
            'taxa_desperdicio_alimento': round(random.uniform(1, 5), 2),
            'refeicoes_servidas': int(random.uniform(3000, 5000) * base_size),
            'custo_medio_refeicao': round(random.uniform(10, 15), 2),
            'absenteismo_docente': round(random.uniform(0, 5), 2)
        })
    if current_date_iter.month == 12:
        current_date_iter = date(current_date_iter.year + 1, 1, 1)
    else:
         current_date_iter = date(current_date_iter.year, current_date_iter.month + 1, 1)

with open('fact_recursos_consumo.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=recursos[0].keys())
    writer.writeheader()
    writer.writerows(recursos)

# 6. Generate NPS
nps_data = []
print("Generating NPS...")

for aluno in alunos:
    if aluno['status_matricula'] == 'Evadido': continue
    
    # 2 Surveys per year
    dates = [date(2025, 6, 15), date(2025, 11, 15)]
    
    for d in dates:
        score = random.choices([9, 10, 7, 8, 5, 6, 0, 4], weights=[0.4, 0.3, 0.1, 0.1, 0.05, 0.03, 0.01, 0.01])[0]
        # Health score impacted by financial status
        hs_base = 90
        if aluno['status_matricula'] == 'Inadimplente': hs_base -= 30
        
        nps_data.append({
            'id': str(uuid.uuid4()),
            'aluno_id': aluno['id'],
            'data_pesquisa': d.isoformat(),
            'nota_nps': score,
            'health_score_familia': max(0, min(100, int(random.gauss(hs_base, 10)))),
            'comentario': 'Gosto muito da escola' if score > 8 else 'Pode melhorar'
        })

with open('fact_pesquisa_nps.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=nps_data[0].keys())
    writer.writeheader()
    writer.writerows(nps_data)

print("Done! CSV files generated.")
