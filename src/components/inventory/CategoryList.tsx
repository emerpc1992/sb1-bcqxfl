import React from 'react';
import { useInventoryStore } from '../../store/inventoryStore';
import { CategoryForm } from './CategoryForm';

export const CategoryList: React.FC = () => {
  const categories = useInventoryStore((state) => state.categories);
  const deleteCategory = useInventoryStore((state) => state.deleteCategory);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Categorías</h3>
      <CategoryForm />
      <div className="mt-4 space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
          >
            <span>{category.name}</span>
            <button
              onClick={() => deleteCategory(category.id)}
              className="text-red-600 hover:text-red-900 text-sm"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};