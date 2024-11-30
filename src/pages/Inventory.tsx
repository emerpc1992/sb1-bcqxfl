import React, { useState } from 'react';
import { ProductForm } from '../components/inventory/ProductForm';
import { ProductList } from '../components/inventory/ProductList';
import { CategoryList } from '../components/inventory/CategoryList';
import { ExcelActions } from '../components/inventory/ExcelActions';
import { useInventoryStore } from '../store/inventoryStore';
import type { ProductFormData } from '../types/inventory';

export const Inventory: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const addProduct = useInventoryStore((state) => state.addProduct);

  const handleSubmit = (data: ProductFormData) => {
    addProduct(data);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inventario</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
        >
          {showForm ? 'Cancelar' : 'Nuevo Producto'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ExcelActions />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar Nuevo Producto</h3>
              <ProductForm onSubmit={handleSubmit} />
            </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <ProductList />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <CategoryList />
        </div>
      </div>
    </div>
  );
};