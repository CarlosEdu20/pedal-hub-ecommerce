# Especificação Funcional & Requisitos — PedalHub E-commerce

## 1. Visão Geral

Construção de uma mini-loja de e-commerce estática e autoral voltada para o nicho de ciclismo e mobilidade urbana (**PedalHub**), hospedada publicamente com alta performance e boas práticas de engenharia de software.

A entrega final consiste em uma aplicação web com suporte a navegação multi-página:
* **Vitrine da Loja (`/index.html`):** Catálogo de produtos, filtros por categoria, busca textual em tempo real, carrinho reativo e checkout dinâmico com comprovante;
* **Documentação Técnica (`/como-fiz.html`):** Relatório de decisões de engenharia, vídeo explicativo auto-hospedado e proposta de arquitetura BFF.

---

## 2. Identidade da Marca

* **Nome da Loja:** PedalHub
* **Nicho:** Bicicletas de alta performance (Mountain Bike, Speed, Urbana, Gravel) e acessórios/vestuário para ciclistas.
* **Paleta Visual:** Tema escuro moderno (Dark Mode com fundo `#121214`), tipografia clara de alto contraste e destaques na cor de alerta esportiva (**Amarelo/Warning `#ffc107`**).
* **Originalidade:** Tema, catálogo, identidade visual, nomes e imagens 100% autorais e independentes dos exemplos de aula.

---

## 3. Requisitos Obrigatórios da Loja (MVP)

| # | Requisito | Critério de Aceite |
| :--- | :--- | :--- |
| **RF01** | **Tema e Identidade Autoral** | Tema próprio de ciclismo (**PedalHub**), logotipo com ícone semântico e paleta de cores consistente. |
| **RF02** | **Catálogo Desacoplado** | Catálogo isolado em `public/data/products.json` contendo no mínimo 6 itens (implementado com 8 produtos completos). |
| **RF03** | **Consumo via `fetch` Assíncrono** | Carregamento assíncrono dos dados via API `fetch` nativa com tratamento de exceções. |
| **RF04** | **Renderização Dinâmica** | Vitrine gerada 100% via JavaScript/TypeScript dinamicamente no DOM. |
| **RF05** | **Zero Hardcode no HTML** | Nenhum card de produto pode ser fixado diretamente no código HTML base. |
| **RF06** | **Busca e Filtros em Tempo Real** | Campo de pesquisa textual combinável com botões de filtro de categoria (Bicicletas, Acessórios, Vestuário). |
| **RF07** | **Arquitetura Estática & TypeScript** | Aplicação estática compilada via Vite, TypeScript em modo estrito (`strict: true`) e Bootstrap 5 CDN. |
| **RF08** | **Hospedagem Pública em Produção** | Deploy ativo em host com CDN global e SSL automático (Vercel). |
| **RF09** | **Página Técnica (`como-fiz.html`)** | Página dedicada e navegável contendo o relatório de decisões técnicas e engenharia. |
| **RF10** | **Demonstração em Vídeo** | Apresentação em vídeo cobrindo funcionalidades, responsividade e fluxo de compra. |

---

## 4. Diferenciais e Bônus Implementados

| # | Funcionalidade | Descrição Técnica |
| :--- | :--- | :--- |
| **OP01** | **Carrinho Reativo** | Gerenciamento de estado em memória com adição incremental, controle de quantidade, remoção e cálculo automático de totais. |
| **OP02** | **Checkout com Pagamento Dinâmico** | Formulário com validação de dados e alternância interativa de campos entre **PIX** (QR Code simulado) e **Cartão de Crédito**. |
| **OP03** | **Modal de Comprovante Estruturado** | Geração de protocolo único de pedido, resumo financeiro, dados do comprador e quebra segura de layout. |
| **OP04** | **Otimização de Mídia (WebP)** | Imagens de catálogo e banners convertidas para **WebP** com nomenclatura padronizada em *kebab-case*. |
| **OP05** | **Integração Contínua (CI)** | Workflow automatizado no **GitHub Actions** validando tipagem estática (`tsc --noEmit`) e build a cada push. |
| **BÔNUS 1** | **Vídeo Auto-Hospedado (+10 pts)** | Execução do vídeo de demonstração via tag nativa `<video>` com buffer progressivo (`+faststart`) direto da infraestrutura estática. |
| **BÔNUS 2** | **Proposta de Arquitetura BFF (+10 pts)** | Documentação e diagrama conceitual da camada *Backend for Frontend (BFF)* para suporte a aplicativo mobile. |

---

## 5. Contrato de Dados do Catálogo (`public/data/products.json`)

O arquivo de dados reside em `public/data/products.json` e obedece estritamente ao contrato de tipagem da interface `Product`:

| Campo | Tipo | Descrição / Exemplo |
| :--- | :--- | :--- |
| `id` | `number` | Identificador numérico único do produto (ex: `1`, `2`) |
| `name` | `string` | Título comercial do produto (ex: `"Caloi Explorer Pro 29"`) |
| `category` | `string` | Categoria restrita: `"Bicicletas"`, `"Acessórios"` ou `"Vestuário"` |
| `price` | `number` | Valor numérico em ponto flutuante (ex: `3299.90`) |
| `image` | `string` | Caminho relativo para o asset otimizado (ex: `"/images/products/caloi-explorer.webp"`) |
| `description`| `string` | Descrição técnica dos diferenciais e especificações do item |

---

## 6. Critérios de Conclusão e Entrega

1. Pipeline de CI no GitHub Actions executando com sucesso (status verde ✅);
2. Build de produção gerando a pasta `dist/` sem erros de compilação ou tipagem;
3. Deploy na Vercel sincronizado com a branch principal;
4. Links entre a vitrine (`index.html`) e o relatório (`como-fiz.html`) 100% operacionais.