# PedalHub

PedalHub é uma vitrine de e-commerce focada no nicho de ciclismo e mobilidade urbana, com proposta técnica enxuta e autoral. O projeto aplica, em miniatura, o conceito de Headless Commerce: o catálogo de produtos fica desacoplado da interface e é consumido dinamicamente via `fetch`, enquanto a apresentação, a navegação e os componentes visuais são montados no front-end.

Essa abordagem permite manter os dados em um arquivo JSON separado, facilitar manutenção e demonstrar um padrão comum em lojas digitais modernas: a camada de conteúdo e a camada de apresentação funcionando de forma independente.

## Stack utilizada

- TypeScript
- Vite
- Bootstrap 5 via CDN
- GitHub Actions para validação contínua

## Estrutura de pastas resumida

```text
pedal-hub-ecommerce/
├── .docs/
│   ├── spec.md
│   └── architecture.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── data/
│   │   └── products.json
│   └── favicon.svg
├── src/
│   ├── api.ts
│   ├── dom.ts
│   ├── main.ts
│   └── types.ts
├── index.html
├── como-fiz.html
├── vite.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

## Execução local

1. Instale as dependências do projeto:

```bash
npm install
```

2. Inicie o ambiente de desenvolvimento com hot reload:

```bash
npm run dev
```

3. Gere a versão de produção do projeto:

```bash
npm run build
```

4. Pré-visualize a build final localmente:

```bash
npm run preview
```

## Produção e links

### URL de produção

- [Adicionar URL pública do projeto]

### Página /como-fiz

- [Adicionar link público para a página de explicação]

---

PedalHub foi pensado para demonstrar, de forma simples e didática, como uma loja estática pode manter o catálogo separado da interface, respeitando boas práticas de organização, tipagem e manutenção.
