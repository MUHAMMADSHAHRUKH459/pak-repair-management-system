export interface Sale {
  id: string;
  invoiceNo: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  totalAmount: number;
  profit: number;
  createdAt: string;
}

export interface CreateSaleInput {
  productName: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
}