export const 
LoginElementsMap = {
  // Input fields
  usernameInput: '[data-testid="username-input"]',
  passwordInput: '[data-testid="password-input"]',
  emailInput: '[data-testid="email-input"]',
  
  // Buttons
  loginButton: '[data-testid="login-button"]',
  submitButton: '[data-testid="submit-button"]',
  forgotPasswordButton: '[data-testid="forgot-password-button"]',
  signUpButton: '[data-testid="signup-button"]',
  
  // Links
  forgotPasswordLink: '[data-testid="forgot-password-link"]',
  signUpLink: '[data-testid="signup-link"]',
  
  // Messages
  errorMessage: '[data-testid="error-message"]',
  successMessage: '[data-testid="success-message"]',
  validationMessage: '[data-testid="validation-message"]',
  
  // Form elements
  loginForm: '[data-testid="login-form"]',
  rememberMeCheckbox: '[data-testid="remember-me-checkbox"]',
  
  // Headers and titles
  loginTitle: '[data-testid="login-title"]',
  welcomeMessage: '[data-testid="welcome-message"]',
  
  // Loading states
  loadingSpinner: '[data-testid="loading-spinner"]',
  submitLoader: '[data-testid="submit-loader"]'
} as const;
