import { Page, Locator } from '@playwright/test';

export class CadastroProdutoPage {
    readonly page: Page;
    readonly nomeInput: Locator;
    readonly precoInput: Locator;
    readonly descricaoInput: Locator;
    readonly quantidadeInput: Locator;
    readonly imagemInput: Locator;
    readonly cadastrarButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nomeInput = page.getByTestId('nome');
        this.precoInput = page.getByTestId('preco');
        this.descricaoInput = page.getByTestId('descricao');
        this.quantidadeInput = page.getByTestId('quantity');
        this.imagemInput = page.getByTestId('imagem');
        this.cadastrarButton = page.getByRole('button', { name: 'Cadastrar' });
    }

    async navigate() {
        await this.page.goto('/admin/')
    }

    async cadastrarProduto(nome: string, preco: number, descricao: string, quantidade: number, imagem: string) {
        await this.nomeInput.fill(nome);
        await this.precoInput.fill(String(preco));
        await this.descricaoInput.fill(descricao);
        await this.quantidadeInput.fill(String(quantidade));
        await this.imagemInput.fill(imagem);
        await this.cadastrarButton.click();
    }
}