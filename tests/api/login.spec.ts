import { test, expect, request } from '@playwright/test';
import { makeUser } from '../../support/factories/userFactory';

test.describe('POST /login', () => {
    let email: string;
    let password: string;

    test.beforeAll(async () => {
        // Cria um usuário via API antes dos testes de login
        const context = await request.newContext({
            baseURL: process.env.BASE_URL,
        });

        const user = makeUser();
        email = user.email;
        password = user.password;

        await context.post('/usuarios', { data: user});
        await context.dispose();
    });

    test('deve realizar login com credenciais válidas', async ({ request }) => {
        const response = await request.post('/login', {
            data: { email, password},
        });

        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body).toHaveProperty('authorization');
        expect(body.message).toBe('Login realizado com sucesso');
    });

    test('deve rejeitar login com email inexistente', async ({ request }) => {
        const response = await request.post('/login', {
            data: { email: 'naoexiste@email.com', password: '123456' },
        });

        const body = await response.json();

        expect(response.status()).toBe(401);
        expect(body.message).toBe('Email e/ou senha inválidos');
    });
});