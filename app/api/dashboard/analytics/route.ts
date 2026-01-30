import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface MetricData {
    id: string;
    unitId: string;
    unitLabel: string;
    segmentId: string;
    segmentLabel: string;
    classId: string;
    classLabel: string;
    subjectId: string;
    subjectLabel: string;
    year: string;
    value: number;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric');

    try {
        let sql = '';
        let transformRow = (row: any): MetricData => ({
            id: Math.random().toString(36).substr(2, 9),
            unitId: 'unknown', unitLabel: 'Unknown',
            segmentId: 'unknown', segmentLabel: 'Unknown',
            classId: 'all', classLabel: 'Geral',
            subjectId: 'all', subjectLabel: 'Geral',
            year: '2024',
            value: 0
        });

        if (metric === 'total-students') {
            sql = `
                SELECT 
                    e.id as unit_id, e.nome as unit_label,
                    a.segmento,
                    a.turma,
                    COUNT(*) as count
                FROM alunos a
                JOIN escolas e ON a.escola_id = e.id
                GROUP BY e.id, e.nome, a.segmento, a.turma
            `;
            transformRow = (row: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                unitId: row.unit_id,
                unitLabel: row.unit_label,
                segmentId: row.segmento || 'outros',
                segmentLabel: row.segmento || 'Outros',
                classId: row.turma,
                classLabel: row.turma,
                subjectId: 'all',
                subjectLabel: 'Geral',
                year: '2024',
                value: Number(row.count)
            });
        }
        else if (metric === 'scholarships') {
            sql = `
                SELECT 
                    e.id as unit_id, e.nome as unit_label,
                    a.segmento,
                    a.turma,
                    COUNT(*) as count
                FROM alunos a
                JOIN escolas e ON a.escola_id = e.id
                WHERE a.bolsista = true
                GROUP BY e.id, e.nome, a.segmento, a.turma
            `;
            transformRow = (row: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                unitId: row.unit_id,
                unitLabel: row.unit_label,
                segmentId: row.segmento || 'outros',
                segmentLabel: row.segmento || 'Outros',
                classId: row.turma,
                classLabel: row.turma,
                subjectId: 'all',
                subjectLabel: 'Geral',
                year: '2024',
                value: Number(row.count)
            });
        }
        else if (metric === 'siblings') {
            // Percentual de alunos com irmãos por turma/unidade
            // Precisamos do total e do count com irmãos
            sql = `
                SELECT 
                    e.id as unit_id, e.nome as unit_label,
                    a.segmento,
                    a.turma,
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE a.tem_irmaos = true) as with_siblings
                FROM alunos a
                JOIN escolas e ON a.escola_id = e.id
                GROUP BY e.id, e.nome, a.segmento, a.turma
            `;
            transformRow = (row: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                unitId: row.unit_id,
                unitLabel: row.unit_label,
                segmentId: row.segmento || 'outros',
                segmentLabel: row.segmento || 'Outros',
                classId: row.turma,
                classLabel: row.turma,
                subjectId: 'all',
                subjectLabel: 'Geral',
                year: '2024',
                value: row.total > 0 ? (Number(row.with_siblings) / Number(row.total)) * 100 : 0
            });
        }
        else if (metric === 'occupancy') {
            // Taxa de ocupação (Total vs Capacidade 40)
            sql = `
                SELECT 
                    e.id as unit_id, e.nome as unit_label,
                    a.segmento,
                    a.turma,
                    COUNT(*) as count
                FROM alunos a
                JOIN escolas e ON a.escola_id = e.id
                WHERE a.status_matricula = 'Ativo'
                GROUP BY e.id, e.nome, a.segmento, a.turma
            `;
            transformRow = (row: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                unitId: row.unit_id,
                unitLabel: row.unit_label,
                segmentId: row.segmento || 'outros',
                segmentLabel: row.segmento || 'Outros',
                classId: row.turma,
                classLabel: row.turma,
                subjectId: 'all',
                subjectLabel: 'Geral',
                year: '2024',
                value: (Number(row.count) / 40) * 100
            });
        }
        else if (metric === 'grades') {
            sql = `
                SELECT 
                    e.id as unit_id, e.nome as unit_label,
                    a.segmento,
                    a.turma,
                    d.disciplina,
                    AVG(d.media_final) as valor
                FROM desempenho_academico d
                JOIN alunos a ON d.aluno_id = a.id
                JOIN escolas e ON a.escola_id = e.id
                GROUP BY e.id, e.nome, a.segmento, a.turma, d.disciplina
            `;
            transformRow = (row: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                unitId: row.unit_id,
                unitLabel: row.unit_label,
                segmentId: row.segmento || 'outros',
                segmentLabel: row.segmento || 'Outros',
                classId: row.turma,
                classLabel: row.turma,
                subjectId: row.disciplina,
                subjectLabel: row.disciplina,
                year: '2024',
                value: Number(row.valor)
            });
        }
        else if (metric === 'attendance') {
            sql = `
                SELECT 
                    e.id as unit_id, e.nome as unit_label,
                    a.segmento,
                    a.turma,
                    d.disciplina,
                    AVG(d.percentual_presenca) as valor
                FROM desempenho_academico d
                JOIN alunos a ON d.aluno_id = a.id
                JOIN escolas e ON a.escola_id = e.id
                GROUP BY e.id, e.nome, a.segmento, a.turma, d.disciplina
            `;
            transformRow = (row: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                unitId: row.unit_id,
                unitLabel: row.unit_label,
                segmentId: row.segmento || 'outros',
                segmentLabel: row.segmento || 'Outros',
                classId: row.turma,
                classLabel: row.turma,
                subjectId: row.disciplina,
                subjectLabel: row.disciplina,
                year: '2024',
                value: Number(row.valor)
            });
        }
        else if (metric === 'approval') {
            sql = `
                SELECT 
                    e.id as unit_id, e.nome as unit_label,
                    a.segmento,
                    a.turma,
                    d.disciplina,
                    COUNT(*) as total,
                    SUM(CASE WHEN d.media_final >= 6.0 AND d.percentual_presenca >= 75 THEN 1 ELSE 0 END) as aprovados
                FROM desempenho_academico d
                JOIN alunos a ON d.aluno_id = a.id
                JOIN escolas e ON a.escola_id = e.id
                GROUP BY e.id, e.nome, a.segmento, a.turma, d.disciplina
            `;
            transformRow = (row: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                unitId: row.unit_id,
                unitLabel: row.unit_label,
                segmentId: row.segmento || 'outros',
                segmentLabel: row.segmento || 'Outros',
                classId: row.turma,
                classLabel: row.turma,
                subjectId: row.disciplina,
                subjectLabel: row.disciplina,
                year: '2024',
                value: row.total > 0 ? (Number(row.aprovados) / Number(row.total)) * 100 : 0
            });
        }
        else if (metric === 'dropout') {
            sql = `
                SELECT 
                    e.id as unit_id, e.nome as unit_label,
                    a.segmento,
                    a.turma,
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE a.status_matricula = 'Evadido') as evadidos
                FROM alunos a
                JOIN escolas e ON a.escola_id = e.id
                GROUP BY e.id, e.nome, a.segmento, a.turma
            `;
            transformRow = (row: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                unitId: row.unit_id,
                unitLabel: row.unit_label,
                segmentId: row.segmento || 'outros',
                segmentLabel: row.segmento || 'Outros',
                classId: row.turma,
                classLabel: row.turma,
                subjectId: 'all',
                subjectLabel: 'Geral',
                year: '2024',
                value: row.total > 0 ? (Number(row.evadidos) / Number(row.total)) * 100 : 0
            });
        }
        else if (metric === 'nps') {
            sql = `
                SELECT 
                    'u1' as unit_id, 'Geral' as unit_label, -- NPS geralmente é global ou por unidade (simplificado)
                    'all' as segmento,
                    'all' as turma,
                    valor,
                    mes_referencia
                FROM metricas_mensais
                WHERE tipo_metrica = 'nps'
                ORDER BY mes_referencia DESC
                LIMIT 1
            `;
            transformRow = (row: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                unitId: 'all',
                unitLabel: 'Geral',
                segmentId: 'all',
                segmentLabel: 'Geral',
                classId: 'all',
                classLabel: 'Geral',
                subjectId: 'all',
                subjectLabel: 'Geral',
                year: '2024',
                value: Number(row.valor)
            });
        }
        else if (metric === 'health-score') {
            sql = `
                SELECT 
                    'u1' as unit_id, 'Geral' as unit_label,
                    'all' as segmento,
                    'all' as turma,
                    valor,
                    mes_referencia
                FROM metricas_mensais
                WHERE tipo_metrica = 'health_score'
                ORDER BY mes_referencia DESC
                LIMIT 1
            `;
            transformRow = (row: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                unitId: 'all',
                unitLabel: 'Geral',
                segmentId: 'all',
                segmentLabel: 'Geral',
                classId: 'all',
                classLabel: 'Geral',
                subjectId: 'all',
                subjectLabel: 'Geral',
                year: '2024',
                value: Number(row.valor)
            });
        }
        // ... Add more metrics as needed

        if (!sql) {
            return NextResponse.json({ error: 'Metric not supported' }, { status: 400 });
        }

        const result = await query(sql);
        const data: MetricData[] = result.rows.map(transformRow);

        return NextResponse.json(data);

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Analytics API Error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
