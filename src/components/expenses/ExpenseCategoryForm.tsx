import React, { useState } from 'react';
import { useExpensesStore } from '../../store/expensesStore';
import { Trash2 } from 'lucide-react';

export const ExpenseCategoryForm: React.FC = () => {
  const [categoryName, setCategoryName] = useState('');
  const categories = useExpensesStore((state) => state.categories);
  const addCategory = useExpensesStore((state) => state.addCategory);
  const deleteCategory = useExpensesStore((state) => state.deleteCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      addCategory(categoryName.trim());
      setCategoryName('');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Categorías de Gastos</h3>
      
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

      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
          >
            <span>{category.name}</span>
            <button
              onClick={() => deleteCategory(category.id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded-full"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};