# Arquitetura & Diretrizes Técnicas — PedalHub

## 1. Visão Geral da Stack

* **Linguagem & Tipagem:** TypeScript (Vanilla TS via Vite) em modo estrito (`strict: true`) para garantir tipagem dos contratos e dados da aplicação.

* **Estrutura & Semântica:** HTML5 semântico (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).

* **Estilização & UI:** Bootstrap 5 via **CDN** (CSS e JS Bundle), utilizando o grid responsivo e componentes/utilitários quando apropriado. Customizações visuais devem preservar a identidade própria da PedalHub.

* **Armazenamento de Dados:** `public/data/products.json` desacoplado do front-end e consumido via `fetch`, demonstrando em pequena escala o princípio de separação entre dados e apresentação utilizado em arquiteturas **Headless Commerce**.

* **Ferramenta de Build & Dev Server:** Vite, responsável pelo ambiente de desenvolvimento, compilação do TypeScript, hot reload e geração dos arquivos estáticos para produção.

* **Compilação Final:** O TypeScript é compilado para JavaScript durante o build, gerando os arquivos estáticos de produção em `dist/`. A aplicação não depende de um servidor backend próprio.

* **Gerenciamento de Estado:** Estado mantido em memória no cliente para busca, filtros e funcionalidades opcionais, como o carrinho simulado. Não haverá banco de dados ou persistência de pedidos.

---

## 2. Estrutura de Diretórios

```text
pedal-hub-ecommerce/

├── .docs/
│   ├── spec.md               # Requisitos funcionais e regras de negócio
│   └── architecture.md       # Decisões de arquitetura e padrões técnicos
│
├── public/
│   ├── data/
│   │   └── products.json     # Catálogo autoral de bikes e acessórios
│   └── favicon.svg           # Ícone da aplicação
│
├── src/
│   ├── types.ts              # Interfaces e tipos (Product, CartItem, FilterState)
│   ├── api.ts                # Camada de consumo assíncrono (fetchProducts)
│   ├── dom.ts                # Funções de renderização da vitrine e do carrinho
│   └── main.ts               # Inicialização, event listeners, filtros e ações
│
├── index.html                # Página principal (vitrine, busca, categorias e carrinho)
│
├── como-fiz.html             # Página com o vídeo explicativo da entrega
│
├── vite.config.ts            # Configuração do Vite e do build da aplicação
│
├── package.json              # Dependências e scripts do projeto
│
├── tsconfig.json             # Configurações do TypeScript
│
└── README.md                 # Instruções de execução local e link do deploy
```

---

## 3. Responsabilidades dos Módulos

### `types.ts`

Centraliza os contratos e tipos utilizados pela aplicação.

Principais tipos:

* `Product`;
* `CartItem`;
* `FilterState`.

Não deve conter manipulação direta do DOM ou chamadas de API.

### `api.ts`

Responsável pelo acesso ao catálogo.

Principal responsabilidade:

* Implementar `fetchProducts()`;
* Consumir `public/data/products.json` por meio de `fetch`;
* Tratar erros de requisição;
* Retornar os produtos para a aplicação.

### `dom.ts`

Responsável pela renderização e atualização da interface.

Principais responsabilidades:

* Renderizar cards de produtos;
* Atualizar a vitrine após busca ou filtro;
* Renderizar o carrinho, caso implementado;
* Exibir estados vazios ou mensagens necessárias na interface.

### `main.ts`

Ponto de entrada da aplicação.

Principais responsabilidades:

* Inicializar a aplicação;
* Carregar os produtos;
* Registrar eventos da interface;
* Controlar busca e filtros;
* Coordenar as funções de `api.ts` e `dom.ts`;
* Gerenciar o estado do carrinho, caso implementado.

---

## 4. Fluxo de Dados

O fluxo principal da aplicação deverá seguir:

```text
products.json
      ↓
   fetch()
      ↓
    api.ts
      ↓
   Product[]
      ↓
    main.ts
      ↓
    dom.ts
      ↓
Interface da loja
```

Os produtos não devem ser definidos diretamente no HTML. A vitrine deve ser construída dinamicamente a partir dos dados carregados do catálogo.

---

## 5. Princípios de Implementação

* Manter responsabilidades separadas entre acesso aos dados, lógica da aplicação e apresentação.
* Evitar código duplicado.
* Evitar abstrações ou dependências desnecessárias.
* Priorizar código simples e fácil de explicar.
* Utilizar TypeScript para reduzir erros relacionados aos dados.
* Utilizar HTML semântico.
* Garantir responsividade da interface.
* Manter os produtos desacoplados do HTML.
* Não adicionar funcionalidades ou tecnologias que não tenham uma justificativa clara para o projeto.

> **Regra principal:** a arquitetura deve permanecer simples o suficiente para que todas as decisões possam ser explicadas e defendidas durante a apresentação técnica.
