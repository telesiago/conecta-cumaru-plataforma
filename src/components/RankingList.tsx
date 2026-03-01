import { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import type { Report, Aluno, Turma } from '../types';

interface RankingListProps {
  reports: Report[];
  students: Aluno[];
  classes: Turma[];
  compact?: boolean;
}

export default function RankingList({ reports, students, classes, compact = false }: RankingListProps) {
  const ranking = useMemo(() => {
    // Armazena temporariamente os dados do aluno e a maior nota que ele tirou em cada quiz
    const studentData: Record<string, { student: Aluno, maxScores: Record<string, number>, uniqueQuizzes: Set<string> }> = {};

    reports.forEach(r => {
      // 1. Regista o aluno se ainda não existir
      if (!studentData[r.studentId]) {
        const student = students.find(s => s.id === r.studentId);
        if (!student) return;
        studentData[r.studentId] = { student, maxScores: {}, uniqueQuizzes: new Set() };
      }

      // 2. Compara a nota atual com a nota mais alta já registada para este quiz específico
      const currentMax = studentData[r.studentId].maxScores[r.quizId] || 0;
      if (r.score > currentMax) {
        studentData[r.studentId].maxScores[r.quizId] = r.score;
      }

      // Regista que o aluno concluiu este quiz
      studentData[r.studentId].uniqueQuizzes.add(r.quizId);
    });

    // 3. Calcula a pontuação final (soma das melhores notas) e ordena o ranking
    const finalScores = Object.values(studentData).map(data => {
      const totalScore = Object.values(data.maxScores).reduce((acc, val) => acc + val, 0);
      return {
        student: data.student,
        score: totalScore,
        quizzes: data.uniqueQuizzes.size
      };
    });

    return finalScores.sort((a, b) => b.score - a.score);
  }, [reports, students]);

  return (
    <div className={compact ? "" : "bg-white p-6 rounded-xl shadow-sm border border-slate-200"}>
      {!compact && (
        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2 flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Ranking Geral de Alunos
        </h3>
      )}
      <div className="space-y-3">
        {ranking.map((r, i) => {
          const tName = classes.find(c => c.id === r.student.classId)?.name || '';
          return (
            <div key={r.student.id} className={`flex items-center justify-between p-4 rounded-lg border ${i === 0 ? 'bg-yellow-50 border-yellow-200' : i === 1 ? 'bg-slate-100 border-slate-300' : i === 2 ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-slate-400 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {i + 1}º
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    {r.student.avatar} {r.student.name}
                  </div>
                  <div className="text-xs text-slate-500">{tName} • {r.quizzes} {r.quizzes === 1 ? 'quiz respondido' : 'quizzes respondidos'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-blue-900">{r.score} <span className="text-sm font-normal text-slate-500">pts</span></div>
              </div>
            </div>
          )
        })}
        {ranking.length === 0 && <p className="text-slate-500 text-center py-4">Nenhum ponto registrado.</p>}
      </div>
    </div>
  );
}