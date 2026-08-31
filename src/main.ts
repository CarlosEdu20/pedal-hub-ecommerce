import { Product } from './types';
import { renderProducts } from './dom';

let allProducts: Product[] = [];
let selectedCategory: string = 'all';
let searchTerm: string = '';

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

  // Filtro por texto digitado
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      searchTerm = target.value.trim();
      applyFilters();
    });
  }

  // Filtro por categoria (com a negação corrigida)
  if (categoryContainer) {
    categoryContainer.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement).closest('button');
      if (!target || !target.dataset.category) return;

      // Atualiza o estado visual do botão ativo
      categoryContainer.querySelectorAll('button').forEach((btn) => {
        btn.classList.remove('active');
      });
      target.classList.add('active');

      selectedCategory = target.dataset.category;
      applyFilters();
    });
  }
};

const init = async (): Promise<void> => {
  try {
    const response = await fetch('/data/products.json');
    if (!response.ok) throw new Error(`Status: ${response.status}`);

    allProducts = await response.json();
    renderProducts(allProducts);
    setupFilters();
  } catch (error) {
    console.error('Erro ao carregar catálogo:', error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}