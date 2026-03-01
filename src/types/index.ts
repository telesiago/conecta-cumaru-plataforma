export interface Turma {
  id: string;
  name: string;
  order?: number; // <-- Nova propriedade para guardar a posição
}

export interface Aluno {
  id: string;
  name: string;
  password?: string;
  classId: string;
  avatar: string;
  number: string;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface Quiz {
  id: string;
  moduleId: number;
  title: string;
  isActive: boolean;
  questions: QuizQuestion[];
}

export interface Report {
  id: string;
  studentId: string;
  classId: string;
  moduleId: number;
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  date: number;
}