import { create } from 'zustand';
import { useInventoryStore } from './inventoryStore';
import { getNextInvoiceNumber } from '../utils/invoiceNumbers';
import type { Sale, Customer, SaleItem, CancellationData } from '../types/sales';

interface SalesState {
  sales: Sale[];
  customers: Customer[];
  lastInvoiceNumber: number;
  addSale: (customerName: string, items: SaleItem[], paymentMethod: 'cash' | 'card' | 'transfer', creditId?: string) => Sale;
  cancelSale: (saleId: string, cancellationData: CancellationData) => void;
  removeSalesByCredit: (creditId: string) => void;
  addCustomer: (name: string) => Customer;
  getCustomerById: (id: string) => Customer | undefined;
  getActiveSales: () => Sale[];
  getSalesByDateRange: (startDate: string, endDate: string) => Sale[];
  resetSystem: () => void;
}

export const useSalesStore = create<SalesState>((set, get) => ({
  sales: [],
  customers: [],
  lastInvoiceNumber: 0,
  
  addSale: (customerName: string, items: SaleItem[], paymentMethod: 'cash' | 'card' | 'transfer', creditId?: string) => {
    let customer = get().customers.find(c => c.name.toLowerCase() === customerName.toLowerCase());
    
    if (!customer) {
      customer = get().addCustomer(customerName);
    }

    // Reduce inventory stock
    const inventoryStore = useInventoryStore.getState();
    items.forEach(item => {
      const product = inventoryStore.products.find(p => p.id === item.productId);
      if (product) {
        inventoryStore.updateProduct(product.id, {
          stock: product.stock - item.quantity
        });
      }
    });

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = items.reduce((sum, item) => sum + item.discount, 0);
    const total = subtotal - discount;

    const nextInvoiceNumber = getNextInvoiceNumber('V', get().lastInvoiceNumber);

    const sale: Sale = {
      id: crypto.randomUUID(),
      invoiceNumber: nextInvoiceNumber,
      customerId: customer.id,
      items,
      subtotal,
      discount,
      total,
      paymentMethod,
      createdAt: new Date(),
      status: 'completed',
      creditId
    };

    set(state => ({
      sales: [...state.sales, sale],
      lastInvoiceNumber: state.lastInvoiceNumber + 1
    }));

    return sale;
  },

  cancelSale: (saleId: string, { reason }: CancellationData) => {
    const sale = get().sales.find(s => s.id === saleId);
    if (!sale || sale.status === 'cancelled') return;

    // Restore inventory stock
    const inventoryStore = useInventoryStore.getState();
    sale.items.forEach(item => {
      const product = inventoryStore.products.find(p => p.id === item.productId);
      if (product) {
        inventoryStore.updateProduct(product.id, {
          stock: product.stock + item.quantity
        });
      }
    });

    set(state => ({
      sales: state.sales.map(sale =>
        sale.id === saleId
          ? {
              ...sale,
              status: 'cancelled',
              cancellationReason: reason,
              cancelledAt: new Date()
            }
          : sale
      ),
    }));
  },

  removeSalesByCredit: (creditId: string) => {
    set(state => ({
      sales: state.sales.filter(sale => sale.creditId !== creditId)
    }));
  },

  addCustomer: (name: string) => {
    const customer: Customer = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
    };

    set(state => ({
      customers: [...state.customers, customer],
    }));

    return customer;
  },

  getCustomerById: (id: string) => {
    return get().customers.find(c => c.id === id);
  },

  getActiveSales: () => {
    return get().sales.filter(sale => sale.status === 'completed');
  },

  getSalesByDateRange: (startDate: string, endDate: string) => {
    return get().sales.filter(sale => {
      if (sale.status === 'cancelled') return false;
      const saleDate = new Date(sale.createdAt).toISOString().split('T')[0];
      return saleDate >= startDate && saleDate <= endDate;
    });
  },

  resetSystem: () => {
    set({
      sales: [],
      customers: [],
      lastInvoiceNumber: 0
    });
  }
}));