import { test, expect } from '@playwright/test';
import { CadastroPage } from '../../pages/CadastroPage';
import { HomePageAdmin } from '../../pages/HomePageAdmin';
import { makeUser } from '../../support/factories/userFactory';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Navegação', () => {
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

    test('deve navegar para cadastro de usuários pelo menu', async ({ page }) => {
        await homePageAdmin.cadastrarUsuariosLink.click();
        await expect(page).toHaveURL('/admin/cadastrarusuarios');
    });

    test('deve navegar para listagem de usuários pelo menu', async ({ page }) => {
        await homePageAdmin.listarUsuariosLink.click();
        await expect(page).toHaveURL('/admin/listarusuarios');
    });

    test('deve navegar para cadastro de produtos pelo menu', async ({ page }) => {
        await homePageAdmin.cadastrarProdutosLink.click();
        await expect(page).toHaveURL('/admin/cadastrarprodutos');
    });

    test('deve navegar para listagem de produtos pelo menu', async ({ page }) => {
        await homePageAdmin.listarProdutosLink.click();
        await expect(page).toHaveURL('/admin/listarprodutos');
    });
});