import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly enterButton: Locator;
    readonly cadastreseLink: Locator;

    constructor (page: Page) {
        this.page = page;
        this.emailInput = page.getByTestId('email');
        this.passwordInput = page.getByTestId('senha');
        this.enterButton = page.getByTestId('entrar');
        this.cadastreseLink = page.getByText('Cadastre-se');
    }

    async navigate() {
        await this.page.goto('/login');
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.enterButton.click();
    }
}