import React, { useState } from 'react';
import { SalesReport } from '../components/reports/SalesReport';
import { ExpensesReport } from '../components/reports/ExpensesReport';
import { CreditsReport } from '../components/reports/CreditsReport';
import { InventoryReport } from '../components/reports/InventoryReport';
import { FinancialSummary } from '../components/reports/FinancialSummary';

export const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<'summary' | 'sales' | 'expenses' | 'credits' | 'inventory'>('summary');
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reportes</h2>
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

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setSelectedReport('summary')}
              className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px ${
                selectedReport === 'summary'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Resumen Financiero
            </button>
            <button
              onClick={() => setSelectedReport('sales')}
              className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px ${
                selectedReport === 'sales'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Ventas y Descuentos
            </button>
            <button
              onClick={() => setSelectedReport('expenses')}
              className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px ${
                selectedReport === 'expenses'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Gastos
            </button>
            <button
              onClick={() => setSelectedReport('credits')}
              className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px ${
                selectedReport === 'credits'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Créditos
            </button>
            <button
              onClick={() => setSelectedReport('inventory')}
              className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px ${
                selectedReport === 'inventory'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Inventario
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedReport === 'summary' && (
            <FinancialSummary startDate={startDate} endDate={endDate} />
          )}
          {selectedReport === 'sales' && <SalesReport />}
          {selectedReport === 'expenses' && <ExpensesReport />}
          {selectedReport === 'credits' && <CreditsReport />}
          {selectedReport === 'inventory' && <InventoryReport />}
        </div>
      </div>
    </div>
  );
};