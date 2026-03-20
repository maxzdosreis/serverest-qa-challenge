import { test, expect } from '@playwright/test';
import { CadastroPage } from '../../pages/CadastroUsuarioPage';
import { CadastroProdutoPage } from '../../pages/CadastroProdutoPage';
import { HomePageAdmin } from '../../pages/HomePageAdmin';
import { makeUser } from '../../support/factories/userFactory';
import { makeProduto } from '../../support/factories/produtoFactory';

test.describe('Cadastrar Produto', () => {
    let cadastroProdutoPage: CadastroProdutoPage;

    test.beforeEach(async ({ page }) => {
        cadastroProdutoPage = new CadastroProdutoPage(page);

        // Cria usuário admin e faz login
        const cadastroPage = new CadastroPage(page);
        const user = makeUser({ administrador: 'true' });
        await cadastroPage.navigate();
        await cadastroPage.cadastrar(user.nome, user.email, user.password, true);
        await page.waitForURL(/home/);
    });

    test('deve cadastrar um produto com sucesso', async ({ page }) => {
        const produto = makeProduto();
        await cadastroProdutoPage.navigate();
        await cadastroProdutoPage.cadastrarProduto(
            produto.nome,
            produto.preco,
            produto.descricao,
            produto.quantidade,
        );

        await expect(page).toHaveURL('/admin/listarprodutos');
    });

    test('deve exibir alerta ao cadastrar sem nome', async () => {
        await cadastroProdutoPage.navigate();
        await cadastroProdutoPage.cadastrarButton.click();

        await expect(
        cadastroProdutoPage.page.getByRole('alert').filter({ hasText: 'Nome é obrigatório' })).toBeVisible();
    });

    test('deve exibir alerta ao cadastrar sem preço', async () => {
        const produto = makeProduto();
        await cadastroProdutoPage.navigate();
        await cadastroProdutoPage.nomeInput.fill(produto.nome);
        await cadastroProdutoPage.cadastrarButton.click();

        await expect(
        cadastroProdutoPage.page.getByRole('alert').filter({ hasText: 'Preco é obrigatório' })).toBeVisible();
    });

    test('deve navegar para cadastro de produto pelo card da home', async ({ page }) => {
        const homePage = new HomePageAdmin(page);
        await homePage.cadastrarProdutosCard.click();

        await expect(page).toHaveURL('/admin/cadastrarprodutos');
    });
});