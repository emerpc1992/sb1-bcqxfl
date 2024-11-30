import { create } from 'zustand';
import { Product, Category } from '../types/inventory';

interface InventoryState {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  resetSystem: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  products: [],
  categories: [
    { id: '1', name: 'Tintes' },
    { id: '2', name: 'Shampoo' },
    { id: '3', name: 'Tratamientos' },
    { id: '4', name: 'Maquillaje' },
    { id: '5', name: 'Accesorios' },
  ],
  addProduct: (productData) => {
    set((state) => ({
      products: [
        ...state.products,
        {
          ...productData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    }));
  },
  updateProduct: (id, productData) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id
          ? { ...product, ...productData, updatedAt: new Date() }
          : product
      ),
    }));
  },
  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    }));
  },
  addCategory: (name) => {
    set((state) => ({
      categories: [...state.categories, { id: crypto.randomUUID(), name }],
    }));
  },
  deleteCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    }));
  },
  resetSystem: () => {
    set({
      products: [],
      categories: [
        { id: '1', name: 'Tintes' },
        { id: '2', name: 'Shampoo' },
        { id: '3', name: 'Tratamientos' },
        { id: '4', name: 'Maquillaje' },
        { id: '5', name: 'Accesorios' },
      ],
    });
  },
}));