export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Category = string;

export interface ProductQueryOptions {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}
