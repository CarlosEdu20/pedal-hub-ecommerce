import { CartItem, Product } from './types';
import { renderCart, renderProducts } from './dom';

// 1. Estado da aplicação
let allProducts: Product[] = [];
let cart: CartItem[] = [];
let selectedCategory: string = 'all';
let searchTerm: string = '';

// Expressão regular para validação de formato de e-mail 
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

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

  if (productsGrid) {
    productsGrid.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement).closest('.btn-add-cart') as HTMLButtonElement | null;
      if (!target || !target.dataset.id) return;

      const productId = Number(target.dataset.id);
      addToCart(productId);
    });
  }

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

//  Fluxo de Checkout e Emissão de Comprovante
const setupCheckout = (): void => {
  const btnCheckout = document.getElementById('btn-checkout');
  const checkoutForm = document.getElementById('checkout-form') as HTMLFormElement | null;
  const offcanvasElement = document.getElementById('cartOffcanvas');
  const checkoutModalElement = document.getElementById('checkoutModal');
  const receiptModalElement = document.getElementById('receiptModal');
  const emailInput = document.getElementById('customer-email') as HTMLInputElement | null;

  // Abertura do modal a partir do carrinho
  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      if (cart.length === 0) return;

      if (offcanvasElement && (window as any).bootstrap) {
        const bsOffcanvas = (window as any).bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (bsOffcanvas) bsOffcanvas.hide();
      }

      if (checkoutModalElement && (window as any).bootstrap) {
        const bsModal = (window as any).bootstrap.Modal.getOrCreateInstance(checkoutModalElement);
        bsModal.show();
      }
    });
  }

  // Validação dinâmica do e-mail ao digitar
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const isValid = EMAIL_REGEX.test(emailInput.value.trim());
      if (emailInput.value.trim() === '' || isValid) {
        emailInput.classList.remove('is-invalid');
      } else {
        emailInput.classList.add('is-invalid');
      }
    });
  }

  // Submissão do pedido e abertura do Card de Comprovante
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const nameInput = document.getElementById('customer-name') as HTMLInputElement | null;
      const emailValue = emailInput ? emailInput.value.trim() : '';

      // Validação estrita por Regex
      if (!EMAIL_REGEX.test(emailValue)) {
        if (emailInput) {
          emailInput.classList.add('is-invalid');
          emailInput.focus();
        }
        return;
      }

      const customerName = nameInput?.value.trim() || 'Cliente';
      const orderProtocol = Math.floor(100000 + Math.random() * 900000);
      const totalAmount = document.getElementById('modal-checkout-total')?.textContent || 'R$ 0,00';
      
      const paymentChecked = document.querySelector('input[name="payment-method"]:checked') as HTMLInputElement | null;
      const paymentMethod = paymentChecked ? paymentChecked.value : 'PIX';

      // 1. Preenche os dados do Card de Comprovante
      const receiptProtocol = document.getElementById('receipt-protocol');
      const receiptName = document.getElementById('receipt-name');
      const receiptEmail = document.getElementById('receipt-email');
      const receiptPayment = document.getElementById('receipt-payment');
      const receiptTotal = document.getElementById('receipt-total');

      if (receiptProtocol) receiptProtocol.textContent = `#${orderProtocol}`;
      if (receiptName) receiptName.textContent = customerName;
      if (receiptEmail) receiptEmail.textContent = emailValue;
      if (receiptPayment) receiptPayment.textContent = paymentMethod;
      if (receiptTotal) receiptTotal.textContent = totalAmount;

      // 2. Fecha o modal de formulário
      if (checkoutModalElement && (window as any).bootstrap) {
        const bsCheckoutModal = (window as any).bootstrap.Modal.getInstance(checkoutModalElement);
        if (bsCheckoutModal) bsCheckoutModal.hide();
      }

      // 3. Abre o Card de Comprovante estilizado
      if (receiptModalElement && (window as any).bootstrap) {
        const bsReceiptModal = (window as any).bootstrap.Modal.getOrCreateInstance(receiptModalElement);
        bsReceiptModal.show();
      }

      // 4. Limpa o formulário e zera o carrinho
      checkoutForm.reset();
      if (emailInput) emailInput.classList.remove('is-invalid');
      cart = [];
      renderCart(cart);
    });
  }
};

// 6. Inicialização
const init = async (): Promise<void> => {
  try {
    const response = await fetch('/data/products.json');
    if (!response.ok) throw new Error(`Status: ${response.status}`);

    allProducts = await response.json();
    renderProducts(allProducts);
    renderCart(cart);
    setupFilters();
    setupCartListeners();
    setupCheckout();
  } catch (error) {
    console.error('Erro ao carregar o catálogo:', error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}