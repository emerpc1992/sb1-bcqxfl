import React from 'react';
import { useInventoryStore } from '../../store/inventoryStore';
import { AlertTriangle, Download } from 'lucide-react';
import { exportToPDF } from '../../utils/pdfExport';

export const InventoryReport: React.FC = () => {
  const products = useInventoryStore((state) => state.products);
  const categories = useInventoryStore((state) => state.categories);

  const totalInventoryValue = products.reduce(
    (sum, product) => sum + product.costPrice * product.stock,
    0
  );

  const totalSaleValue = products.reduce(
    (sum, product) => sum + product.salePrice * product.stock,
    0
  );

  const potentialProfit = totalSaleValue - totalInventoryValue;

  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = {
        count: 0,
        stockValue: 0,
        lowStock: 0,
      };
    }
    acc[product.category].count += 1;
    acc[product.category].stockValue += product.costPrice * product.stock;
    if (product.stock <= product.minStock) {
      acc[product.category].lowStock += 1;
    }
    return acc;
  }, {} as Record<string, { count: number; stockValue: number; lowStock: number }>);

  const lowStockProducts = products.filter((product) => product.stock <= product.minStock);

  const handleExportPDF = () => {
    const headers = ['Código', 'Producto', 'Categoría', 'Stock', 'Costo', 'Valor Total'];
    const data = products.map(product => [
      product.code,
      product.name,
      product.category,
      product.stock,
      `$${product.costPrice.toFixed(2)}`,
      `$${(product.costPrice * product.stock).toFixed(2)}`
    ]);

    const summary = [
      { label: 'Valor del Inventario', value: `$${totalInventoryValue.toFixed(2)}` },
      { label: 'Valor de Venta Potencial', value: `$${totalSaleValue.toFixed(2)}` },
      { label: 'Ganancia Potencial', value: `$${potentialProfit.toFixed(2)}` },
      { label: 'Productos con Stock Bajo', value: lowStockProducts.length }
    ];

    exportToPDF('Reporte de Inventario', headers, data, summary);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Reporte de Inventario</h2>
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-medium">Valor del Inventario</div>
          <div className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 font-medium">Valor de Venta Potencial</div>
          <div className="text-2xl font-bold">${totalSaleValue.toFixed(2)}</div>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg">
          <div className="text-pink-600 font-medium">Ganancia Potencial</div>
          <div className="text-2xl font-bold">${potentialProfit.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen por Categoría</h3>
          <div className="space-y-2">
            {Object.entries(productsByCategory)
              .sort((a, b) => b[1].stockValue - a[1].stockValue)
              .map(([category, data]) => (
                <div key={category} className="p-2 bg-gray-50 rounded">
                  <div className="flex justify-between">
                    <span className="font-medium">{category}</span>
                    <span>{data.count} productos</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Valor: ${data.stockValue.toFixed(2)}</span>
                    {data.lowStock > 0 && (
                      <span className="text-yellow-600">
                        {data.lowStock} con stock bajo
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Productos con Stock Bajo</h3>
          <div className="space-y-2">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="p-2 bg-gray-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      Código: {product.code} | Categoría: {product.category}
                    </div>
                  </div>
                  <div className="flex items-center text-yellow-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {product.stock}/{product.minStock} unidades
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-center text-gray-500">No hay productos con stock bajo</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detalle del Inventario</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products
                .sort((a, b) => (a.stock <= a.minStock ? -1 : 1))
                .map((product) => (
                  <tr
                    key={product.id}
                    className={product.stock <= product.minStock ? 'bg-yellow-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      ${product.costPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      ${(product.costPrice * product.stock).toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};