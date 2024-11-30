import React, { useState } from 'react';
import { useSalesStore } from '../../store/salesStore';
import { Receipt, XCircle } from 'lucide-react';
import type { Sale } from '../../types/sales';

interface SalesListProps {
  onReceiptClick: (sale: Sale) => void;
}

interface CancellationModalProps {
  sale: Sale;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const CancellationModal: React.FC<CancellationModalProps> = ({ sale, onConfirm, onClose }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cancelar Venta</h3>
        <div className="mb-4">
          <div className="text-sm text-gray-500">
            Esta acción:
            <ul className="list-disc ml-5 mt-2">
              <li>Cancelará la venta</li>
              <li>Devolverá los productos al inventario</li>
              <li>No se puede deshacer</li>
            </ul>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Motivo de Cancelación
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              rows={3}
              required
              placeholder="Ingrese el motivo de la cancelación..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Confirmar Cancelación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SalesList: React.FC<SalesListProps> = ({ onReceiptClick }) => {
  const [saleToCancel, setSaleToCancel] = useState<Sale | null>(null);
  const sales = useSalesStore((state) => state.sales);
  const getCustomerById = useSalesStore((state) => state.getCustomerById);
  const cancelSale = useSalesStore((state) => state.cancelSale);

  const handleCancelSale = (reason: string) => {
    if (saleToCancel) {
      cancelSale(saleToCancel.id, { reason });
      setSaleToCancel(null);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Últimas Ventas</h3>
      <div className="space-y-4">
        {sales.map((sale) => {
          const customer = getCustomerById(sale.customerId);
          return (
            <div key={sale.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">{customer?.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(sale.createdAt).toLocaleString()}
                  </div>
                  {sale.status === 'cancelled' && (
                    <div className="mt-1">
                      <span className="text-sm font-medium text-red-600">Cancelada</span>
                      <p className="text-sm text-gray-500">{sale.cancellationReason}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold">${sale.total.toFixed(2)}</div>
                  {sale.status === 'completed' && (
                    <>
                      <button
                        onClick={() => onReceiptClick(sale)}
                        className="p-1 text-pink-600 hover:bg-pink-50 rounded-full"
                        title="Ver factura"
                      >
                        <Receipt className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setSaleToCancel(sale)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                        title="Cancelar venta"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <div>Subtotal: ${sale.subtotal.toFixed(2)}</div>
                <div>Descuento: ${sale.discount.toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {saleToCancel && (
        <CancellationModal
          sale={saleToCancel}
          onConfirm={handleCancelSale}
          onClose={() => setSaleToCancel(null)}
        />
      )}
    </div>
  );
};