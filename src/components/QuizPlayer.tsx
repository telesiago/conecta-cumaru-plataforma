import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  BookOpen,
} from "lucide-react";
import { db, appId } from "../firebase";
import type { Aluno, Quiz, WrongAnswer } from "../types";

interface QuizPlayerProps {
  student: Aluno;
  quiz: Quiz;
  onBack: () => void;
}

export default function QuizPlayer({ student, quiz, onBack }: QuizPlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const question = quiz.questions[currentIdx];
  const isLast = currentIdx === quiz.questions.length - 1;

  const handleSelect = (optIdx: number) => {
    if (!isAnswered) {
      setAnswers({ ...answers, [currentIdx]: optIdx });
    }
  };

  const handleConfirmAnswer = () => {
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (isLast) {
      finishQuiz();
    } else {
      setIsAnswered(false);
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const finishQuiz = async () => {
    setIsSaving(true);
    let finalScore = 0;
    const wrongAnswers: WrongAnswer[] = [];

    quiz.questions.forEach((q, i) => {
      const selectedIdx = answers[i];
      const correctIdx = q.options.findIndex((o) => o.isCorrect);

      if (selectedIdx === correctIdx) {
        finalScore++;
      } else {
        // Guarda os detalhes da questão que o aluno errou
        wrongAnswers.push({
          question: q.question,
          studentAnswer:
            selectedIdx !== undefined
              ? q.options[selectedIdx].text
              : "Não respondeu",
          correctAnswer: q.options[correctIdx]?.text || "Desconhecida",
        });
      }
    });

    setScore(finalScore);

    try {
      await addDoc(
        collection(db, "artifacts", appId, "public", "data", "reports"),
        {
          studentId: student.id,
          classId: student.classId,
          moduleId: quiz.moduleId,
          quizId: quiz.id,
          quizTitle: quiz.title,
          score: finalScore,
          total: quiz.questions.length,
          date: Date.now(),
          wrongAnswers, // Envia os erros para o Firebase
        },
      );
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
    }

    setIsSaving(false);
    setIsFinished(true);
  };

  if (isFinished) {
    const percentage = (score / quiz.questions.length) * 100;
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center animate-in fade-in zoom-in duration-500">
        <Trophy
          size={64}
          className={`mx-auto mb-6 ${percentage >= 70 ? "text-yellow-500" : percentage >= 50 ? "text-orange-500" : "text-red-500"}`}
        />
        <h2 className="text-3xl font-black text-slate-800 mb-2">
          Quiz Concluído!
        </h2>
        <p className="text-slate-500 mb-8">
          Você acertou {score} de {quiz.questions.length} perguntas.
        </p>
        <button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-transform active:scale-95 shadow-md"
        >
          Voltar ao Painel
        </button>
      </div>
    );
  }

  const selectedOptIdx = answers[currentIdx];

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-bold transition-colors"
      >
        <ArrowLeft size={20} /> Voltar sem salvar
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center">
          <h3 className="font-bold text-slate-700">{quiz.title}</h3>
          <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">
            Pergunta {currentIdx + 1} de {quiz.questions.length}
          </span>
        </div>

        <div className="p-6 md:p-10">
          <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
            {question.question}
          </h4>

          <div className="space-y-3 mb-8">
            {question.options.map((opt, i) => {
              let btnClass =
                "border-slate-200 hover:border-blue-300 hover:bg-slate-50";
              let iconClass = "border-slate-300";

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnClass = "border-green-500 bg-green-50";
                  iconClass = "border-green-500 bg-green-500";
                } else if (selectedOptIdx === i) {
                  btnClass = "border-red-500 bg-red-50";
                  iconClass = "border-red-500 bg-red-500";
                } else {
                  btnClass = "border-slate-100 opacity-50";
                }
              } else if (selectedOptIdx === i) {
                btnClass = "border-blue-500 bg-blue-50";
                iconClass = "border-blue-500";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${btnClass}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${iconClass}`}
                  >
                    {!isAnswered && selectedOptIdx === i && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    )}
                    {isAnswered && opt.isCorrect && (
                      <CheckCircle size={16} className="text-white" />
                    )}
                    {isAnswered && !opt.isCorrect && selectedOptIdx === i && (
                      <XCircle size={16} className="text-white" />
                    )}
                  </div>
                  <span
                    className={`font-medium ${selectedOptIdx === i ? "text-slate-900" : "text-slate-700"}`}
                  >
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {isAnswered && question.explanation && (
            <div className="mb-8 p-5 bg-blue-50 border border-blue-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <h5 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
                <BookOpen size={18} /> Explicação
              </h5>
              <p className="text-blue-800 text-sm leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}

          <div className="flex justify-end">
            {!isAnswered ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOptIdx === undefined}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                Confirmar Resposta
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={isSaving}
                className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                {isSaving
                  ? "A Salvar..."
                  : isLast
                    ? "Finalizar Quiz"
                    : "Próxima Pergunta"}
                {!isSaving && !isLast && <ArrowRight size={20} />}
                {!isSaving && isLast && <CheckCircle size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
