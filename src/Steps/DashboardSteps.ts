import { DashboardElementsMap } from '../Pages/DashboardPageObject/DashboardElementsMap';
import { ServicosElementsMap } from '../Pages/ServicosPageObject/ServicosElementsMap';
import { AgendamentoElementsMap } from '../Pages/AgendamentoPageObject/AgendamentoElementsMap';
import { click, fill, navegation, waitForSelector } from '../Utils/support';
import { createBdd } from 'playwright-bdd';

import { expect, Page } from '@playwright/test';

type StepContext = { page: Page };

const { Given, When, Then } = createBdd();

Given('que acessei a tela de dashboard', async ({ page }) => {
    console.log('➡️ Realizando navegação...');
    await page.waitForURL("/dashboard");
    await page.waitForLoadState('domcontentloaded');

    //Elementos tela de Dashboard
    await waitForSelector(page, DashboardElementsMap.welcomeTitle);
    await waitForSelector(page, DashboardElementsMap.totalCard);
    await waitForSelector(page, DashboardElementsMap.agendadosCard);
    await waitForSelector(page, DashboardElementsMap.concluidosCard);
    await waitForSelector(page, DashboardElementsMap.canceladosCard);
    await waitForSelector(page, DashboardElementsMap.novoAgendamentoButton);
    await waitForSelector(page, DashboardElementsMap.verTodosButton);
    await waitForSelector(page, DashboardElementsMap.dashboardMenu);
    await waitForSelector(page, DashboardElementsMap.servicosMenu);
    await waitForSelector(page, DashboardElementsMap.agendamentosMenu);
    await waitForSelector(page, DashboardElementsMap.sairButton);
    console.log('✅ Navegação realizada com sucesso!\n');
});

When("clico no botão de novo agendamento", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, DashboardElementsMap.novoAgendamentoButton);
    console.log('✅ Click realizado com sucesso!\n');
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

When("clico no botão ver todos", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, DashboardElementsMap.verTodosButton);
    console.log('✅ Click realizado com sucesso!\n');
});

When("clico no botão de serviços no menu lateral", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, DashboardElementsMap.servicosMenu);
    console.log('✅ Click realizado com sucesso!\n');
});

When("clico no botão de agendamentos no menu lateral", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, DashboardElementsMap.agendamentosMenu);
    console.log('✅ Click realizado com sucesso!\n');
});

When("clico no botão sair no menu lateral", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, DashboardElementsMap.sairButton);
    console.log('✅ Click realizado com sucesso!\n');
});

Then("deve ser exibido o toast de sucesso no agendamento", async ({ page }: StepContext) => {
    console.log('➡️ Realizando rastreio de elementos...');
    await waitForSelector(page, AgendamentoElementsMap.agendamentoSuccess);
    console.log('✅ Elementos encontrados com sucesso!\n');
});

Then("devo ser redirecionado para a tela de agendamentos", async ({ page }: StepContext) => {
    console.log('➡️ Realizando rastreio de elementos...');
    await page.waitForURL("/appointments");
    await page.waitForLoadState('domcontentloaded');

    //Elementos tela de Agendamentos
    await waitForSelector(page, AgendamentoElementsMap.agendamentoTitle);
    await waitForSelector(page, AgendamentoElementsMap.agendadosCard);
    await waitForSelector(page, AgendamentoElementsMap.concluidosCard);
    await waitForSelector(page, AgendamentoElementsMap.canceladosCard);
    await waitForSelector(page, AgendamentoElementsMap.canceladosCard);
    await waitForSelector(page, AgendamentoElementsMap.novoAgendamentoButton);
    console.log('✅ Elementos encontrados com sucesso!\n');
});

Then("devo ser redirecionado para a tela de serviços", async ({ page }: StepContext) => {
    console.log('➡️ Realizando rastreio de elementos...');
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
    console.log('✅ Elementos encontrados com sucesso!\n');
});