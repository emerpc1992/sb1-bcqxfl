import * as XLSX from 'xlsx';
import type { Product } from '../types/inventory';

export const exportToExcel = (products: Product[]) => {
  // Prepare data for export
  const exportData = products.map(product => ({
    'Código': product.code,
    'Nombre': product.name,
    'Categoría': product.category,
    'Stock': product.stock,
    'Stock Mínimo': product.minStock,
    'Precio de Costo': product.costPrice,
    'Precio de Venta': product.salePrice,
    'URL de Imagen': product.imageUrl || ''
  }));

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Inventario");

  // Generate Excel file
  XLSX.writeFile(wb, `inventario-${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const importFromExcel = (file: File): Promise<Partial<Product>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        const products = jsonData.map(row => ({
          code: row['Código']?.toString() || '',
          name: row['Nombre']?.toString() || '',
          category: row['Categoría']?.toString() || '',
          stock: Number(row['Stock']) || 0,
          minStock: Number(row['Stock Mínimo']) || 0,
          costPrice: Number(row['Precio de Costo']) || 0,
          salePrice: Number(row['Precio de Venta']) || 0,
          imageUrl: row['URL de Imagen']?.toString() || ''
        }));

        resolve(products);
      } catch (error) {
        reject(new Error('Error al procesar el archivo Excel'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsArrayBuffer(file);
  });
};