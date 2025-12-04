import { InventoryItem } from '@/types/inventory';

export function generateCSV(items: InventoryItem[]): string {
  const headers = [
    'Item Name',
    'Category',
    'Quantity',
    'Min Stock',
    'Purchase Price',
    'Selling Price',
    'Stock Value',
    'Supplier',
    'Created Date',
    'Last Updated'
  ];

  const rows = items.map(item => [
    item.name,
    item.category,
    item.quantity.toString(),
    item.minStock.toString(),
    item.purchasePrice.toFixed(2),
    item.sellingPrice.toFixed(2),
    (item.quantity * item.purchasePrice).toFixed(2),
    item.supplier || '',
    new Date(item.createdAt).toLocaleDateString(),
    new Date(item.updatedAt).toLocaleDateString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function calculateTotalStockValue(items: InventoryItem[]): number {
  return items.reduce((total, item) => total + (item.quantity * item.purchasePrice), 0);
}

export function calculatePotentialRevenue(items: InventoryItem[]): number {
  return items.reduce((total, item) => total + (item.quantity * item.sellingPrice), 0);
}
