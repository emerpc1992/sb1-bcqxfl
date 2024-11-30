import React from 'react';
import { useSalesStore } from '../../store/salesStore';
import { useExpensesStore } from '../../store/expensesStore';
import { useInventoryStore } from '../../store/inventoryStore';
import { useCreditStore } from '../../store/creditStore';
import { Download } from 'lucide-react';
import { exportToPDF } from '../../utils/pdfExport';

interface FinancialSummaryProps {
  startDate: string;
  endDate: string;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ startDate, endDate }) => {
  const getSalesByDateRange = useSalesStore((state) => state.getSalesByDateRange);
  const expenses = useExpensesStore((state) => state.expenses);
  const products = useInventoryStore((state) => state.products);
  const credits = useCreditStore((state) => state.getActiveCredits());
  const creditPayments = useCreditStore((state) => state.payments);

  // Get active sales for the date range
  const filteredSales = getSalesByDateRange(startDate, endDate);

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date).toISOString().split('T')[0];
    return expenseDate >= startDate && expenseDate <= endDate;
  });

  const filteredCredits = credits.filter((credit) => {
    const creditDate = new Date(credit.createdAt).toISOString().split('T')[0];
    return creditDate >= startDate && creditDate <= endDate;
  });

  const filteredCreditPayments = creditPayments.filter((payment) => {
    const paymentDate = new Date(payment.date).toISOString().split('T')[0];
    return paymentDate >= startDate && paymentDate <= endDate;
  });

  // Calculate payment method totals including credit payments
  const paymentTotals = filteredSales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  // Add credit payments to payment totals
  filteredCreditPayments.forEach(payment => {
    paymentTotals[payment.paymentMethod] = (paymentTotals[payment.paymentMethod] || 0) + payment.amount;
  });

  // Calculate financial metrics
  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalDiscounts = filteredSales.reduce((sum, sale) => sum + sale.discount, 0);
  const totalCredits = filteredCredits.reduce((sum, credit) => sum + credit.total, 0);
  const totalPendingCredits = filteredCredits.reduce((sum, credit) => sum + credit.remainingAmount, 0);
  const totalPaidCredits = totalCredits - totalPendingCredits;
  
  const totalRevenue = totalSales + totalPaidCredits;
  
  const totalCostOfGoods = filteredSales.reduce((sum, sale) => {
    return sum + sale.items.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId);
      return itemSum + (product?.costPrice || 0) * item.quantity;
    }, 0);
  }, 0);

  const grossProfit = totalRevenue - totalCostOfGoods;
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = grossProfit - totalExpenses;

  // Calculate percentages safely
  const calculatePercentage = (value: number) => {
    if (totalRevenue === 0) return 0;
    return (value / totalRevenue * 100);
  };

  const handleExportPDF = () => {
    const headers = ['Métrica', 'Valor'];
    const data = [
      ['Ventas Brutas', `$${(totalSales + totalDiscounts).toFixed(2)}`],
      ['Descuentos', `$${totalDiscounts.toFixed(2)}`],
      ['Ventas Netas', `$${totalSales.toFixed(2)}`],
      ['Efectivo (Ventas + Créditos)', `$${(paymentTotals.cash || 0).toFixed(2)}`],
      ['Tarjeta (Ventas + Créditos)', `$${(paymentTotals.card || 0).toFixed(2)}`],
      ['Transferencia (Ventas + Créditos)', `$${(paymentTotals.transfer || 0).toFixed(2)}`],
      ['Créditos Cobrados', `$${totalPaidCredits.toFixed(2)}`],
      ['Ingresos Totales', `$${totalRevenue.toFixed(2)}`],
      ['Costo de Ventas', `$${totalCostOfGoods.toFixed(2)}`],
      ['Ganancia Bruta', `$${grossProfit.toFixed(2)}`],
      ['Gastos Operativos', `$${totalExpenses.toFixed(2)}`],
      ['Ganancia Neta', `$${netProfit.toFixed(2)}`],
    ];

    const summary = [
      { label: 'Margen Bruto', value: `${calculatePercentage(grossProfit).toFixed(1)}%` },
      { label: 'Margen Neto', value: `${calculatePercentage(netProfit).toFixed(1)}%` },
      { label: 'Ratio de Gastos', value: `${calculatePercentage(totalExpenses).toFixed(1)}%` }
    ];

    exportToPDF('Resumen Financiero', headers, data, summary);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 font-medium">Ingresos Totales</div>
          <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-green-600">
            Ventas: ${totalSales.toFixed(2)}
            <br />
            Créditos Cobrados: ${totalPaidCredits.toFixed(2)}
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-medium">Ganancia Bruta</div>
          <div className="text-2xl font-bold">${grossProfit.toFixed(2)}</div>
          <div className="text-sm text-blue-600">
            Costo de Ventas: -${totalCostOfGoods.toFixed(2)}
          </div>
        </div>

        <div className="bg-pink-50 p-4 rounded-lg">
          <div className="text-pink-600 font-medium">Ganancia Neta</div>
          <div className="text-2xl font-bold">${netProfit.toFixed(2)}</div>
          <div className="text-sm text-pink-600">
            Gastos: -${totalExpenses.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-4 rounded-lg">
          <div className="text-emerald-600 font-medium">Efectivo (Ventas + Créditos)</div>
          <div className="text-2xl font-bold">${(paymentTotals.cash || 0).toFixed(2)}</div>
          <div className="text-sm text-emerald-600">
            {calculatePercentage(paymentTotals.cash || 0).toFixed(1)}% del total
          </div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-indigo-600 font-medium">Tarjeta (Ventas + Créditos)</div>
          <div className="text-2xl font-bold">${(paymentTotals.card || 0).toFixed(2)}</div>
          <div className="text-sm text-indigo-600">
            {calculatePercentage(paymentTotals.card || 0).toFixed(1)}% del total
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-purple-600 font-medium">Transferencia (Ventas + Créditos)</div>
          <div className="text-2xl font-bold">${(paymentTotals.transfer || 0).toFixed(2)}</div>
          <div className="text-sm text-purple-600">
            {calculatePercentage(paymentTotals.transfer || 0).toFixed(1)}% del total
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen Financiero</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ventas Brutas</span>
              <span className="font-medium">${(totalSales + totalDiscounts).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Descuentos</span>
              <span>-${totalDiscounts.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Créditos Cobrados</span>
              <span className="font-medium">${totalPaidCredits.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Costo de Ventas</span>
              <span>-${totalCostOfGoods.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Gastos Operativos</span>
              <span>-${totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Ganancia Neta</span>
              <span className={netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                ${netProfit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas Financieras</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Margen Bruto</div>
              <div className="text-lg font-medium">
                {calculatePercentage(grossProfit).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Margen Neto</div>
              <div className="text-lg font-medium">
                {calculatePercentage(netProfit).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Ratio de Gastos</div>
              <div className="text-lg font-medium">
                {calculatePercentage(totalExpenses).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};