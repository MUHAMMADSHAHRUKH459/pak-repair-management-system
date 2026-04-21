export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  lowStockAlert: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  category: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  lowStockAlert: number;
}