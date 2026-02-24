export const 
DashboardElementsMap = {
  // Cards
  totalCard: '//p[text()="Total"]',
  agendadosCard: '//p[text()="Agendados"]',
  concluidosCard: '//p[text()="Concluídos"]',
  canceladosCard: '//p[text()="Cancelados"]',
  
  // Buttons
  novoAgendamentoButton: '//button[contains(., "Novo Agendamento")]',
  verTodosButton: '//button[contains(., "Ver Todos")]',
  sairButton: '//button[normalize-space()="Sair"]',
  
  // Links
  criarAgendamentoLink: '//a[normalize-space()="Criar um agendamento"]',
  
  // Menu side
  dashboardMenu: '//a[@href="/dashboard"]',
  servicosMenu: '//a[@href="/services"]',
  agendamentosMenu: '//a[@href="/appointments"]',

  // Messages
  agendamentoSuccess: '//div[text()="Agendamento criado!"]',
  
  // Headers and titles
  welcomeTitle: '//h1[contains(text(), "BEM-VINDO")]',
} as const;
