import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { BookOpen, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { db, appId } from '../firebase';
import type { Aluno, Quiz } from '../types';
import { MODULES } from '../constants/modules';

interface QuizPlayerProps {
  student: Aluno;
  quiz: Quiz;
  onBack: () => void;
}

export default function QuizPlayer({ student, quiz, onBack }: QuizPlayerProps) {
  const modInfo = MODULES.find(m => m.id === quiz.moduleId);
  const questions = quiz.questions || [];

  // Guardamos as respostas usando o índice da pergunta (0, 1, 2...) apontando para o índice da opção (0, 1, 2, 3)
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400"><BookOpen size={40} /></div>
        <h3 className="text-2xl font-bold text-slate-700 mb-2">Quiz Vazio</h3>
        <p className="text-slate-500 mb-6">O professor ainda não adicionou perguntas a este quiz.</p>
        <button onClick={onBack} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-900">Voltar</button>
      </div>
    );
  }

  const handleSelect = (qIndex: number, optIndex: number) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && q.options[answers[idx]].isCorrect) score++;
    });
    return score;
  };

  const handleFinish = async () => {
    if (Object.keys(answers).length < questions.length) {
      if (!window.confirm("Ainda não respondeu a todas as perguntas. Deseja finalizar mesmo assim?")) return;
    }

    setSaving(true);
    const score = calculateScore();
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'reports'), {
        studentId: student.id,
        classId: student.classId,
        moduleId: quiz.moduleId,
        quizId: quiz.id,           // NOVO: Liga o resultado ao quiz específico
        quizTitle: quiz.title,     // NOVO: Facilita mostrar o nome no painel do admin
        score,
        total: questions.length,
        date: Date.now()
      });
      setShowResults(true);
    } catch (e) {
      alert("Erro ao gravar o resultado.");
      console.log(e)
    }
    setSaving(false);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="max-w-2xl mx-auto text-center py-16 animate-pop-in">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-40 rounded-full"></div>
            <Trophy className="text-8xl text-yellow-500 relative z-10 drop-shadow-lg" />
          </div>
        </div>
        <h3 className="text-4xl font-extrabold text-slate-800 mb-2">Quiz Concluído!</h3>
        <p className="text-xl text-slate-600 mb-8">
          Acertou <span className="font-black text-blue-900 text-3xl">{score}</span> de <span className="font-black text-slate-800 text-3xl">{questions.length}</span> questões no <br /> <strong>{quiz.title}</strong>
        </p>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 text-left space-y-4">
          <h4 className="font-bold text-lg border-b pb-2">Gabarito:</h4>
          {questions.map((q, i) => {
            const myAnswer = answers[i];
            const isCorrect = myAnswer !== undefined && q.options[myAnswer].isCorrect;
            return (
              <div key={i} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="font-bold text-slate-800 mb-2">{i + 1}. {q.question}</p>
                <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'} font-semibold mb-2 flex items-center gap-1`}>
                  {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  A sua resposta: {myAnswer !== undefined ? q.options[myAnswer].text : 'Não respondeu'}
                </p>
                <p className="text-sm text-slate-600 bg-white p-2 rounded border border-slate-100 italic">💡 {q.explanation}</p>
              </div>
            )
          })}
        </div>
        <button onClick={onBack} className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg text-lg">
          Voltar ao Painel
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 bg-white p-2 rounded-full shadow-sm"><XCircle size={24} /></button>
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{quiz.title}</h2>
          <p className="text-slate-500">Módulo {modInfo?.id}: {modInfo?.title} • {questions.length} Questões</p>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-start gap-4 mb-6">
              <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-lg text-sm flex-shrink-0">#{index + 1}</span>
              <h3 className="text-xl font-bold text-slate-800">{q.question}</h3>
            </div>
            <div className="space-y-3">
              {q.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(index, optIdx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center group ${answers[index] === optIdx ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-slate-50 hover:border-blue-300 hover:bg-white'}`}
                >
                  <div className={`w-6 h-6 flex-shrink-0 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${answers[index] === optIdx ? 'border-blue-500' : 'border-slate-300 group-hover:border-blue-400'}`}>
                    {answers[index] === optIdx && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                  </div>
                  <span className={`font-medium ${answers[index] === optIdx ? 'text-blue-900' : 'text-slate-700'}`}>{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center sticky bottom-6 z-10">
        <button
          onClick={handleFinish}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-4 px-12 rounded-full shadow-xl transition-all hover:scale-105 text-lg flex items-center gap-2 mx-auto"
        >
          {saving ? 'A gravar...' : 'Finalizar Quiz'} <CheckCircle size={20} />
        </button>
      </div>
    </div>
  );
}