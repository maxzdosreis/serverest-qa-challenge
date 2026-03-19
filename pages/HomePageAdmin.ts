import { Page, Locator } from '@playwright/test';

export class HomePageAdmin {
    readonly page: Page;
    readonly homeLink: Locator;
    readonly cadastrarUsuariosLink: Locator;
    readonly listarUsuariosLink: Locator;
    readonly cadastrarProdutosLink: Locator;
    readonly listarProdutosLink: Locator;
    readonly relatoriosLink: Locator;
    readonly cadastrarUsuariosCard: Locator;
    readonly listarUsuariosCard: Locator;
    readonly cadastrarProdutosCard: Locator;
    readonly listarProdutosCard: Locator;
    readonly relatoriosCard: Locator;

    constructor(page: Page) {
        this.page = page;
        this.homeLink = page.getByTestId('home');
        this.cadastrarUsuariosLink = page.getByTestId('cadastrar-usuarios');
        this.listarUsuariosLink = page.getByTestId('listar-usuarios');
        this.cadastrarProdutosLink = page.getByTestId('cadastrar-produtos');
        this.listarProdutosLink = page.getByTestId('listar-produtos');
        this.relatoriosLink = page.getByTestId('link-relatorios');
        this.cadastrarUsuariosCard = page.getByTestId('cadastrarUsuarios');
        this.listarUsuariosCard = page.getByTestId('listarUsuarios');
        this.cadastrarProdutosCard = page.getByTestId('cadastrarProdutos');
        this.listarProdutosCard = page.getByTestId('listarProdutos');
        this.relatoriosCard = page.getByTestId('relatorios');
    }

    async navigate() {
        await this.page.goto('/home')
    }
}