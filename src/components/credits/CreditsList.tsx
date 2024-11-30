import React, { useState } from 'react';
import { useCreditStore } from '../../store/creditStore';
import { PaymentReceipt } from './PaymentReceipt';
import { XCircle } from 'lucide-react';
import type { Customer, Credit, CreditPayment } from '../../types/credits';

interface CreditsListProps {
  customer: Customer | null;
}

interface PaymentModalProps {
  credit: Credit;
  onSubmit: (amount: number, paymentMethod: 'cash' | 'card' | 'transfer') => void;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ credit, onSubmit, onClose }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentAmount = parseFloat(amount);
    if (!isNaN(paymentAmount) && paymentAmount > 0) {
      onSubmit(paymentAmount, paymentMethod);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Realizar Pago</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              max={credit.remainingAmount}
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pago
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                  className="text-pink-600 focus:ring-pink-500"
                />
                <span className="ml-2">Efectivo</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                  className="text-pink-600 focus:ring-pink-500"
                />
                <span className="ml-2">Tarjeta</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="transfer"
                  checked={paymentMethod === 'transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'transfer')}
                  className="text-pink-600 focus:ring-pink-500"
                />
                <span className="ml-2">Transferencia</span>
              </label>
            </div>
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
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
            >
              Realizar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CancellationModalProps {
  credit: Credit;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const CancellationModal: React.FC<CancellationModalProps> = ({ credit, onConfirm, onClose }) => {
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cancelar Crédito</h3>
        <div className="mb-4">
          <div className="text-sm text-gray-500">
            Esta acción:
            <ul className="list-disc ml-5 mt-2">
              <li>Cancelará el crédito</li>
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

export const CreditsList: React.FC<CreditsListProps> = ({ customer }) => {
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
  const [currentPayment, setCurrentPayment] = useState<{
    payment: CreditPayment;
    credit: Credit;
    customer: Customer;
  } | null>(null);
  const [creditToCancel, setCreditToCancel] = useState<Credit | null>(null);

  const credits = useCreditStore((state) =>
    customer ? state.getCreditsByCustomerId(customer.id) : []
  );
  const addPayment = useCreditStore((state) => state.addPayment);
  const cancelCredit = useCreditStore((state) => state.cancelCredit);

  const handlePayment = (amount: number, paymentMethod: 'cash' | 'card' | 'transfer') => {
    if (selectedCredit && customer) {
      const payment = addPayment(selectedCredit.id, amount, paymentMethod);
      const updatedCredit = credits.find(c => c.id === selectedCredit.id);
      if (payment && updatedCredit) {
        setCurrentPayment({
          payment,
          credit: updatedCredit,
          customer,
        });
      }
      setSelectedCredit(null);
    }
  };

  const handleCancelCredit = (reason: string) => {
    if (creditToCancel) {
      cancelCredit(creditToCancel.id, reason);
      setCreditToCancel(null);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {customer ? `Créditos de ${customer.name}` : 'Créditos'}
      </h3>

      <div className="space-y-4">
        {credits.map((credit) => (
          <div key={credit.id} className="border rounded-md p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium">
                  Vence: {new Date(credit.dueDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500">
                  Creado: {new Date(credit.createdAt).toLocaleDateString()}
                </div>
                {credit.status === 'cancelled' && (
                  <div className="mt-1">
                    <span className="text-sm font-medium text-red-600">Cancelado</span>
                    <p className="text-sm text-gray-500">{credit.cancellationReason}</p>
                  </div>
                )}
              </div>
              <div
                className={`px-2 py-1 rounded text-sm ${
                  credit.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : credit.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {credit.status === 'paid' 
                  ? 'Pagado' 
                  : credit.status === 'cancelled'
                  ? 'Cancelado'
                  : 'Pendiente'}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div>
                <div>Total: ${credit.total.toFixed(2)}</div>
                <div>Restante: ${credit.remainingAmount.toFixed(2)}</div>
              </div>

              {credit.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCredit(credit)}
                    className="px-3 py-1 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                  >
                    Abonar
                  </button>
                  <button
                    onClick={() => setCreditToCancel(credit)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {credits.length === 0 && (
          <p className="text-center text-gray-500">No hay créditos registrados</p>
        )}
      </div>

      {selectedCredit && (
        <PaymentModal
          credit={selectedCredit}
          onSubmit={handlePayment}
          onClose={() => setSelectedCredit(null)}
        />
      )}

      {currentPayment && (
        <PaymentReceipt
          payment={currentPayment.payment}
          credit={currentPayment.credit}
          customer={currentPayment.customer}
          onClose={() => setCurrentPayment(null)}
        />
      )}

      {creditToCancel && (
        <CancellationModal
          credit={creditToCancel}
          onConfirm={handleCancelCredit}
          onClose={() => setCreditToCancel(null)}
        />
      )}
    </div>
  );
};