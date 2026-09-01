export type ProductCategory = 'Bicicletas' | 'Acessórios' | 'Vestuário';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}