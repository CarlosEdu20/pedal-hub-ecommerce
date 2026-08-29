import { Product } from './types';
import { renderProducts } from './dom';

const init = async (): Promise<void> => {
  console.log('1. [Main] Função init disparada!');

  try {
    const response = await fetch('/data/products.json');
    console.log('2. [Fetch] Status da resposta:', response.status);

    if (!response.ok) {
      throw new Error(`Falha na requisição: ${response.status}`);
    }

    const products: Product[] = await response.json();
    console.log('3. [Dados] Produtos carregados com sucesso:', products);

    renderProducts(products);
  } catch (error) {
    console.error('ERRO no carregamento dos dados:', error);
  }
};

// Garante a execução seja antes ou depois do DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}