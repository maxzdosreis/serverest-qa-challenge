import { Page, Locator } from '@playwright/test';

export class HomePageUser {
    readonly page: Page;
    readonly homeLink: Locator;
    readonly listaDeComprasLink: Locator;
    readonly carrinhoLink: Locator;
    readonly logoutButton: Locator;
    readonly pesquisarInput: Locator;
    readonly botaoPesquisar: Locator;
    readonly paginaInicialButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.homeLink = page.getByTestId('home');
        this.listaDeComprasLink = page.getByTestId('lista-de-compras');
        this.carrinhoLink = page.getByTestId('carrinho');
        this.logoutButton = page.getByTestId('logout');
        this.pesquisarInput = page.getByTestId('pesquisar');
        this.botaoPesquisar = page.getByTestId('botaoPesquisar');
        this.paginaInicialButton = page.getByTestId('paginaInicial');
    }

    async navigate() {
        await this.page.goto('/home');
    }

    async pesquisarProduto(nomeProduto: string) {
        await this.pesquisarInput.fill(nomeProduto);
        await this.botaoPesquisar.click();
    }
}