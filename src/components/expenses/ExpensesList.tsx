import React from 'react';
import { useExpensesStore } from '../../store/expensesStore';
import { Trash2 } from 'lucide-react';

export const ExpensesList: React.FC = () => {
  const expenses = useExpensesStore((state) => state.expenses);
  const getCategoryById = useExpensesStore((state) => state.getCategoryById);
  const deleteExpense = useExpensesStore((state) => state.deleteExpense);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Gastos</h3>
      <div className="space-y-4">
        {expenses.map((expense) => {
          const category = getCategoryById(expense.categoryId);
          return (
            <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{expense.description}</div>
                <div className="text-sm text-gray-500">
                  {category?.name} • {new Date(expense.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold">${expense.amount.toFixed(2)}</span>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
        {expenses.length === 0 && (
          <p className="text-center text-gray-500">No hay gastos registrados</p>
        )}
      </div>
    </div>
  );
};