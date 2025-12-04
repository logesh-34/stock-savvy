import { useState } from 'react';
import { useInventory } from '@/context/InventoryContext';
import { InventoryItem, FilterOptions, SortField, SortDirection } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  ArrowUpDown, 
  Edit2, 
  Trash2, 
  Plus, 
  Minus,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { StockUpdateDialog } from './StockUpdateDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

export function ItemsTable() {
  const { items, categories, deleteItem } = useInventory();
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'all',
    sortField: 'name',
    sortDirection: 'asc',
  });
  const [stockUpdateItem, setStockUpdateItem] = useState<InventoryItem | null>(null);
  const [stockUpdateType, setStockUpdateType] = useState<'increase' | 'decrease'>('increase');
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const field = filters.sortField;
      const direction = filters.sortDirection === 'asc' ? 1 : -1;
      
      if (field === 'name' || field === 'category') {
        return a[field].localeCompare(b[field]) * direction;
      }
      return (a[field] - b[field]) * direction;
    });

  const toggleSort = (field: SortField) => {
    setFilters(prev => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleStockUpdate = (item: InventoryItem, type: 'increase' | 'decrease') => {
    setStockUpdateItem(item);
    setStockUpdateType(type);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items or suppliers..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">
                  <button 
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Item <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="font-semibold">
                  <button 
                    onClick={() => toggleSort('category')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Category <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="font-semibold text-right">
                  <button 
                    onClick={() => toggleSort('quantity')}
                    className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                  >
                    Stock <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="font-semibold text-right">
                  <button 
                    onClick={() => toggleSort('purchasePrice')}
                    className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                  >
                    Purchase <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="font-semibold text-right">
                  <button 
                    onClick={() => toggleSort('sellingPrice')}
                    className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                  >
                    Selling <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="font-semibold text-right">Stock Value</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Package className="h-8 w-8" />
                      <p>No items found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => {
                  const isLowStock = item.quantity <= item.minStock;
                  const stockValue = item.quantity * item.purchasePrice;
                  
                  return (
                    <TableRow 
                      key={item.id}
                      className={cn(
                        "transition-colors",
                        isLowStock && "low-stock-row"
                      )}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.supplier && (
                            <p className="text-xs text-muted-foreground">{item.supplier}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                          {item.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={cn(
                            "font-semibold",
                            isLowStock && "text-destructive"
                          )}>
                            {item.quantity}
                          </span>
                          {isLowStock && (
                            <span className="text-xs text-destructive">(Min: {item.minStock})</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.purchasePrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.sellingPrice)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(stockValue)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                            onClick={() => handleStockUpdate(item, 'increase')}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-warning hover:text-warning hover:bg-warning/10"
                            onClick={() => handleStockUpdate(item, 'decrease')}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <Link to={`/edit-item/${item.id}`}>
                              <Edit2 className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteItemId(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredItems.length} of {items.length} items
      </p>

      {/* Stock Update Dialog */}
      <StockUpdateDialog
        item={stockUpdateItem}
        type={stockUpdateType}
        onClose={() => setStockUpdateItem(null)}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        itemId={deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={() => {
          if (deleteItemId) {
            deleteItem(deleteItemId);
            setDeleteItemId(null);
          }
        }}
      />
    </div>
  );
}
