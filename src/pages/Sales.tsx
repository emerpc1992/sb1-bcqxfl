import React, { useState } from 'react';
import { SaleForm } from '../components/sales/SaleForm';
import { SalesList } from '../components/sales/SalesList';
import { SaleReceipt } from '../components/sales/SaleReceipt';
import { useSalesStore } from '../store/salesStore';
import type { Sale } from '../types/sales';

export const Sales: React.FC = () => {
  const [currentSale, setCurrentSale] = useState<{ sale: Sale; customerName: string } | null>(null);
  const getCustomerById = useSalesStore((state) => state.getCustomerById);

  const handleSaleComplete = (sale: Sale) => {
    const customer = getCustomerById(sale.customerId);
    if (customer) {
      setCurrentSale({ sale, customerName: customer.name });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Ventas</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Venta</h3>
          <SaleForm onComplete={handleSaleComplete} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <SalesList onReceiptClick={handleSaleComplete} />
        </div>
      </div>

      {currentSale && (
        <SaleReceipt
          sale={currentSale.sale}
          customerName={currentSale.customerName}
          onClose={() => setCurrentSale(null)}
        />
      )}
    </div>
  );
};