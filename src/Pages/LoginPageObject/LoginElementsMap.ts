export const 
LoginElementsMap = {
  // Input fields
  emailInput: '//*[@id="email"]',
  passwordInput: '//*[@id="password"]',
  
  // Buttons
  loginButton: '//button[@type="submit" and contains(., "Entrar")]',
  
  // Links
  signUpLink: '//a[@href="/register"]',
  
  // Messages
  errorEmailMessage: '//p[normalize-space()="Email inválido"]',
  errorPasswordMessage: '//p[normalize-space()="Senha deve ter pelo menos 6 caracteres"]',
  errorCredentialsMessage: '//div[contains(text(), "Credenciais inválidas")]',
  successMessage: '//div[contains(text(), "Login realizado com sucesso")]',
  
  // Headers and titles
  loginTitle: '//h3[contains(text(), "ENTRAR")]',
  welcomeMessage: '//h1[contains(text(), "BEM-VINDO")]',
} as const;
