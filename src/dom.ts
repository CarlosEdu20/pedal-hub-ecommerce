import { Product } from './types';

// Utilitário para formatar moeda com segurança
export const formatCurrency = (value: number = 0): string => {
  return (value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// Renderiza a lista de produtos no grid principal
export const renderProducts = (products: Product[]): void => {
  const grid = document.getElementById('products-grid');
  const emptyState = document.getElementById('empty-state');

  if (!grid) return;

  if (!products || products.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('d-none');
    return;
  }

  if (emptyState) emptyState.classList.add('d-none');

  grid.innerHTML = products
    .map((product) => {
      // Garante valor padrão caso a propriedade não venha no JSON
      const rating = typeof product.rating === 'number' ? product.rating.toFixed(1) : '5.0';
      const inStock = product.inStock ?? true;
      const price = product.price ?? 0;
      const category = product.category || 'Geral';
      const image = product.image || 'https://placehold.co/600x400?text=Sem+Foto';

      return `
      <div class="col">
        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div class="position-relative">
            <img 
              src="${image}" 
              class="card-img-top object-fit-cover" 
              alt="${product.name}" 
              style="height: 220px;"
              loading="lazy"
            />
            <span class="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 text-warning border border-secondary border-opacity-50 rounded-pill px-2 py-1 small">
              ${category}
            </span>
          </div>

          <div class="card-body d-flex flex-column p-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <small class="text-secondary fw-semibold">
                <i class="bi bi-star-fill text-warning me-1"></i>${rating}
              </small>
              <span class="badge ${inStock ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} rounded-pill small">
                ${inStock ? 'Em estoque' : 'Esgotado'}
              </span>
            </div>
            
            <h5 class="card-title fw-bold text-dark mb-2 fs-6">${product.name}</h5>
            <p class="card-text text-secondary small flex-grow-1 mb-3">${product.description || ''}</p>
            
            <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-light-subtle">
              <div>
                <small class="text-secondary d-block" style="font-size: 0.75rem;">Preço</small>
                <span class="fs-5 fw-bold text-dark">${formatCurrency(price)}</span>
              </div>
              <button 
                class="btn btn-warning text-dark fw-semibold rounded-pill px-3 py-2 btn-add-cart d-flex align-items-center gap-1 shadow-sm"
                data-id="${product.id}"
                type="button"
                ${!inStock ? 'disabled' : ''}
              >
                <i class="bi bi-cart-plus"></i>
                <span>Comprar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      `;
    })
    .join('');
};