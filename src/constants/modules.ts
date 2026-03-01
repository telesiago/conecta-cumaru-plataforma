import { Cpu, Keyboard, FileText, Table, Presentation, Globe } from 'lucide-react';

export const MODULES = [
  {
    id: 1,
    title: "Hardware e Software",
    desc: "A base de como o computador funciona fisicamente e logicamente.",
    color: "bg-slate-800",
    iconClass: "text-slate-700 bg-slate-100 group-hover:bg-slate-800 group-hover:text-white",
    hoverBorderClass: "hover:border-slate-400",
    link: "https://drive.google.com/file/d/19tITvqrSl6zZnd1cXwdE9oLgjx_jvBWR/view?usp=sharing",
    icon: Cpu
  },
  {
    id: 2,
    title: "Digitação",
    desc: "Técnicas e postura para digitar de forma rápida e correta.",
    color: "bg-teal-700",
    iconClass: "text-teal-700 bg-teal-100 group-hover:bg-teal-700 group-hover:text-white",
    hoverBorderClass: "hover:border-teal-400",
    link: "",
    icon: Keyboard
  },
  {
    id: 3,
    title: "Microsoft Word",
    desc: "Criação, edição e formatação de textos profissionais.",
    color: "bg-blue-800",
    iconClass: "text-blue-700 bg-blue-100 group-hover:bg-blue-800 group-hover:text-white",
    hoverBorderClass: "hover:border-blue-500",
    link: "https://drive.google.com/file/d/1oc6vjhL3tJwTDFUkKYmfZtqRaYS9nzV1/view?usp=sharing",
    icon: FileText
  },
  {
    id: 4,
    title: "Microsoft Excel",
    desc: "Criação de planilhas e uso de fórmulas para cálculos.",
    color: "bg-green-800",
    iconClass: "text-green-700 bg-green-100 group-hover:bg-green-800 group-hover:text-white",
    hoverBorderClass: "hover:border-green-500",
    link: "https://drive.google.com/file/d/1-rolciZzls1PNCRIsOY_hQnQhsyW_Y2b/view?usp=sharing",
    icon: Table
  },
  {
    id: 5,
    title: "PowerPoint",
    desc: "Criação de apresentações de slides dinâmicas.",
    color: "bg-orange-700",
    iconClass: "text-orange-700 bg-orange-100 group-hover:bg-orange-700 group-hover:text-white",
    hoverBorderClass: "hover:border-orange-500",
    link: "https://drive.google.com/file/d/1TfIKD5132BZt0Uoa-A7jVoahgK_FBjSp/view?usp=sharing",
    icon: Presentation
  },
  {
    id: 6,
    title: "Internet",
    desc: "Navegação, pesquisa e segurança digital.",
    color: "bg-indigo-800",
    iconClass: "text-indigo-700 bg-indigo-100 group-hover:bg-indigo-800 group-hover:text-white",
    hoverBorderClass: "hover:border-indigo-500",
    link: "https://docs.google.com/presentation/d/1RlZedD1xvAXjkmgZjgl2PvFYId8DcFOK/edit?usp=sharing&ouid=109739067894302533500&rtpof=true&sd=true",
    icon: Globe
  }
];