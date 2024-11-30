import React, { useState } from 'react';
import { useSalesStore } from '../../store/salesStore';
import { useCreditStore } from '../../store/creditStore';
import { useExpensesStore } from '../../store/expensesStore';

export const UserSalesSummary: React.FC = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const getSalesByDateRange = useSalesStore((state) => state.getSalesByDateRange);
  const credits = useCreditStore((state) => state.getActiveCredits());
  const expenses = useExpensesStore((state) => state.expenses);
  const getCategoryById = useExpensesStore((state) => state.getCategoryById);
  const sales = getSalesByDateRange(startDate, endDate);

  // Filter credits by date range
  const filteredCredits = credits.filter((credit) => {
    const creditDate = new Date(credit.createdAt).toISOString().split('T')[0];
    return creditDate >= startDate && creditDate <= endDate;
  });

  // Filter expenses by date range
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date).toISOString().split('T')[0];
    return expenseDate >= startDate && expenseDate <= endDate;
  });

  // Calculate credit payments
  const creditPayments = filteredCredits.reduce((sum, credit) => 
    sum + (credit.total - credit.remainingAmount), 0
  );

  // Calculate totals
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalRevenue = totalSales + creditPayments;
  const totalDiscounts = sales.reduce((sum, sale) => sum + sale.discount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  // Calculate payment method totals
  const paymentTotals = sales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  // Calculate percentages safely
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  // Group expenses by category
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    const category = getCategoryById(expense.categoryId);
    const categoryName = category?.name || 'Sin categoría';
    acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Resumen de Ventas y Gastos</h2>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Desde</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hasta</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-pink-50 p-4 rounded-lg">
          <div className="text-pink-600 font-medium">Ingresos Totales</div>
          <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-pink-600">
            Ventas: ${totalSales.toFixed(2)}
            <br />
            Créditos Cobrados: ${creditPayments.toFixed(2)}
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-red-600 font-medium">Gastos Totales</div>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <div className="text-sm text-red-600">
            {Object.keys(expensesByCategory).length} categorías
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 font-medium">Ganancia Neta</div>
          <div className="text-2xl font-bold">${netIncome.toFixed(2)}</div>
          <div className="text-sm text-green-600">
            {calculatePercentage(netIncome, totalRevenue).toFixed(1)}% de margen
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg">
          <div className="text-emerald-600 font-medium">Efectivo</div>
          <div className="text-2xl font-bold">${(paymentTotals.cash || 0).toFixed(2)}</div>
          <div className="text-sm text-emerald-600">
            {calculatePercentage(paymentTotals.cash || 0, totalSales).toFixed(1)}% de las ventas
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-medium">Tarjeta</div>
          <div className="text-2xl font-bold">${(paymentTotals.card || 0).toFixed(2)}</div>
          <div className="text-sm text-blue-600">
            {calculatePercentage(paymentTotals.card || 0, totalSales).toFixed(1)}% de las ventas
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-purple-600 font-medium">Transferencia</div>
          <div className="text-2xl font-bold">${(paymentTotals.transfer || 0).toFixed(2)}</div>
          <div className="text-sm text-purple-600">
            {calculatePercentage(paymentTotals.transfer || 0, totalSales).toFixed(1)}% de las ventas
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Desglose de Gastos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(expensesByCategory).map(([category, amount]) => (
            <div key={category} className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium text-gray-700">{category}</div>
              <div className="text-xl font-bold">${amount.toFixed(2)}</div>
              <div className="text-sm text-gray-500">
                {calculatePercentage(amount, totalExpenses).toFixed(1)}% del total
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};