import { MODULES } from '../constants/modules';

interface PublicHomeProps {
  onSelectModule: (id: number) => void;
}

export default function PublicHome({ onSelectModule }: PublicHomeProps) {
  return (
    <div className="fade-in">
      {/* Secção Hero (Destaque) */}
      <section className="bg-slate-900 py-20 flex items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-90"></div>
        <div className="max-w-3xl text-white relative z-10">
          <span className="bg-blue-500 bg-opacity-30 border border-blue-400 text-blue-100 px-4 py-1 rounded-full text-sm font-semibold mb-4 inline-block backdrop-blur-sm">
            Curso Completo
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Informática Básica</h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 font-light">
            Selecione um módulo abaixo para iniciar os seus estudos, aceder aos resumos e realizar os exercícios práticos.
          </p>
        </div>
      </section>

      {/* Grelha de Módulos */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Módulos do Curso</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MODULES.map(m => (
            <button
              key={m.id}
              onClick={() => onSelectModule(m.id)}
              className={`group text-left bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 ${m.hoverBorderClass}`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${m.iconClass}`}>
                <m.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">{m.id}. {m.title}</h3>
              <p className="text-slate-500 text-sm">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}