import { Product, CartItem } from './types';

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
              style="height: 320px;"
              loading="lazy"
            />
            <span class="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 text-warning border border-secondary border-opacity-50 rounded-pill px-2 py-1 small">
              ${category}
            </span>
          </div>

          <div class="card-body d-flex flex-column p-4">
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


export const renderCart = (cart: CartItem[]): void => {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const cartCountElement = document.getElementById('cart-count');
  const btnCheckout = document.getElementById('btn-checkout') as HTMLButtonElement | null;
  const modalCheckoutTotal = document.getElementById('modal-checkout-total');

  // Cálculos de quantidade e preço
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const formattedTotal = formatCurrency(totalPrice);

  // 1. Atualiza Badge no cabeçalho
  if (cartCountElement) {
    cartCountElement.textContent = totalCount.toString();
    if (totalCount > 0) {
      cartCountElement.classList.remove('d-none');
    } else {
      cartCountElement.classList.add('d-none');
    }
  }

  // 2. Atualiza os totais (no offcanvas e no modal)
  if (cartTotalElement) cartTotalElement.textContent = formattedTotal;
  if (modalCheckoutTotal) modalCheckoutTotal.textContent = formattedTotal;

  // 3. Bloqueia o botão se o carrinho estiver vazio
  if (btnCheckout) {
    btnCheckout.disabled = cart.length === 0;
  }

  if (!cartItemsContainer) return;

  // 4. Estado vazio
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-message text-center py-5 text-muted">
        <i class="bi bi-cart-x fs-1 d-block mb-2 text-secondary"></i>
        Seu carrinho está vazio
      </div>
    `;
    return;
  }

  // 5. Renderização dos itens
  cartItemsContainer.innerHTML = cart
    .map(
      ({ product, quantity }) => `
      <div class="card mb-3 border-0 bg-light w-100">
        <div class="card-body p-2 d-flex align-items-center gap-2">
          <img src="${product.image}" alt="${product.name}" class="rounded object-fit-cover flex-shrink-0" style="width: 50px; height: 50px;">
          
          <div class="flex-grow-1 min-w-0" style="overflow: hidden;">
            <h6 class="mb-0 text-truncate small fw-bold" title="${product.name}">${product.name}</h6>
            <span class="text-muted small">${formatCurrency(product.price)}</span>
            
            <div class="d-flex align-items-center gap-2 mt-1">
              <button class="btn btn-outline-secondary btn-sm px-2 py-0" data-action="decrease" data-id="${product.id}">-</button>
              <span class="small fw-bold px-1">${quantity}</span>
              <button class="btn btn-outline-secondary btn-sm px-2 py-0" data-action="increase" data-id="${product.id}">+</button>
            </div>
          </div>

          <button class="btn btn-link text-danger p-1 flex-shrink-0 ms-auto" data-action="remove" data-id="${product.id}" title="Remover item">
            <i class="bi bi-trash fs-5 pointer-events-none"></i>
          </button>
        </div>
      </div>
    `
    )
    .join('');
};