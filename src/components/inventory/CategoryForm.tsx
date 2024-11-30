import React, { useState } from 'react';
import { useInventoryStore } from '../../store/inventoryStore';

export const CategoryForm: React.FC = () => {
  const [categoryName, setCategoryName] = useState('');
  const addCategory = useInventoryStore((state) => state.addCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      addCategory(categoryName.trim());
      setCategoryName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="Nueva categoría"
        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
      >
        Agregar
      </button>
    </form>
  );
};