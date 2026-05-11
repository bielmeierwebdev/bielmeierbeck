export type ProductType = 'STANDARD' | 'SPECIAL';

export type ProductCategory = 'BACKWARE' | 'SUESSWARE';

export interface ProductPrice {
  price: number;
}

export interface Product {
  id: number;

  name: string;

  active: boolean;

  type: ProductType;

  category: ProductCategory;

  prices: ProductPrice[];
}

export interface SelectOption<T> {
  label: string;

  value: T;
}
