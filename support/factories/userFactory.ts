import { faker } from "@faker-js/faker";

export interface User {
    nome: string;
    email: string;
    password: string;
    administrador: string;
}

export function makeUser(overrides?: Partial<User>): User {
    return {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 10 }),
        administrador: 'true',
        ...overrides,
    };
}