import { test, expect, request } from '@playwright/test';
import { makeUser } from '../../support/factories/userFactory';

test.describe('GET /usuarios', () => {
    test('deve listar todos os usuários', async ({ request }) => {
        const response = await request.get('/usuarios');
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body).toHaveProperty('quantidade');
        expect(Array.isArray(body.usuarios)).toBeTruthy();
    });

    test('deve buscar usuário por ID existente', async ({ request }) => {
        // Primeiro cria um usuário para buscar
        const user = makeUser();
        const created = await request.post('/usuarios', { data: user });
        const { _id } = await created.json();

        const response = await request.get(`/usuarios/${_id}`);
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.email).toBe(user.email);
    });

    test('deve retornar erro ao buscar ID inexistente', async ({ request }) => {
        const response = await request.get('/usuarios/1234567890123456');
        const body = await response.json();

        expect(response.status()).toBe(400);
        expect(body).toHaveProperty('message');
    });
});

test.describe('POST/usuarios', () => {
    test('deve criar um novo usuário', async ({ request }) => {
        const user = makeUser();
        const response = await request.post('/usuarios', { data: user });
        const body = await response.json();

        expect(response.status()).toBe(201);
        expect(body.message).toBe('Cadastro realizado com sucesso');
        expect(body).toHaveProperty('_id');
    });

    test('deve rejeitar email duplicado', async ({ request }) => {
        const user = makeUser();

        // Cria o usuário pela primeira vez
        await request.post('/usuarios', { data: user });

        // Tenta criar novamente com o mesmo email
        const response = await request.post('/usuarios', { data: user });
        const body = await response.json();

        expect(response.status()).toBe(400);
        expect(body.message).toBe('Este email já está sendo usado');
    });

    test('deve rejeitar cadastro sem email', async ({ request }) => {
        const user = makeUser({ email: '' });
        const response = await request.post('/usuarios', { data: user});
        const body = await response.json();

        expect(response.status()).toBe(400);
        expect(body).toHaveProperty('email');
    });
});

test.describe('PUT /usuarios', () => {
    test('deve atualizar dados de um usuário existente', async ({ request }) => {
        // Cria um usuário para atualizar
        const user = makeUser();
        const created = await request.post('/usuarios', { data: user });
        const { _id } = await created.json();

        const updatedUser = makeUser();
        const response = await request.put(`/usuarios/${_id}`, {
            data: updatedUser,
        });

        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.message).toBe('Registro alterado com sucesso');
    });

    test('deve criar usuário ao fazer PUT com ID inexistente', async ({ request }) => {
        const user = makeUser();
        const response = await request.put('/usuarios/1234567890123456', {
            data: user,
        });

        const body = await response.json();

        expect(response.status()).toBe(201);
        expect(body.message).toBe('Cadastro realizado com sucesso');
        expect(body).toHaveProperty('_id');
    });

    test('deve rejeitar atualização com email já existente', async ({ request }) => {
        // Cria dois usuários
        const user1 = makeUser();
        const user2 = makeUser();

        await request.post('/usuarios', { data: user1 });
        const created2 = await request.post('/usuarios', { data: user2 });
        const { _id } = await created2.json();

        // Tenta atualizar user2 com o email do user1
        const response = await request.put(`/usuarios/${_id}`, {
            data: { ...user2, email: user1.email }, 
        });

        const body = await response.json();

        expect(response.status()).toBe(400);
        expect(body.message).toBe('Este email já está sendo usado');
    });
});

test.describe('DELETE /usuarios', () => {
    test('deve deletar usuário existente', async ({ request }) => {
        const user = makeUser();
        const created = await request.post('/usuarios', { data: user });
        const { _id } = await created.json();

        const response = await request.delete(`/usuarios/${_id}`);
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.message).toBe('Registro excluído com sucesso');
    });

    test('deve retornar erro ao deletar ID inexistente', async ({ request }) => {
        const response = await request.delete('/usuarios/1234567890123456');
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.message).toBe('Nenhum registro excluído');
    });
});