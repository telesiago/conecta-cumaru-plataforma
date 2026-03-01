import { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged, type User as FirebaseAuthUser } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { LaptopMinimal, LogOut, User } from 'lucide-react';
import { auth, db, appId } from './firebase';

// Tipos Atualizados
import type { Turma, Aluno, Quiz, Report } from './types';

// Páginas Importadas
import PublicHome from './pages/PublicHome';
import PublicModule from './pages/PublicModule';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';

export default function App() {
  const [authUser, setAuthUser] = useState<FirebaseAuthUser | null>(null);

  const [view, setView] = useState<'home' | 'module' | 'login' | 'admin' | 'student'>('home');
  const [publicModuleId, setPublicModuleId] = useState<number | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Aluno | null>(null);

  const [classes, setClasses] = useState<Turma[]>([]);
  const [students, setStudents] = useState<Aluno[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]); // Mudou para Quiz[]
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const initAuth = async () => {
      try { await signInAnonymously(auth); } catch (err) { console.error(err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => setAuthUser(user));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authUser) return;
    const getCol = (colName: string) => collection(db, 'artifacts', appId, 'public', 'data', colName);

    const unsubClasses = onSnapshot(getCol('classes'), (snap) => setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Turma))));
    const unsubStudents = onSnapshot(getCol('students'), (snap) => setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() } as Aluno))));
    const unsubQuizzes = onSnapshot(getCol('quizzes'), (snap) => setQuizzes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Quiz)))); // Mudou para Quiz
    const unsubReports = onSnapshot(getCol('reports'), (snap) => setReports(snap.docs.map(d => ({ id: d.id, ...d.data() } as Report))));

    return () => { unsubClasses(); unsubStudents(); unsubQuizzes(); unsubReports(); };
  }, [authUser]);

  const handleLogout = () => { setView('home'); setCurrentStudent(null); };
  const goHome = () => { setView('home'); setPublicModuleId(null); };

  if (!authUser) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Cabeçalho Fixo */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={goHome}>
            <div className="bg-blue-900 text-white p-2 rounded-lg">
              <LaptopMinimal size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-blue-900 leading-tight">Conecta Cumaru</h1>
              <p className="hidden sm:block text-xs text-slate-500 uppercase tracking-wide">Prefeitura Municipal de Cumaru do Norte</p>
            </div>
          </div>

          <nav className="flex gap-2 sm:gap-6 text-sm font-semibold text-slate-600 items-center">
            <button onClick={goHome} className="hidden md:block hover:text-blue-600 transition">Início / Módulos</button>
            {view === 'home' || view === 'module' || view === 'login' ? (
              <button onClick={() => setView('login')} className="bg-slate-800 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full hover:bg-slate-900 transition flex items-center gap-2 shadow-sm">
                <User size={16} /> <span className="hidden sm:inline">Entrar / Login</span><span className="sm:hidden text-xs">Entrar</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="hidden sm:block text-sm font-semibold text-slate-600">
                  Olá, {view === 'admin' ? 'Administrador' : currentStudent?.name?.split(' ')[0]}
                </span>
                <button onClick={handleLogout} className="flex items-center gap-1 sm:gap-2 text-red-600 hover:text-red-800 transition bg-red-50 sm:bg-transparent px-3 py-2 sm:p-0 rounded-full sm:rounded-none">
                  <LogOut size={16} /> <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Troca de Ecrãs (Roteamento Manual) */}
      <main className="flex-1 pb-12">
        {view === 'home' && <PublicHome onSelectModule={(id) => { setPublicModuleId(id); setView('module'); }} />}

        {view === 'module' && publicModuleId && <PublicModule moduleId={publicModuleId} onBack={goHome} onGoToLogin={() => setView('login')} />}

        <div className="container mx-auto px-4 py-8">
          {view === 'login' && <Login setView={setView} setCurrentStudent={setCurrentStudent} classes={classes} students={students} />}
          {view === 'admin' && <AdminDashboard classes={classes} students={students} quizzes={quizzes} reports={reports} />}
          {view === 'student' && currentStudent && <StudentDashboard student={currentStudent} quizzes={quizzes} reports={reports} classes={classes} students={students} />}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-10 text-center mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-3 mb-6">
            <LaptopMinimal size={54} />
            <div className="text-left">
              <h4 className="text-white font-bold text-lg leading-none">Conecta Cumaru</h4>
              <span className="text-xs">Inclusão Digital</span>
            </div>
          </div>
          <p className="mb-2">Prefeitura Municipal de Cumaru do Norte</p>
          <p className="text-sm opacity-60">Desenvolvido por Iago Teles para fins educacionais.</p>
        </div>
      </footer>
    </div>
  );
}