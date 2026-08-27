# Architecture & Technical Guidelines —  pedal-hub-ecommerce 

## 1. Visão Geral da Stack
- **Linguagem & Tipagem:** TypeScript (Vanilla TS via Vite) para tipagem estrita de dados e contratos.
- **Estrutura & Semântica:** HTML5 semântico (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **Estilização & UI:** Bootstrap 5 via **CDN** (não npm) — evita configuração extra de bundling de CSS e reduz risco no prazo curto.
- **Armazenamento de Dados:** `data/products.json` desacoplado, simulando um endpoint/CMS Headless.
- **Ferramenta de Build/Dev Server:** Vite (ambiente ágil, compilação rápida de TS e hot reload).
- **Compilação final:** o TS é transpilado para JS puro no build — o resultado é um site 100% estático (HTML/CSS/JS), cumprindo RF05 mesmo usando ferramentas modernas.

---

## 2. Estrutura de Diretórios
```text
 pedal-hub-ecommerce /
├── .docs/
│   ├── spec.md               # Requisitos e regras de negócio
│   └── architecture.md       # Diretrizes técnicas e padrões
├── data/
│   └── products.json         # Catálogo autoral de bikes e acessórios
├── public/                   # Assets públicos e estáticos (imagens, favicon)
├── src/
│   ├── types.ts              # Interfaces e tipos (Product, Category, FilterState)
│   ├── api.ts                # Camada de consumo de dados (fetchProducts)
│   ├── dom.ts                # Funções de renderização de cards e manipulação do DOM
│   └── main.ts                # Ponto de entrada, listeners de busca e filtros
├── index.html                 # Página principal (Vitrine e filtros)
├── como-fiz.html               # Página da entrega (/como-fiz com vídeo embed)
├── vite.config.ts             # Configuração de build multi-página (ver seção 3)
├── package.json
├── tsconfig.json
└── README.md                  # Instruções de setup e link de deploy
```

---

## 3. Build Multi-Página (crítico)

Por padrão o Vite builda apenas `index.html`. Como o desafio exige `/como-fiz` como página separada, é obrigatório declarar as duas entradas em `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './', // garante caminhos relativos corretos em qualquer host estático
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        comoFiz: resolve(__dirname, 'como-fiz.html'),
      },
    },
  },
});
```

> Testar `npm run build && npm run preview` antes do deploy final é obrigatório — é o único jeito de garantir que `/como-fiz` existe no `dist/`.

---

## 4. Modelagem de Dados (`src/types.ts`)

```ts
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export type ProductList = Product[];
```

Mantém o contrato simples — sem campos que a spec não pede (evitar `stock`, `sku`, `rating` etc. se não forem usados em nenhuma feature real).

---

## 5. Camada de Dados (`src/api.ts`)

```ts
import type { Product } from './types';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('data/products.json');
  if (!response.ok) {
    throw new Error(`Falha ao carregar catálogo: ${response.status}`);
  }
  return response.json();
}
```

`main.ts` deve envolver a chamada em `try/catch` e renderizar um estado de erro simples na vitrine (ex.: "Não foi possível carregar os produtos") — sem isso, uma falha de rede quebra a página em branco, silenciosamente.

---

## 6. Busca e Filtro

Estado mantido em memória, sem lib externa (Redux, Zustand etc. seriam overengineering para este escopo):

- `main.ts` guarda o array completo de produtos (`allProducts`) após o fetch.
- Busca (input de texto) e/ou filtro (select de categoria) aplicam `.filter()` sobre `allProducts` e re-renderizam via `dom.ts`.
- Um único evento (`input` ou `change`) dispara a re-renderização — não precisa de debounce dado o volume pequeno de dados (mínimo 6 produtos).

---

## 7. Hospedagem / Deploy

- **Recomendado:** Vercel ou Netlify (deploy direto do repositório Git, build automático via `vite build`, HTTPS gratuito).
- Alternativa: GitHub Pages (requer ajustar `base` no `vite.config.ts` para o nome do repositório).
- Publicar a URL final do `dist/` — validar que `/como-fiz` responde corretamente após o deploy (ver seção 3).

---

## 8. Padrões de Código

- TypeScript em modo `strict: true` no `tsconfig.json` — sem `any` implícito.
- HTML semântico obrigatório: `<nav>` para filtros, `<main>` para vitrine, `<article>` por card de produto.
- Acessibilidade mínima: `alt` em todas as imagens de produto, `<label>` associado ao input de busca/filtro.
- Sem frameworks de estado, sem router, sem testes automatizados — fora do escopo e do prazo do desafio.