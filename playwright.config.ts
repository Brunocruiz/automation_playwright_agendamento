import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { envConfig } from './src/Utils/environment';
import * as fs from 'fs';

// Log da configuração do ambiente
envConfig.logConfig();

// Projetos organizados por categorias
const PROJECTS = {
  desktop: [
    {
      name: 'chrome-desktop',
      use: (() => {
        const base = { ...devices['Desktop Chrome'] } as any;

        const defaultWin = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        const defaultLinux = '/opt/google/chrome/chrome';
        const candidate = process.env.CHROME_BIN ||
          (process.platform === 'win32' ? defaultWin : defaultLinux);

        const hasChrome = fs.existsSync(candidate);

        base.launchOptions = {
          executablePath: hasChrome ? candidate : undefined,
          channel: hasChrome ? 'chrome' : undefined,
          ignoreDefaultArgs: ['--disable-component-update'],
        };

        base.contextOptions = {
          permissions: ['geolocation'],
          viewport: { width: 1920, height: 1080 },
        };

        return base;
      })(),
    },

    {
      name: 'firefox-desktop',
      use: (() => {
        const base = { ...devices['Desktop Firefox'] } as any;
        
        base.contextOptions = {
          permissions: ['geolocation'],
          viewport: { width: 1920, height: 1080 },
        };

        return base;
      })(),
    },

    {
      name: 'edge-desktop',
      use: (() => {
        const base = { ...devices['Desktop Chrome'] } as any;

        const defaultWin = 'C:\\Program Files (x86)\\Microsoft\\Edge Dev\\Application\\msedge.exe';
        const defaultLinux = '/opt/microsoft/msedge-dev/msedge';
        const candidate = process.env.EDGE_BIN ||
          (process.platform === 'win32' ? defaultWin : defaultLinux);

        const hasEdge = fs.existsSync(candidate);

        base.browserName = 'chromium';
        base.launchOptions = {
          executablePath: hasEdge ? candidate : undefined,
          channel: hasEdge ? 'msedge-dev' : undefined,
        };

        base.contextOptions = {
          permissions: ['geolocation'],
          viewport: { width: 1920, height: 1080 },
        };

        return base;
      })(),
    },
  ]
};

type ProjectCategory = keyof typeof PROJECTS;

function getSelectedProjects() {
  const config = envConfig;
  
  // Se projetos específicos foram definidos
  if (config.testProjects.length > 0) {
    const allProjects = Object.values(PROJECTS).flat();
    return allProjects.filter(project =>
      config.testProjects.includes(project.name)
    );
  }

  // Se categorias foram definidas
  if (config.testCategories.length > 0) {
    let projects: typeof PROJECTS[ProjectCategory][number][] = [];

    config.testCategories.forEach((category: string) => {
      if (PROJECTS[category as ProjectCategory]) {
        projects.push(...PROJECTS[category as ProjectCategory]);
      } else {
        console.warn(`Categoria desconhecida: ${category}`);
      }
    });

    return projects;
  }

  // Padrão: retorna apenas desktop em CI, todos local
  if (config.isCI) {
    return PROJECTS.desktop;
  }

  // Local: retorna todos os projetos
  return Object.values(PROJECTS).flat();
}

const testDir: string = defineBddConfig({
  paths: ['Features/*.feature'],
  require: ['Steps/*.ts', 'Hooks/*.ts'],
});

const config: PlaywrightTestConfig = defineConfig({
  testDir,
  timeout: 60000,
  retries: envConfig.retries,
  workers: envConfig.workers,
  fullyParallel: true,
  
  outputDir: 'Reports/test-results',
  reporter: [
    ['line'],
    ['allure-playwright', {
      detail: true,
      resultsDir: 'Reports/allure-results',
      suiteTitle: true,
    }],
    ['html', {
      outputFolder: 'Reports/html-report',
      open: 'never',
    }],
  ],
  use: {
    baseURL: envConfig.dominio,
    headless: envConfig.headless,
    viewport: { width: 1280, height: 720 },
    
    video: {
      mode: envConfig.video,
      size: { width: 1280, height: 720 },
    },
    
    screenshot: {
      mode: envConfig.isCI ? 'only-on-failure' : 'on',
      fullPage: true,
    },
    
    actionTimeout: 5000,
    trace: envConfig.isCI ? 'retain-on-failure' : 'off',
    launchOptions: {
      slowMo: envConfig.slowMo,
      args: ['--start-maximized'],
    },
  },
    globalSetup: './src/Utils/global-setup.ts',
    globalTeardown: './src/Utils/global-teardown.ts',
    projects: getSelectedProjects(),
});

export default config;