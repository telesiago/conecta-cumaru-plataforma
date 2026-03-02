# 💻 Conecta Cumaru - Plataforma Educacional

A **Conecta Cumaru** é uma plataforma de inclusão digital desenvolvida para a Prefeitura Municipal de Cumaru do Norte. O sistema oferece um curso completo de Informática Básica com materiais de estudo, exercícios gamificados (quizzes) e painéis administrativos para gestão de alunos e turmas.

## ✨ Funcionalidades

A plataforma está dividida em 3 experiências de utilizador distintas:

### 🌐 Área Pública (Visitantes)

- Visualização de todos os módulos do curso de Informática Básica.
- Acesso rápido a links externos e materiais de apoio (Google Drive, PDFs).
- Interface responsiva e acessível por telemóvel ou computador.

### 🎓 Painel do Aluno

- **Gamificação e Ranking:** O aluno ganha pontos ao acertar questões e compete no ranking global.
- **Personalização:** Escolha de avatares interativos (emojis) e gestão de contacto (WhatsApp com máscara automática).
- **Exercícios (Quizzes):** Resolução de testes interativos com limite de 3 tentativas por quiz (para incentivar a aprendizagem).
- **Feedback em Tempo Real:** Gabarito instantâneo com explicações detalhadas das respostas certas e erradas.

### 🛡️ Painel de Administração

- **Gestão de Turmas:** Criação e reordenação (Drag & Drop) de turmas.
- **Gestão de Alunos:** Criação, edição (nome, turma, palavra-passe) e remoção de contas de alunos.
- **Construtor de Quizzes Premium:**
  - Adição manual de perguntas com interface amigável.
  - Importação em massa de perguntas através de formato **JSON**.
  - Edição, ativação e desativação de quizzes inteiros.
- **Relatórios:** Tabela completa de acompanhamento de notas com data, hora, turma e percentagem de acertos.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as melhores práticas modernas de desenvolvimento Web:

- **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) (Carregamento e build ultrarrápidos)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Tipagem estática e segurança no código)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (Design responsivo e Premium UI)
- **Base de Dados & Auth:** [Firebase Firestore & Firebase Auth](https://firebase.google.com/) (Tempo real e escalabilidade)
- **Ícones:** [Lucide React](https://lucide.dev/)

## 📂 Estrutura do Projeto (Clean Architecture)

src/  
├── components/ # Componentes visuais reutilizáveis (Ex: RankingList, QuizPlayer)  
├── constants/ # Dados estáticos (Ex: text/links dos Módulos)  
├── pages/ # Ecrãs principais da aplicação (Admin, Student, Home, Login)  
├── types/ # Definições estritas (Interfaces) do TypeScript  
├── App.tsx # Roteamento central e inicialização Auth  
├── firebase.ts # Ligação e configuração do Firebase  
└── main.tsx # Ponto de entrada (Entry point)  

## 🚀 Como Executar o Projeto Localmente

### 1\. Pré-requisitos

Certifique-se de ter o **Node.js** (versão 18 ou superior) instalado no seu computador.

### 2\. Instalação

Clone o repositório e instale as dependências:

git clone \[<https://github.com/SEU-USUARIO/conecta-cumaru-plataforma.git\>](<https://github.com/SEU-USUARIO/conecta-cumaru-plataforma.git>)  
cd conecta-cumaru-plataforma  
npm install  

### 3\. Variáveis de Ambiente

Crie um ficheiro .env.local na raiz do projeto e cole as credenciais do seu projeto Firebase:

VITE_FIREBASE_API_KEY="SUA_API_KEY"  
VITE_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"  
VITE_FIREBASE_PROJECT_ID="seu-projeto"  
VITE_FIREBASE_STORAGE_BUCKET="seu-projeto.appspot.com"  
VITE_FIREBASE_MESSAGING_SENDER_ID="123456"  
VITE_FIREBASE_APP_ID="1:1234:web:abcd"  

### 4\. Executar o Servidor

Inicie o servidor de desenvolvimento:

npm run dev  

O projeto estará disponível no seu navegador em <http://localhost:5173>.

## 📦 Como Publicar (Deploy)

O projeto está configurado para ser facilmente alojado no **Firebase Hosting**.

Execute os comandos abaixo:

\# 1. Compilar o código para produção  
npm run build  
<br/>\# 2. Enviar para os servidores da Google  
firebase deploy --only hosting  

## 👨‍💻 Desenvolvedor

Desenvolvido com dedicação por **Iago Teles** para fins educacionais e projetos de Inclusão Digital.