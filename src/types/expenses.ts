export interface ExpenseCategory {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  categoryId: string;
  description: string;
  amount: number;
  date: Date;
  createdAt: Date;
}

export interface ExpenseFormData {
  categoryId: string;
  description: string;
  amount: number;
  date: string;
}