import * as dotenv from 'dotenv';

if (!process.env.CI && !process.env.GITLAB_CI) {
  dotenv.config();
}

type Environment = 'dev' | 'prod';

export class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private readonly currentEnv: Environment;

  private constructor() {
    const env = (process.env.AMBIENTE || process.env.NODE_ENV || 'dev') as Environment;
    const validEnvs: Environment[] = ['dev', 'prod'];
    
    if (!validEnvs.includes(env)) {
      throw new Error(`Ambiente inválido: ${env}. Use: ${validEnvs.join(', ')}`);
    }
    
    this.currentEnv = env;
  }

  static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  get current(): Environment {
    return this.currentEnv;
  }

  get isDev(): boolean {
    return this.currentEnv === 'dev';
  }

  get isProd(): boolean {
    return this.currentEnv === 'prod';
  }

  get isCI(): boolean {
    return process.env.CI === 'true' || process.env.CI === '1';
  }

  get video(): 'off' | 'retain-on-failure' {
    return process.env.VIDEO === 'true' ? 'retain-on-failure' : 'off';
  }

  // URLs
  get dominio(): string {
    return process.env[`${this.currentEnv.toUpperCase()}_DOMINIO`] || '';
  }

  get dominioLogin(): string {
    return process.env[`${this.currentEnv.toUpperCase()}_DOMINIO_LOGIN`] || '';
  }

  get apiBase(): string {
    return process.env[`${this.currentEnv.toUpperCase()}_API_BASE`] || '';
  }

  // Credenciais
  get email(): string {
    return process.env[`${this.currentEnv.toUpperCase()}_EMAIL`] || '';
  }

  get senha(): string {
    return process.env[`${this.currentEnv.toUpperCase()}_SENHA`] || '';
  }

  // Configurações globais
  get urlBO(): string {
    return process.env.URL_BO || '';
  }

  get emailBO(): string {
    return process.env.EMAIL_BO || '';
  }

  get senhaBO(): string {
    return process.env.SENHA_BO || '';
  }

  get apiwebWatchUrl(): string {
    return process.env.APIWEB_WATCH_URL || '';
  }

  // Configurações de execução
  get testCategories(): string[] {
    return process.env.TEST_CATEGORIES?.split(',').map(cat => cat.trim()).filter(Boolean) || [];
  }

  get testProjects(): string[] {
    return process.env.TEST_PROJECTS?.split(',').map(proj => proj.trim()).filter(Boolean) || [];
  }

  get headless(): boolean {
    return process.env.HEADLESS !== 'false';
  }

  get slowMo(): number {
    return parseInt(process.env.SLOW_MO || '0', 10);
  }

  get timeout(): number {
    return parseInt(process.env.TIMEOUT || '60000', 10);
  }

  get retries(): number {
    return parseInt(process.env.RETRIES || '0', 10);
  }

  get workers(): number | undefined {
    const workers = process.env.WORKERS;
    return workers ? parseInt(workers, 10) : undefined;
  }

  // Helper para log
  logConfig(): void {
    console.log('='.repeat(60));
    console.log(`AMBIENTE: ${this.currentEnv}`);
    console.log(`DOMÍNIO: ${this.dominio}`);
    console.log(`CI: ${this.isCI}`);
    console.log(`CATEGORIAS: ${this.testCategories.join(', ')}`);
    console.log(`PROJETOS: ${this.testProjects.join(', ')}`);
    console.log(`HEADLESS: ${this.headless}`);
    console.log(`WORKERS: ${this.workers}`);
    console.log(`VIDEO: ${this.video || 'off'} `);
    console.log('='.repeat(60));
  }
}

export const envConfig = EnvironmentConfig.getInstance();