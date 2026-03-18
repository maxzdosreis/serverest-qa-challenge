import { test, expect } from '@playwright/test';
import { getAuthToken } from '../../support/helpers/apiHelper';
import { makeProduto } from '../../support/factories/produtoFactory';
import { makeCarrinho } from '../../support/factories/carrinhoFactory';

test.describe('GET /carrinhos', () => {
    test('deve listar todos os carrinhos', async ({ request }) => {
        const response = await request.get('/carrinhos');
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body).toHaveProperty('quantidade');
        expect(Array.isArray(body.carrinhos)).toBeTruthy();
    });

    test('deve buscar carrinho por ID existente', async ({ request }) => {
        const token = await getAuthToken();

        // Cria produto e carrinho para buscar
        const produto = makeProduto();
        const produtoCriado = await request.post('/produtos',{
            data: produto,
            headers: { Authorization: token },
        });

        const { _id: produtoId } = await produtoCriado.json();

        const carrinhoCriado = await request.post('/carrinhos', {
            data: makeCarrinho(produtoId),
            headers: { Authorization: token },
        });

        const { _id: carrinhoId } = await carrinhoCriado.json();

        const response = await request.get(`/carrinhos/${carrinhoId}`);
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body).toHaveProperty('_id', carrinhoId);
        expect(Array.isArray(body.produtos)).toBeTruthy();
    });

    test('deve retornar erro ao buscar ID', async ({ request }) => {
        const response = await request.get('/produtos/1234567890123456');
        const body = await response.json();

        expect(response.status()).toBe(400);
        expect(body).toHaveProperty('message');
    });
});

test.describe('POST /carrinhos', () => {
    test('deve criar carrinho com produto válido', async ({ request }) => {
        const token = await getAuthToken();

        // Cria um produto para adicionar ao carrinho
        const produto = makeProduto();
        const produtoCriado = await request.post('/produtos',{
            data: produto,
            headers: { Authorization: token },
        });
        const { _id: produtoId} = await produtoCriado.json();

        const response = await request.post('/carrinhos', {
            data: makeCarrinho(produtoId),
            headers: { Authorization: token },
        });

        const body = await response.json();

        expect(response.status()).toBe(201);
        expect(body.message).toBe('Cadastro realizado com sucesso');
        expect(body).toHaveProperty('_id');
    });

    test('deve rejeitar criação de carrinho sem token', async ({ request }) => {
        const response = await request.post('/carrinhos', {
            data: {
                produtos: [{ idProduto: '1234567890123456', quantidade: 1 }]
            }
        });

        const body = await response.json();

        expect(response.status()).toBe(401);
        expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
    });

    test('deve rejeitar carrinho duplicado para o mesmo usuário', async ({ request }) => {
        const token = await getAuthToken();

        // Cria um produto
        const produto = makeProduto();
        const produtoCriado = await request.post('/produtos', {
            data: produto,
            headers: { Authorization: token },
        });
        const { _id: produtoId} = await produtoCriado.json();

        // Cria o carrinho pela primeira vez
        const carrinho = makeCarrinho(produtoId);
        const carrinhoCriado = await request.post('/carrinhos', {
            data: carrinho,
            headers: { Authorization: token},
        });

        // Tenta criar novamente com o mesmo usuário
        const response = await request.post('/carrinhos', {
            data: carrinho,
            headers: { Authorization: token},
        })

        const body = await response.json();

        expect(response.status()).toBe(400);
        expect(body.message).toBe('Não é permitido ter mais de 1 carrinho');
    });
});

test.describe('DELETE /carrinhos', () => {
    test('deve concluir compra e deletar carrinho', async ({ request }) => {
        const token = await getAuthToken();

        // Cria produto e carrinho
        const produto = makeProduto();
        const produtoCriado = await request.post('/produtos', {
            data: produto,
            headers: { Authorization: token},
        });
        const { _id: produtoId} = await produtoCriado.json();
        
        const carrinho = makeCarrinho(produtoId);
        await request.post('/carrinhos', {
            data: carrinho,
            headers: { Authorization: token},
        });

        const response = await request.delete('/carrinhos/concluir-compra', {
            headers: { Authorization: token },
        });

        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.message).toBe('Registro excluído com sucesso');
    });

    test('deve rejeitar conclusão de venda e exclusão de carrinho sem token', async ({ request }) => {
        const token = await getAuthToken();

        // Cria produto e carrinho
        const produto = makeProduto();
        const produtoCriado = await request.post('/produtos', {
            data: produto,
            headers: { Authorization: token},
        });
        const { _id: produtoId} = await produtoCriado.json();
        
        const carrinho = makeCarrinho(produtoId);
        await request.post('/carrinhos', {
            data: carrinho,
            headers: { Authorization: token},
        });

        const response = await request.delete('/carrinhos/concluir-compra');

        const body = await response.json();

        expect(response.status()).toBe(401);
        expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
    });

    test('deve cancelar comprar e restituir estoque', async ({ request }) => {
        const token = await getAuthToken();

        // Cria produto e carrinho
        const produto = makeProduto();
        const produtoCriado = await request.post('/produtos', {
            data: produto,
            headers: { Authorization: token },
        });
        const { _id: produtoId } = await produtoCriado.json();

        const carrinho = makeCarrinho(produtoId);
        await request.post('/carrinhos', {
            data: carrinho,
            headers: { Authorization: token}, 
        });

        const response = await request.delete('/carrinhos/cancelar-compra', {
            headers: { Authorization: token},
        });
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.message).toBe('Registro excluído com sucesso. Estoque dos produtos reabastecido');
    });

    test('deve rejeitar cancelar comprar e restituir estoque', async ({ request }) => {
        const token = await getAuthToken();

        // Cria produto e carrinho
        const produto = makeProduto();
        const produtoCriado = await request.post('/produtos', {
            data: produto,
            headers: { Authorization: token },
        });
        const { _id: produtoId } = await produtoCriado.json();

        const carrinho = makeCarrinho(produtoId);
        await request.post('/carrinhos', {
            data: carrinho,
            headers: { Authorization: token}, 
        });

        const response = await request.delete('/carrinhos/cancelar-compra');
        const body = await response.json();

        expect(response.status()).toBe(401);
        expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
    });
});