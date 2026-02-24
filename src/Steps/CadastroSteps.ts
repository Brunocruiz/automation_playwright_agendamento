import { LoginElementsMap} from '../Pages/LoginPageObject/LoginElementsMap';
import { CadastroElementsMap} from '../Pages/CadastroPageObject/CadastroElementsMap';
import { click, fill, generateRandomEmail, getCredentials, navegation, waitForSelector } from '../Utils/support';
import { createBdd } from 'playwright-bdd';

import { expect, Page } from '@playwright/test';

type StepContext = { page: Page };

const { Given, When, Then } = createBdd();

Given('que acessei a tela de cadastro', async ({ page }) => {
    console.log('➡️ Realizando navegação...');
    await navegation(page, "/register");
    await page.waitForLoadState('domcontentloaded');
    console.log('✅ Navegação realizada com sucesso!\n');
});

When("preencho o campo de nome", async ({ page }: StepContext) => {
    console.log('➡️ Realizando preenchimento de campo...');
    await fill(page, CadastroElementsMap.nameInput, 'Automation');
    console.log('✅ Preenchimento de campo realizado com sucesso!\n');
});

When("preencho o campo de email com email aleatório", async ({ page }: StepContext) => {
    console.log('➡️ Realizando preenchimento de campo...');
    const emailAleatorio = generateRandomEmail('teste');
    await fill(page, CadastroElementsMap.emailInput, emailAleatorio);
    console.log(`➡️ E-mail gerado para o teste: ${emailAleatorio}\n`);
    console.log('✅ Preenchimento de campo realizado com sucesso!\n');
});

When("preencho o campo de confirmação de senha", async ({ page }: StepContext) => {
    console.log('➡️ Realizando preenchimento de campo...');
    const credentials = getCredentials();
    const password = credentials.senha || '';
    await fill(page, CadastroElementsMap.confirmPasswordInput, password);
    console.log('✅ Preenchimento de campo realizado com sucesso!\n');
});

When("clico no botão de cadastro", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, CadastroElementsMap.submitButton);
    console.log('✅ Click realizado com sucesso!\n');
});

When("clico no link de login", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, CadastroElementsMap.loginLink);
    console.log('✅ Click realizado com sucesso!\n');
});

Then("deve ser exibido um toast de conta criada", async ({ page }: StepContext) => {
    console.log('➡️ Realizando rastreio de elementos...');
    await waitForSelector(page, CadastroElementsMap.successMessage);
    console.log('✅ Elementos encontrados com sucesso!\n');
});

Then("deve ser exibido mensagens de erro indicando os campos de cadastro", async ({ page }: StepContext) => {
    console.log('➡️ Realizando rastreio de elementos...');
    await waitForSelector(page, CadastroElementsMap.errorNameMessage);
    await waitForSelector(page, CadastroElementsMap.errorEmailMessage);
    await waitForSelector(page, CadastroElementsMap.errorPasswordMessage);
    console.log('✅ Elementos encontrados com sucesso!\n');
});

Then("deve ser exibido mensagens de erro indicando que as senhas não coincidem", async ({ page }: StepContext) => {
    console.log('➡️ Realizando rastreio de elementos...');
    await waitForSelector(page, CadastroElementsMap.errorPasswordConfirm);
    console.log('✅ Elementos encontrados com sucesso!\n');
});

Then("devo ser redirecionado para a tela de login", async ({ page }: StepContext) => {
    console.log('➡️ Realizando rastreio de elementos...');
    await page.waitForURL("/login");
    await page.waitForLoadState('domcontentloaded');

    //Campos e elementos tela de login
    await waitForSelector(page, LoginElementsMap.loginTitle);
    await waitForSelector(page, LoginElementsMap.emailInput);
    await waitForSelector(page, LoginElementsMap.passwordInput);
    await waitForSelector(page, LoginElementsMap.loginButton);
    await waitForSelector(page, LoginElementsMap.signUpLink);
    console.log('✅ Elementos encontrados com sucesso!\n');
});