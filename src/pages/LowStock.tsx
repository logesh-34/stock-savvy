import { Layout } from '@/components/layout/Layout';
import { useInventory } from '@/context/InventoryContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertTriangle, Plus, Package, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { StockUpdateDialog } from '@/components/items/StockUpdateDialog';
import { InventoryItem } from '@/types/inventory';

const LowStock = () => {
  const { getLowStockItems } = useInventory();
  const lowStockItems = getLowStockItems();
  const [stockUpdateItem, setStockUpdateItem] = useState<InventoryItem | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Low Stock Alerts</h1>
              <p className="text-muted-foreground">Items that need to be restocked.</p>
            </div>
          </div>
        </div>

        {lowStockItems.length === 0 ? (
          <div className="bg-card rounded-xl p-12 shadow-card text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-success/10">
                <CheckCircle2 className="h-12 w-12 text-success" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">All Stock Levels OK</h2>
                <p className="text-muted-foreground max-w-md">
                  Great news! All your items are above their minimum stock levels. 
                  Keep monitoring to maintain healthy inventory levels.
                </p>
              </div>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/items">
                  <Package className="h-4 w-4 mr-2" />
                  View All Items
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Alert Summary */}
            <div className="bg-warning/5 border border-warning/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <p className="text-sm">
                  <span className="font-semibold">{lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''}</span> below minimum stock level. 
                  Consider restocking soon to avoid stockouts.
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold">Item</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold text-right">Current Stock</TableHead>
                      <TableHead className="font-semibold text-right">Minimum</TableHead>
                      <TableHead className="font-semibold text-right">Shortage</TableHead>
                      <TableHead className="font-semibold text-right">Restock Cost</TableHead>
                      <TableHead className="font-semibold text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems.map((item) => {
                      const shortage = item.minStock - item.quantity;
                      const restockCost = shortage * item.purchasePrice;
                      
                      return (
                        <TableRow key={item.id} className="low-stock-row">
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
                            <span className="font-semibold text-destructive">{item.quantity}</span>
                          </TableCell>
                          <TableCell className="text-right">{item.minStock}</TableCell>
                          <TableCell className="text-right">
                            <span className="font-semibold text-destructive">-{shortage}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium">{formatCurrency(restockCost)}</span>
                            <p className="text-xs text-muted-foreground">to reach min</p>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              className="bg-success hover:bg-success/90"
                              onClick={() => setStockUpdateItem(item)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Restock
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Total Restock Cost */}
            <div className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Estimated Restock Cost</p>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrency(
                      lowStockItems.reduce((total, item) => {
                        const shortage = Math.max(0, item.minStock - item.quantity);
                        return total + (shortage * item.purchasePrice);
                      }, 0)
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">To bring all items to minimum levels</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Stock Update Dialog */}
      <StockUpdateDialog
        item={stockUpdateItem}
        type="increase"
        onClose={() => setStockUpdateItem(null)}
      />
    </Layout>
  );
};

export default LowStock;
