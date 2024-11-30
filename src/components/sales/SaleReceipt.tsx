import React from 'react';
import { Logo } from '../Logo';
import { useInventoryStore } from '../../store/inventoryStore';
import type { Sale } from '../../types/sales';

interface SaleReceiptProps {
  sale: Sale;
  customerName: string;
  onClose: () => void;
}

export const SaleReceipt: React.FC<SaleReceiptProps> = ({ sale, customerName, onClose }) => {
  const products = useInventoryStore((state) => state.products);

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const handlePrint = () => {
    window.print();
  };

  const getPaymentMethodText = (method: 'cash' | 'card' | 'transfer') => {
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'card': return 'Tarjeta';
      case 'transfer': return 'Transferencia';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 print:p-0">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 print:shadow-none print:p-4">
        {/* Print-only styles */}
        <style type="text/css" media="print">
          {`
            @page { size: auto; margin: 20mm; }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          `}
        </style>

        {/* Receipt Content */}
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4 border-b pb-6">
            <div className="flex justify-center">
              <Logo />
            </div>
            <div className="text-sm text-gray-500">
              <div>Factura de Venta #{sale.invoiceNumber}</div>
              <div>Fecha: {new Date(sale.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Cliente</h3>
            <div className="text-sm text-gray-600">{customerName}</div>
          </div>

          {/* Items */}
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Código</th>
                  <th className="text-left py-2">Producto</th>
                  <th className="text-right py-2">Cantidad</th>
                  <th className="text-right py-2">Precio</th>
                  <th className="text-right py-2">Descuento</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item) => {
                  const product = getProductById(item.productId);
                  return (
                    <tr key={item.productId} className="border-b">
                      <td className="py-2">{product?.code}</td>
                      <td className="py-2">{product?.name}</td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">${item.price.toFixed(2)}</td>
                      <td className="text-right py-2">${item.discount.toFixed(2)}</td>
                      <td className="text-right py-2">
                        ${((item.price * item.quantity) - item.discount).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${sale.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Descuento Total:</span>
              <span>${sale.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${sale.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Método de Pago:</span>
              <span>{getPaymentMethodText(sale.paymentMethod)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-6 border-t">
            <p>¡Gracias por su compra!</p>
          </div>
        </div>

        {/* Action Buttons - Hidden when printing */}
        <div className="mt-6 flex justify-end gap-4 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};