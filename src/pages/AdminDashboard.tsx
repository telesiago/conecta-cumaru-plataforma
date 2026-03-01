import React, { useState, useRef } from 'react';
import { collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Users, User, BookOpen, BarChart3, Trophy, Plus, Trash2, ListChecks, FileJson, Pencil, GripVertical, ShieldAlert, Settings, X, CheckCircle, XCircle } from 'lucide-react';
import { db, appId } from '../firebase';
import type { Turma, Aluno, Quiz, Report, QuizQuestion } from '../types';
import { MODULES } from '../constants/modules';
import RankingList from '../components/RankingList';

interface AdminDashboardProps {
  classes: Turma[];
  students: Aluno[];
  quizzes: Quiz[];
  reports: Report[];
}

export default function AdminDashboard({ classes, students, quizzes, reports }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('alunos');

  const seedDatabase = async () => {
    if (!window.confirm("Isto criará dados de exemplo (turmas, alunos e quizzes). Tem a certeza que deseja continuar?")) return;

    const classRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'classes'), { name: "Turma Manhã - Info Básica", order: 0 });

    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'students'), { name: "João Silva", password: "123", classId: classRef.id, avatar: "👨‍🎓", number: "01" });

    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'quizzes'), {
      moduleId: 1,
      title: "Quiz 1 - Hardware e Sistema",
      isActive: true,
      questions: [
        { question: "Qual é a definição de Hardware?", explanation: "Hardware é a parte física.", options: [{ text: "Programas", isCorrect: false }, { text: "Parte física", isCorrect: true }, { text: "Internet", isCorrect: false }, { text: "Arquivos", isCorrect: false }] },
        { question: "O que é um Software?", explanation: "A parte lógica.", options: [{ text: "Parte Lógica", isCorrect: true }, { text: "Peças internas", isCorrect: false }, { text: "Mesa", isCorrect: false }, { text: "Cabo", isCorrect: false }] }
      ]
    });
    alert("Dados gerados com sucesso!");
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[85vh] flex flex-col lg:flex-row overflow-hidden fade-in">

      {/* Sidebar - Elegante e Responsiva */}
      <div className="w-full lg:w-72 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center lg:block">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-blue-500" size={24} />
            <h2 className="text-xl font-black text-white tracking-wide">Painel Admin</h2>
          </div>
          <button onClick={seedDatabase} className="lg:hidden text-xs bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-lg px-3 py-2 transition font-medium">Auto-Dados</button>
        </div>

        {/* Navegação - Scroll horizontal no mobile, Lista vertical no Desktop */}
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible p-3 lg:p-6 gap-2 no-scrollbar">
          {[
            { id: 'turmas', icon: Users, label: 'Gestão de Turmas' },
            { id: 'alunos', icon: User, label: 'Base de Alunos' },
            { id: 'quizzes', icon: BookOpen, label: 'Exercícios & Quizzes' },
            { id: 'relatorios', icon: BarChart3, label: 'Relatórios de Notas' },
            { id: 'ranking', icon: Trophy, label: 'Ranking Global' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap text-sm font-semibold flex-shrink-0
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20 translate-x-0 lg:translate-x-2'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto hidden lg:block border-t border-slate-800">
          <button onClick={seedDatabase} className="w-full text-sm font-medium bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 rounded-xl p-3 transition-colors flex items-center justify-center gap-2">
            <Settings size={16} /> Gerar Dados Exemplo
          </button>
        </div>
      </div>

      {/* Content Area - Fundo claro para contraste */}
      <div className="flex-1 p-5 md:p-10 overflow-y-auto bg-slate-50/50">
        {activeTab === 'turmas' && <AdminTurmas classes={classes} />}
        {activeTab === 'alunos' && <AdminAlunos students={students} classes={classes} />}
        {activeTab === 'quizzes' && <AdminQuizzes quizzes={quizzes} />}
        {activeTab === 'relatorios' && <AdminReports reports={reports} students={students} classes={classes} />}
        {activeTab === 'ranking' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Trophy className="text-yellow-500" size={24} /> Classificação Geral</h3>
            <RankingList reports={reports} students={students} classes={classes} compact={true} />
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// ADMIN SUB-COMPONENTS
// ==========================================

function AdminTurmas({ classes }: { classes: Turma[] }) {
  const [name, setName] = useState('');

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const sortedClasses = [...classes].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'classes'), {
      name: name.trim(),
      order: classes.length
    });
    setName('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem a certeza? Pode quebrar os dados dos alunos associados.')) {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'classes', id));
    }
  };

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const _classes = [...sortedClasses];
    const draggedItemContent = _classes.splice(dragItem.current, 1)[0];
    _classes.splice(dragOverItem.current, 0, draggedItemContent);

    _classes.forEach((c, index) => {
      if (c.order !== index) {
        updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'classes', c.id), { order: index });
      }
    });

    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-black text-slate-800">Turmas</h3>
        <p className="text-slate-500 mt-1">Crie e gira as turmas ou grupos de estudo. Arraste para reordenar.</p>
      </div>

      <form onSubmit={handleAdd} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row gap-3">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome da nova turma..." className="flex-1 p-3 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm"><Plus size={18} /> Adicionar</button>
      </form>

      <div className="grid gap-3">
        {sortedClasses.map((c, index) => (
          <div
            key={c.id}
            draggable
            onDragStart={() => (dragItem.current = index)}
            onDragEnter={() => (dragOverItem.current = index)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center cursor-grab active:cursor-grabbing hover:border-blue-300 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="text-slate-300 group-hover:text-blue-500 transition-colors"><GripVertical size={20} /></div>
              <span className="font-bold text-slate-700 text-lg">{c.name}</span>
            </div>
            <button onClick={() => handleDelete(c.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Eliminar Turma"><Trash2 size={18} /></button>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="text-center py-12 bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200">
            <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Nenhuma turma registada.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminAlunos({ students, classes }: { students: Aluno[], classes: Turma[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [classId, setClassId] = useState('');

  const sortedClasses = [...classes].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim() || !classId) return;

    if (editingId) {
      // Modo Edição
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'students', editingId), {
        name: name.trim(),
        password: password.trim(),
        classId
      });
      alert("Dados do aluno atualizados com sucesso!");
    } else {
      // Modo Adição
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'students'), {
        name: name.trim(),
        password: password.trim(),
        classId,
        avatar: '👤',
        number: ''
      });
    }
    cancelEditing();
  };

  const startEditing = (s: Aluno) => {
    setEditingId(s.id);
    setName(s.name);
    setPassword(s.password || '');
    setClassId(s.classId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setName('');
    setPassword('');
    setClassId('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem a certeza absoluta? O aluno perderá acesso a todo o histórico.')) {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'students', id));
      if (editingId === id) cancelEditing();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-black text-slate-800">Alunos</h3>
        <p className="text-slate-500 mt-1">Gira o acesso, palavras-passe e registo de estudantes na plataforma.</p>
      </div>

      {/* FORMULÁRIO (Adição / Edição) */}
      <form onSubmit={handleSave} className={`p-5 md:p-6 rounded-2xl shadow-sm border mb-8 transition-colors duration-300 ${editingId ? 'bg-orange-50 border-orange-300' : 'bg-white border-slate-200'}`}>
        <div className="flex justify-between items-center mb-4 border-b border-slate-200/50 pb-3">
          <h4 className={`font-bold flex items-center gap-2 ${editingId ? 'text-orange-800' : 'text-slate-800'}`}>
            {editingId ? <Pencil size={18} /> : <User size={18} className="text-blue-500" />}
            {editingId ? 'A Editar Aluno Existente' : 'Registar Novo Aluno'}
          </h4>
          {editingId && (
            <button type="button" onClick={cancelEditing} className="text-sm font-bold text-slate-500 hover:text-red-500 flex items-center gap-1">
              <X size={16} /> Cancelar Edição
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Nome Completo</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Ana Silva" className="w-full p-3 bg-white focus:ring-2 focus:ring-blue-500 border border-slate-300 rounded-xl outline-none transition-all shadow-sm" required />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Palavra-passe</label>
            <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Acesso..." className="w-full p-3 bg-white focus:ring-2 focus:ring-blue-500 border border-slate-300 rounded-xl outline-none transition-all shadow-sm font-mono" required />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Atribuir à Turma</label>
            <select value={classId} onChange={e => setClassId(e.target.value)} className="w-full p-3 bg-white focus:ring-2 focus:ring-blue-500 border border-slate-300 rounded-xl outline-none transition-all shadow-sm" required>
              <option value="">Selecione...</option>
              {sortedClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className={`w-full text-white p-3 rounded-xl font-bold transition-all shadow-sm h-[50px] ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-800 hover:bg-slate-900'}`}>
              {editingId ? 'Atualizar' : 'Gravar'}
            </button>
          </div>
        </div>
      </form>

      {/* TABELA DE ALUNOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-slate-200">Aluno</th>
                <th className="p-4 font-bold border-b border-slate-200">Turma</th>
                <th className="p-4 font-bold border-b border-slate-200">Palavra-passe</th>
                <th className="p-4 font-bold border-b border-slate-200 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(s => {
                const isEditingThis = editingId === s.id;
                return (
                  <tr key={s.id} className={`transition-colors ${isEditingThis ? 'bg-orange-50/50' : 'hover:bg-slate-50'}`}>
                    <td className="p-4 font-semibold text-slate-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-lg">{s.avatar}</div>
                      {s.name}
                    </td>
                    <td className="p-4 text-sm text-slate-600">{classes.find(c => c.id === s.classId)?.name || <span className="text-red-500 italic">Sem Turma</span>}</td>
                    <td className="p-4"><span className="text-sm font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">{s.password}</span></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEditing(s)} className="text-blue-600 p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Editar Aluno"><Pencil size={18} /></button>
                        <button onClick={() => handleDelete(s.id)} className="text-red-500 p-2 hover:bg-red-100 rounded-lg transition-colors" title="Eliminar Aluno"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {students.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Nenhum aluno registado na plataforma.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminQuizzes({ quizzes }: { quizzes: Quiz[] }) {
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'manual' | 'json'>('manual');

  const [moduleId, setModuleId] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [questionsList, setQuestionsList] = useState<QuizQuestion[]>([]);

  const [question, setQuestion] = useState('');
  const [explanation, setExplanation] = useState('');
  const [opt1, setOpt1] = useState(''); const [opt2, setOpt2] = useState(''); const [opt3, setOpt3] = useState(''); const [opt4, setOpt4] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);

  const [jsonInput, setJsonInput] = useState('');

  const addQuestionToQueue = () => {
    if (!question || !opt1 || !opt2 || !opt3 || !opt4) return alert("Preencha todos os campos da pergunta!");
    const options = [{ text: opt1, isCorrect: correctIdx === 0 }, { text: opt2, isCorrect: correctIdx === 1 }, { text: opt3, isCorrect: correctIdx === 2 }, { text: opt4, isCorrect: correctIdx === 3 }];
    setQuestionsList([...questionsList, { question, options, explanation }]);

    setQuestion(''); setExplanation(''); setOpt1(''); setOpt2(''); setOpt3(''); setOpt4('');
  };

  const handleJsonImport = () => {
    if (!jsonInput.trim()) return alert("Cole o JSON primeiro.");
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error("O formato raiz precisa ser um array (lista).");

      const isValid = parsed.every(q => q.question && Array.isArray(q.options) && q.options.length >= 2);
      if (!isValid) throw new Error("Alguma pergunta não tem o formato correto (precisa de 'question' e 'options').");

      setQuestionsList([...questionsList, ...parsed]);
      setJsonInput('');
      alert(`${parsed.length} perguntas importadas com sucesso!`);
      setInputMode('manual');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Erro ao importar JSON: " + err.message);
      } else {
        alert("Erro desconhecido ao importar JSON.");
      }
    }
  };

  const removeQuestion = (index: number) => {
    setQuestionsList(questionsList.filter((_, i) => i !== index));
  };

  const saveFullQuiz = async () => {
    if (!title || questionsList.length === 0) return alert("Dê um título e adicione pelo menos uma pergunta!");

    if (editingQuizId) {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'quizzes', editingQuizId), {
        moduleId,
        title,
        questions: questionsList
      });
      alert("Quiz atualizado com sucesso!");
    } else {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'quizzes'), {
        moduleId,
        title,
        questions: questionsList,
        isActive: true
      });
      alert("Quiz gravado com sucesso!");
    }

    cancelEditing();
  };

  const startEditing = (quiz: Quiz) => {
    setEditingQuizId(quiz.id);
    setModuleId(quiz.moduleId);
    setTitle(quiz.title);
    setQuestionsList(quiz.questions || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingQuizId(null);
    setModuleId(1);
    setTitle('');
    setQuestionsList([]);
    setQuestion(''); setExplanation(''); setOpt1(''); setOpt2(''); setOpt3(''); setOpt4(''); setCorrectIdx(0);
    setJsonInput('');
  };

  const toggleActive = async (id: string, current: boolean) => await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'quizzes', id), { isActive: !current });
  const handleDelete = async (id: string) => { if (window.confirm('Excluir Quiz Inteiro permanentemente?')) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'quizzes', id)); };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-black text-slate-800">Exercícios & Quizzes</h3>
        <p className="text-slate-500 mt-1">Crie avaliações interativas para os módulos.</p>
      </div>

      {/* CONSTRUTOR DE QUIZ */}
      <div className={`p-6 rounded-2xl shadow-sm border mb-10 transition-colors duration-300 ${editingQuizId ? 'bg-orange-50 border-orange-300' : 'bg-white border-slate-200'}`}>
        <div className="flex justify-between items-center mb-6 border-b border-slate-200/50 pb-4">
          <h4 className={`font-bold text-lg flex items-center gap-2 ${editingQuizId ? 'text-orange-800' : 'text-slate-800'}`}>
            {editingQuizId ? <><Pencil size={20} className="text-orange-600" /> A Editar Quiz Existente</> : <><ListChecks size={20} className="text-blue-600" /> Criar Novo Quiz</>}
          </h4>
          {editingQuizId && <button onClick={cancelEditing} className="text-sm font-bold text-slate-500 hover:text-red-500 flex items-center gap-1"><X size={16} /> Cancelar Edição</button>}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
            <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Pertence ao Módulo</label>
            <select value={moduleId} onChange={e => setModuleId(Number(e.target.value))} className="w-full p-3 border border-slate-300 rounded-xl font-semibold text-blue-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              {MODULES.map(m => <option key={m.id} value={m.id}>{m.id}. {m.title}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Título do Quiz</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Avaliação de Hardware Básico" className="w-full p-3 border border-slate-300 rounded-xl font-semibold bg-white focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 mb-6 shadow-sm">
          <div className="flex border-b border-slate-100 mb-5 gap-4">
            <button onClick={() => setInputMode('manual')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${inputMode === 'manual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Adição Manual</button>
            <button onClick={() => setInputMode('json')} className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-1 ${inputMode === 'json' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}><FileJson size={16} /> Importar JSON</button>
          </div>

          {inputMode === 'manual' ? (
            <div>
              <input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Escreva a pergunta aqui..." className="w-full p-4 border border-slate-300 rounded-xl mb-4 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {[opt1, opt2, opt3, opt4].map((_, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${correctIdx === i ? 'bg-green-50 border-green-400' : 'bg-slate-50 border-slate-200 hover:border-blue-300'}`}>
                    <input type="radio" checked={correctIdx === i} onChange={() => setCorrectIdx(i)} className="w-4 h-4 text-green-600" />
                    <input type="text" value={i === 0 ? opt1 : i === 1 ? opt2 : i === 2 ? opt3 : opt4} onChange={e => { const val = e.target.value; if (i === 0) setOpt1(val); else if (i === 1) setOpt2(val); else if (i === 2) setOpt3(val); else setOpt4(val); }} placeholder={`Opção ${i + 1} ${correctIdx === i ? '(Correta)' : ''}`} className="w-full outline-none bg-transparent font-medium" />
                  </div>
                ))}
              </div>
              <input type="text" value={explanation} onChange={e => setExplanation(e.target.value)} placeholder="Explicação que o aluno verá ao finalizar..." className="w-full p-3 border border-slate-300 rounded-xl mb-4 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm" />
              <button type="button" onClick={addQuestionToQueue} className="w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-sm">
                <Plus size={16} className="inline mr-2" /> Adicionar à Lista de Perguntas
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-500 mb-2 font-medium">Cole um array JSON com as perguntas. Exemplo de formato:</p>
              <pre className="text-xs bg-slate-900 text-green-400 p-4 rounded-xl mb-4 overflow-x-auto shadow-inner">
                {`[
  {
    "question": "O que é Hardware?",
    "explanation": "Parte física.",
    "options": [
      { "text": "Parte lógica", "isCorrect": false },
      { "text": "Parte física", "isCorrect": true }
    ]
  }
]`}
              </pre>
              <textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)} rows={6} className="w-full p-4 border border-slate-300 rounded-xl font-mono text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Colar JSON aqui..."></textarea>
              <button type="button" onClick={handleJsonImport} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-95">
                Importar Perguntas
              </button>
            </div>
          )}
        </div>

        {questionsList.length > 0 && (
          <div className="mb-6 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <h5 className="font-bold text-sm text-blue-900 mb-3 flex items-center justify-between">
              Lista de Perguntas Atual
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">{questionsList.length}</span>
            </h5>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {questionsList.map((q, idx) => (
                <li key={idx} className="text-sm bg-white border border-slate-200 text-slate-700 p-3 rounded-xl flex justify-between items-center shadow-sm">
                  <span className="font-semibold truncate pr-4">{idx + 1}. {q.question}</span>
                  <button onClick={() => removeQuestion(idx)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex-shrink-0"><Trash2 size={16} /></button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="button" onClick={saveFullQuiz} disabled={questionsList.length === 0 || !title} className={`w-full text-white p-4 rounded-xl font-bold text-lg shadow-md transition-all active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed ${editingQuizId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>
          {editingQuizId ? 'Gravar Alterações do Quiz' : 'Finalizar e Guardar Novo Quiz'}
        </button>
      </div>

      {/* LISTAGEM DE QUIZZES GUARDADOS */}
      <h4 className="font-black text-slate-800 text-xl mb-4">Quizzes Gravados no Sistema</h4>
      <div className="space-y-6">
        {MODULES.map(m => {
          const modQuizzes = quizzes.filter(q => q.moduleId === m.id);
          if (modQuizzes.length === 0) return null;
          return (
            <div key={m.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${m.color}`}></div>
                <h5 className="font-bold text-slate-700">Módulo {m.id}: {m.title}</h5>
              </div>
              <div className="divide-y divide-slate-100 p-2">
                {modQuizzes.map(q => (
                  <div key={q.id} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl transition-colors ${!q.isActive ? 'bg-slate-50/80 opacity-60' : 'hover:bg-slate-50'}`}>
                    <div>
                      <p className="font-bold text-slate-800 text-lg">{q.title}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><BookOpen size={12} /> {q.questions?.length || 0} Perguntas adicionadas</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleActive(q.id, q.isActive)} className={`text-xs px-4 py-2 rounded-full font-bold transition-colors mr-2 ${q.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>
                        {q.isActive ? 'Online (Ativo)' : 'Inativo'}
                      </button>
                      <button onClick={() => startEditing(q)} title="Editar Quiz" className="text-blue-600 p-2 hover:bg-blue-100 rounded-lg bg-blue-50 transition-colors"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(q.id)} title="Excluir Quiz" className="text-red-500 p-2 hover:bg-red-100 rounded-lg bg-red-50 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

function AdminReports({ reports, students, classes }: { reports: Report[], students: Aluno[], classes: Turma[] }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-black text-slate-800">Relatórios Recentes</h3>
        <p className="text-slate-500 mt-1">Acompanhe as avaliações e as notas dos alunos em tempo real.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4 font-bold">Data & Hora</th>
                <th className="p-4 font-bold">Aluno</th>
                <th className="p-4 font-bold">Turma</th>
                <th className="p-4 font-bold">Quiz Respondido</th>
                <th className="p-4 font-bold text-right">Nota Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.sort((a, b) => b.date - a.date).map(r => {
                const student = students.find(s => s.id === r.studentId);
                const turma = classes.find(c => c.id === r.classId);
                const percentage = (r.score / r.total) * 100;

                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-500">
                      <div className="font-medium text-slate-700">{new Date(r.date).toLocaleDateString()}</div>
                      <div className="text-xs">{new Date(r.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">{student?.avatar || '👤'}</div>
                      {student?.name || 'Desconhecido'}
                    </td>
                    <td className="p-4 text-slate-600">{turma?.name || '-'}</td>
                    <td className="p-4">
                      <div className="text-xs text-slate-500 mb-0.5">Módulo {r.moduleId}</div>
                      <div className="font-bold text-blue-700">{r.quizTitle}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${percentage >= 70 ? 'bg-green-100 text-green-700' :
                        percentage >= 50 ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {percentage >= 70 ? <CheckCircle size={14} /> : percentage >= 50 ? <BarChart3 size={14} /> : <XCircle size={14} />}
                        {r.score} / {r.total}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <BarChart3 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <p className="font-medium">Nenhum quiz respondido ainda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}