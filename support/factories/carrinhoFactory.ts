import { faker } from "@faker-js/faker";

export interface ItemCarrinho {
    idProduto: string;
    quantidade: number;
}

export interface Carrinho {
    produtos: ItemCarrinho[];
}

export function makeCarrinho(idProduto: string, overrides?: Partial<ItemCarrinho>): Carrinho {
    return {
        produtos: [
            {
                idProduto,
                quantidade: faker.number.int({ min: 1, max: 10 }),
                ...overrides,
            },
        ],
    };
}