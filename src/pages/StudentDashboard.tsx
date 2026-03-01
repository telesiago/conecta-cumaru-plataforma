import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { Trophy, Edit, CheckCircle, PlayCircle, XCircle } from 'lucide-react';
import { db, appId } from '../firebase';
import type { Aluno, Quiz, Report, Turma } from '../types';
import { MODULES } from '../constants/modules';
import RankingList from '../components/RankingList';
import QuizPlayer from '../components/QuizPlayer';

interface StudentDashboardProps {
  student: Aluno;
  quizzes: Quiz[];
  reports: Report[];
  classes: Turma[];
  students: Aluno[];
}

// Lista de avatares disponíveis para os alunos escolherem
const AVATARS = [
  '👨‍🎓', '👩‍🎓', '🧑‍💻', '👩‍💻', '🦊', '🐱', '🐶', '🐼',
  '🐯', '🦁', '🐸', '🐵', '🦄', '🦉', '🦋', '🐢',
  '🦖', '🐙', '👾', '🤖', '👽', '👻', '🚀', '🎮'
];

// Função auxiliar para aplicar a máscara do WhatsApp: (DD) 9XXXX-XXXX
const formatWhatsApp = (value: string) => {
  const numbers = value.replace(/\D/g, ''); // Remove tudo que não for número
  if (numbers.length === 0) return '';
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export default function StudentDashboard({ student, quizzes, reports, classes, students }: StudentDashboardProps) {
  // Procura o aluno na lista atualizada em tempo real vinda do Firebase.
  // Se não encontrar (por algum atraso de rede), usa o student inicial do login.
  const liveStudent = students.find(s => s.id === student.id) || student;

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  // Estados do formulário de edição
  const [avatar, setAvatar] = useState(liveStudent.avatar);
  const [number, setNumber] = useState(formatWhatsApp(liveStudent.number || ''));

  // Abre o modal e garante que os campos têm a informação mais recente
  const handleOpenProfile = () => {
    setAvatar(liveStudent.avatar);
    setNumber(formatWhatsApp(liveStudent.number || ''));
    setShowProfile(true);
  };

  const saveProfile = async () => {
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'students', liveStudent.id), { avatar, number });
    setShowProfile(false);
  };

  // Todos os relatórios deste aluno
  const myReports = reports.filter(r => r.studentId === liveStudent.id);

  // Calcula a pontuação total somando apenas a MELHOR NOTA de cada quiz
  const maxScoresPerQuiz: Record<string, number> = {};
  myReports.forEach(r => {
    if (!maxScoresPerQuiz[r.quizId] || r.score > maxScoresPerQuiz[r.quizId]) {
      maxScoresPerQuiz[r.quizId] = r.score;
    }
  });
  const totalScore = Object.values(maxScoresPerQuiz).reduce((acc, score) => acc + score, 0);

  if (activeQuiz) {
    return <QuizPlayer student={liveStudent} quiz={activeQuiz} onBack={() => setActiveQuiz(null)} />;
  }

  return (
    <div className="max-w-5xl mx-auto fade-in">
      {/* Cabeçalho do Aluno (Responsivo e Atualizado em Tempo Real) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6 w-full lg:w-auto">
          <div className="w-24 h-24 flex-shrink-0 bg-slate-100 rounded-full flex items-center justify-center text-5xl shadow-inner border-4 border-white relative">
            {liveStudent.avatar}
            <button onClick={handleOpenProfile} className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 transition">
              <Edit size={14} />
            </button>
          </div>
          <div className="w-full sm:w-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 break-words">{liveStudent.name}</h2>
            <div className="text-slate-500 flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-sm truncate max-w-full">Turma: {classes.find(c => c.id === liveStudent.classId)?.name}</span>
              <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap">WhatsApp: {liveStudent.number}</span>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 px-8 py-4 rounded-xl text-center w-full lg:w-auto flex-shrink-0">
          <p className="text-blue-800 font-bold text-sm uppercase tracking-wider mb-1">Meus Pontos</p>
          <div className="text-4xl font-black text-blue-900 flex items-center justify-center gap-2"><Trophy size={28} className="text-yellow-500" /> {totalScore}</div>
        </div>
      </div>

      {showProfile && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl animate-pop-in">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Editar o seu Perfil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Escolha o seu Avatar</label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100 max-h-48 overflow-y-auto">
                  {AVATARS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      className={`text-2xl p-2 rounded-xl border transition-all flex items-center justify-center ${avatar === emoji ? 'bg-blue-100 border-blue-500 scale-110 shadow-sm z-10' : 'bg-white border-slate-200 hover:bg-slate-100 hover:scale-105'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Número do WhatsApp</label>
                <input
                  type="text"
                  value={number}
                  onChange={e => setNumber(formatWhatsApp(e.target.value))}
                  maxLength={15} // Limita o tamanho para (XX) XXXXX-XXXX
                  placeholder="(DD) 9XXXX-XXXX"
                  className="w-full p-3 border rounded-lg bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowProfile(false)} className="flex-1 p-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition">Cancelar</button>
                <button onClick={saveProfile} className="flex-1 p-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md">Guardar Alterações</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Módulos e Quizzes</h3>
          <div className="grid gap-6">
            {MODULES.map(m => {
              const activeQuizzes = quizzes.filter(q => q.moduleId === m.id && q.isActive);

              return (
                <div key={m.id} className={`text-left p-6 rounded-2xl border bg-white shadow-sm transition-all duration-300 ${m.hoverBorderClass}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl flex flex-shrink-0 items-center justify-center shadow-sm transition-all duration-300 ${m.iconClass}`}>
                      <m.icon size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-slate-800">{m.title}</h4>
                      <p className="text-sm text-slate-500">{activeQuizzes.length} Quizzes disponíveis</p>
                    </div>
                  </div>

                  {/* Lista de Quizzes Ativos neste Módulo */}
                  <div className="space-y-3 mt-6 border-t border-slate-100 pt-4">
                    {activeQuizzes.map(quiz => {
                      const quizReports = myReports.filter(r => r.quizId === quiz.id);
                      const attempts = quizReports.length;
                      const maxScore = attempts > 0 ? Math.max(...quizReports.map(r => r.score)) : 0;
                      const totalQuestions = quiz.questions?.length || 0;
                      const hasAttemptsLeft = attempts < 3;

                      return (
                        <div key={quiz.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition">
                          <span className="font-bold text-slate-700 mb-3 sm:mb-0">
                            {quiz.title} <span className="text-xs font-normal text-slate-500 ml-2">({totalQuestions} perguntas)</span>
                          </span>

                          <div className="flex flex-wrap items-center gap-3">
                            {/* Mostra a melhor nota se já tentou pelo menos uma vez */}
                            {attempts > 0 && (
                              <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                                <CheckCircle size={14} /> Melhor: {maxScore}/{totalQuestions}
                              </span>
                            )}

                            {/* Botão de Iniciar / Refazer / Esgotado */}
                            {hasAttemptsLeft ? (
                              <button onClick={() => setActiveQuiz(quiz)} className="text-sm font-bold bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 flex items-center gap-2 transition shadow-sm">
                                <PlayCircle size={16} />
                                {attempts > 0 ? `Refazer (${attempts}/3)` : 'Iniciar (0/3)'}
                              </button>
                            ) : (
                              <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm cursor-not-allowed" title="Limite máximo de 3 tentativas atingido">
                                <XCircle size={14} /> Esgotado (3/3)
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    {activeQuizzes.length === 0 && <p className="text-sm text-slate-400 italic">Nenhum quiz ativo no momento.</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Trophy className="text-yellow-500" size={20} /> Top Alunos</h3>
            <RankingList reports={reports} students={students} classes={classes} compact={true} />
          </div>
        </div>
      </div>
    </div>
  );
}