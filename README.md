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
│   ├── architecture.md       # Decisões arquiteturais e padrões de projeto
│   └── spec.md               # Requisitos funcionais e regras de negócio
├── .github/
│   └── workflows/
│       └── ci.yml            # Pipeline de automação (GitHub Actions)
├── public/
│   ├── data/
│   │   └── products.json     # Catálogo de produtos desacoplado
│   ├── images/
│   │   ├── banners/          # Banners e identidades visuais
│   │   └── products/         # Imagens dos produtos em formato WebP
│   ├── videos/
│   │   └── apresentacao.mp4  # Vídeo auto-hospedado da entrega técnica
│   └── favicon.svg           # Ícone da aplicação
├── src/
│   ├── api.ts                # Camada de consumo assíncrono (fetchProducts)
│   ├── dom.ts                # Renderização e manipulação da interface
│   ├── main.ts               # Orquestrador de estado e event listeners
│   ├── style.css             # Estilização customizada e variáveis CSS
│   └── types.ts              # Interfaces e contratos estritos (Product, CartItem, Order)
├── como-fiz.html             # Página técnica com vídeo e relatório
├── index.html                # Página principal da loja
├── package.json              # Dependências e scripts npm
├── tsconfig.json             # Configuração estrita do TypeScript
├── vite.config.ts            # Configuração do Vite para build multi-página
└── README.md                 # Documentação principal do repositório
```

## Pré-requisitos

Para executar este projeto localmente, você precisará de:

- Node.js 18.x ou superior
- npm 9.x ou superior (ou yarn/pnpm equivalente)
- Git para clonar o repositório

Verifique as versões instaladas:

```bash
node --version
npm --version
```

## Execução local

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/CarlosEdu20/pedal-hub-ecommerce.git
cd pedal-hub-ecommerce
```

### Passo 2: Instalar dependências

```bash
npm install
```

Ou, para garantir reprodutibilidade em ambientes de CI/CD:

```bash
npm ci
```

### Passo 3: Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:5173` com:
- Hot Module Replacement (HMR) habilitado
- Recompilação automática ao salvar arquivos
- TypeScript verificado em tempo real

Abra o navegador e acesse a URL acima para visualizar a aplicação.

### Passo 4: Validar tipos TypeScript

Para verificar se há erros de tipagem sem gerar arquivos JavaScript:

```bash
npx tsc --noEmit
```

Isso garante que o código está em conformidade com as regras de `strict: true`.

### Passo 5: Gerar build de produção

```bash
npm run build
```

Saída esperada:
- Arquivos compilados em `dist/`
- TypeScript convertido para JavaScript minificado
- Assets otimizados com Gzip
- Tamanho final: ~9.8 KB (gzip comprimido)

### Passo 6: Visualizar build localmente

```bash
npm run preview
```

Abre a build de produção em `http://localhost:4173` para simular o ambiente final.

---

## Ambiente de Produção

### URL de Produção

A aplicação está hospedada em:

**https://pedal-hub-ecommerce.vercel.app**

Deployment automático via Vercel. Qualquer push para a branch principal dispara rebuild e redeploy automaticamente.

### Página de Explicação Técnica

Documentação detalhada da arquitetura e decisões de design:

**https://pedal-hub-ecommerce.vercel.app/como-fiz.html**

Esta página contém:
- Vídeo explicativo do desenvolvimento
- Relatório técnico das decisões de arquitetura
- Padrões utilizados (SoC, Headless Commerce, TypeScript Estrito)
- Guia de manutenção e extensão futura

### Documentação Interna

- `.docs/architecture.md` — Diretrizes técnicas e padrões de projeto
- `.docs/spec.md` — Requisitos funcionais completos e regras de negócio

---

## Integração Contínua (CI/CD)

A aplicação utiliza GitHub Actions para validação automática. O pipeline executado a cada push inclui:

1. Validação de tipos (`tsc --noEmit`)
2. Build de produção (`npm run build`)
3. Relatório de tamanho de assets

Visualize o status em `.github/workflows/ci.yml`.

---

## Estrutura Técnica

### Módulos TypeScript

| Arquivo | Responsabilidade |
|---------|------------------|
| `types.ts` | Contratos e interfaces (Product, CartItem, ProductCategory) |
| `api.ts` | Camada de consumo assíncrono de dados (fetchProducts) |
| `dom.ts` | Renderização dinâmica e atualização de interface (renderProducts, renderCart) |
| `main.ts` | Orquestrador central, listeners e gerenciamento de estado |

### Padrão Headless Commerce

O catálogo é completamente desacoplado:

```typescript
const products = await fetchProducts(); 
renderProducts(products);
```

Zero hardcode de produtos no HTML. Toda a vitrine é renderizada em tempo de execução via TypeScript.

### Gerenciamento de Estado

Estado mantido em memória no cliente:

```typescript
let allProducts: Product[] = [];
let cart: CartItem[] = [];
let selectedCategory: string = 'all';
let searchTerm: string = '';
```

Fluxo:
1. Usuário interage (busca, filtro, adiciona ao carrinho)
2. Função atualiza estado
3. `renderProducts()` ou `renderCart()` é chamado
4. DOM é re-renderizado

---

## Troubleshooting

### Porta 5173 já está em uso

Se a porta padrão do Vite estiver ocupada:

```bash
npm run dev -- --port 3000
```

### Erros de tipagem ao buildar

Valide tipos antes de compilar:

```bash
tsc --noEmit
```

Se encontrar erros, corrija conforme as sugestões do compilador TypeScript.

### Limpar cache e reinstalar

Em caso de problemas persistentes:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Sobre o Projeto

PedalHub foi desenvolvido para demonstrar, em uma escala acadêmica, como uma loja moderna de e-commerce pode manter catálogo e apresentação completamente desacoplados do front-end, aplicando padrões de separação de responsabilidades, tipagem estrita, renderização dinâmica e integração contínua automatizada.

A arquitetura é simples o suficiente para ser totalmente explicável e defensável, mas robusta o bastante para servir como base de produção ou ser expandida com backend real, persistência de dados e um gateway de pagamento.
