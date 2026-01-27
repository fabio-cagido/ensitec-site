$nomes = @("Miguel", "Arthur", "Gael", "Théo", "Heitor", "Ravi", "Davi", "Bernardo", "Noah", "Gabriel", "Samuel", "Pedro", "Anthony", "Isaac", "Benício", "Benjamin", "Matheus", "Lucas", "Joaquim", "Nicolas", "Helena", "Alice", "Laura", "Maria Alice", "Sophia", "Manuela", "Maitê", "Liz", "Cecília", "Isabella", "Luísa", "Eloá", "Heloísa", "Júlia", "Ayla", "Maria Luísa", "Isis", "Elisa", "Antonella", "Valentina")
$sobrenomes = @("Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa", "Rocha", "Dias", "Nascimento", "Andrade", "Moreira", "Nunes", "Marques", "Machado", "Mendes", "Freitas", "Cardoso", "Ramos", "Gonçalves", "Santana", "Teixeira")
$generos = @("M", "F", "Não-binário")
$turmas = @("1º Ano A", "1º Ano B", "2º Ano A", "3º Ano A")
$status_opts = @("Ativo", "Trancado", "Inadimplente")

$csvContent = "id,nome_completo,data_nascimento,genero,turma,status_matricula,media_global,percentual_presenca,data_ultima_atualizacao"
$csvLines = new-object System.Collections.Generic.List[string]
$csvLines.Add($csvContent)

for ($i = 0; $i -lt 300; $i++) {
    $id = [guid]::NewGuid()
    
    $nome = $nomes | Get-Random
    $sobrenome1 = $sobrenomes | Get-Random
    $sobrenome2 = $sobrenomes | Get-Random
    $nome_completo = "$nome $sobrenome1 $sobrenome2"
    
    # Gênero (pesos aproximados na lógica simples: apenas aleatório aqui, mas nomes tem variação. Simplificando para M/F baseado no nome ou aleatório se neutro, mas vou fazer aleatório simples para agilizar, nomes são mistos na lista)
    $genero = $generos | Get-Random
    
    $turma = $turmas | Get-Random
    
    # Data Nascimento baseada na turma (aproximada para 2026)
    # 1º ano: 14-15 anos (2011-2012)
    # 2º ano: 15-16 anos (2010-2011)
    # 3º ano: 16-18 anos (2008-2010)
    $ano = 2010
    if ($turma -like "1º*") { $ano = (Get-Random -Min 2011 -Max 2013) }
    elseif ($turma -like "2º*") { $ano = (Get-Random -Min 2010 -Max 2012) }
    elseif ($turma -like "3º*") { $ano = (Get-Random -Min 2008 -Max 2011) }
    
    $mes = Get-Random -Min 1 -Max 13
    $dia = Get-Random -Min 1 -Max 28
    $data_nascimento = "$ano-$mes-$dia" # Formato ISO simples
    
    # Status: 10% Inadimplente, 5% Trancado, 85% Ativo
    $roll = Get-Random -Min 1 -Max 101
    if ($roll -le 10) { $status = "Inadimplente" }
    elseif ($roll -le 15) { $status = "Trancado" }
    else { $status = "Ativo" }
    
    # Presença
    $presenca = Get-Random -Min 60 -Max 100
    # Alguns outliers ruins
    if ((Get-Random -Min 1 -Max 20) -eq 1) { $presenca = Get-Random -Min 30 -Max 60 }
    
    # Média Global (correlação com presença)
    $mediaBase = Get-Random -Min 50 -Max 90
    $media = $mediaBase / 10.0
    
    if ($presenca -gt 90) { $media += (Get-Random -Min 0 -Max 15) / 10.0 }
    if ($presenca -lt 70) { $media -= (Get-Random -Min 10 -Max 30) / 10.0 }
    
    # Clamp media 0-10
    if ($media -gt 10) { $media = 10 }
    if ($media -lt 0) { $media = 0 }
    $media = [math]::Round($media, 1) # 1 casa decimal
    
    # Data Atualização (Jan 2026)
    $diaAtualizacao = Get-Random -Min 1 -Max 26
    $data_ultima_atualizacao = "2026-01-$diaAtualizacao"
    
    $line = "$id,$nome_completo,$data_nascimento,$genero,$turma,$status,$media,$presenca,$data_ultima_atualizacao"
    $csvLines.Add($line)
}

$csvLines | Out-File -FilePath "alunos_mock.csv" -Encoding utf8
Write-Host "Arquivo alunos_mock.csv gerado com sucesso."
