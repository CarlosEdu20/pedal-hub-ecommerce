# Spec — pedal-hub-ecommerce (E-commerce Estático)

## 1. Visão Geral

Construção de uma mini-loja de e-commerce estática autoral voltada para o nicho de ciclismo e mobilidade urbana (**pedal-hub-ecommerce**), hospedada publicamente e de forma gratuita.

A entrega final consiste em uma única URL pública contendo:
- A loja funcional com catálogo dinâmico;
- Uma página `/como-fiz`;
- Um vídeo de 5 a 8 minutos explicando a construção, organização de pastas, decisões técnicas, métricas de Lighthouse e aprendizados do projeto.

O foco é demonstrar domínio prático dos conceitos:
- E-commerce e Headless Commerce (catálogo desacoplado da interface);
- Consumo assíncrono de dados via `fetch`;
- Boas práticas de CDN, cache e projeção de arquitetura na AWS;
- Performance e métricas com Lighthouse;
- Casos de uso práticos de IA aplicada a e-commerce.

**Prazo:** Terça-feira, 01/09/2026, às 17h59.  
**Modalidade:** Individual.

---

## 2. Objetivos e Identidade

### 2.1 Identidade da Marca
- **Nome da Loja:** Velox Bike Store
- **Nicho:** Bicicletas de alta performance (Mountain Bike, Speed, Gravel, Urbana) e acessórios para ciclistas.
- **Paleta Visual Sugerida:** Tons escuros/neutros (ardósia/cinza escuro), branco para contraste e destaque em verde limão ou laranja neon esportivo.

### 2.2 Objetivos Técnicos
- Manter o catálogo de produtos estritamente separado do código HTML.
- Consumir o catálogo local via `fetch('./data/products.json')`.
- Renderizar os cards de produtos dinamicamente via JavaScript.
- Implementar busca textual em tempo real **e/ou** filtro interativo por categoria.
- Criar a página de documentação `/como-fiz` contendo o vídeo embedado.
- Explicar no vídeo a viabilidade de hospedar a solução em **AWS S3 + CloudFront (CDN)** e como ferramentas de IA aceleram a experiência de compra.

---

## 3. Requisitos Funcionais Obrigatórios

| ID | Requisito | Critério de Aceite |
|:---|:---|:---|
| **RF01** | Identidade Própria | Nome (**pedal-hub-ecommerce**), identidade visual e produtos próprios do nicho de ciclismo. |
| **RF02** | Catálogo Externo | Dados persistidos exclusivamente no arquivo `data/products.json`. |
| **RF03** | Mínimo de Produtos | Catálogo contendo no mínimo 8 produtos categorizados. |
| **RF04** | Consumo via Fetch | O JavaScript deve obrigatoriamente carregar os dados via `fetch()`. |
| **RF05** | Renderização Dinâmica | A vitrine é gerada em tempo de execução pelo JavaScript a partir do JSON. |
| **RF06** | Sem Hardcode no HTML | O HTML não deve conter nenhum card de produto estático pré-escrito. |
| **RF07** | Busca e Filtro | Vitrine com campo de busca por nome e botões/select de categorias funcionais. |
| **RF08** | Site Estático | Estrutura estática (HTML5 semântico, CSS/Tailwind, JavaScript Vanilla). |
| **RF09** | Hospedagem Gratuita | Deploy ativo em plataforma pública gratuita (GitHub Pages, Vercel ou Netlify). |
| **RF10** | Página `/como-fiz` | Página acessível via menu/navegação dedicada à explicação do projeto. |
| **RF11** | Vídeo Explicativo | Embed de vídeo (YouTube ou Loom) de 5 a 8 minutos detalhando as decisões técnicas. |

---

## 4. Estrutura do Catálogo (`data/products.json`)

O arquivo deve residir em `data/products.json` com a seguinte estrutura de dados:

```json
[
  {
    "id": 1,
    "name": "Velox Trail Mountain Bike 29",
    "category": "Mountain Bike",
    "price": 3299.90,
    "image": "[https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80](https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80)",
    "description": "Quadro em alumínio hidroformado, transmissão Shimano 24V e freios a disco hidráulicos para trilhas exigentes."
  },
  {
    "id": 2,
    "name": "Apex Pro Carbon Road Bike",
    "category": "Speed",
    "price": 5890.00,
    "image": "[https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80](https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80)",
    "description": "Geometria aerodinâmica com garfo e quadro em fibra de carbono, ideal para alta performance no asfalto."
  },
  {
    "id": 3,
    "name": "Urban Commuter Step-Thru",
    "category": "Urbana",
    "price": 1850.00,
    "image": "[https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80](https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80)",
    "description": "Projetada para deslocamento diário com para-lamas integrados, bagageiro traseiro e postura ergonômica."
  },
  {
    "id": 4,
    "name": "Gravel Roam Adventure 700c",
    "category": "Gravel",
    "price": 4199.90,
    "image": "[https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80](https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80)",
    "description": "Versatilidade total entre estradas de terra batida e asfalto com pneus largos de alta tração."
  },
  {
    "id": 5,
    "name": "Capacete Aerodinâmico Velox Protect",
    "category": "Acessórios",
    "price": 279.90,
    "image": "[https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80](https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80)",
    "description": "Construção In-Mold com sistema de ventilação de 18 canais e ajuste milimétrico traseiro."
  },
  {
    "id": 6,
    "name": "Sapatilha Road Carbon Grip",
    "category": "Vestuário",
    "price": 459.00,
    "image": "[https://images.unsplash.com/photo-1565992441121-4367c2967103?auto=format&fit=crop&w=800&q=80](https://images.unsplash.com/photo-1565992441121-4367c2967103?auto=format&fit=crop&w=800&q=80)",
    "description": "Fechamento por disco BOA, solado reforçado para máxima transferência de potência nos pedais."
  },
  {
    "id": 7,
    "name": "Farol Noturno LED 1000 Lumens USB",
    "category": "Acessórios",
    "price": 149.90,
    "image": "[https://images.unsplash.com/photo-1502744688674-c619d38864a8?auto=format&fit=crop&w=800&q=80](https://images.unsplash.com/photo-1502744688674-c619d38864a8?auto=format&fit=crop&w=800&q=80)",
    "description": "Bateria recarregável de longa duração, resistência à chuva IPX6 e 5 modos de iluminação."
  },
  {
    "id": 8,
    "name": "Bolsa de Quadro Impermeável 1.5L",
    "category": "Acessórios",
    "price": 119.00,
    "image": "[https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80](https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80)",
    "description": "Fixação por tiras de velcro reforçado, zíper selado e compartimento touch para smartphone."
  }
]