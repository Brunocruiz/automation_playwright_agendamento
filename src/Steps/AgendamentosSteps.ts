import { AgendamentoElementsMap } from '../Pages/AgendamentoPageObject/AgendamentoElementsMap';
import { click, fill, navegation, waitForSelector } from '../Utils/support';
import { createBdd } from 'playwright-bdd';

import { expect, Page } from '@playwright/test';

type StepContext = { page: Page };

const { Given, When, Then } = createBdd();

Given('que acessei a tela de agendamentos', async ({ page }) => {
    console.log('➡️ Realizando navegação...');
    await page.waitForURL("/appointments");
    await page.waitForLoadState('domcontentloaded');

    //Elementos tela de Agendamentos
    await waitForSelector(page, AgendamentoElementsMap.agendamentoTitle);
    await waitForSelector(page, AgendamentoElementsMap.agendadosCard);
    await waitForSelector(page, AgendamentoElementsMap.concluidosCard);
    await waitForSelector(page, AgendamentoElementsMap.canceladosCard);
    await waitForSelector(page, AgendamentoElementsMap.canceladosCard);
    await waitForSelector(page, AgendamentoElementsMap.novoAgendamentoButton);
    console.log('✅ Navegação realizada com sucesso!\n');
});

When("seleciono um serviço", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, AgendamentoElementsMap.servicoSelectButton);
    await click(page, AgendamentoElementsMap.servicoCorteButton);
    console.log('✅ Click realizado com sucesso!\n');
});

When("seleciono uma data", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, AgendamentoElementsMap.dataButton);
    console.log('✅ Click realizado com sucesso!\n');
});

When("seleciono um horário", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, AgendamentoElementsMap.horarioButton);
    console.log('✅ Click realizado com sucesso!\n');
});

When("clico no botão de confirmação de agendamento", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, AgendamentoElementsMap.confirmarAgendamentoButton);
    console.log('✅ Click realizado com sucesso!\n');
});

When("não realizo a seleção de nada", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, AgendamentoElementsMap.confirmarAgendamentoButton);
    console.log('✅ Click realizado com sucesso!\n');
});

Then("deve ser exibido o toast de sucesso no agendamento", async ({ page }: StepContext) => {
    console.log('➡️ Realizando rastreio de elementos...');
    await waitForSelector(page, AgendamentoElementsMap.agendamentoSuccess);
    console.log('✅ Elementos encontrados com sucesso!\n');
});

Then("o botão de confirmação de agendamento deve estar desativado", async ({ page }: StepContext) => {
    console.log('➡️ Realizando rastreio de elementos...');
    await waitForSelector(page, AgendamentoElementsMap.confirmarAgendamentoDisableButton);
    console.log('✅ Elementos encontrados com sucesso!\n');
});