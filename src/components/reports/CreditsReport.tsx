import React, { useState } from 'react';
import { useCreditStore } from '../../store/creditStore';
import { Download } from 'lucide-react';
import { exportToPDF } from '../../utils/pdfExport';

export const CreditsReport: React.FC = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const credits = useCreditStore((state) => state.getActiveCredits());
  const getCustomerById = useCreditStore((state) => state.getCustomerById);

  const filteredCredits = credits.filter((credit) => {
    const creditDate = new Date(credit.createdAt).toISOString().split('T')[0];
    return creditDate >= startDate && creditDate <= endDate;
  });

  const totalCredits = filteredCredits.reduce((sum, credit) => sum + credit.total, 0);
  const totalPending = filteredCredits.reduce((sum, credit) => sum + credit.remainingAmount, 0);
  const totalPaid = totalCredits - totalPending;

  const handleExportPDF = () => {
    const headers = ['Cliente', 'Fecha', 'Total', 'Pendiente', 'Estado'];
    const data = filteredCredits.map(credit => {
      const customer = getCustomerById(credit.customerId);
      return [
        customer?.name || '',
        new Date(credit.createdAt).toLocaleDateString(),
        `$${credit.total.toFixed(2)}`,
        `$${credit.remainingAmount.toFixed(2)}`,
        credit.status === 'paid' ? 'Pagado' : 'Pendiente'
      ];
    });

    const summary = [
      { label: 'Total en Créditos', value: `$${totalCredits.toFixed(2)}` },
      { label: 'Pendiente de Cobro', value: `$${totalPending.toFixed(2)}` },
      { label: 'Total Cobrado', value: `$${totalPaid.toFixed(2)}` }
    ];

    exportToPDF('Reporte de Créditos', headers, data, summary);
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-medium">Total en Créditos</div>
          <div className="text-2xl font-bold">${totalCredits.toFixed(2)}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-yellow-600 font-medium">Pendiente de Cobro</div>
          <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 font-medium">Total Cobrado</div>
          <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pendiente
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimiento
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCredits.map((credit) => {
              const customer = getCustomerById(credit.customerId);
              const isOverdue = new Date(credit.dueDate) < new Date() && credit.status === 'pending';
              
              return (
                <tr key={credit.id} className={isOverdue ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(credit.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    ${credit.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    ${credit.remainingAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        credit.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : isOverdue
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {credit.status === 'paid' ? 'Pagado' : isOverdue ? 'Vencido' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {new Date(credit.dueDate).toLocaleDateString()}
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