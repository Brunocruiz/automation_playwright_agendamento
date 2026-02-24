// hooks.ts
import { createBdd } from 'playwright-bdd';
import * as allure from "allure-js-commons";
import { ContentType } from "allure-js-commons";
import { Page, BrowserContext } from 'playwright';
import type { TestInfo } from '@playwright/test';
import * as env from '../playwright.env';
import fs from 'fs';
import { AfterAll, Status } from '@cucumber/cucumber';

const { BeforeAll, Before, After, AfterStep } = createBdd();

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

type SessionRequirement = 'none' | 'user' | 'profile';

const SESSION_TAGS: Record<SessionRequirement, Set<string>> = {
  none: new Set(['@session:none', '@sem-sessao', '@no-session', '@sessao:none']),
  user: new Set(['@session:user', '@perfil:pendente', '@session:usuario']),
  profile: new Set(['@session:profile', '@profile:required', '@perfil:selecionado'])
};

let currentTestFailed = false;
let currentPage: Page | null = null;
let currentContext: BrowserContext | null = null;

BeforeAll(async function() {
  console.log('🧪 Iniciando execução de testes...');
});

Before(async function ({ page, context, $tags, $testInfo }: { page: Page; context: BrowserContext; $tags: string[], $testInfo: any }) {

  currentTestFailed = false;
  currentPage = page;
  currentContext = context;
  
  console.log(`🎬 [TEST] Título: ${$testInfo?.title || 'Desconhecido'}`);
  console.log(`🎬 [TEST] Tags: ${$tags?.join(', ') || 'Nenhuma'}`);
  const sessionRequirement = resolveSessionRequirement($tags || []);

  page.setDefaultTimeout(15000);
  page.setDefaultNavigationTimeout(10000);
  context.setDefaultTimeout(30000);

  if (sessionRequirement === 'none') {
    console.log('ℹ️ Cenário marcado para iniciar sem sessão reaproveitada. Limpando estado do navegador...');
    await clearContextState(context, page);
    return;
  }

  const statePath = sessionRequirement === 'user'
    ? env.sessionUserFilePath
    : env.sessionProfileFilePath;

  await restoreSessionFromFile(context, page, statePath, sessionRequirement);
});

After(async function ({ page, context, $testInfo }: { page: Page; context: BrowserContext; $testInfo: TestInfo }) {
  const scenarioStatus = $testInfo?.status;
  
  if (scenarioStatus === 'failed' || scenarioStatus === 'timedOut') {
    console.log(`⚠️ Cenário [${$testInfo?.title}] falhou. Fechando recursos imediatamente...`);
    
    try {
      await page.route('**/*', route => route.abort());
      
      await page.close({ runBeforeUnload: false }).catch(() => {});
      await context.close().catch(() => {});
    } catch (error) {
      console.warn('Erro ao fechar recursos após falha:', error);
    }
    
    currentPage = null;
    currentContext = null;
  }
});

AfterStep(async function ({ page, $step, $bddContext }: any) {
  const stepStatus = $bddContext?.testInfo?.error ? 'failed' : 'passed';

  const scenarioTitle = $bddContext?.testInfo?.title ?? 'cenario-desconhecido';
  const stepTitle = $step?.title ?? 'passo-desconhecido';

  if (stepStatus === 'failed' && !currentTestFailed) {
    currentTestFailed = true;
    console.log(`❌ Step [${stepTitle}] falhou. Tirando screenshot...`);

    try {
      await page.waitForTimeout(800);

      const screenshot = await page.screenshot({
        fullPage: true,
        timeout: 8000,
        animations: 'disabled'
      });

      await allure.attachment(
        `FAILED Screenshot | ${scenarioTitle} | ${stepTitle}`,
        screenshot,
        ContentType.PNG
      );

    } catch (error) {
      console.warn('⚠️ Falha no screenshot fullPage, tentando fallback...', error);

      try {
        const fallback = await page.screenshot({
          timeout: 5000,
          animations: 'disabled'
        });

        await allure.attachment(
          `FAILED Screenshot (fallback) | ${scenarioTitle} | ${stepTitle}`,
          fallback,
          ContentType.PNG
        );
      } catch (e) {
        console.warn('❌ Screenshot fallback também falhou:', e);
      }
    }
  }

  if (!currentTestFailed) {
    try {
      await page.waitForTimeout(500);

      const screenshot = await page.screenshot({
        fullPage: true,
        timeout: 5000,
        animations: 'disabled'
      });

      await allure.attachment(
        `Screenshot | ${scenarioTitle} | ${stepTitle}`,
        screenshot,
        ContentType.PNG
      );

    } catch (error) {
      console.warn('⚠️ Não foi possível tirar screenshot do step:', error);
    }
  }
});

export async function executeIfNotFailed<T>(
  action: () => Promise<T>,
  actionName: string
): Promise<T | null> {
  if (currentTestFailed) {
    console.log(`⏭️ Pulando "${actionName}" - teste já falhou`);
    return null;
  }
  
  try {
    return await action();
  } catch (error) {
    currentTestFailed = true;
    throw error;
  }
}

function resolveSessionRequirement(tags: string[]): SessionRequirement {
  const normalizedTags = tags.map(tag => tag.toLowerCase());

  if (normalizedTags.some(tag => SESSION_TAGS.none.has(tag))) {
    return 'none';
  }

  if (normalizedTags.some(tag => SESSION_TAGS.user.has(tag))) {
    return 'user';
  }

  if (normalizedTags.some(tag => SESSION_TAGS.profile.has(tag))) {
    return 'profile';
  }

  return 'profile';
}

async function clearContextState(context: BrowserContext, page: Page) {
  await context.clearCookies();
  await context.clearPermissions();

  try {
    await page.goto(process.env.DOMINIO ?? 'https://agendapro-web.lovable.app/', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  } catch (error) {
    console.warn('Não foi possível limpar local/session storage:', error);
  }
}

async function restoreSessionFromFile(
  context: BrowserContext,
  page: Page,
  statePath: string,
  requirement: SessionRequirement
) {
  if (!fs.existsSync(statePath)) {
    console.warn(`⚠️ Arquivo de sessão (${statePath}) não encontrado. O cenário prosseguirá sem restauração.`);
    return;
  }

  try {
    const storageState = JSON.parse(fs.readFileSync(statePath, 'utf-8'));

    console.log(`📦 Restaurando ${storageState.cookies?.length} cookies para sessão (${requirement})...`);

    if (storageState.cookies && storageState.cookies.length > 0) {
      await context.addCookies(storageState.cookies);

      storageState.cookies.forEach((cookie: any, index: number) => {
        console.log(
          `🍪 [${index + 1}] ${cookie.name}=${cookie.value} | domain=${cookie.domain} | path=${cookie.path} | expires=${cookie.expires}`
        );
      });
    }

    if (storageState.origins && storageState.origins.length > 0) {
      const mainOrigin = storageState.origins[0];

      await page.goto(mainOrigin.origin, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });

      if (mainOrigin.localStorage && mainOrigin.localStorage.length > 0) {
        await page.evaluate((localStorageData: Array<{ name: string; value: string }>) => {
          localStorageData.forEach(({ name, value }) => {
            localStorage.setItem(name, value);
          });
        }, mainOrigin.localStorage);
      }
    }

    console.log('✅ Sessão restaurada com sucesso');
  } catch (error) {
    console.warn('⚠️ Não foi possível restaurar a sessão:', error);
  }
}