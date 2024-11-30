import { create } from 'zustand';
import type { Expense, ExpenseCategory } from '../types/expenses';

interface ExpensesState {
  expenses: Expense[];
  categories: ExpenseCategory[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  addCategory: (name: string) => void;
  deleteExpense: (id: string) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => ExpenseCategory | undefined;
  resetSystem: () => void;
}

export const useExpensesStore = create<ExpensesState>((set, get) => ({
  expenses: [],
  categories: [
    { id: '1', name: 'Servicios', createdAt: new Date() },
    { id: '2', name: 'Salarios', createdAt: new Date() },
    { id: '3', name: 'Productos', createdAt: new Date() },
    { id: '4', name: 'Mantenimiento', createdAt: new Date() },
  ],
  addExpense: (expenseData) => {
    set((state) => ({
      expenses: [
        ...state.expenses,
        {
          ...expenseData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        },
      ],
    }));
  },
  addCategory: (name) => {
    set((state) => ({
      categories: [
        ...state.categories,
        {
          id: crypto.randomUUID(),
          name,
          createdAt: new Date(),
        },
      ],
    }));
  },
  deleteExpense: (id) => {
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id !== id),
    }));
  },
  deleteCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    }));
  },
  getCategoryById: (id) => {
    return get().categories.find((category) => category.id === id);
  },
  resetSystem: () => {
    set({
      expenses: [],
      categories: [
        { id: '1', name: 'Servicios', createdAt: new Date() },
        { id: '2', name: 'Salarios', createdAt: new Date() },
        { id: '3', name: 'Productos', createdAt: new Date() },
        { id: '4', name: 'Mantenimiento', createdAt: new Date() },
      ],
    });
  },
}));