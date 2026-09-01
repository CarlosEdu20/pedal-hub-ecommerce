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
├── .github/
│   └── workflows/
│       └── ci.yml            # Pipeline de Integração Contínua (GitHub Actions)
│
├── public/
│   ├── data/
│   │   └── products.json     # Catálogo autoral desacoplado de bikes e acessórios
│   ├── images/
│   │   ├── banners/          # Banners e imagens de destaque
│   │   └── products/         # Imagens dos produtos em WebP (kebab-case)
│   ├── videos/
│   │   └── apresentacao.mp4  # Vídeo auto-hospedado da entrega técnica
│   └── favicon.svg           # Ícone da aplicação
│
├── src/
│   ├── types.ts              # Interfaces e tipos (Product, CartItem, Order)
│   ├── api.ts                # Camada de consumo assíncrono (fetchProducts)
│   ├── dom.ts                # Funções de renderização da vitrine, carrinho e modais
│   ├── main.ts               # Inicialização, event listeners, filtros e ações
│   └── style.css             # Estilos customizados e variáveis CSS
│
├── index.html                # Página principal (vitrine, busca, categorias e checkout)
│
├── como-fiz.html             # Página técnica com vídeo auto-hospedado e relatório
│
├── vite.config.ts            # Configuração do Vite para build multi-página
│
├── package.json              # Dependências e scripts do projeto
│
├── tsconfig.json             # Configurações estritas do TypeScript
│
└── README.md                 # Instruções de execução local e link do deploy

---

## 3. Responsabilidades dos Módulos

### `types.ts`

Centraliza os contratos e tipos utilizados pela aplicação.

Principais tipos:

* `Product` — interface do objeto produto com campos: `id`, `name`, `description`, `price`, `category` e `image`;
* `ProductCategory` — tipo literal das categorias válidas: `'Bicicletas' | 'Acessórios' | 'Vestuário'`;
* `CartItem` — interface do item no carrinho com `product` (Product) e `quantity` (number).

O estado de filtro e busca (`selectedCategory`, `searchTerm`) é mantido em variáveis de escopo em `main.ts`, não como um tipo separado.

Não deve conter manipulação direta do DOM ou chamadas de API.

### `api.ts`

Responsável pelo acesso ao catálogo.

Principal responsabilidade:

* Exportar `fetchProducts()` como função assíncrona;
* Consumir `public/data/products.json` por meio de `fetch`;
* Tratar erros de requisição com mensagens significativas;
* Retornar array tipado `Product[]` para a aplicação.

**Nota:** Embora definida em `api.ts`, a função pode ser chamada diretamente de `main.ts` ou de qualquer outro módulo que necessite consumir o catálogo.

### `dom.ts`

Responsável pela renderização e atualização da interface.

Principais responsabilidades:

* Exportar utilitário `formatCurrency()` para conversão de valores numéricos em strings de moeda (BRL);
* Implementar `renderProducts()` para renderizar dinamicamente cards de produtos no grid;
* Implementar `renderCart()` para renderizar itens do carrinho, atualizar totais e gerenciar estados vazios;
* Exibir estados e mensagens de feedback (carrinho vazio, busca sem resultados, etc.);
* Delegar gerenciamento de DOM para Bootstrap e classes utilitárias CSS.

Não contém lógica de negócio ou estado persistente — apenas apresentação.

### `main.ts`

Ponto de entrada e orquestrador central da aplicação.

Principais responsabilidades:

* **Inicialização**: Carregar os produtos via `fetch` no evento `DOMContentLoaded`;
* **Gerenciamento de estado**: Manter em memória `allProducts`, `cart`, `selectedCategory` e `searchTerm`;
* **Lógica de filtro e busca**: Implementar `applyFilters()` para filtrar por categoria e texto em tempo real;
* **Configuração de listeners**: 
  - `setupFilters()` — registrar eventos de busca e clique em categorias;
  - `setupCartListeners()` — registrar eventos de adição, remoção e atualização de quantidade;
  - `setupCheckout()` — registrar eventos de abertura do modal, validação de e-mail e submissão de pedido.
* **Gerenciamento de carrinho**: 
  - `addToCart()` — adicionar ou incrementar produto;
  - `updateCartQuantity()` — aumentar ou diminuir quantidade;
  - `removeFromCart()` — remover item completamente.
* **Fluxo de checkout**: 
  - Validação de e-mail com regex;
  - Geração de protocolo de pedido fictício;
  - Preenchimento de modal de comprovante com dados do pedido;
  - Limpeza de estado após submissão.
* **Coordenação**: Chamar `renderProducts()` e `renderCart()` em resposta às mudanças de estado.

---

## 5. Fluxo de Dados

O fluxo principal da aplicação:

```text
products.json
      ↓
   fetch() em main.ts
      ↓
    Product[]
      ↓
    main.ts (estado em memória)
      ↓
    dom.ts (renderização)
      ↓
Interface da loja (vitrine, busca, filtros, carrinho)
```

Os produtos não devem ser definidos diretamente no HTML. A vitrine é construída dinamicamente a partir dos dados carregados do catálogo.

### Estados Adicionais

Além dos produtos, `main.ts` mantém em memória:
* `cart: CartItem[]` — itens adicionados pelo usuário;
* `selectedCategory: string` — filtro de categoria ativo;
* `searchTerm: string` — termo de busca atual.

Esses estados são atualizados em resposta a eventos de interação e acionam re-renderizações via `renderProducts()` e `renderCart()`.

---

## 6. Estilização e CSS

A aplicação utiliza **Bootstrap 5 via CDN** para componentes e grid responsivo, complementado por estilos customizados em `src/style.css`.

### Estratégia de Estilos

* **Utilitários Bootstrap**: Classes como `d-flex`, `py-3`, `text-center` etc. para layout e spacing rápidos;
* **Customizações locais**: Variáveis CSS (`:root`), animações, gradientes e efeitos hover em `style.css`;
* **Estilos inline evitados**: Propriedades de estilo que seriam repetidas ou reutilizáveis foram extraídas para classes CSS:
  - `.hero-subtitle-max-width` — max-width para subtítulo do hero;
  - `.icon-badge-circle` — dimensões fixas para ícones circulares;
  - `.badge-small-font` — tamanho de fonte pequeno para badges;
  - `.small-font-75` — tamanho 0.75rem para textos compactos;
  - `.text-muted-icon` — cor de ícone muteado;
  - `.footer-description-max` — width e line-height para descrição do footer;
  - `.monospace-font-small` — font-family monospace com tamanho reduzido;
  - `.receipt-text-truncate` — truncagem de texto em modal de recibo;
  - `.toast-container-custom` — z-index para toast notifications.

### Paleta de Cores

Definida em variáveis CSS:
* `--primary-color: #ffc107` (amarelo/warning para destaques e CTAs);
* `--dark-bg: #1a1a1a` (fundo escuro para header e footer);
* `--light-text: #f8f9fa` (texto claro para contraste em fundo escuro);
* `--muted-text: #6c757d` (cinza para textos secundários).

---

## 7. Princípios de Implementação

* Manter responsabilidades separadas entre acesso aos dados, lógica da aplicação e apresentação.
* Evitar código duplicado.
* Evitar abstrações ou dependências desnecessárias.
* Priorizar código simples e fácil de explicar.
* Utilizar TypeScript com `strict: true` para reduzir erros relacionados aos dados.
* Utilizar HTML semântico (`<header>`, `<main>`, `<section>`, `<footer>`, etc.).
* Garantir responsividade da interface com grid do Bootstrap e breakpoints de mídia.
* Manter os produtos desacoplados do HTML — renderização 100% dinâmica via JavaScript.
* Centralizar estilos em classes CSS, evitando atributos `style=""` inline.
* Não adicionar funcionalidades ou tecnologias que não tenham uma justificativa clara para o projeto.

> **Regra principal:** a arquitetura deve permanecer simples o suficiente para que todas as decisões possam ser explicadas e defendidas durante a apresentação técnica.

---

## 8. Funcionalidades Implementadas

### MVP Obrigatório ✅

* ✓ Tema e identidade autoral (PedalHub — ciclismo);
* ✓ Catálogo em JSON desacoplado (`products.json` com 8 itens);
* ✓ Consumo via `fetch` do catálogo;
* ✓ Renderização dinâmica 100% em JavaScript/TypeScript;
* ✓ Zero hardcode de produtos no HTML;
* ✓ Busca textual em tempo real;
* ✓ Filtro por categorias (Bicicletas, Acessórios, Vestuário);
* ✓ Site estático compilado (Vite + TypeScript);
* ✓ Hospedagem pública (Vercel/Netlify);
* ✓ Página `/como-fiz` com vídeo explicativo.

### Diferenciais Implementados ✅

* ✓ **Carrinho de Compras**: Adicionar itens, alterar quantidade, remover, com totalizadores;
* ✓ **Checkout Simulado**: Formulário de dados (nome, e-mail, endereço) com validação;
* ✓ **Modal de Comprovante**: Exibição de protocolo de pedido, dados do cliente e total;
* ✓ **Pagamento Simulado**: Opções de PIX ou Cartão de Crédito com campos dinâmicos;
* ✓ **Extração de Estilos**: Migração de estilos inline para classes CSS reutilizáveis.
