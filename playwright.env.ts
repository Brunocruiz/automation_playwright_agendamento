import * as fs from 'fs';
import os from 'os';
import * as path from 'path';
import { envConfig } from './src/Utils/environment';

// -----------------------------------------------------------------------------
// Resolve diretório base e user-data para Chromium
// -----------------------------------------------------------------------------
const PROJECT_ROOT = path.resolve(path.dirname(''));

// Diretórios por ambiente
const getEnvSpecificDir = (baseDir: string): string => {
  return path.join(baseDir, envConfig.current);
};

export const TEMP_USER_DATA_DIR = getEnvSpecificDir(
  path.join(PROJECT_ROOT, '/test-data/temp-user-data')
);

const SESSION_DIR = getEnvSpecificDir(
  path.join(PROJECT_ROOT, '/test-data/session')
);

// Arquivos de sessão específicos por ambiente
export const sessionUserFilePath = path.join(
  SESSION_DIR, 
  `session-user-${envConfig.current}.json`
);

export const sessionProfileFilePath = path.join(
  SESSION_DIR, 
  `session-profile-${envConfig.current}.json`
);

// Mantém compatibilidade com código existente
export const sessionFilePath = sessionProfileFilePath;

// -----------------------------------------------------------------------------
// Funções de limpeza e preparação
// -----------------------------------------------------------------------------

function cleanUserDataDir() {
  if (fs.existsSync(TEMP_USER_DATA_DIR)) {
    try {
      fs.rmSync(TEMP_USER_DATA_DIR, { recursive: true, force: true });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to remove directory: ${error.message}`);
      }
    }
  }
  
  // Criar diretórios base
  const dirsToCreate = [
    TEMP_USER_DATA_DIR,
    SESSION_DIR,
    path.join(PROJECT_ROOT, '/test-data'),
    path.join(PROJECT_ROOT, '/Reports'),
    path.join(PROJECT_ROOT, '/test-artifacts')
  ];
  
  dirsToCreate.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Log do ambiente atual
  console.log(`📁 Ambiente: ${envConfig.current}`);
  console.log(`📂 User Data Dir: ${TEMP_USER_DATA_DIR}`);
  console.log(`📂 Session Dir: ${SESSION_DIR}`);
}

// Limpa o diretório no início
cleanUserDataDir();

// -----------------------------------------------------------------------------
// Função para obter subpasta exclusiva para cada execução
// -----------------------------------------------------------------------------
export function getUniqueUserDataDir(testName: string): string {
  // Sanitizar nome do teste
  const sanitizedTestName = testName.replace(/[^a-zA-Z0-9_-]/g, '_');
  
  // Gerar subdiretório base
  let baseName = sanitizedTestName || `process-${process.pid}`;
  
  // Adicionar timestamp para evitar colisões
  const timestamp = Date.now();
  let subDir = path.join(TEMP_USER_DATA_DIR, `${baseName}_${timestamp}`);
  
  // Se já existir, adicionar sufixo aleatório
  if (fs.existsSync(subDir)) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    subDir = path.join(TEMP_USER_DATA_DIR, `${baseName}_${timestamp}_${randomSuffix}`);
  }
  
  // Criar diretório
  try {
    fs.mkdirSync(subDir, { recursive: true });
    return subDir;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to create directory '${subDir}': ${error.message}`);
    }
    
    // Fallback para temp do sistema
    const fallbackDir = path.join(
      os.tmpdir(), 
      `playwright-${envConfig.current}-${baseName}-${timestamp}`
    );
    
    try {
      fs.mkdirSync(fallbackDir, { recursive: true });
      return fallbackDir;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Unable to create fallback directory '${fallbackDir}': ${err.message}`);
      }
      throw err;
    }
  }
}

// -----------------------------------------------------------------------------
// Limpa subpastas ao final da execução (com opção por ambiente)
// -----------------------------------------------------------------------------
export function cleanAllUserDataSubDirs() {
  // Em CI, limpar completamente. Localmente, manter para debug
  if (envConfig.isCI) {
    cleanUserDataDir();
    console.log(`🧹 Dados de usuário limpos para ambiente: ${envConfig.current}`);
  } else {
    console.log(`🔄 Mantendo dados de usuário para debug (ambiente: ${envConfig.current})`);
  }
}

// Limpeza seletiva por categoria de teste
export function cleanUserDataByCategory(categories: string[] = []) {
  
  if (envConfig.isProd) {
    console.log('🔒 Ambiente de produção - Limpeza completa ativada');
    cleanUserDataDir();
  }
}

// -----------------------------------------------------------------------------
// Configurações específicas por ambiente para contexto do navegador
// -----------------------------------------------------------------------------
export function getContextOptions(testCategory?: string) {
  const baseOptions: any = {
    permissions: ['geolocation'],
    timezoneId: 'America/Sao_Paulo',
    locale: 'pt-BR',
    colorScheme: 'light' as const
  };

  // Configurações específicas por ambiente
  if (envConfig.isCI) {
    baseOptions.acceptDownloads = true;
    baseOptions.bypassCSP = true;
  }

  if (envConfig.isProd) {
    baseOptions.recordHar = {
      path: path.join(PROJECT_ROOT, 'Reports', `har-${Date.now()}.har`),
      mode: 'minimal'
    };
  }

  // Configurações por categoria de teste
  if (testCategory === 'desktop') {
    baseOptions.permissions.push('camera', 'microphone');
    baseOptions.extraHTTPHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  return baseOptions;
}

// -----------------------------------------------------------------------------
// Funções auxiliares para gerenciamento de sessão
// -----------------------------------------------------------------------------
export function getSessionFilePath(type: 'user' | 'profile' = 'profile'): string {
  return type === 'user' ? sessionUserFilePath : sessionProfileFilePath;
}

export function sessionExists(): boolean {
  return fs.existsSync(sessionProfileFilePath);
}

export function cleanupOldSessions(maxAgeHours: number = 24) {
  const now = Date.now();
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  
  [sessionUserFilePath, sessionProfileFilePath].forEach(filePath => {
    if (fs.existsSync(filePath)) {
      try {
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > maxAgeMs) {
          fs.unlinkSync(filePath);
          console.log(`🧹 Sessão expirada removida: ${filePath}`);
        }
      } catch (error) {
        console.error(`Erro ao verificar sessão ${filePath}:`, error);
      }
    }
  });
}

// Limpar sessões antigas no início
cleanupOldSessions();