export const 
ServicosElementsMap = {
  // Cards
  corteCabeloCard: '//div[h3[text()="Corte de Cabelo"]]',
  barbaCard: '//div[h3[text()="Barba"]]',
  corteBarbaCard: '//div[h3[text()="Corte + Barba"]]',
  coloracaoCard: '//div[h3[text()="Coloração"]]',
  massagemCard: '//div[h3[text()="Massagem Relaxante"]]',
  manicureCard: '//div[h3[text()="Manicure"]]',
  Pedicure: '//div[h3[text()="Pedicure"]]',
  
  // Buttons
  agendarButton: '//button[text()="Agendar"]',
  
  // Headers and titles
  servicosTitle: '//h1[contains(., "NOSSOS SERVIÇOS")]',
} as const;
