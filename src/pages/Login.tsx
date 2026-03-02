import { useState } from 'react';
import { User, ShieldAlert } from 'lucide-react';
import type { Aluno, Turma } from '../types';

interface LoginProps {
  setView: (view: 'home' | 'module' | 'login' | 'admin' | 'student') => void;
  setCurrentStudent: (student: Aluno | null) => void;
  classes: Turma[];
  students: Aluno[];
}

export default function Login({ setView, setCurrentStudent, classes, students }: LoginProps) {
  const [role, setRole] = useState<'student' | 'admin' | null>(null);
  const [adminPass, setAdminPass] = useState('');

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentPass, setStudentPass] = useState('');
  const [error, setError] = useState('');

  // Ordena as turmas respeitando a ordem definida pelo Administrador
  const sortedClasses = [...classes].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === '4dmin$') { // Senha fixa do administrador
      setView('admin');
    } else {
      setError('Senha de administrador incorreta');
    }
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s: Aluno) => s.id === selectedStudent);
    if (student && student.password === studentPass) {
      setCurrentStudent(student);
      setView('student');
    } else {
      setError('Senha incorreta para o aluno selecionado.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 fade-in">
      <div className="bg-blue-900 text-white p-6 text-center">
        <h2 className="text-2xl font-bold">Acesso ao Portal</h2>
        <p className="text-blue-200 text-sm mt-1">Selecione o seu perfil para continuar</p>
      </div>

      <div className="p-6">
        {!role ? (
          <div className="space-y-4">
            <button onClick={() => setRole('student')} className="w-full flex items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-900 p-4 rounded-xl border border-blue-200 transition font-bold">
              <User size={24} /> Sou Aluno
            </button>
            <button onClick={() => setRole('admin')} className="w-full flex items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 text-slate-700 p-4 rounded-xl border border-slate-200 transition font-bold">
              <ShieldAlert size={24} /> Sou Administrador
            </button>
          </div>
        ) : role === 'admin' ? (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <button type="button" onClick={() => { setRole(null); setError(''); }} className="text-sm text-slate-500 hover:text-blue-600 mb-2 block">&larr; Voltar</button>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Senha de Administrador</label>
              <input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Digite a senha..." required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white p-3 rounded-lg font-bold transition">Aceder ao Painel</button>
          </form>
        ) : (
          <form onSubmit={handleStudentLogin} className="space-y-4">
            <button type="button" onClick={() => { setRole(null); setError(''); }} className="text-sm text-slate-500 hover:text-blue-600 mb-2 block">&larr; Voltar</button>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">A sua Turma</label>
              <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSelectedStudent(''); }} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" required>
                <option value="">Selecione a turma...</option>
                {/* Agora usa a variável sortedClasses em vez de classes puro */}
                {sortedClasses.map((c: Turma) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {selectedClass && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">O seu Nome</label>
                <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" required>
                  <option value="">Selecione o seu nome...</option>
                  {/* Dica extra: Podemos ordenar também os alunos alfabeticamente para facilitar a procura! */}
                  {students
                    .filter((s: Aluno) => s.classId === selectedClass)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((s: Aluno) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
              </div>
            )}

            {selectedStudent && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">A sua Senha</label>
                <input type="password" value={studentPass} onChange={(e) => setStudentPass(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Digite a sua senha..." required />
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={!selectedStudent} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white p-3 rounded-lg font-bold transition">Entrar</button>
          </form>
        )}
      </div>
    </div>
  );
}