import React, { useState } from 'react';
import { useExpensesStore } from '../../store/expensesStore';
import { PieChart, Download } from 'lucide-react';
import { exportToPDF } from '../../utils/pdfExport';

export const ExpensesReport: React.FC = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const expenses = useExpensesStore((state) => state.expenses);
  const getCategoryById = useExpensesStore((state) => state.getCategoryById);

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date).toISOString().split('T')[0];
    return expenseDate >= startDate && expenseDate <= endDate;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    const category = getCategoryById(expense.categoryId);
    const categoryName = category?.name || 'Sin categoría';
    
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleExportPDF = () => {
    const headers = ['Fecha', 'Categoría', 'Descripción', 'Monto'];
    const data = filteredExpenses.map(expense => {
      const category = getCategoryById(expense.categoryId);
      return [
        new Date(expense.date).toLocaleDateString(),
        category?.name || '',
        expense.description,
        `$${expense.amount.toFixed(2)}`
      ];
    });

    const summary = [
      { label: 'Gastos Totales', value: `$${totalExpenses.toFixed(2)}` },
      { label: 'Categorías con Gastos', value: Object.keys(expensesByCategory).length },
      { label: 'Promedio por Gasto', value: `$${(filteredExpenses.length ? totalExpenses / filteredExpenses.length : 0).toFixed(2)}` }
    ];

    exportToPDF('Reporte de Gastos', headers, data, summary);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-end">
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
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gastos por Categoría</h3>
          <div className="space-y-4">
            {Object.entries(expensesByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-pink-500 mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                  </div>
                  <span className="text-sm text-gray-900">${amount.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Gastos</h3>
          <div className="space-y-4">
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="text-pink-600 font-medium">Total de Gastos</div>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 font-medium">Promedio por Gasto</div>
              <div className="text-2xl font-bold">
                ${(filteredExpenses.length ? totalExpenses / filteredExpenses.length : 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.map((expense) => {
              const category = getCategoryById(expense.categoryId);
              return (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};