import React, { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useInventoryStore } from '../../store/inventoryStore';
import { useSalesStore } from '../../store/salesStore';
import { useCreditStore } from '../../store/creditStore';
import { useExpensesStore } from '../../store/expensesStore';

interface SystemResetModalProps {
  onClose: () => void;
}

export const SystemResetModal: React.FC<SystemResetModalProps> = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const adminPassword = useAuthStore((state) => state.credentials.admin.password);
  const resetInventory = useInventoryStore((state) => state.resetSystem);
  const resetSales = useSalesStore((state) => state.resetSystem);
  const resetCredits = useCreditStore((state) => state.resetSystem);
  const resetExpenses = useExpensesStore((state) => state.resetSystem);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== adminPassword) {
      setError('La contraseña de administrador es incorrecta');
      return;
    }

    if (!confirmReset) {
      setError('Debe confirmar que desea resetear el sistema');
      return;
    }

    // Reset all stores
    resetInventory();
    resetSales();
    resetCredits();
    resetExpenses();

    setSuccess(true);
    
    // Close modal after a short delay
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Trash2 className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Resetear Sistema</h2>
          </div>
          
          {success ? (
            <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-4">
              ¡Sistema reseteado exitosamente!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">¡Advertencia!</span>
                </div>
                <p className="text-sm text-red-600">
                  Esta acción eliminará permanentemente todos los datos del sistema:
                </p>
                <ul className="list-disc list-inside text-sm text-red-600 mt-2">
                  <li>Inventario y categorías</li>
                  <li>Ventas y clientes</li>
                  <li>Créditos y pagos</li>
                  <li>Gastos</li>
                </ul>
                <p className="text-sm text-red-600 mt-2">
                  Esta acción no se puede deshacer.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña de Administrador
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="confirmReset"
                  checked={confirmReset}
                  onChange={(e) => setConfirmReset(e.target.checked)}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <label htmlFor="confirmReset" className="text-sm text-gray-700">
                  Confirmo que deseo eliminar todos los datos del sistema
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 className="h-5 w-5" />
                  Resetear Sistema
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};