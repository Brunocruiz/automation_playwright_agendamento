import { LoginElementsMap} from '../Pages/LoginPageObject/LoginElementsMap';
import { CadastroElementsMap} from '../Pages/CadastroPageObject/CadastroElementsMap';
import { click, fill, getCredentials, navegation, waitForSelector } from '../Utils/support';
import { createBdd } from 'playwright-bdd';

import { expect, Page } from '@playwright/test';

type StepContext = { page: Page };

const { Given, When, Then } = createBdd();

Given('que acessei a tela de login', async ({ page }) => {
    console.log('➡️ Realizando navegação...');
    await navegation(page, "/login");
    await page.waitForLoadState('domcontentloaded');
    console.log('✅ Navegação realizada com sucesso!\n');
});

When("preencho o campo de email", async ({ page }: StepContext) => {
    console.log('➡️ Realizando preenchimento de campo...');
    const credentials = getCredentials();
    const email = credentials.email || '';
    await fill(page, LoginElementsMap.emailInput, email);
    console.log('✅ Preenchimento de campo realizado com sucesso!\n');
});

When("preencho o campo de senha", async ({ page }: StepContext) => {
    console.log('➡️ Realizando preenchimento de campo...');
    const credentials = getCredentials();
    const password = credentials.senha || '';
    await fill(page, LoginElementsMap.passwordInput, password);
    console.log('✅ Preenchimento de campo realizado com sucesso!\n');
});

When("clico no botão de login", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, LoginElementsMap.loginButton);
    console.log('✅ Click realizado com sucesso!\n');
});

When("preencho o campo de email incorretamente", async ({ page }: StepContext) => {
    console.log('➡️ Realizando preenchimento de campo...');
    await fill(page, LoginElementsMap.emailInput, 'teste@teste.com');
    console.log('✅ Preenchimento de campo realizado com sucesso!\n');
});

When("preencho o campo de senha incorretamente", async ({ page }: StepContext) => {
    console.log('➡️ Realizando preenchimento de campo...');
    await fill(page, LoginElementsMap.passwordInput, 'teste123');
    console.log('✅ Preenchimento de campo realizado com sucesso!\n');
});

When("mantenho os campos vazios", async ({ page }: StepContext) => {
    console.log('➡️ Realizando espera de ação...');
    console.log('✅ Realizado com sucesso!\n');
});

When("clico no link de cadastre-se", async ({ page }: StepContext) => {
    console.log('➡️ Realizando click...');
    await click(page, LoginElementsMap.signUpLink);
    console.log('✅ Click realizado com sucesso!\n');
});

Then("devo ser redirecionado para o dashboard", async ({ page }: StepContext) => {
    console.log('➡️ Realizando rastreio de elementos...');
    await page.waitForURL("/dashboard");
    await page.waitForLoadState('domcontentloaded');
    console.log('✅ Elementos encontrados com sucesso!\n');
});

Then("deve ser exibido um toast de credenciais inválidas", async ({ page }: StepContext) => {
    console.log('➡️ Realizando rastreio de elementos...');
    await waitForSelector(page, LoginElementsMap.errorCredentialsMessage);
    console.log('✅ Elementos encontrados com sucesso!\n');
});

Then("deve ser exibido mensagens de erro indicando os campos", async ({ page }: StepContext) => {
    console.log('➡️ Realizando rastreio de elementos...');
    await waitForSelector(page, LoginElementsMap.errorEmailMessage);
    await waitForSelector(page, LoginElementsMap.errorPasswordMessage);
    console.log('✅ Elementos encontrados com sucesso!\n');
});

Then("devo ser redirecionado para a tela de cadastro", async ({ page }: StepContext) => {
    console.log('➡️ Realizando rastreio de elementos...');
    await page.waitForURL("/register");
    await page.waitForLoadState('domcontentloaded');

    //Campos e elementos tela de cadastro
    await waitForSelector(page, CadastroElementsMap.signUpTitle);
    await waitForSelector(page, CadastroElementsMap.nameInput);
    await waitForSelector(page, CadastroElementsMap.emailInput);
    await waitForSelector(page, CadastroElementsMap.passwordInput);
    await waitForSelector(page, CadastroElementsMap.confirmPasswordInput);
    await waitForSelector(page, CadastroElementsMap.submitButton);
    await waitForSelector(page, CadastroElementsMap.loginLink);
    console.log('✅ Elementos encontrados com sucesso!\n');
});