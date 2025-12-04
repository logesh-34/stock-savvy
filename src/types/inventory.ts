export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'increase' | 'decrease';
  quantity: number;
  date: Date;
  note?: string;
}

export type SortField = 'name' | 'quantity' | 'purchasePrice' | 'sellingPrice' | 'category';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  search: string;
  category: string;
  sortField: SortField;
  sortDirection: SortDirection;
}
