import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CadastroPage } from '../../pages/CadastroUsuarioPage';
import { HomePageAdmin } from '../../pages/HomePageAdmin';
import { makeUser } from '../../support/factories/userFactory';

test.describe('Home - Usuário Admin', () => {
    let loginPage: LoginPage;
    let homePageAdmin: HomePageAdmin;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        homePageAdmin = new HomePageAdmin(page);

        const cadastroPage = new CadastroPage(page);
        const user = makeUser();
        await cadastroPage.navigate();
        await cadastroPage.cadastrar(user.nome, user.email, user.password, true);
        await page.waitForURL('/admin/home');
    });

    test('deve exibir mensagem de boas vindas com nome do usuário', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Bem vindo' })).toBeVisible();
    });

    test('deve exibir todos os cards na home', async () => {
        await expect(homePageAdmin.cadastrarUsuariosCard).toBeVisible();
        await expect(homePageAdmin.listarUsuariosCard).toBeVisible();
        await expect(homePageAdmin.cadastrarProdutosCard).toBeVisible();
        await expect(homePageAdmin.listarProdutosCard).toBeVisible();
        await expect(homePageAdmin.relatoriosCard).toBeVisible();
    });

    test('deve navegar para cadastro de usuários pelo card', async ({ page }) => {
        await homePageAdmin.cadastrarUsuariosCard.click();
        await expect(page).toHaveURL('/admin/cadastrarusuarios');
    });

    test('deve navegar para listagem de usuários pelo card', async ({ page }) => {
        await homePageAdmin.listarUsuariosCard.click();
        await expect(page).toHaveURL('/admin/listarusuarios');
    });

    test('deve navegar para cadastro de produtos pelo card', async ({ page }) => {
        await homePageAdmin.cadastrarProdutosCard.click();
        await expect(page).toHaveURL('/admin/cadastrarprodutos');
    });

    test('deve navegar para listagem de produtos pelo card', async ({ page }) => {
        await homePageAdmin.listarProdutosCard.click();
        await expect(page).toHaveURL('/admin/listarprodutos');
    });
});