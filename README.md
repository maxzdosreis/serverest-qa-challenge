# ServeRest QA Challenge 🧪

Projeto de automação de testes desenvolvido como desafio técnico para a vaga de QA Júnior.

## 📋 Sobre o Projeto

Automação de testes para a aplicação [ServeRest](https://serverest.dev) — uma API REST e front-end de uma loja virtual. O projeto cobre testes de API e testes E2E de front-end, seguindo boas práticas como Page Object Model, factories de dados dinâmicos e organização modular.

A ferramenta escolhida para ambos os tipos de teste foi o **Playwright com TypeScript**. Essa decisão foi intencional: além de ser a ferramenta obrigatória para o front-end, o Playwright possui suporte nativo a testes de API via `APIRequestContext`, o que permitiu manter uma stack única, coesa e alinhada com o ecossistema TypeScript da empresa.

## 🛠️ Stack

- **[Playwright](https://playwright.dev/) + TypeScript** — automação de front-end (obrigatório) e API
- **[@faker-js/faker](https://fakerjs.dev/)** — geração de dados dinâmicos nos testes
- **[dotenv](https://github.com/motdotla/dotenv)** — gerenciamento de variáveis de ambiente
- **GitHub Actions** — execução automática dos testes em CI/CD

## 📁 Estrutura do Projeto
```
serverest-qa-challenge/
├── tests/
│   ├── api/                        # Testes de API REST
│   │   ├── login.spec.ts
│   │   ├── usuarios.spec.ts
│   │   ├── produtos.spec.ts
│   │   └── carrinhos.spec.ts
│   └── e2e/                        # Testes E2E de front-end
│       ├── login.spec.ts
│       ├── cadastro.spec.ts
│       ├── homeAdmin.spec.ts
│       ├── homeUser.spec.ts
│       ├── navegacaoAdmin.spec.ts
│       └── cadastroProduto.spec.ts
├── pages/                          # Page Object Model
│   ├── LoginPage.ts
│   ├── CadastroUsuarioPage.ts
│   ├── HomePageAdmin.ts
│   ├── HomePageUser.ts
│   └── CadastrarProdutoPage.ts
├── support/
│   ├── factories/                  # Geração de dados de teste
│   │   ├── userFactory.ts
│   │   ├── produtoFactory.ts
│   │   └── carrinhoFactory.ts
│   └── helpers/
│       └── apiHelper.ts            # Autenticação centralizada via API
├── playwright.config.ts
├── tsconfig.json
└── .env.example
```

## ⚙️ Pré-requisitos

- Node.js 18+
- npm

### Instalação
1. #### Clone o repositório
```
git clone https://github.com/maxzdosreis/serverest-qa-challenge.git
cd serverest-qa-challenge
```
2.  #### Instale as dependências
```
npm install
```

3. #### Instale os browsers do Playwright
```
npx playwright install
```

4. #### Configure as variáveis de ambiente
```
cp .env.example .env
```

### Executando os testes
- #### Todos os testes
```
npx playwright test
```

- #### Somente testes de API
```
npx playwright test --project=api
```

- #### Somente testes de E2E
```
npx playwright test --project=e2e
```

- #### Com navegador visível
```
npx playwright test --headed
```

- #### Relatório HTML interativo
```
npx playwright show-report
```

## 🧪 Estratégia de Testes

### API

| Recurso | Métodos cobertos |
|---|---|
| `/login` | POST |
| `/usuarios` | GET, POST, PUT, DELETE |
| `/produtos` | GET, POST, PUT, DELETE |
| `/carrinhos` | GET, POST, DELETE |

Cenários cobertos por recurso incluem fluxos de sucesso, validações de campos obrigatórios, autenticação, dados duplicados e IDs inexistentes.

### Front-end

| Tela | Cenários |
|---|---|
| Login | Válido, inválido, campos obrigatórios, navegação |
| Cadastro | Novo usuário, administrador, email duplicado, validações, navegação |
| Home Admin | Cards, navegação |
| Home Usuário | Loja, pesquisa de produtos, navegação, logout |
| Navegação Admin | Todos os links do menu |
| Cadastrar Produto | Cadastro completo, campos obrigatórios |

## ✅ Boas Práticas Adotadas

- **Page Object Model (POM)** — separação entre lógica de interação com a UI e os casos de teste, facilitando manutenção e reuso
- **Factories com Faker.js** — geração de dados dinâmicos e únicos a cada execução, evitando dependência de dados fixos
- **Helper de autenticação centralizado** — token gerado de forma isolada por teste, evitando acoplamento e repetição de código
- **Projetos separados** — `api` e `e2e` configurados independentemente no `playwright.config.ts`
- **Variáveis de ambiente** — URLs e configurações via `.env`, sem hardcode no código
- **Retries configurados** — 1 retry para lidar com instabilidades de rede em APIs públicas
- **Screenshot e vídeo automáticos** — capturados automaticamente em caso de falha, facilitando debug
- **CI/CD com GitHub Actions** — testes executados automaticamente a cada push

## 📊 Cobertura

67 testes automatizados cobrindo API REST e front-end da aplicação ServeRest.