import { test, expect } from '@playwright/test';
import { CadastroPage } from '../../pages/CadastroUsuarioPage';
import { LoginPage } from '../../pages/LoginPage';
import { makeUser } from '../../support/factories/userFactory';

test.describe('Cadastro', () => {
    let cadastroPage: CadastroPage;

    test.beforeEach(async ({ page }) => {
        cadastroPage = new CadastroPage(page);
        await cadastroPage.navigate();
    });

    test('deve cadastrar um novo usuário com sucesso', async ({ page }) => {
        const user = makeUser();
        
        await cadastroPage.cadastrar(user.nome, user.email, user.password);

        await expect(page).toHaveURL('/home')
    });

    test('deve cadastrar um usuário administrador', async ({ page }) => {
        const user = makeUser();
        
        await cadastroPage.cadastrar(user.nome, user.email, user.password, true);

        await expect(page).toHaveURL('/admin/home')
    });

    test('deve exibir alerta ao cadastrar sem nome', async () => {
        await cadastroPage.cadastrarButton.click();

        await expect(cadastroPage.page.getByRole('alert').filter({ hasText: 'Nome é obrigatório '})).toBeVisible();
    });

    test('deve exibir alerta ao cadastrar sem email', async () => {
        await cadastroPage.nomeInput.fill('Teste usuário');
        await cadastroPage.cadastrarButton.click();

        await expect(cadastroPage.page.getByRole('alert').filter({ hasText: 'Email é obrigatório '})).toBeVisible();
    });

    test('deve exibir alerta ao cadastrar sem senha', async () => {
        const user = makeUser();

        await cadastroPage.nomeInput.fill(user.nome);
        await cadastroPage.emailInput.fill(user.email);
        await cadastroPage.cadastrarButton.click();

        await expect(cadastroPage.page.getByRole('alert').filter({ hasText: 'Password é obrigatório'})).toBeVisible();
    });

    test('deve exibir erro ao cadastrar email já existente', async ({ page }) => {
        const user = makeUser();

        // Cadastra pela primeira vez
        await cadastroPage.cadastrar(user.nome, user.email, user.password);

        // Aguarda redirecionar para home
        await page.waitForURL('/home');

        // Tenta cadastrar novamente com o mesmo email
        await cadastroPage.navigate();
        await cadastroPage.cadastrar(user.nome, user.email, user.password);

        await expect(page.getByText('Este email já está sendo usado')).toBeVisible();
    });

    test('deve navegar para login ao clicar em Entrar', async ({ page }) => {
        await cadastroPage.entrarLink.click();

        await expect(page).toHaveURL('/login')
    });
})