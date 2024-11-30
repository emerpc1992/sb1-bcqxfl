import { create } from 'zustand';
import { useSalesStore } from './salesStore';
import { useInventoryStore } from './inventoryStore';
import { getNextInvoiceNumber } from '../utils/invoiceNumbers';
import type { Credit, Customer, CreditPayment, CreditItem } from '../types/credits';

interface CreditState {
  credits: Credit[];
  customers: Customer[];
  payments: CreditPayment[];
  lastInvoiceNumber: number;
  addCredit: (customerId: string, items: CreditItem[], dueDate: Date) => Credit;
  addCustomer: (data: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  deleteCustomer: (id: string) => void;
  addPayment: (creditId: string, amount: number, paymentMethod: 'cash' | 'card' | 'transfer') => CreditPayment | null;
  cancelCredit: (creditId: string, reason: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getCreditsByCustomerId: (customerId: string) => Credit[];
  searchCustomers: (query: string) => Customer[];
  getActiveCredits: () => Credit[];
  resetSystem: () => void;
}

export const useCreditStore = create<CreditState>((set, get) => ({
  credits: [],
  customers: [],
  payments: [],
  lastInvoiceNumber: 0,

  addCredit: (customerId, items, dueDate) => {
    const inventoryStore = useInventoryStore.getState();
    items.forEach(item => {
      const product = inventoryStore.products.find(p => p.id === item.productId);
      if (product) {
        inventoryStore.updateProduct(product.id, {
          stock: product.stock - item.quantity
        });
      }
    });

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const nextInvoiceNumber = getNextInvoiceNumber('C', get().lastInvoiceNumber);

    const credit: Credit = {
      id: crypto.randomUUID(),
      invoiceNumber: nextInvoiceNumber,
      customerId,
      items,
      total,
      remainingAmount: total,
      dueDate,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      credits: [...state.credits, credit],
      lastInvoiceNumber: state.lastInvoiceNumber + 1
    }));

    return credit;
  },

  addCustomer: (data) => {
    const customer: Customer = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    set((state) => ({
      customers: [...state.customers, customer],
    }));

    return customer;
  },

  deleteCustomer: (id) => {
    // Check if customer has any active credits
    const customerCredits = get().credits.filter(
      credit => credit.customerId === id && credit.status === 'pending'
    );

    if (customerCredits.length > 0) {
      throw new Error('No se puede eliminar el cliente porque tiene créditos pendientes');
    }

    set((state) => ({
      customers: state.customers.filter(customer => customer.id !== id),
    }));
  },

  addPayment: (creditId, amount, paymentMethod) => {
    const credit = get().credits.find((c) => c.id === creditId);
    if (!credit || amount <= 0 || amount > credit.remainingAmount || credit.status === 'cancelled') return null;

    const payment: CreditPayment = {
      id: crypto.randomUUID(),
      creditId,
      amount,
      date: new Date(),
      paymentMethod,
    };

    set((state) => {
      const newRemainingAmount = credit.remainingAmount - amount;
      const updatedCredit = {
        ...credit,
        remainingAmount: newRemainingAmount,
        status: newRemainingAmount <= 0 ? 'paid' : 'pending',
        updatedAt: new Date(),
      };

      if (newRemainingAmount <= 0) {
        const customer = get().getCustomerById(credit.customerId);
        if (customer) {
          const salesStore = useSalesStore.getState();
          salesStore.addSale(customer.name, credit.items.map(item => ({
            ...item,
            discount: 0
          })), paymentMethod, credit.id);
        }
      }

      return {
        payments: [...state.payments, payment],
        credits: state.credits.map((c) => (c.id === creditId ? updatedCredit : c)),
      };
    });

    return payment;
  },

  cancelCredit: (creditId: string, reason: string) => {
    const credit = get().credits.find((c) => c.id === creditId);
    if (!credit || credit.status === 'cancelled') return;

    const inventoryStore = useInventoryStore.getState();
    credit.items.forEach(item => {
      const product = inventoryStore.products.find(p => p.id === item.productId);
      if (product) {
        inventoryStore.updateProduct(product.id, {
          stock: product.stock + item.quantity
        });
      }
    });

    if (credit.status === 'paid') {
      const salesStore = useSalesStore.getState();
      salesStore.removeSalesByCredit(creditId);
    }

    set((state) => ({
      credits: state.credits.map((c) =>
        c.id === creditId
          ? {
              ...c,
              status: 'cancelled',
              remainingAmount: 0,
              cancellationReason: reason,
              cancelledAt: new Date(),
              updatedAt: new Date(),
            }
          : c
      ),
      payments: state.payments.filter(payment => payment.creditId !== creditId)
    }));
  },

  getCustomerById: (id) => {
    return get().customers.find((c) => c.id === id);
  },

  getCreditsByCustomerId: (customerId) => {
    return get().credits.filter((credit) => credit.customerId === customerId);
  },

  searchCustomers: (query) => {
    const searchTerm = query.toLowerCase();
    return get().customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.code.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm)
    );
  },

  getActiveCredits: () => {
    return get().credits.filter(credit => credit.status !== 'cancelled');
  },

  resetSystem: () => {
    set({
      credits: [],
      customers: [],
      payments: [],
      lastInvoiceNumber: 0
    });
  },
}));