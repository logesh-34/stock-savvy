import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InventoryItem, StockMovement } from '@/types/inventory';

interface InventoryContextType {
  items: InventoryItem[];
  movements: StockMovement[];
  categories: string[];
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  updateStock: (itemId: string, quantity: number, type: 'increase' | 'decrease', note?: string) => void;
  getLowStockItems: () => InventoryItem[];
  getItemById: (id: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const STORAGE_KEY = 'inventory_items';
const MOVEMENTS_KEY = 'stock_movements';

// Sample data for demo
const sampleItems: InventoryItem[] = [
  { id: '1', name: 'Wireless Mouse', category: 'Electronics', quantity: 45, minStock: 20, purchasePrice: 15, sellingPrice: 29.99, supplier: 'TechSupply Co.', createdAt: new Date('2024-01-15'), updatedAt: new Date('2024-01-15') },
  { id: '2', name: 'USB-C Cable', category: 'Electronics', quantity: 8, minStock: 25, purchasePrice: 5, sellingPrice: 12.99, supplier: 'CableMart', createdAt: new Date('2024-01-16'), updatedAt: new Date('2024-01-16') },
  { id: '3', name: 'Office Chair', category: 'Furniture', quantity: 12, minStock: 5, purchasePrice: 120, sellingPrice: 249.99, supplier: 'OfficePro', createdAt: new Date('2024-01-17'), updatedAt: new Date('2024-01-17') },
  { id: '4', name: 'Desk Lamp', category: 'Furniture', quantity: 3, minStock: 10, purchasePrice: 25, sellingPrice: 49.99, supplier: 'LightWorld', createdAt: new Date('2024-01-18'), updatedAt: new Date('2024-01-18') },
  { id: '5', name: 'Notebook A5', category: 'Stationery', quantity: 150, minStock: 50, purchasePrice: 2, sellingPrice: 5.99, supplier: 'PaperPlus', createdAt: new Date('2024-01-19'), updatedAt: new Date('2024-01-19') },
  { id: '6', name: 'Ballpoint Pen (Box)', category: 'Stationery', quantity: 5, minStock: 15, purchasePrice: 8, sellingPrice: 14.99, supplier: 'PaperPlus', createdAt: new Date('2024-01-20'), updatedAt: new Date('2024-01-20') },
  { id: '7', name: 'Printer Paper', category: 'Stationery', quantity: 200, minStock: 100, purchasePrice: 25, sellingPrice: 39.99, supplier: 'PaperPlus', createdAt: new Date('2024-01-21'), updatedAt: new Date('2024-01-21') },
  { id: '8', name: 'Monitor Stand', category: 'Electronics', quantity: 18, minStock: 8, purchasePrice: 35, sellingPrice: 69.99, supplier: 'TechSupply Co.', createdAt: new Date('2024-01-22'), updatedAt: new Date('2024-01-22') },
];

const sampleMovements: StockMovement[] = [
  { id: '1', itemId: '1', type: 'increase', quantity: 20, date: new Date('2024-01-20'), note: 'Restock from supplier' },
  { id: '2', itemId: '2', type: 'decrease', quantity: 15, date: new Date('2024-01-21'), note: 'Sold to customer' },
  { id: '3', itemId: '3', type: 'increase', quantity: 5, date: new Date('2024-01-22'), note: 'New shipment' },
  { id: '4', itemId: '5', type: 'decrease', quantity: 30, date: new Date('2024-01-23'), note: 'Bulk sale' },
  { id: '5', itemId: '4', type: 'decrease', quantity: 7, date: new Date('2024-01-24'), note: 'Retail sales' },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    const storedMovements = localStorage.getItem(MOVEMENTS_KEY);
    
    if (storedItems) {
      const parsed = JSON.parse(storedItems);
      setItems(parsed.map((item: InventoryItem) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })));
    } else {
      setItems(sampleItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleItems));
    }

    if (storedMovements) {
      const parsed = JSON.parse(storedMovements);
      setMovements(parsed.map((m: StockMovement) => ({
        ...m,
        date: new Date(m.date),
      })));
    } else {
      setMovements(sampleMovements);
      localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(sampleMovements));
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  useEffect(() => {
    if (movements.length > 0) {
      localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
    }
  }, [movements]);

  const categories = [...new Set(items.map(item => item.category))];

  const addItem = (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateStock = (itemId: string, quantity: number, type: 'increase' | 'decrease', note?: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const newQuantity = type === 'increase' 
      ? item.quantity + quantity 
      : Math.max(0, item.quantity - quantity);

    updateItem(itemId, { quantity: newQuantity });

    const movement: StockMovement = {
      id: crypto.randomUUID(),
      itemId,
      type,
      quantity,
      date: new Date(),
      note,
    };
    setMovements(prev => [...prev, movement]);
  };

  const getLowStockItems = () => {
    return items.filter(item => item.quantity <= item.minStock);
  };

  const getItemById = (id: string) => {
    return items.find(item => item.id === id);
  };

  return (
    <InventoryContext.Provider value={{
      items,
      movements,
      categories,
      addItem,
      updateItem,
      deleteItem,
      updateStock,
      getLowStockItems,
      getItemById,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
