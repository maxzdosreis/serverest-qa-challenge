import { APIRequestContext, request } from '@playwright/test';
import { makeUser } from '../factories/userFactory';

export async function getAuthToken(): Promise<string> {
    const context = await request.newContext({
        baseURL: process.env.BASE_URL
    });

    // Cria um usuário administrador
    const user = makeUser({ administrador: 'true' });
    await context.post('/usuarios', { data: user });

    // Faz login e retorna o token
    const response = await context.post('/login', {
        data: { email: user.email, password: user.password},
    });

    const body = await response.json();
    await context.dispose();

    return body.authorization;
}