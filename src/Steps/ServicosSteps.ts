import { ServicosElementsMap } from '../Pages/ServicosPageObject/ServicosElementsMap';
import { click, fill, navegation, waitForSelector } from '../Utils/support';
import { createBdd } from 'playwright-bdd';

import { expect, Page } from '@playwright/test';

type StepContext = { page: Page };

const { Given, When, Then } = createBdd();

Given('que acessei a tela de serviços', async ({ page }) => {
    console.log('➡️ Realizando navegação...');
    await page.waitForURL("/services");
    await page.waitForLoadState('domcontentloaded');

    //Elementos tela de Agendamentos
    await waitForSelector(page, ServicosElementsMap.servicosTitle);
    await waitForSelector(page, ServicosElementsMap.corteCabeloCard);
    await waitForSelector(page, ServicosElementsMap.barbaCard);
    await waitForSelector(page, ServicosElementsMap.coloracaoCard);
    await waitForSelector(page, ServicosElementsMap.massagemCard);
    await waitForSelector(page, ServicosElementsMap.manicureCard);
    await waitForSelector(page, ServicosElementsMap.Pedicure);
    await waitForSelector(page, ServicosElementsMap.agendarButton);
    console.log('✅ Navegação realizada com sucesso!\n');
});

When("clico no botão agendar", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, ServicosElementsMap.agendarButton);
    console.log('✅ Click realizado com sucesso!\n');
});