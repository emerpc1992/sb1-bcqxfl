export interface Customer {
  id: string;
  name: string;
  createdAt: Date;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  createdAt: Date;
  status: 'completed' | 'cancelled';
  cancellationReason?: string;
  cancelledAt?: Date;
  creditId?: string;
}

export interface SaleFormData {
  customerName: string;
  items: SaleItem[];
  paymentMethod: 'cash' | 'card' | 'transfer';
}

export interface CancellationData {
  reason: string;
}