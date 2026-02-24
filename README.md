# 🎭 Playwright Automation Framework (TypeScript + BDD)

Este repositório contém um framework de automação de testes de ponta a ponta (E2E) robusto e escalável, utilizando **Playwright** com **TypeScript**, estruturado sob o conceito de **BDD (Behavior Driven Development)** com **Cucumber**.

O projeto foi desenhado seguindo as melhores práticas de engenharia de software, garantindo manutenção simplificada, execução eficiente e relatórios detalhados.

---

## 🏗️ Arquitetura e Tecnologias

O framework utiliza as seguintes tecnologias e padrões:

* **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Tipagem forte e maior segurança no código).
* **Engine de Testes:** [Playwright](https://playwright.dev/) (Execução rápida e confiável em múltiplos browsers).
* **BDD:** [Cucumber / @playwright-bdd](https://cucumber.io/) (Escrita de cenários em Gherkin para melhor colaboração).
* **Padrão de Projeto:** **POM (Page Object Model)** para desacoplar a lógica da aplicação dos scripts de teste.
* **Massa de Dados:** Gerenciamento via variáveis de ambiente com `.env`.
* **Relatórios:** **Allure Report** para dashboards visuais e detalhados.

---

## 🚀 Funcionalidades Principais

### 🔧 Configuração Global (Setup & Teardown)
Implementação de `global-setup` e `global-teardown` para melhor controle do ciclo de vida dos testes, permitindo:
* Autenticação única (State Storage) para evitar logins repetitivos.
* Limpeza de massa de dados ou logs antes/após a execução da suite.

### 🌐 Execução Multi-Browser
Configuração avançada no `playwright.config.ts` para suporte nativo a:
* **Chromium**
* **Firefox**
* **Edge**

### 📊 Relatórios Dinâmicos
Integração completa com o **Allure Report**, capturando screenshots, vídeos e logs detalhados de cada passo executado nos cenários Gherkin.

### 🔐 Gerenciamento de Ambientes
Uso de arquivos `.env` para proteger dados sensíveis e facilitar a troca de contextos (Dev, Homologação, Produção) sem alterar o código fonte.

---

## 🛠️ Como Executar o Projeto

### 1. Pré-requisitos
* Node.js (v18 ou superior)
* NPM ou Yarn

### 2. Instalação
```bash
# Clone o repositório
git clone [https://github.com/Brunocruiz/automation_playwright_agendamento](https://github.com/Brunocruiz/automation_playwright_agendamento.git)

# Entre na pasta
cd seu-repositorio

# Instale as dependências
npm install

# Instale os browsers do Playwright
npx playwright install

# Rode o comando npm
npm run test:login