$escolas = @(
    @{ Nome = "Escola Ensitec Modelo"; Cidade = "Rio de Janeiro"; Estado = "RJ" }
)

# Configurações
$disciplinas = @("Matemática", "Português", "História", "Física", "Química")
$ano_letivo = 2026
$meses = 1..12

# Dados base
$nomes = @("Arthur", "Miguel", "Heitor", "Gael", "Théo", "Davi", "Gabriel", "Bernardo", "Samuel", "João", "Helena", "Alice", "Laura", "Maria", "Sophia", "Manuela", "Maitê", "Liz", "Cecília", "Isabella")
$sobrenomes = @("Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida")
$turmas = @("1A", "1B", "2A", "2B", "3A")

# Arrays para CSV
$csvEscolas = new-object System.Collections.Generic.List[string]
$csvEscolas.Add("id,nome,cidade,estado")

$csvAlunos = new-object System.Collections.Generic.List[string]
$csvAlunos.Add("id,escola_id,nome_completo,data_nascimento,genero,turma,status_matricula")

$csvDesempenho = new-object System.Collections.Generic.List[string]
$csvDesempenho.Add("id,aluno_id,disciplina,media_final,percentual_presenca,ano_letivo")

$csvFinanceiro = new-object System.Collections.Generic.List[string]
$csvFinanceiro.Add("id,aluno_id,mes_referencia,valor,status_pagamento")

# Gerar Escola Única
$escolaId = [guid]::NewGuid()
$e = $escolas[0]
$csvEscolas.Add("$escolaId,$($e.Nome),$($e.Cidade),$($e.Estado)")

# Gerar 300 Alunos
for ($i = 0; $i -lt 300; $i++) {
    $alunoId = [guid]::NewGuid()
    
    # Dados Pessoais
    $nome = "$($nomes | Get-Random) $($sobrenomes | Get-Random) $($sobrenomes | Get-Random)"
    $genero = if ((Get-Random) % 2 -eq 0) { "M" } else { "F" } 
    if ((Get-Random -Min 0 -Max 100) -ge 98) { $genero = "Outro" } # 2% chance
    
    $anoNasc = Get-Random -Min 2009 -Max 2012
    $dataNasc = "$anoNasc-$((Get-Random -Min 1 -Max 13))-$((Get-Random -Min 1 -Max 28))"
    
    $turma = $turmas | Get-Random
    
    # Status (ponderado)
    $roll = Get-Random -Min 0 -Max 100
    if ($roll -lt 85) { $status = "Ativo" }
    elseif ($roll -lt 95) { $status = "Inadimplente" }
    else { $status = "Evadido" }

    $csvAlunos.Add("$alunoId,$escolaId,$nome,$dataNasc,$genero,$turma,$status")

    # Gerar Desempenho (se não evadido logo no início)
    if ($status -ne "Evadido") {
        foreach ($disc in $disciplinas) {
            $perfId = [guid]::NewGuid()
            # Média e Presença correlacionados
            $media = (Get-Random -Min 40 -Max 95) / 10.0
            $presenca = Get-Random -Min 70 -Max 100
            
            # Ajuste realista: baixa presença -> nota menor
            if ($presenca -lt 80) { $media = $media * 0.8 }
            if ($media -gt 10) { $media = 10 }
            
            # Arredondar
            $media = "{0:N1}" -f $media
            
            $csvDesempenho.Add("$perfId,$alunoId,$disc,$media,$presenca,$ano_letivo")
        }
    }

    # Gerar Financeiro (Mensalidades para Jan/Fev/Mar 2026)
    for ($m = 1; $m -le 3; $m++) {
        $finId = [guid]::NewGuid()
        $mesRef = "2026-00$m-01"
        $mesRef = $mesRef.Replace("-00", "-0")
        $valor = 1200.00
        
        # Status pagto
        if ($status -eq "Inadimplente") {
            $stPagto = if ((Get-Random) % 2 -eq 0) { "Atrasado" } else { "Pendente" }
        }
        else {
            $stPagto = if ((Get-Random -Min 0 -Max 100) -gt 10) { "Pago" } else { "Atrasado" }
        }

        $csvFinanceiro.Add("$finId,$alunoId,$mesRef,$valor,$stPagto")
    }
}

# Salvar Arquivos
$csvEscolas | Out-File "escolas.csv" -Encoding utf8
$csvAlunos | Out-File "alunos.csv" -Encoding utf8
$csvDesempenho | Out-File "desempenho_academico.csv" -Encoding utf8
$csvFinanceiro | Out-File "financeiro.csv" -Encoding utf8

Write-Host "Arquivos CSV gerados: escolas.csv, alunos.csv, desempenho_academico.csv, financeiro.csv"
