export const 
AgendamentoElementsMap = {
  // Cards
  agendadosCard: '//button[@role="tab" and contains(., "Agendados")]',
  concluidosCard: '//button[@role="tab" and contains(., "Concluídos")]',
  canceladosCard: '//button[@role="tab" and contains(., "Cancelados")]',
  
  // Buttons
  novoAgendamentoButton: '//button[contains(., "Novo Agendamento")]',
  verTodosButton: '//button[contains(., "Ver Todos")]',
  sairButton: '//button[normalize-space()="Sair"]',
  servicoSelectButton: '//button[@role="combobox"][.//span[text()="Selecione um serviço"]]',
  servicoCorteButton: '//div[@role="option" and .//span[contains(text(), "Barba")]]',
  dataButton: '(//button[contains(@class, "bg-muted/50")])[6]',
  horarioButton: '//button[text()="11:00"]',
  confirmarAgendamentoButton: '//button[contains(., "Confirmar Agendamento")]',
  confirmarAgendamentoDisableButton: '//button[contains(., "Confirmar Agendamento") and @disabled]',

  // Messages
  agendamentoSuccess: '//div[text()="Agendamento criado!"]',
  
  // Headers and titles
  agendamentoTitle: '//h1[contains(., "MEUS AGENDAMENTOS")]',
  novoAgendamentoTitle: '//h1[contains(., "NOVO AGENDAMENTO")]',
} as const;
