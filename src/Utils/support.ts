// Arquivo responsável por funções e configurações globais
import { expect, Page, TestInfo } from "playwright/test";
import * as fs from 'fs';
import { TIMEOUT } from "dns";

export type Canal = {
   id: number;
   slug: string;
   title: string;
   channelNumber: number;
   genre: string;
   hlsUrl: string;
   isRegional: boolean;
   geolocation?: { latitude: number; longitude: number; };
};

/**
 * Função para esperar um tempo em milissegundos
 * @param ms tempo em milissegundos
 * @returns Promise<void>
 */
export async function delay(ms: number): Promise<void> {
   return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para obter variáveis de ambiente baseadas no ambiente
function getEnvConfig(ambiente?: string) {
    const env = ambiente || process.env.AMBIENTE || 'dev';
    
    switch (env) {
        case 'prod':
            return {
                dominio: process.env.PROD_DOMINIO || process.env.DOMINIO,
                dominioLogin: process.env.PROD_DOMINIO_LOGIN,
                email: process.env.PROD_EMAIL,
                senha: process.env.PROD_SENHA
            };
        case 'dev':
        default:
            return {
                dominio: process.env.DEV_DOMINIO || process.env.DOMINIO,
                dominioLogin: process.env.DEV_DOMINIO_LOGIN,
                email: process.env.DEV_EMAIL,
                senha: process.env.DEV_SENHA
            };
    }
}

export function getUrls(ambiente?: string) {
    const config = getEnvConfig(ambiente);
    return {
        dominio: config.dominio,
        dominioLogin: config.dominioLogin
    };
}

export function getCredentials(ambiente?: string) {
    const config = getEnvConfig(ambiente);
    return {
        email: config.email,
        senha: config.senha
    }
}

export function getTimeout(): number {
  return Number(process.env.TIMEOUT) || 60000;
}

/**
 * Função para tirar print da tela e anexar a evidência ao relatório
 * @param nome Nome do print
 * @param page Instância da página
 * @param testInfo Informações do teste para anexar o print
 * @returns promise<void>
*/
export async function printScr(
   nome: string,
   page: Page,
   testInfo: TestInfo
) {
   // await waitForDomStability(page, 2000, 5000);
   await testInfo.attach(nome, {
      body: await page.screenshot(),
      contentType: 'image/png'
   });
}


/**
 * Função para realizar a ação de click em elementos
 * @param page     // Instância da página
 * @param selector // Elemento esperado que será rastreado
 * @param timeout // Tempo limite para esperar a página ficar estável
*/
export async function click(
  page: Page,
  selector: string
): Promise<void> {
  await page.locator(selector).first().click({ timeout: getTimeout() });
}


/**
 * Função para realizar a ação de preenchimento de campo
 * @param page     // Instância da página
 * @param selector // Elemento esperado que será rastreado
 * @param value    // Texto inserido no campo
 * @param timeout  // Tempo limite para esperar a página ficar estável
*/
export async function fill(
    page: Page, 
    selector: string, 
    value: string, 
    timeout: number = 30000
): Promise<void> {
    await page.locator(selector).fill(value, { timeout });
}


/**
 * Função para realizar a ação de rastreio de elementos
 * @param page     // Instância da página
 * @param selector // Elemento esperado que será rastreado
 * @param value    // Texto inserido no campo
 * @param timeout  // Tempo limite para esperar a página ficar estável
*/
export async function waitForSelector(
  page: Page,
  selector: string,
  options: {
    state?: 'visible' | 'hidden' | 'attached' | 'detached';
  } = {}
): Promise<void> {
  const { state = 'visible' } = options;

  try {
    await page.waitForSelector(selector, { state });
  } catch (error) {
    throw new Error(`❌ Elemento não encontrado: ${selector}`);
  }
}

/**
* Função para realizar o scroll até o final da página
* @returns
*/
export async function scrollToBottom(
  page: Page,
  options?: {
    timeout?: number;
    scrollStep?: number;
    delayBetweenScrolls?: number;
  }
): Promise<void> {
  const {
    timeout = 30000,
    scrollStep = 500,
    delayBetweenScrolls = 300,
  } = options || {};

  const startTime = Date.now();
  let lastScrollPosition = 0;
  let scrollAttempts = 0;
  let hasReachedBottom = false;

  while (Date.now() - startTime < timeout && !hasReachedBottom) {
    scrollAttempts++;

    const { isAtBottom, currentScrollPosition } = await page.evaluate(
      async ({ scrollStep, delayBetweenScrolls }) => {
        window.scrollBy({
          top: scrollStep,
          behavior: 'smooth',
        });

        await new Promise((resolve) => setTimeout(resolve, delayBetweenScrolls));

        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;
        const totalHeight = document.body.scrollHeight;

        return {
          isAtBottom: scrollPosition + viewportHeight >= totalHeight - 10,
          currentScrollPosition: scrollPosition,
        };
      },
      { scrollStep, delayBetweenScrolls }
    );

    hasReachedBottom = isAtBottom;

    if (currentScrollPosition === lastScrollPosition) {
      await page.mouse.wheel(0, scrollStep);
      await page.waitForTimeout(delayBetweenScrolls);
    }

    lastScrollPosition = currentScrollPosition;

    if (hasReachedBottom) break;
  }

  console.log(`Rolagem concluída em ${scrollAttempts} tentativas`);

  if (!hasReachedBottom) {
    console.warn(
      'Aviso: Não foi possível rolar até o final da página dentro do tempo limite'
    );
  }
}

export interface ScrollOptions {
  /** Número de rolagens a serem executadas (padrão: 1) */
  scrollCount?: number;
  /** Quantidade de pixels a rolar por vez (padrão: 500) */
  scrollStep?: number;
  /** Tempo de espera entre rolagens em ms (padrão: 800) */
  delayBetweenScrolls?: number;
  /** Comportamento da rolagem: 'auto' ou 'smooth' (padrão: 'smooth') */
  behavior?: ScrollBehavior;
  /** Se deve verificar se chegou ao final da página (padrão: false) */
  checkBottom?: boolean;
}


/**
 * Executa rolagens na página conforme configuração
 * @param page Instância do Playwright Page
 * @param options Configurações da rolagem
 */
export async function performScroll(
  page: Page,
  options?: ScrollOptions
): Promise<void> {
  const {
    scrollCount = 1,
    scrollStep = 500,
    delayBetweenScrolls = 800,
    behavior = 'smooth',
    checkBottom = false,
  } = options || {};

  for (let i = 0; i < scrollCount; i++) {
    // Executa a rolagem
    await page.evaluate(
      ({ step, behavior }) => {
        window.scrollBy({
          top: step,
          behavior,
        });
      },
      { step: scrollStep, behavior }
    );

    // Aguarda o tempo configurado
    await page.waitForTimeout(delayBetweenScrolls);

    // Verifica se chegou ao final (se solicitado)
    if (checkBottom) {
      const isAtBottom = await page.evaluate(() => {
        return window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;
      });

      if (isAtBottom) break;
    }
  }
}

export interface HoverOptions {
  /** Timeout para operações (padrão: 10000ms) */
  timeout?: number;
  /** Força o hover mesmo se elemento estiver oculto */
  force?: boolean;
  /** Posição específica dentro do elemento */
  position?: { x: number; y: number };
  /** Modificadores de teclado */
  modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[];
  /** Seletor personalizado (obrigatório) */
  customSelector: string; // Agora é obrigatório
  /** Índice do elemento se houver múltiplos (padrão: 0) */
  elementIndex?: number;
}


/**
 * Executa hover em um elemento usando seletor customizado
 * @param page Instância do Playwright Page
 * @param options Opções de configuração do hover (customSelector é obrigatório)
 */

export async function hoverOnElement(
  page: Page,
  options: HoverOptions
): Promise<void> {
  const {
    timeout = 10000,
    force = false,
    position,
    modifiers,
    customSelector,
    elementIndex = 0
  } = options;

  try {
    const elements = page.locator(customSelector);
    const count = await elements.count();
    
    console.log(`🔍 Encontrados ${count} elementos com o seletor: ${customSelector}`);
    
    if (count === 0) {
      throw new Error(`Nenhum elemento encontrado com o seletor: ${customSelector}`);
    }

    const element = elements.first();
    
    await expect(element).toBeAttached({ timeout });
    await expect(element).toBeVisible({ timeout });
    
    // Executa o hover apenas no primeiro elemento
    await element.hover({
      force,
      position,
      modifiers,
      timeout,
    });

    await page.waitForTimeout(300);
    
    console.log(`✅ Hover executado com sucesso no primeiro elemento de ${count}: ${customSelector}`);
    
  } catch (error) {
    throw new Error(`Falha ao fazer hover no primeiro elemento ${customSelector}`);
  }
}


/**
 * Executa navegação de URLs customizado ou padrão .env.DOMINIO
 */
interface NavegationOptions {
    waitUntil?: 'domcontentloaded' | 'load' | 'networkidle';
    log?: boolean;
    dominio?: string; // Permite sobrescrever o DOMINIO do .env
    ambiente?: 'dev' | 'prod'; // Permite sobrescrever o ambiente
}

export async function navegation(page: Page, path: string, options?: NavegationOptions): Promise<void> {
    
    const {
        waitUntil = 'domcontentloaded',
        log = true,
        dominio: dominioCustomizado,
        ambiente: ambienteCustomizado
    } = options || {};

    const ambiente = ambienteCustomizado || process.env.AMBIENTE || 'dev';
    
    // Usa domínio customizado ou obtém do ambiente apropriado
    let dominio;
    if (dominioCustomizado) {
        dominio = dominioCustomizado;
    } else {
        const config = getEnvConfig(ambiente);
        dominio = config.dominio;
    }

    if (!dominio) {
        throw new Error(`❌ Variável de ambiente DOMINIO não está definida para o ambiente: ${ambiente}`);
    }

    // Constrói a URL
    const baseUrl = dominio.replace(/\/+$/, '');
    const pathFormatted = path.startsWith('/') ? path.slice(1) : path;
    const url = `${baseUrl}/${pathFormatted}`;

    if (log) {
        console.log(`🌐 Navegando para: ${url}`);
        console.log(`📁 Ambiente: ${ambiente}`);
    }

    try {
        await page.goto(url, { waitUntil});
        
        if (log) {
            console.log('✅ Navegação realizada com sucesso!\n');
        }
        
    } catch (error) {
        console.error(`❌ Erro na navegação: ${error}`);
        throw error;
    }
}


/**
 * Salva o estado da sessão em um arquivo JSON.
 * @param page Instância da página do Playwright.
 * @param storageStatePath Caminho do arquivo onde o estado da sessão será salvo.
 * @returns Promise<void>
 */
export async function saveSessionState(page: Page, storageStatePath: string) {
   const cookies = await page.context().cookies();
   const localStorage = await page.evaluate(() => {
      const entries: { [key: string]: string } = {};
      const length = Number(localStorage.length); // Ensure length is treated as a number
      for (let i = 0; i < length; i++) {
         const key = (localStorage as Storage).key(i); // key() is callable
         if (key) {
            entries[key] = (localStorage as Storage).getItem(key) || ''; // getItem() is callable
         }
      }
      return entries;
   });

   fs.writeFileSync(storageStatePath, JSON.stringify({ cookies, localStorage }, null, 2));
}


/**
 * Restaura o estado da sessão a partir de um arquivo JSON.
 * @param page Instância da página do Playwright.
 * @param storageStatePath Caminho do arquivo onde o estado da sessão está salvo.
 * @returns Promise<void>
 * @throws Error se o arquivo de estado da sessão não for encontrado.
 */
export async function restoreSessionState(page: Page, storageStatePath: string) {
   if (!fs.existsSync(storageStatePath)) {
      throw new Error(`Arquivo de estado da sessão não encontrado: ${storageStatePath}`);
   }

   const { cookies, localStorage } = JSON.parse(fs.readFileSync(storageStatePath, 'utf-8'));

   // Restaurar cookies
   await page.context().addCookies(cookies);

   // Restaurar localStorage com verificação de contexto
   try {
      const currentOrigin = await page.evaluate(() => window.location.origin);
      const expectedOrigin = cookies[0]?.domain ? `https://${cookies[0].domain}` : null;

      if (currentOrigin !== expectedOrigin) {
         throw new Error(`Origem da página (${currentOrigin}) não corresponde à origem esperada (${expectedOrigin}).`);
      }

      await page.evaluate((entries) => {
         for (const [key, value] of Object.entries(entries)) {
            localStorage.setItem(key, value);
         }
      }, localStorage);
   } catch (error) {
        if (error instanceof Error) {
            console.error('Erro ao restaurar o localStorage:', error.message);
        }
   }
}


/**
 * Gera um e-mail aleatório para fins de automação.
 * @param prefix - Opcional: Um prefixo para identificar o tipo de teste (ex: 'admin', 'user').
 * @returns Uma string de e-mail única.
 */
export const generateRandomEmail = (prefix: string = 'test'): string => {
  const randomString = Math.random().toString(36).substring(2, 6);
  
  return `${prefix}_${randomString}@automation.com`;
};