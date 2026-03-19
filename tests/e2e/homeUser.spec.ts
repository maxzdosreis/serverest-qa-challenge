import { test, expect } from '@playwright/test';
import { CadastroPage } from '../../pages/CadastroPage';
import { HomePageUser } from '../../pages/HomePageUser';
import { makeUser } from '../../support/factories/userFactory';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Home - Usuário Comum', () => {
    let loginPage: LoginPage;
    let homePageUser: HomePageUser;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        homePageUser = new HomePageUser(page);
        
        const cadastroPage = new CadastroPage(page);
        const user = makeUser({ administrador: 'false' });
        await cadastroPage.navigate();
        await cadastroPage.cadastrar(user.nome, user.email, user.password, false);
        await page.waitForURL('/home');
    });

    test('deve exibir a Serverest Store', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Serverest Store' })).toBeVisible();
    });

    test('deve exibir menu com Home, Lista de Compras e Carrinho', async () => {
        await expect(homePageUser.homeLink).toBeVisible();
        await expect(homePageUser.listaDeComprasLink).toBeVisible();
        await expect(homePageUser.carrinhoLink).toBeVisible();
    });

    test('deve pesquisar produto sem resultado', async ({ page }) => {
        await homePageUser.pesquisarProduto('produto inexistente xyz');
        await expect(page.getByText('Nenhum produto foi encontrado')).toBeVisible();
    });

    test('deve navegar para lista de compras', async ({ page }) => {
        await homePageUser.listaDeComprasLink.click();
        await expect(page.getByRole('heading', { name: 'Lista de Compras' })).toBeVisible();
    });

    test('deve navegar para carrinho', async ({ page }) => {
        await homePageUser.carrinhoLink.click();
        await expect(page).toHaveURL(/carrinho/);
    });

    test('deve realizar logout com sucesso', async ({ page }) => {
        await homePageUser.logoutButton.click();
        await expect(page).toHaveURL(/login/);
    });

    test('não deve ver menu de administração', async () => {
        await expect(homePageUser.page.getByTestId('cadastrar-usuarios')).not.toBeVisible();
        await expect(homePageUser.page.getByTestId('cadastrar-produtos')).not.toBeVisible();
    });

});