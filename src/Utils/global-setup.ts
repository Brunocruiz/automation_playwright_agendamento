import { BrowserContext, FullConfig, Page } from '@playwright/test';
import * as env from '../../playwright.env';
import fs from 'fs';
import * as path from 'path';
import { chromium } from '@playwright/test';
import { spawn, spawnSync } from 'child_process';
import { envConfig } from './environment';

async function globalSetup(config: FullConfig) {
  console.log('🔧 GLOBAL SETUP INICIADO');
  // Limpar sessões antigas automaticamente
  env.cleanupOldSessions();
  
  // Log das configurações atuais
  console.log('='.repeat(60));
  console.log(`📁 Ambiente: ${envConfig.current}`);
  console.log(`🌐 URL Base: ${envConfig.dominio}`);
  console.log(`🔧 Categorias selecionadas: ${envConfig.testCategories.join(', ')}`);
  console.log(`🖥️ Projetos selecionados: ${envConfig.testProjects.join(', ')}`);
  console.log(`👤 Usuário: ${envConfig.email.substring(0, 3)}...${envConfig.email.substring(envConfig.email.indexOf('@'))}`);
  console.log(`📂 Session Dir: ${path.dirname(env.sessionUserFilePath)}`);
  console.log('='.repeat(60));

  // Verificar se precisa executar login baseado nas categorias selecionadas
  const shouldRunLogin = shouldExecuteLogin(config);
  
  if (!shouldRunLogin) {
    console.log('⏭️  Login não necessário para as categorias/projetos selecionados');
    return;
  }

  // Configuração do Xvfb apenas se necessário
  await setupXvfbIfNeeded(config);

  // Limpeza seletiva baseada nas categorias
  env.cleanUserDataByCategory(envConfig.testCategories);
  
  const needsLogin = await shouldRenewSession();

  if (needsLogin) {
    console.log('🔄 Sessão inválida ou ausente. Realizando login...');
    await doLoginPerfil();
  } else {
    console.log('✅ Sessões válidas encontradas, reaproveitando...');
  }
  console.log('🔧 GLOBAL SETUP FINALIZADO');
}

// Função para determinar se o login deve ser executado
function shouldExecuteLogin(config: FullConfig): boolean {
  // Se não há categorias nem projetos específicos, executa login
  if (envConfig.testCategories.length === 0 && envConfig.testProjects.length === 0) {
    return true;
  }

  // Obter todos os projetos que serão executados
  const allProjects = getAllProjectsFromConfig(config);

  // Verificar se há categorias que precisam de login
  const requiresLoginCategories = ['drm', 'desktop'];
  const selectedRequiresLogin = envConfig.testCategories.some((cat: string) => 
    requiresLoginCategories.includes(cat)
  );

  // Se tem projetos e categorias que precisam de login, executa
  return selectedRequiresLogin || envConfig.testProjects.length > 0;
}

// Função para extrair projetos da configuração
function getAllProjectsFromConfig(config: FullConfig): Array<{name: string}> {
  try {
    return config.projects?.map(p => ({ name: p.name || '' })) || [];
  } catch {
    return [];
  }
}

async function setupXvfbIfNeeded(config: FullConfig) {
  const XVFB_PID_FILE = path.join(process.cwd(), 'test-artifacts', '.xvfb.pid');
  
  // Apenas no Linux sem DISPLAY
  if (process.platform === 'linux' && !process.env.DISPLAY) {
    // Verificar se algum projeto precisa de modo headed
    const hasHeadedProjects = config.projects?.some(project => 
      project.use?.headless === false
    ) || false;

    if (hasHeadedProjects && !envConfig.headless) {
      try {
        if (!fs.existsSync(path.dirname(XVFB_PID_FILE))) {
          fs.mkdirSync(path.dirname(XVFB_PID_FILE), { recursive: true });
        }

        if (!fs.existsSync(XVFB_PID_FILE)) {
          // Verificar se Xvfb está disponível
          const which = spawnSync('which', ['Xvfb']);
          if (which.status !== 0) {
            console.warn('⚠️  Xvfb não encontrado. Testes headed podem falhar.');
            return;
          }

          // Iniciar Xvfb
          const display = ':99';
          const xvfb = spawn('Xvfb', [
            display, 
            '-screen', '0', 
            `${envConfig.isCI ? '1920x1080x24' : '1280x720x24'}`, 
            '-ac'
          ], { 
            detached: true, 
            stdio: 'ignore' 
          });
          
          xvfb.unref();
          fs.writeFileSync(XVFB_PID_FILE, String(xvfb.pid), 'utf-8');
          process.env.DISPLAY = display;
          
          console.log(`🖥️  Xvfb iniciado (pid=${xvfb.pid}) em ${display}`);
        } else {
          // Reutilizar Xvfb existente
          const pid = Number(fs.readFileSync(XVFB_PID_FILE, 'utf-8').trim());
          if (pid) {
            process.env.DISPLAY = ':99';
            console.log(`🔄 Usando Xvfb existente (pid=${pid})`);
          }
        }
      } catch (error) {
        console.error('❌ Falha ao configurar Xvfb:', error);
      }
    }
  }
}

async function shouldRenewSession(): Promise<boolean> {
  // Se estamos em CI e não precisa de sessão persistente, sempre renovar
  if (envConfig.isCI && !requiresPersistentSession()) {
    console.log('🔄 CI detectado, renovando sessão...');
    return true;
  }

  // Verificar se as sessões existem
  const userSessionExists = fs.existsSync(env.sessionUserFilePath);
  const profileSessionExists = fs.existsSync(env.sessionProfileFilePath);

  if (!userSessionExists || !profileSessionExists) {
    console.log(`📄 Sessões ausentes: user=${userSessionExists}, profile=${profileSessionExists}`);
    return true;
  }

  try {
    const session = JSON.parse(fs.readFileSync(env.sessionProfileFilePath, 'utf-8'));
    const tokenExpiry = session.cookies?.find((c: any) => c.name === 'wtk')?.expires;

    if (tokenExpiry && Date.now() > (tokenExpiry * 1000 - 300000)) {
      console.log('⏰ Token expirado ou próximo do vencimento');
      return true;
    }

    return false;
  } catch (error) {
    console.log('⚠️  Erro ao ler sessão:', error);
    return true;
  }
}

function requiresPersistentSession(): boolean {
  // Alguns cenários específicos precisam de sessão persistente
  return envConfig.testCategories.includes('desktop') || 
         envConfig.testProjects.some((p: string | string[]) => p.includes('desktop'));
}

async function doLoginPerfil() {
  console.log(`🔐 Iniciando login no ambiente: ${envConfig.current}`);
  
  // Usar configurações do ambiente atual
  const dominioLogin = envConfig.dominioLogin;
  const email = envConfig.email;
  const senha = envConfig.senha;

  // Validação das credenciais
  if (!dominioLogin || !email || !senha) {
    throw new Error(
      `Credenciais incompletas para ambiente ${envConfig.current}.\n` +
      `DOMINIO_LOGIN: ${dominioLogin ? 'Definido' : 'Faltando'}\n` +
      `EMAIL: ${email ? 'Definido' : 'Faltando'}\n` +
      `SENHA: ${senha ? 'Definido' : 'Faltando'}`
    );
  }

  // Usar userDataDir do ambiente configurado
  const userDataDir = env.TEMP_USER_DATA_DIR;
  
  // Configurar browser baseado no ambiente
  const browserOptions: any = {
    headless: envConfig.headless,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: []
  };

  // Configurações específicas por ambiente
  if (envConfig.isCI) {
    browserOptions.headless = true;
    browserOptions.args.push('--no-sandbox', '--disable-dev-shm-usage');
  }

  // Apenas usar Chrome específico se não for CI e o caminho existir
  if (!envConfig.isCI) {
    const defaultWin = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const defaultLinux = '/opt/google/chrome/chrome';
    const chromePath = process.env.CHROME_BIN || 
      (process.platform === 'win32' ? defaultWin : defaultLinux);
    
    if (fs.existsSync(chromePath)) {
      browserOptions.executablePath = chromePath;
      browserOptions.channel = 'chrome';
    }
  }

  console.log(`🚀 Iniciando browser com opções:`, {
    headless: browserOptions.headless,
    hasExecutablePath: !!browserOptions.executablePath
  });

  const browser = await chromium.launch(browserOptions);

  // Usar configurações de contexto baseadas nas categorias de teste
  const contextOptions = env.getContextOptions(
    envConfig.testCategories.includes('desktop') ? 'desktop' : undefined
  );

  const context = await browser.newContext({
    ...contextOptions,
    viewport: { width: 1280, height: 720 },
    userAgent: envConfig.isCI 
      ? 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      : undefined
  });

  const page = await context.newPage();

  try {
    console.log(`🌐 Acessando: ${dominioLogin}`);
    await page.goto(dominioLogin, {
      timeout: envConfig.isCI ? 45000 : 30000 
    });

    // Login
    await page.fill('#email', email);
    await page.fill('#password', senha);
    await page.click("//button[@type='submit']");

    // Aguardar dashboard com validação
    const dominioBase = new URL(dominioLogin).origin;
    const homeUrl = `${dominioBase}/dashboard`;
    
    console.log(`🏠 Aguardando redirect para: ${homeUrl}`);
    await page.waitForURL(homeUrl, { 
      timeout: envConfig.isCI ? 60000 : 30000 
    });

    // Validação adicional de login bem-sucedido
    const pageTitle = await page.title();
    const currentUrl = page.url();
    
    console.log(`✅ Login confirmado:`);
    console.log(`   Título: ${pageTitle}`);
    console.log(`   URL: ${currentUrl}`);
    console.log(`   Status: ${currentUrl.includes('/dashboard') ? 'Sucesso' : 'Possível problema'}`);

    // Salvar sessão com perfil
    await persistSessionState(
      context, 
      page, 
      dominioBase, 
      env.sessionProfileFilePath, 
      'usuário autenticado'
    );

    // Verificação final da sessão salva
    if (fs.existsSync(env.sessionProfileFilePath)) {
      const sessionSize = fs.statSync(env.sessionProfileFilePath).size;
      console.log(`💾 Sessão salva com sucesso: ${sessionSize} bytes`);
    }

  } catch (error: any) {
    // Tirar screenshot em caso de erro
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = path.join(
      process.cwd(), 
      'test-artifacts', 
      `login-error-${envConfig.current}-${timestamp}.png`
    );
    
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true,
      timeout: 5000 
    }).catch(e => console.error('Não foi possível tirar screenshot:', e));
    
    console.error(`❌ Erro durante login no ambiente ${envConfig.current}:`);
    console.error(`   Mensagem: ${error.message}`);
    console.error(`   Screenshot: ${screenshotPath}`);
    console.error(`   URL atual: ${await page.url()}`);
    
    // Informações adicionais de debug
    const pageContent = await page.content().catch(() => 'Não foi possível obter conteúdo');
    if (pageContent.length < 1000) {
      console.error(`   Conteúdo da página (resumo): ${pageContent.substring(0, 500)}...`);
    }
    
    // Em CI, falhar explicitamente
    if (envConfig.isCI) {
      throw new Error(`Falha no login para ambiente ${envConfig.current}: ${error.message}`);
    }
    
    throw error;
  } finally {
    await context.close().catch(e => console.error('Erro ao fechar contexto:', e));
    await browser.close().catch(e => console.error('Erro ao fechar browser:', e));
  }
}

async function persistSessionState(
  context: BrowserContext,
  page: Page,
  dominio: string,
  targetFilePath: string,
  label: string
) {

  try {
    const storageState = await buildStorageState(context, page, dominio);
    
    // Criar diretório se não existir
    const dirPath = path.dirname(targetFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Salvar sessão
    fs.writeFileSync(targetFilePath, JSON.stringify(storageState, null, 2), 'utf-8');
    
    // Verificar se foi salvo
    if (fs.existsSync(targetFilePath)) {
      const stats = fs.statSync(targetFilePath);
      console.log(`💾 Sessão (${label}) salva em ${targetFilePath} (${stats.size} bytes)`);
    } else {
      console.warn(`⚠️  Sessão (${label}) não foi salva: ${targetFilePath}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao salvar sessão (${label}):`, error);
    throw error;
  }
}

async function buildStorageState(context: BrowserContext, page: Page, dominio: string) {
  try {
    const dominioUrl = new URL(dominio);
    const cookies = await context.cookies();
    
    // Obter localStorage
    const localStorageData = await page.evaluate(() => {
      try {
        return Object.entries(localStorage).map(([name, value]) => ({ name, value }));
      } catch {
        return [];
      }
    });

    return {
      cookies,
      origins: [{
        origin: dominioUrl.origin,
        localStorage: localStorageData,
      }],
      meta: {
        environment: envConfig.current,
        createdAt: new Date().toISOString(),
        dominio: dominioUrl.origin
      }
    };
  } catch (error) {
    console.error('Erro ao construir storage state:', error);
    throw error;
  }
}

export default globalSetup;