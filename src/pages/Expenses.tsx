import React, { useState } from 'react';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ExpensesList } from '../components/expenses/ExpensesList';
import { ExpenseCategoryForm } from '../components/expenses/ExpenseCategoryForm';

export const Expenses: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gastos</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Registrar Gasto</h3>
            <ExpenseForm />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <ExpensesList />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <ExpenseCategoryForm />
        </div>
      </div>
    </div>
  );
};