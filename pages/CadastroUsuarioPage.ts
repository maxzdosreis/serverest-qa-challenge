import { Page, Locator } from '@playwright/test';

export class CadastroPage {
    readonly page: Page;
    readonly nomeInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly adminCheckBox: Locator;
    readonly cadastrarButton: Locator;
    readonly entrarLink: Locator;

    constructor (page: Page) {
        this.page = page;
        this.nomeInput = page.getByTestId('nome');
        this.emailInput = page.getByTestId('email');
        this.passwordInput = page.getByTestId('password');
        this.adminCheckBox = page.getByText('Cadastrar como administrador?');
        this.cadastrarButton = page.getByTestId('cadastrar');
        this.entrarLink = page.getByText('Entrar');
    }

    async navigate() {
        await this.page.goto('/cadastrarusuarios');
    }

    async cadastrar(nome: string, email: string, password: string, admin = false) {
        await this.nomeInput.fill(nome);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        if (admin) await this.adminCheckBox.click();
        await this.cadastrarButton.click();
    }
}

