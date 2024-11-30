import React, { useState } from 'react';
import { CustomerForm } from '../components/credits/CustomerForm';
import { CreditForm } from '../components/credits/CreditForm';
import { CreditsList } from '../components/credits/CreditsList';
import { CustomerSearch } from '../components/credits/CustomerSearch';
import { CustomerList } from '../components/credits/CustomerList';
import type { Customer } from '../types/credits';

export const Credits: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Créditos</h2>
        <div className="space-x-4">
          <button
            onClick={() => setShowCustomerList(!showCustomerList)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showCustomerList ? 'Ocultar Clientes' : 'Ver Clientes'}
          </button>
          <button
            onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            {showNewCustomerForm ? 'Cancelar' : 'Nuevo Cliente'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {showNewCustomerForm ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Registrar Nuevo Cliente</h3>
              <CustomerForm onSuccess={() => setShowNewCustomerForm(false)} />
            </div>
          ) : showCustomerList ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <CustomerList />
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Buscar Cliente</h3>
              <CustomerSearch onSelect={setSelectedCustomer} />
            </div>
          )}

          {selectedCustomer && !showNewCustomerForm && !showCustomerList && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nuevo Crédito</h3>
              <CreditForm customer={selectedCustomer} />
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <CreditsList customer={selectedCustomer} />
        </div>
      </div>
    </div>
  );
};