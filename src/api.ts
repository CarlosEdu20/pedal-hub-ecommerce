import type { Product } from './types';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('./data/products.json');
  if (!response.ok) {
    throw new Error(`Falha ao carregar catálogo: ${response.status}`);
  }
  const data: Product[] = await response.json();
  return data;
}
