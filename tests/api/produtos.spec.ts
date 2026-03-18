import { test, expect } from '@playwright/test';
import { getAuthToken } from '../../support/helpers/apiHelper';
import { makeProduto } from '../../support/factories/produtoFactory';

test.describe('GET /produtos', () => {
    test('deve listar todos os produtos', async ({ request }) => {
        const response = await request.get('/produtos');
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body).toHaveProperty('quantidade');
        expect(Array.isArray(body.produtos)).toBeTruthy();
    });

    test('deve buscar produto por ID existente', async ({ request }) => {
        const token = await getAuthToken();

        // Cria um produto para buscar
        const produto = makeProduto();

        const created = await request.post('/produtos', {
            data: produto,
            headers: { Authorization: token },
        });

        const { _id } = await created.json();

        const response = await request.get(`/produtos/${_id}`);
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.nome).toBe(produto.nome);
    });

    test('deve retornar erro ao buscar ID inexistente', async ({ request }) => {
        const response = await request.get('/produtos/1234567890123456');
        const body = await response.json();

        expect(response.status()).toBe(400);
        expect(body).toHaveProperty('message');
    });
});

test.describe('POST /produtos', () => {
    test('deve criar um novo', async ({ request }) => {
        const token = await getAuthToken();
        const produto = makeProduto();

        const response = await request.post('/produtos', {
            data: produto,
            headers: { Authorization: token},
        });
        const body = await response.json();

        expect(response.status()).toBe(201);
        expect(body.message).toBe('Cadastro realizado com sucesso');
        expect(body).toHaveProperty('_id');
    });

    test('deve rejeitar criação de produto sem token', async ({ request }) => {
        const produto = makeProduto();

        const response = await request.post('/produtos', { data: produto });
        const body = await response.json();

        expect(response.status()).toBe(401);
        expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
    });
});

test.describe('DELETE /produtos', () => {
    test('deve deletar produto existente', async ({ request }) => {
        const token = await getAuthToken();
        const produto = makeProduto();

        const created = await request.post('/produtos', {
            data: produto,
            headers: { Authorization: token},
        });

        const { _id } = await created.json();

        const response = await request.delete(`/produtos/${_id}`, {
            headers: { Authorization: token },
        });

        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.message).toBe('Registro excluído com sucesso')
    });

    test('deve retornar erro ao deletar ID inexistente', async ({ request }) => {
        const token = await getAuthToken();

        const response = await request.delete(`/produtos/1234567890123456`, {
            headers: { Authorization: token },
        });
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.message).toBe('Nenhum registro excluído');
    });

    test('deve rejeitar a exclusão de um produto sem token', async ({ request }) => {
        const token = await getAuthToken();
        const produto = makeProduto();

        const created = await request.post('/produtos', {
            data: produto,
            headers: { Authorization: token},
        });

        const { _id } = await created.json();

        const response = await request.delete(`/produtos/${_id}`);

        const body = await response.json();

        expect(response.status()).toBe(401);
        expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
    });

});