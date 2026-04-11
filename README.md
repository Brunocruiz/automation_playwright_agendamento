# 🎭 Playwright Automation Framework (TypeScript + BDD)

This repository contains a robust and scalable End-to-End (E2E) test automation framework utilizing **Playwright** with **TypeScript**, structured under the **BDD (Behavior Driven Development)** concept with **Cucumber**.

The project was designed following software engineering best practices, ensuring simplified maintenance, efficient execution, and detailed reporting.

---

## 🏗️ Architecture and Technologies

The framework utilizes the following technologies and patterns:

* **Language:** [TypeScript](https://www.typescriptlang.org/) (Strong typing and enhanced code security).
* **Test Engine:** [Playwright](https://playwright.dev/) (Fast and reliable execution across multiple browsers).
* **BDD:** [Cucumber / @playwright-bdd](https://cucumber.io/) (Scenario writing in Gherkin for better collaboration).
* **Design Pattern:** **POM (Page Object Model)** to decouple application logic from test scripts.
* **Data Management:** Managed via environment variables using `.env`.
* **Reporting:** **Allure Report** for visual and detailed dashboards.

---

## 🚀 Key Features

### 🔧 Global Configuration (Setup & Teardown)
Implementation of `global-setup` and `global-teardown` for better lifecycle control of the test suite, allowing:
* **Single Authentication (State Storage):** Avoids repetitive logins by reusing session states.
* **Data Cleanup:** Automated management of test data or logs before and after suite execution.

### 🌐 Multi-Browser Execution
Advanced configuration in `playwright.config.ts` for native support of:
* **Chromium**
* **Firefox**
* **Edge**

### 📊 Dynamic Reporting
Full integration with **Allure Report**, capturing screenshots, videos, and detailed logs for every step executed within Gherkin scenarios.

### 🔐 Environment Management
Usage of `.env` files to protect sensitive data and facilitate seamless switching between environments (Dev, Staging, Production) without modifying the source code.

---

## 🛠️ How to Run the Project

### 1. Prerequisites
* Node.js (v18 or higher)
* NPM or Yarn

### 2. Installation
```bash
# Clone the repository
git clone [https://github.com/Brunocruiz/automation_playwright_agendamento.git](https://github.com/Brunocruiz/automation_playwright_agendamento.git)

# Enter the directory
cd your-repository-name

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
