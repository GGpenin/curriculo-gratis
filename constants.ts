import type { ResumeData } from './types';

export const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "Maria Silva",
    jobTitle: "Engenheira de Frontend Sênior",
    email: "maria.silva@example.com",
    phone: "(11) 98765-4321",
    address: "São Paulo, SP",
    linkedin: "linkedin.com/in/mariasilva",
    github: "github.com/mariasilva",
    photo: "",
  },
  summary: "Engenheira de Frontend Sênior com mais de 8 anos de experiência na construção e manutenção de aplicações web responsivas e escaláveis. Proficiente em React, TypeScript e frameworks JavaScript modernos. Apaixonada por criar interfaces de usuário intuitivas e otimizar o desempenho.",
  experience: [
    {
      id: "exp1",
      jobTitle: "Engenheira de Frontend Sênior",
      company: "Soluções Tech Ltda.",
      location: "São Paulo, SP",
      startDate: "Jan 2018",
      endDate: "Atual",
      description: "- Liderei o desenvolvimento de um novo painel para clientes usando React e Redux, melhorando o engajamento do usuário em 25%.\n- Mentiorei desenvolvedores juniores, realizando revisões de código e promovendo melhores práticas.\n- Colaborei com designers UX/UI para traduzir wireframes em código de alta qualidade.",
    },
    {
      id: "exp2",
      jobTitle: "Desenvolvedora Frontend",
      company: "Inovações Web",
      location: "Campinas, SP",
      startDate: "Jun 2015",
      endDate: "Dez 2017",
      description: "- Desenvolvi e mantive funcionalidades para uma plataforma de e-commerce de grande escala usando Angular.js.\n- Melhorei o desempenho do site otimizando assets e implementando lazy loading, resultando em uma redução de 40% no tempo de carregamento.",
    },
  ],
  education: [
    {
      id: "edu1",
      institution: "Universidade de São Paulo (USP)",
      degree: "Mestrado em Ciência da Computação",
      fieldOfStudy: "Ciência da Computação",
      startDate: "Set 2013",
      endDate: "Mai 2015",
    },
  ],
  skills: [
    { id: "skill1", name: "React" },
    { id: "skill2", name: "TypeScript" },
    { id: "skill3", name: "JavaScript (ES6+)" },
    { id: "skill4", name: "Node.js" },
    { id: "skill5", name: "Tailwind CSS" },
    { id: "skill6", name: "GraphQL" },
    { id: "skill7", name: "Jest & RTL" },
    { id: "skill8", name: "Webpack" },
  ],
};
