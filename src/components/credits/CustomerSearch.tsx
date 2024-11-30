import React, { useState } from 'react';
import { useCreditStore } from '../../store/creditStore';
import { Search } from 'lucide-react';
import type { Customer } from '../../types/credits';

interface CustomerSearchProps {
  onSelect: (customer: Customer) => void;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const searchCustomers = useCreditStore((state) => state.searchCustomers);

  const customers = query ? searchCustomers(query) : [];

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por código, nombre o teléfono"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {customers.length > 0 && (
        <div className="border rounded-md divide-y">
          {customers.map((customer) => (
            <button
              key={customer.id}
              onClick={() => onSelect(customer)}
              className="w-full text-left p-4 hover:bg-gray-50"
            >
              <div className="font-medium">{customer.name}</div>
              <div className="text-sm text-gray-500">
                Código: {customer.code} | Tel: {customer.phone}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};