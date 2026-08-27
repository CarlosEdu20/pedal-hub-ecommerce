# Especificação — PedalHub E-commerce

## 1. Visão Geral

Construção de uma mini-loja de e-commerce estática e autoral voltada para o nicho de ciclismo e mobilidade urbana (**PedalHub**), hospedada publicamente de forma gratuita.

A entrega final consiste em uma única URL pública contendo:
- A vitrine da loja funcional;
- A página `/como-fiz` com o vídeo explicativo do projeto.

---

## 2. Identidade da Marca

- **Nome da Loja:** PedalHub
- **Nicho:** Bicicletas de alta performance (Mountain Bike, Speed, Urbana, Gravel) e equipamentos/acessórios para ciclistas.
- **Paleta Visual:** Tons escuros/neutros (ardósia/cinza escuro), branco e detalhes em destaque esportivo (verde limão ou laranja neon).
- **Originalidade:** Tema, catálogo, nomes e identidade 100% autorais e distintos dos exemplos de aula.

---

## 3. Requisitos Obrigatórios da Loja (MVP)

| # | Requisito | Critério de Aceite |
|:---|:---|:---|
| **RF01** | **Tema e Identidade Autoral** | Tema próprio (ciclismo), nome (**PedalHub**), cores e produtos originais. |
| **RF02** | **Catálogo em JSON Desacoplado** | Catálogo persistido em `products.json` com no mínimo 6 itens (implementado com 8). |
| **RF03** | **Consumo via `fetch`** | Leitura obrigatória do `products.json` por meio da API `fetch`. |
| **RF04** | **Renderização Dinâmica** | Vitrine gerada inteiramente via JavaScript/TypeScript em tempo de execução. |
| **RF05** | **Zero Hardcode no HTML** | É terminantemente proibido fixar cards de produtos diretamente no código HTML. |
| **RF06** | **Busca OU Filtro por Categoria** | Campo de pesquisa textual em tempo real e/ou botões/select de categorias operacionais. |
| **RF07** | **Site Estático** | Aplicação estática compilada (HTML5 semântico, Bootstrap 5 CDN, TypeScript via Vite). |
| **RF08** | **Hospedagem Pública e Gratuita** | Deploy ativo em host estático gratuito (Vercel, Netlify ou GitHub Pages). |
| **RF09** | **Página `/como-fiz`** | Rota/página dedicada acessível publicamente via menu de navegação. |
| **RF10** | **Vídeo Explicativo** | Vídeo embutido (YouTube não listado ou Loom) detalhando decisões técnicas e arquitetura. |

---

## 4. Opcionais e Diferenciais 

| # | Diferencial | Descrição |
|:---|:---|:---|
| **OP01** | **Carrinho de Compras** | Gerenciamento de itens em memória (adicionar, alterar quantidade, remover e subtotal). |
| **OP02** | **Checkout Simulado** | Formulário de dados de entrega e modal de confirmação de pedido fictício. |
| **OP03** | **Auto-hospedagem de Vídeo** | Execução de vídeo local/estático em vez de player embedado (vale bônus). |
| **OP04** | **Dark Mode** | Alternância de tema claro/escuro via classe utilitária. |

---

## 5. Estrutura do Catálogo (`public/data/products.json`)

Contrato oficial com 8 produtos (acima do mínimo de 6 exigido):

```json
[
  {
    "id": 1,
    "name": "PedalHub Trail Mountain Bike 29",
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
    "name": "Capacete Aerodinâmico PedalHub Protect",
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