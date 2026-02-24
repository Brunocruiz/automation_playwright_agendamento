export const 
CadastroElementsMap = {
  // Input fields
  nameInput: '//*[@id="name"]',
  emailInput: '//*[@id="email"]',
  passwordInput: '//*[@id="password"]',
  confirmPasswordInput: '//*[@id="confirmPassword"]',
  
  // Buttons
  submitButton: '//button[@type="submit"]',
  
  // Links
  loginLink: '//a[@href="/login"]',
  
  // Messages
  errorNameMessage: '//p[normalize-space()="Nome deve ter pelo menos 2 caracteres"]',
  errorEmailMessage: '//p[normalize-space()="Email inválido"]',
  errorPasswordMessage: '//p[normalize-space()="Senha deve ter pelo menos 6 caracteres"]',
  errorPasswordConfirm: '//p[normalize-space()="As senhas não coincidem"]',
  successMessage: '//div[text()="Conta criada!"]',
  
  // Headers and titles
  signUpTitle: '//h3[contains(text(), "CRIA CONTA")]',
} as const;
