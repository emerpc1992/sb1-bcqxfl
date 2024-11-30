import React from 'react';
import { Logo } from '../Logo';
import type { Credit, Customer, CreditPayment } from '../../types/credits';

interface PaymentReceiptProps {
  payment: CreditPayment;
  credit: Credit;
  customer: Customer;
  onClose: () => void;
}

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  payment,
  credit,
  customer,
  onClose,
}) => {
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 print:shadow-none print:p-4">
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
              <div>Recibo de Pago - Crédito #{credit.invoiceNumber}</div>
              <div>Fecha: {new Date(payment.date).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Cliente</h3>
            <div className="text-sm text-gray-600">
              <div>Código: {customer.code}</div>
              <div>Nombre: {customer.name}</div>
              <div>Teléfono: {customer.phone}</div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monto Total del Crédito:</span>
              <span className="font-medium">${credit.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monto Abonado:</span>
              <span className="font-medium text-green-600">${payment.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Método de Pago:</span>
              <span className="font-medium">{getPaymentMethodText(payment.paymentMethod)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium pt-2 border-t">
              <span>Saldo Pendiente:</span>
              <span className={credit.remainingAmount === 0 ? 'text-green-600' : ''}>
                ${credit.remainingAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Status */}
          {credit.remainingAmount === 0 && (
            <div className="bg-green-50 text-green-800 text-center py-2 rounded-md">
              ¡Crédito Cancelado!
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-6 border-t">
            <p>¡Gracias por su pago!</p>
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