import { CartItem, Product } from './types';
import { renderCart, renderProducts } from './dom';

// 1. Estado da aplicação
let allProducts: Product[] = [];
let cart: CartItem[] = [];
let selectedCategory: string = 'all';
let searchTerm: string = '';

// 2. Lógica de Filtragem e Busca
const applyFilters = (): void => {
  const filtered = allProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  renderProducts(filtered);
};

const setupFilters = (): void => {
  const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
  const categoryContainer = document.getElementById('category-filters');

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      searchTerm = target.value.trim();
      applyFilters();
    });
  }

  if (categoryContainer) {
    categoryContainer.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement).closest('button');
      if (!target || !target.dataset.category) return;

      categoryContainer.querySelectorAll('button').forEach((btn) => {
        btn.classList.remove('active');
      });
      target.classList.add('active');

      selectedCategory = target.dataset.category;
      applyFilters();
    });
  }
};

// 3. Regras de Negócio do Carrinho
const openCartOffcanvas = (): void => {
  const offcanvasElement = document.getElementById('cartOffcanvas');
  if (offcanvasElement && (window as any).bootstrap) {
    const bsOffcanvas = (window as any).bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
    bsOffcanvas.show();
  } else {
    const cartTrigger = document.querySelector('[data-bs-target="#cartOffcanvas"]') as HTMLElement | null;
    if (cartTrigger) cartTrigger.click();
  }
};

const addToCart = (productId: number): void => {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.product.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }

  renderCart(cart);
  openCartOffcanvas();
};

const updateCartQuantity = (productId: number, action: 'increase' | 'decrease'): void => {
  const itemIndex = cart.findIndex((item) => item.product.id === productId);
  if (itemIndex === -1) return;

  if (action === 'increase') {
    cart[itemIndex].quantity += 1;
  } else if (action === 'decrease') {
    cart[itemIndex].quantity -= 1;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  }

  renderCart(cart);
};

const removeFromCart = (productId: number): void => {
  cart = cart.filter((item) => item.product.id !== productId);
  renderCart(cart);
};

// 4. Delegação de Eventos do Carrinho
const setupCartListeners = (): void => {
  const productsGrid = document.getElementById('products-grid');
  const cartItemsContainer = document.getElementById('cart-items');

  // Adicionar ao carrinho a partir da vitrine
  if (productsGrid) {
    productsGrid.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement).closest('.btn-add-cart') as HTMLButtonElement | null;
      if (!target || !target.dataset.id) return;

      const productId = Number(target.dataset.id);
      addToCart(productId);
    });
  }

  // Ações dentro do offcanvas (aumentar, diminuir, remover)
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (event) => {
      const actionElement = (event.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
      if (!actionElement || !actionElement.dataset.action || !actionElement.dataset.id) return;

      const productId = Number(actionElement.dataset.id);
      const action = actionElement.dataset.action;

      if (action === 'increase' || action === 'decrease') {
        updateCartQuantity(productId, action);
      } else if (action === 'remove') {
        removeFromCart(productId);
      }
    });
  }
};

// 5. Inicialização
const init = async (): Promise<void> => {
  try {
    const response = await fetch('/data/products.json');
    if (!response.ok) throw new Error(`Status: ${response.status}`);

    allProducts = await response.json();
    renderProducts(allProducts);
    renderCart(cart);
    setupFilters();
    setupCartListeners();
  } catch (error) {
    console.error('Erro ao carregar o catálogo:', error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}