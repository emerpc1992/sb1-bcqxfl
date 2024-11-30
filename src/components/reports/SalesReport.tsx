import React, { useState } from 'react';
import { useSalesStore } from '../../store/salesStore';
import { useInventoryStore } from '../../store/inventoryStore';
import { BarChart3, Download } from 'lucide-react';
import { exportToPDF } from '../../utils/pdfExport';

export const SalesReport: React.FC = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const sales = useSalesStore((state) => state.getActiveSales());
  const getCustomerById = useSalesStore((state) => state.getCustomerById);
  const products = useInventoryStore((state) => state.products);

  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.createdAt).toISOString().split('T')[0];
    return saleDate >= startDate && saleDate <= endDate;
  });

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalDiscounts = filteredSales.reduce((sum, sale) => sum + sale.discount, 0);

  // Calculate totals by payment method
  const paymentTotals = filteredSales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  // Calculate cost of goods sold
  const totalCost = filteredSales.reduce((sum, sale) => {
    return sum + sale.items.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId);
      return itemSum + (product?.costPrice || 0) * item.quantity;
    }, 0);
  }, 0);

  const grossProfit = totalSales - totalCost;

  const handleExportPDF = () => {
    const headers = ['Fecha', 'Cliente', 'Subtotal', 'Descuento', 'Total', 'Método de Pago'];
    const data = filteredSales.map(sale => {
      const customer = getCustomerById(sale.customerId);
      const paymentMethod = {
        cash: 'Efectivo',
        card: 'Tarjeta',
        transfer: 'Transferencia'
      }[sale.paymentMethod];
      
      return [
        new Date(sale.createdAt).toLocaleDateString(),
        customer?.name || '',
        `$${sale.subtotal.toFixed(2)}`,
        `$${sale.discount.toFixed(2)}`,
        `$${sale.total.toFixed(2)}`,
        paymentMethod
      ];
    });

    const summary = [
      { label: 'Ventas Totales', value: `$${totalSales.toFixed(2)}` },
      { label: 'Efectivo', value: `$${(paymentTotals.cash || 0).toFixed(2)}` },
      { label: 'Tarjeta', value: `$${(paymentTotals.card || 0).toFixed(2)}` },
      { label: 'Transferencia', value: `$${(paymentTotals.transfer || 0).toFixed(2)}` },
      { label: 'Ganancia Bruta', value: `$${grossProfit.toFixed(2)}` },
      { label: 'Descuentos', value: `$${totalDiscounts.toFixed(2)}` }
    ];

    exportToPDF('Reporte de Ventas', headers, data, summary);
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 font-medium">Ventas Totales</div>
          <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-medium">Ganancia Bruta</div>
          <div className="text-2xl font-bold">${grossProfit.toFixed(2)}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-yellow-600 font-medium">Descuentos</div>
          <div className="text-2xl font-bold">${totalDiscounts.toFixed(2)}</div>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg">
          <div className="text-pink-600 font-medium">Costo de Ventas</div>
          <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-4 rounded-lg">
          <div className="text-emerald-600 font-medium">Efectivo</div>
          <div className="text-2xl font-bold">${(paymentTotals.cash || 0).toFixed(2)}</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-indigo-600 font-medium">Tarjeta</div>
          <div className="text-2xl font-bold">${(paymentTotals.card || 0).toFixed(2)}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-purple-600 font-medium">Transferencia</div>
          <div className="text-2xl font-bold">${(paymentTotals.transfer || 0).toFixed(2)}</div>
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
                Cliente
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtotal
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descuento
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método de Pago
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSales.map((sale) => {
              const customer = getCustomerById(sale.customerId);
              const paymentMethod = {
                cash: 'Efectivo',
                card: 'Tarjeta',
                transfer: 'Transferencia'
              }[sale.paymentMethod];

              return (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    ${sale.subtotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    ${sale.discount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    ${sale.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {paymentMethod}
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