export const STORAGE_KEY = "transpetro-study-data-v1";
export const POMODORO_KEY = "transpetro-pomodoro-v1";
export const EXAM_DATE = new Date("2026-11-29T13:00:00-03:00");
export const WORK_SECONDS = 25 * 60;
export const BREAK_SECONDS = 5 * 60;

export const DEFAULT_SUBJECTS = [
  {
    id: "portugues",
    name: "Língua Portuguesa",
    color: "#2E8C90",
    topics: [
      { id: "p1", text: "Compreensão de textos", done: false },
      { id: "p2", text: "Ortografia oficial", done: false },
      { id: "p3", text: "Mecanismos de coesão textual", done: false },
      { id: "p4", text: "Significação das palavras", done: false },
      { id: "p5", text: "Emprego de tempos e modos verbais", done: false },
      { id: "p6", text: "Emprego das classes de palavras", done: false },
      { id: "p7", text: "Coordenação e subordinação", done: false },
      { id: "p8", text: "Emprego dos sinais de pontuação", done: false },
      { id: "p9", text: "Concordância verbal e nominal", done: false },
      { id: "p10", text: "Regência verbal e nominal", done: false },
      { id: "p11", text: "Emprego do sinal indicativo de crase", done: false },
      { id: "p12", text: "Colocação dos pronomes átonos", done: false },
    ],
  },
  {
    id: "ingles",
    name: "Língua Inglesa",
    color: "#2E8C90",
    topics: [
      { id: "i1", text: "Compreensão de texto escrito", done: false },
      { id: "i2", text: "Itens gramaticais relevantes", done: false },
    ],
  },
  {
    id: "processos",
    name: "Processos de Negócio",
    color: "#F2A93B",
    topics: [
      { id: "n1", text: "Arquitetura de Dados (modelagem, SQL, NoSQL, ETL)", done: false },
      { id: "n2", text: "Gerenciamento de Projetos (Scrum, Kanban, PMBOK, SAFe)", done: false },
      { id: "n3", text: "Processos (grupos e áreas de conhecimento PMBOK)", done: false },
      { id: "n4", text: "Gestão e Governança em TI / LGPD", done: false },
      { id: "n5", text: "Engenharia de Software (requisitos, ciclo de vida)", done: false },
      { id: "n6", text: "UX (usabilidade, design thinking, MVP, personas)", done: false },
      { id: "n7", text: "Análise de Dados e BI (DW, OLAP, dashboards)", done: false },
      { id: "n8", text: "Lógica Matemática (sentencial, predicados)", done: false },
      { id: "n9", text: "Segurança da Informação (visão geral)", done: false },
    ],
  },
];
