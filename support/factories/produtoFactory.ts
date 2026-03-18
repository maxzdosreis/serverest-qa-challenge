import { faker } from "@faker-js/faker";

export interface Produto {
    nome: string;
    preco: number;
    descricao: string;
    quantidade: number;
}

export function makeProduto(overrides?: Partial<Produto>): Produto {
    return {
        nome: faker.commerce.productName(),
        preco: faker.number.int({ min: 1, max: 100 }),
        descricao: faker.commerce.productDescription(),
        quantidade: faker.number.int({ min: 1, max: 100}),
        ...overrides,
    };
}