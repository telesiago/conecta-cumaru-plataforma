import { MODULES } from '../constants/modules';

interface PublicModuleProps {
  moduleId: number;
  onBack: () => void;
  onGoToLogin: () => void;
}

export default function PublicModule({ moduleId, onBack, onGoToLogin }: PublicModuleProps) {
  const modInfo = MODULES.find(m => m.id === moduleId);

  if (!modInfo) return null;

  return (
    <div className="fade-in">
      {/* Faixa de Cabeçalho (Banner) */}
      <div className={`${modInfo.color} text-white py-12 px-4 shadow-inner`}>
        <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <button onClick={onBack} className="text-blue-200 hover:text-white text-sm font-bold mb-4 flex items-center gap-2 transition">
              &larr; Voltar aos Módulos
            </button>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{modInfo.title}</h1>
            <p className="text-white opacity-90">{modInfo.desc}</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            {modInfo.link && (
              <a href={modInfo.link} target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-bold transition shadow-sm border border-white/30 inline-flex items-center gap-2 backdrop-blur-sm">
                <i className="fa-solid fa-download"></i> Baixar Material
              </a>
            )}
            <button onClick={onGoToLogin} className="bg-white text-slate-800 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition shadow-lg inline-flex items-center gap-2">
              <i className="fa-solid fa-pen-to-square"></i> Fazer Exercícios
            </button>
          </div>
        </div>
      </div>

      {/* Área de Conteúdo Estático */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <ModuleStaticContent moduleId={moduleId} />
      </main>

      {/* Chamada para Ação (Rodapé) */}
      <div className="bg-slate-100 border-t border-slate-200 py-12 text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Pronto para testar os seus conhecimentos?</h3>
        <button onClick={onGoToLogin} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          Aceder ao Quiz do Módulo
        </button>
      </div>
    </div>
  );
}

// Componente helper interno que contém o HTML de resumo de cada módulo
function ModuleStaticContent({ moduleId }: { moduleId: number }) {
  switch (moduleId) {
    case 1:
      return (
        <div>
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-2">A Estrutura do Computador</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border-l-4 border-slate-600 shadow-sm hover:shadow-md transition">
                <h3 className="font-bold text-lg mb-2"><i className="fa-solid fa-microchip mr-2 text-slate-600"></i>Hardware</h3>
                <p className="text-slate-600">É a parte física do computador, os equipamentos e as peças reais que podemos tocar. Inclui tanto as partes externas quanto as internas da máquina.</p>
                <ul className="mt-3 text-sm text-slate-500 list-disc list-inside">
                  <li>Teclado, Rato (Mouse), Monitor</li>
                  <li>Gabinete, Placa-mãe, Discos</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm hover:shadow-md transition">
                <h3 className="font-bold text-lg mb-2"><i className="fa-brands fa-windows mr-2 text-blue-500"></i>Software</h3>
                <p className="text-slate-600">É a parte lógica. Trata-se do conjunto de instruções, programas e aplicativos que dizem ao hardware o que ele deve fazer.</p>
                <ul className="mt-3 text-sm text-slate-500 list-disc list-inside">
                  <li>Sistema Operativo (Windows 10)</li>
                  <li>Aplicações (Word, Excel, Google Chrome)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12 bg-slate-100 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Componentes Internos Principais</h2>
            <div className="space-y-6 text-slate-700">
              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                <i className="fa-solid fa-brain text-3xl text-purple-600 mt-1"></i>
                <div>
                  <strong className="text-lg">Processador (CPU)</strong>
                  <p className="text-sm mt-1">Considerado o cérebro da máquina. É a peça responsável por realizar todos os cálculos, processar dados e executar os programas.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                <i className="fa-solid fa-memory text-3xl text-green-600 mt-1"></i>
                <div>
                  <strong className="text-lg">Memória RAM</strong>
                  <p className="text-sm mt-1">Memória de trabalho temporária e muito rápida. Guarda os ficheiros e programas que estão a ser usados *no momento*. É apagada quando o computador é desligado.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                <i className="fa-solid fa-hard-drive text-3xl text-slate-600 mt-1"></i>
                <div>
                  <strong className="text-lg">Disco Rígido (HD) / SSD</strong>
                  <p className="text-sm mt-1">É a unidade de armazenamento permanente. Guarda os seus documentos, fotos, músicas e o próprio Windows de forma definitiva, mesmo sem energia.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-2">O Windows e a Organização de Ficheiros</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-6">
              <h3 className="font-bold text-xl mb-4 text-blue-800"><i className="fa-solid fa-folder-tree mr-2"></i>O Explorador de Ficheiros (Arquivos)</h3>
              <p className="mb-6 text-slate-600">O Explorador de Ficheiros é o programa nativo do Windows onde gerimos todos os nossos dados. A organização baseia-se em <strong>Pastas</strong>, que funcionam como gavetas de um armário virtual.</p>

              <h4 className="font-bold text-slate-700 mb-3">Principais Pastas do Sistema:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <i className="fa-solid fa-desktop text-blue-500 mb-2 text-xl"></i>
                  <strong className="block">Área de Trabalho (Desktop)</strong>
                  <span className="text-sm text-slate-500">O ecrã inicial. É, na verdade, uma pasta que guarda os ícones e atalhos visíveis logo que liga o PC.</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <i className="fa-solid fa-download text-green-500 mb-2 text-xl"></i>
                  <strong className="block">Transferências (Downloads)</strong>
                  <span className="text-sm text-slate-500">Local onde são guardados automaticamente os ficheiros e programas descarregados da internet.</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <i className="fa-solid fa-file-lines text-orange-500 mb-2 text-xl"></i>
                  <strong className="block">Documentos</strong>
                  <span className="text-sm text-slate-500">A pasta padrão para guardar trabalhos, textos e relatórios pessoais.</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <i className="fa-solid fa-hard-drive text-slate-700 mb-2 text-xl"></i>
                  <strong className="block">Este Computador</strong>
                  <span className="text-sm text-slate-500">Acesso principal aos discos rígidos (C:), Pens USB e Leitores de CD/DVD conectados à máquina.</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 text-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-4 text-center text-slate-300">Atalhos Essenciais de Teclado</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-slate-700 rounded"><span className="block font-bold text-blue-300">CTRL + C</span> Copiar</div>
                <div className="p-3 bg-slate-700 rounded"><span className="block font-bold text-blue-300">CTRL + V</span> Colar</div>
                <div className="p-3 bg-slate-700 rounded"><span className="block font-bold text-blue-300">CTRL + X</span> Recortar</div>
                <div className="p-3 bg-slate-700 rounded"><span className="block font-bold text-red-300">DELETE</span> Apagar</div>
              </div>
            </div>
          </div>
        </div>
      );
    case 2:
      return (
        <div>
          <div className="mb-12 text-center">
            <i className="fa-solid fa-hands text-6xl text-teal-600 mb-4"></i>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">A Arte de Digitar Eficientemente</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">Aprender a digitar corretamente não é apenas uma questão de velocidade, mas sim de ergonomia e saúde. Digitar sem olhar para as teclas poupa tempo, melhora a concentração e evita dores musculares no pescoço e costas.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-teal-500">
              <h3 className="text-xl font-bold mb-4"><i className="fa-solid fa-chair mr-2 text-teal-600"></i>A Postura Correta</h3>
              <ul className="space-y-4 text-slate-600 mt-6">
                <li className="flex gap-3"><i className="fa-solid fa-check-circle text-green-500 mt-1"></i> <span>Mantenha as <strong>costas retas</strong> e totalmente apoiadas no encosto da cadeira.</span></li>
                <li className="flex gap-3"><i className="fa-solid fa-check-circle text-green-500 mt-1"></i> <span>As plantas dos <strong>pés devem estar apoiadas no chão</strong> (ou num descanso apropriado).</span></li>
                <li className="flex gap-3"><i className="fa-solid fa-check-circle text-green-500 mt-1"></i> <span>O <strong>monitor deve estar à altura dos olhos</strong>, evitando que dobre o pescoço para baixo.</span></li>
                <li className="flex gap-3"><i className="fa-solid fa-check-circle text-green-500 mt-1"></i> <span>Mantenha os <strong>pulsos relaxados e retos</strong>. Não os apoie dobrados na borda da mesa.</span></li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-teal-500">
              <h3 className="text-xl font-bold mb-4"><i className="fa-regular fa-keyboard mr-2 text-teal-600"></i>As Teclas Guias</h3>
              <p className="mb-4 text-slate-600">O segredo da digitação é a posição de descanso. As suas mãos devem repousar na linha central do teclado alfanumérico.</p>

              <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg mb-4 text-sm text-teal-800">
                <strong>Dica Tátil:</strong> Repare que as teclas <strong>F</strong> e <strong>J</strong> têm um pequeno relevo (um tracinho). Servem para que os seus dedos indicadores encontrem a posição inicial sem precisar de olhar para o teclado!
              </div>

              <div className="flex justify-between gap-4">
                <div className="bg-slate-100 p-4 rounded text-center w-1/2 border border-slate-200">
                  <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Mão Esquerda</span>
                  <span className="font-mono font-bold tracking-widest text-xl text-slate-700">A S D F</span>
                </div>
                <div className="bg-slate-100 p-4 rounded text-center w-1/2 border border-slate-200">
                  <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Mão Direita</span>
                  <span className="font-mono font-bold tracking-widest text-xl text-slate-700">J K L Ç</span>
                </div>
              </div>
              <p className="text-center text-sm text-slate-500 mt-4">Os dois polegares descansam sobre a Barra de Espaços.</p>
            </div>
          </div>
        </div>
      );
    case 3:
      return (
        <div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
            <h3 className="text-2xl font-bold mb-4 text-slate-800"><i className="fa-solid fa-window-maximize mr-2 text-blue-600"></i>O Ambiente de Trabalho do Word</h3>
            <p className="text-slate-600 mb-6">Para dominar o Word, é vital conhecer a sua interface principal:</p>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4 py-2">
                <h4 className="font-bold text-slate-700">Faixa de Opções (Ribbon)</h4>
                <p className="text-sm text-slate-600">É a barra superior principal que concentra todos os comandos, divididos em abas como <em>Base (Início)</em>, <em>Inserir</em>, <em>Estrutura (Design)</em> e <em>Esquema (Layout)</em>.</p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4 py-2">
                <h4 className="font-bold text-slate-700">Barra de Estado</h4>
                <p className="text-sm text-slate-600">Localizada no rodapé inferior. Mostra informações vitais como a quantidade de páginas do documento, contagem de palavras, o idioma de correção e os controlos de Zoom.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
            <h3 className="text-xl font-bold mb-6 border-b pb-2">Formatação e Estilização de Texto</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center bg-slate-50 p-4 rounded-lg">
                <div className="font-serif font-black text-3xl mb-2 text-slate-800">N</div>
                <h4 className="font-bold">Negrito</h4>
                <p className="text-xs text-slate-500 mt-2">Engrossa o traço da fonte para dar destaque a títulos e palavras centrais. (CTRL + N)</p>
              </div>
              <div className="text-center bg-slate-50 p-4 rounded-lg">
                <div className="font-serif italic text-3xl mb-2 text-slate-800">I</div>
                <h4 className="font-bold">Itálico</h4>
                <p className="text-xs text-slate-500 mt-2">Inclina a letra levemente para a direita. Ideal para citações ou palavras em língua estrangeira. (CTRL + I)</p>
              </div>
              <div className="text-center bg-slate-50 p-4 rounded-lg">
                <div className="font-serif underline text-3xl mb-2 text-slate-800">S</div>
                <h4 className="font-bold">Sublinhado</h4>
                <p className="text-xs text-slate-500 mt-2">Traça uma linha debaixo da palavra para chamar a atenção do leitor. (CTRL + S)</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border border-slate-100 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-2"><i className="fa-solid fa-align-justify mr-2"></i>Alinhamento</h4>
                <p className="text-slate-600 text-sm">Os parágrafos podem ser alinhados à Esquerda, ao Centro, à Direita ou <strong>Justificados</strong>.</p>
              </div>
              <div className="p-6 border border-slate-100 rounded-lg bg-blue-50">
                <h4 className="font-bold text-blue-900 mb-2"><i className="fa-solid fa-floppy-disk mr-2"></i>Boas Práticas: Guardar!</h4>
                <p className="text-slate-600 text-sm">O maior erro é escrever um texto longo e não o guardar. Guarde logo de início (CTRL + G) para evitar perdas de trabalho.</p>
              </div>
            </div>
          </div>
        </div>
      );
    case 4:
      return (
        <div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-8">
            <h3 className="text-xl font-bold mb-6 border-b pb-2"><i className="fa-solid fa-border-all mr-2 text-green-600"></i>A Estrutura da Planilha</h3>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 text-center w-full">
                <table className="w-full border-collapse bg-slate-50 text-sm shadow-sm rounded overflow-hidden">
                  <tbody>
                    <tr><td className="border bg-slate-200 p-2"></td><td className="border bg-slate-200 p-2 font-bold text-center">A (Coluna)</td><td className="border bg-slate-200 p-2 font-bold text-center">B</td></tr>
                    <tr><td className="border bg-slate-200 p-2 font-bold text-center">1 (Linha)</td><td className="border p-3 bg-green-100 text-green-800 font-bold text-center">Célula A1</td><td className="border p-3 text-center">B1</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="md:w-2/3">
                <ul className="space-y-3 text-slate-600">
                  <li><strong>Colunas:</strong> Organizadas verticalmente e identificadas por <em>Letras</em> (A, B, C...).</li>
                  <li><strong>Linhas:</strong> Organizadas horizontalmente e identificadas por <em>Números</em> (1, 2, 3...).</li>
                  <li><strong>Célula:</strong> É a unidade básica do Excel. Ponto de cruzamento (Ex: A1).</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-green-400 mb-4"><i className="fa-solid fa-calculator mr-2"></i>Fórmulas Essenciais</h3>
              <p className="mb-4 text-sm text-slate-300">Toda fórmula no Excel <strong>deve começar pelo sinal de Igual (=)</strong>.</p>
              <ul className="space-y-3 font-mono text-sm">
                <li className="bg-slate-800 p-3 rounded border border-slate-700"><strong>=SOMA(A1:A5)</strong></li>
                <li className="bg-slate-800 p-3 rounded border border-slate-700"><strong>=MÉDIA(B1:B4)</strong></li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-2"><i className="fa-solid fa-filter mr-2 text-blue-500"></i>Criar Filtros</h4>
                <p className="text-sm text-slate-600">Ajuda a organizar e ocultar informação indesejada na tabela.</p>
              </div>
            </div>
          </div>
        </div>
      );
    case 5:
      return (
        <div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-2"><i className="fa-solid fa-lightbulb text-yellow-500 mr-2"></i>Dicas de Design e Recursos Pedagógicos</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-bold text-orange-900 mb-2"><i className="fa-solid fa-expand mr-2"></i>Espaço em Branco</h4>
                <p className="text-sm text-slate-700">Deixe "respirar" os elementos visuais para facilitar a leitura rápida.</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-bold text-orange-900 mb-2"><i className="fa-solid fa-font mr-2"></i>Tipografia</h4>
                <p className="text-sm text-slate-700">Escolha fontes legíveis (como Arial ou Calibri).</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-bold text-orange-900 mb-2"><i className="fa-solid fa-photo-film mr-2"></i>Multimédia</h4>
                <p className="text-sm text-slate-700">Abandone apresentações só de texto! Integre imagens e vídeos.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-slate-800 text-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4 text-orange-400"><i className="fa-solid fa-wand-magic-sparkles mr-2"></i>Dando Vida ao Slide</h3>
              <ul className="space-y-4 text-slate-300 text-sm">
                <li><strong className="text-white block mb-1">Transições:</strong> "Troca de página" entre slides inteiros.</li>
                <li><strong className="text-white block mb-1">Animações:</strong> Movimentos aplicados a elementos individuais (texto/imagem).</li>
              </ul>
            </div>

            <div className="flex flex-col justify-center">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <h4 className="font-bold text-red-800 mb-1"><i className="fa-solid fa-circle-exclamation mr-2"></i>O Maior Erro</h4>
                <p className="text-sm text-red-700">Evite blocos de "textão". O slide é um apoio visual, não um documento Word!</p>
              </div>
            </div>
          </div>
        </div>
      );
    case 6:
      return (
        <div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-12">
            <p className="text-lg leading-relaxed mb-6 text-slate-700">
              A Internet é uma gigantesca <strong>Rede Global de Computadores</strong> interligados.
            </p>

            <h3 className="font-bold text-slate-800 text-lg mb-4 border-b pb-2">Como Funciona a Navegação (Browser)</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                <h4 className="font-bold text-blue-600">Google Chrome</h4>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                <h4 className="font-bold text-cyan-600">Microsoft Edge</h4>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                <h4 className="font-bold text-orange-600">Mozilla Firefox</h4>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-8 rounded-2xl border border-red-200">
            <h2 className="text-2xl font-bold text-red-900 mb-6"><i className="fa-solid fa-shield-halved mr-2"></i>Segurança Digital</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-red-800 mb-2"><i className="fa-solid fa-lock mr-2"></i>Cadeado</h4>
                <p className="text-sm text-red-700">Indica que o site utiliza HTTPS (comunicação segura).</p>
              </div>
              <div>
                <h4 className="font-bold text-red-800 mb-2"><i className="fa-solid fa-fish mr-2"></i>Phishing</h4>
                <p className="text-sm text-red-700">Golpes virtuais que tentam "pescar" as suas senhas. Não clique em links estranhos!</p>
              </div>
              <div>
                <h4 className="font-bold text-red-800 mb-2"><i className="fa-solid fa-right-from-bracket mr-2"></i>Logout</h4>
                <p className="text-sm text-red-700">Em PCs públicos, clique SEMPRE em "Sair" das suas contas!</p>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}