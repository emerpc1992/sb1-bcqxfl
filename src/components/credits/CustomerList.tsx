import React, { useState } from 'react';
import { useCreditStore } from '../../store/creditStore';
import { Trash2, AlertCircle } from 'lucide-react';

export const CustomerList: React.FC = () => {
  const customers = useCreditStore((state) => state.customers);
  const deleteCustomer = useCreditStore((state) => state.deleteCustomer);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteCustomer = async (id: string) => {
    try {
      if (confirm('¿Está seguro que desea eliminar este cliente?')) {
        deleteCustomer(id);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Lista de Clientes</h3>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="space-y-2">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="flex justify-between items-center p-4 bg-white rounded-lg shadow"
          >
            <div>
              <div className="font-medium">{customer.name}</div>
              <div className="text-sm text-gray-500">
                Código: {customer.code} | Tel: {customer.phone}
              </div>
              <div className="text-sm text-gray-500">{customer.address}</div>
            </div>
            <button
              onClick={() => handleDeleteCustomer(customer.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              title="Eliminar cliente"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}

        {customers.length === 0 && (
          <p className="text-center text-gray-500">No hay clientes registrados</p>
        )}
      </div>
    </div>
  );
};