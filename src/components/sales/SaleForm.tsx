import React, { useState } from 'react';
import { useInventoryStore } from '../../store/inventoryStore';
import { useSalesStore } from '../../store/salesStore';
import { Search, Plus, X, ImageIcon } from 'lucide-react';
import type { Product } from '../../types/inventory';
import type { SaleItem, Sale } from '../../types/sales';

interface SaleFormProps {
  onComplete: (sale: Sale) => void;
}

export const SaleForm: React.FC<SaleFormProps> = ({ onComplete }) => {
  const [customerName, setCustomerName] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState<(SaleItem & { product: Product })[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  
  const products = useInventoryStore((state) => state.products);
  const categories = useInventoryStore((state) => state.categories);
  const addSale = useSalesStore((state) => state.addSale);

  const filteredProducts = products.filter(product => {
    const matchesSearch = search.trim() === '' || 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.code.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (product: Product) => {
    const existingItem = items.find(item => item.productId === product.id);
    
    if (existingItem) {
      setItems(items.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setItems([...items, {
        productId: product.id,
        quantity: 1,
        price: product.salePrice,
        discount: 0,
        product,
      }]);
    }
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const handleQuantityChange = (productId: string, quantityStr: string) => {
    const quantity = parseInt(quantityStr, 10);
    if (!isNaN(quantity) && quantity > 0) {
      setItems(items.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const handleDiscountChange = (productId: string, discountStr: string) => {
    const discount = parseFloat(discountStr);
    if (!isNaN(discount) && discount >= 0) {
      setItems(items.map(item =>
        item.productId === productId
          ? { ...item, discount: Math.min(discount, item.price * item.quantity) }
          : item
      ));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = items.reduce((sum, item) => sum + (item.discount || 0), 0);
  const total = subtotal - totalDiscount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim() && items.length > 0) {
      const saleItems = items.map(({ productId, quantity, price, discount }) => ({
        productId, quantity, price, discount: discount || 0
      }));
      
      const sale = addSale(customerName, saleItems, paymentMethod);
      setCustomerName('');
      setItems([]);
      setPaymentMethod('cash');
      onComplete(sale);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
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
                <div className="flex items-center gap-4">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = 'https://via.placeholder.com/150?text=No+imagen';
                      }}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      Código: {product.code} | Stock: {product.stock}
                    </div>
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
              <div className="flex items-center gap-4 flex-1">
                {item.product.imageUrl ? (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-10 w-10 object-cover rounded"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'https://via.placeholder.com/150?text=No+imagen';
                    }}
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                <div>
                  <div className="font-medium">{item.product.name}</div>
                  <div className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                  className="w-20 rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  min="1"
                />
                <input
                  type="number"
                  value={item.discount || ''}
                  onChange={(e) => handleDiscountChange(item.productId, e.target.value)}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  placeholder="Descuento"
                  min="0"
                  step="0.01"
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

        <div className="border-t pt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Descuento:</span>
              <span>-${totalDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pago
            </label>
            <div className="flex gap-4">
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
        </div>
      </div>

      <button
        type="submit"
        disabled={items.length === 0 || !customerName.trim()}
        className="w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Completar Venta
      </button>
    </form>
  );
};