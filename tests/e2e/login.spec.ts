import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CadastroPage } from '../../pages/CadastroPage';
import { makeUser } from '../../support/factories/userFactory';

test.describe('Login', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();2
    });

    test('deve realizar login com credenciais válidas', async ({ page }) => {
        // Cria usuário via API antes de logar
        const cadastroPage = new CadastroPage(page);
        const user = makeUser();

        await cadastroPage.navigate();
        await cadastroPage.cadastrar(user.nome, user.email, user.password);

        await loginPage.navigate();
        await loginPage.login(user.email, user.password);
    });

    test('deve exibir alerta ao tentar logar sem email', async () => {
        await loginPage.enterButton.click();

        await expect(loginPage.page.getByRole('alert').filter({ hasText: 'Email é obrigatório' })).toBeVisible();
    });

    test('deve exibir alerta ao tentar logar sem senha', async ({ request }) => {
        await loginPage.emailInput.fill('teste@gmail.com');
        await loginPage.enterButton.click();

        await expect(loginPage.page.getByRole('alert').filter({ hasText: 'Password é obrigatório' })).toBeVisible();
    });

    test('deve exibir erro ao logar com credenciais inválidas', async () => {
        await loginPage.login('invalida@gmail.com', 'senhaerrada');

        await expect(loginPage.page.getByRole('alert').filter({ hasText: 'Email e/ou senha inválidos' })).toBeVisible();
    });

    test('deve navegar para a tela de cadastro ao clicar em Cadastre-se', async ({ page }) => {
        await loginPage.cadastreseLink.click();

        await expect(page).toHaveURL('/cadastrarusuarios');
    });
});