import React, { useRef } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import { exportToExcel, importFromExcel } from '../../utils/excelUtils';

export const ExcelActions: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const products = useInventoryStore((state) => state.products);
  const addProduct = useInventoryStore((state) => state.addProduct);
  const [error, setError] = React.useState<string>('');
  const [success, setSuccess] = React.useState<string>('');

  const handleExport = () => {
    try {
      exportToExcel(products);
      setSuccess('Inventario exportado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al exportar el inventario');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedProducts = await importFromExcel(file);
      
      // Validate and add each product
      importedProducts.forEach(product => {
        if (product.code && product.name && product.category) {
          addProduct(product as any);
        }
      });

      setSuccess('Inventario importado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al importar el inventario');
      setTimeout(() => setError(''), 3000);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg">
          {success}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          <Download className="h-5 w-5" />
          Exportar Excel
        </button>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Upload className="h-5 w-5" />
            Importar Excel
          </button>
        </div>
      </div>
    </div>
  );
};