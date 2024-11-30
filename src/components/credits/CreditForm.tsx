import React, { useState } from 'react';
import { useInventoryStore } from '../../store/inventoryStore';
import { useCreditStore } from '../../store/creditStore';
import { Search, Plus, X } from 'lucide-react';
import type { Product } from '../../types/inventory';
import type { Customer, CreditItem } from '../../types/credits';

interface CreditFormProps {
  customer: Customer;
}

export const CreditForm: React.FC<CreditFormProps> = ({ customer }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState<(CreditItem & { product: Product })[]>([]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const products = useInventoryStore((state) => state.products);
  const categories = useInventoryStore((state) => state.categories);
  const addCredit = useCreditStore((state) => state.addCredit);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      search.trim() === '' ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.code.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (product: Product) => {
    const existingItem = items.find((item) => item.productId === product.id);

    if (existingItem) {
      setItems(
        items.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          quantity: 1,
          price: product.salePrice,
          product,
        },
      ]);
    }
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter((item) => item.productId !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setItems(
      items.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length > 0 && dueDate) {
      const creditItems = items.map(({ productId, quantity, price }) => ({
        productId,
        quantity,
        price,
      }));

      addCredit(customer.id, creditItems, new Date(dueDate));
      setItems([]);
      setSearch('');
      setSelectedCategory('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium">Cliente</h4>
        <div className="text-sm text-gray-500">
          <div>Código: {customer.code}</div>
          <div>Nombre: {customer.name}</div>
          <div>Teléfono: {customer.phone}</div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Buscar Producto</label>
            <div className="mt-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 pl-10"
                placeholder="Código o nombre del producto"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border rounded-md">
          <div className="max-h-60 overflow-y-auto">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-2 hover:bg-gray-50 flex justify-between items-center border-b last:border-b-0"
              >
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    Código: {product.code} | Stock: {product.stock}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-semibold">${product.salePrice.toFixed(2)}</div>
                  <button
                    type="button"
                    onClick={() => handleAddItem(product)}
                    className="p-1 text-pink-600 hover:bg-pink-50 rounded-full"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 p-2 bg-gray-50 rounded-md">
              <div className="flex-1">
                <div className="font-medium">{item.product.name}</div>
                <div className="text-sm text-gray-500">
                  ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                  className="w-20 rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.productId)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={items.length === 0}
        className="w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Crear Crédito
      </button>
    </form>
  );
};