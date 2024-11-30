export interface Credit {
  id: string;
  invoiceNumber: string;
  customerId: string;
  items: CreditItem[];
  total: number;
  remainingAmount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'cancelled';
  cancellationReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreditPayment {
  id: string;
  creditId: string;
  amount: number;
  date: Date;
  paymentMethod: 'cash' | 'card' | 'transfer';
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  address: string;
  createdAt: Date;
}

export interface CustomerFormData {
  code: string;
  name: string;
  phone: string;
  address: string;
}