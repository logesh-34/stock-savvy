import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useInventory } from '@/context/InventoryContext';
import { generateCSV, downloadCSV, calculateTotalStockValue, calculatePotentialRevenue } from '@/lib/reports';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, Download, Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const Reports = () => {
  const { items, categories, getLowStockItems } = useInventory();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [reportType, setReportType] = useState<'all' | 'low-stock'>('all');

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = reportType === 'all' || (reportType === 'low-stock' && item.quantity <= item.minStock);
    return matchesCategory && matchesType;
  });

  const totalValue = calculateTotalStockValue(filteredItems);
  const potentialRevenue = calculatePotentialRevenue(filteredItems);
  const lowStockCount = getLowStockItems().filter(
    item => selectedCategory === 'all' || item.category === selectedCategory
  ).length;

  const handleDownload = () => {
    if (filteredItems.length === 0) {
      toast.error('No items to export');
      return;
    }

    const csv = generateCSV(filteredItems);
    const filename = `inventory-report-${reportType}-${selectedCategory}-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
    toast.success('Report downloaded successfully');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Inventory Reports</h1>
          <p className="text-muted-foreground">Generate and download inventory reports.</p>
        </div>

        {/* Report Options */}
        <div className="bg-card rounded-xl p-6 shadow-card space-y-6">
          <h2 className="text-lg font-semibold">Report Options</h2>
          
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={(v) => setReportType(v as 'all' | 'low-stock')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="low-stock">Low Stock Items Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category Filter</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Report Preview Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card rounded-xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Items in Report</p>
                <p className="text-2xl font-bold">{filteredItems.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10 text-success">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Stock Value</p>
                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potential Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(potentialRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10 text-warning">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold">{lowStockCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Table */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Report Preview</h2>
            <span className="text-sm text-muted-foreground">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No items match the selected filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium py-3 px-2">Item Name</th>
                    <th className="text-left font-medium py-3 px-2">Category</th>
                    <th className="text-right font-medium py-3 px-2">Qty</th>
                    <th className="text-right font-medium py-3 px-2">Purchase</th>
                    <th className="text-right font-medium py-3 px-2">Selling</th>
                    <th className="text-right font-medium py-3 px-2">Stock Value</th>
                    <th className="text-left font-medium py-3 px-2">Supplier</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.slice(0, 10).map(item => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-3 px-2 font-medium">{item.name}</td>
                      <td className="py-3 px-2">{item.category}</td>
                      <td className="py-3 px-2 text-right">{item.quantity}</td>
                      <td className="py-3 px-2 text-right">{formatCurrency(item.purchasePrice)}</td>
                      <td className="py-3 px-2 text-right">{formatCurrency(item.sellingPrice)}</td>
                      <td className="py-3 px-2 text-right">{formatCurrency(item.quantity * item.purchasePrice)}</td>
                      <td className="py-3 px-2 text-muted-foreground">{item.supplier || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredItems.length > 10 && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Showing 10 of {filteredItems.length} items. Download the full report to see all items.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
