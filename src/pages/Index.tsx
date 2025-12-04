import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { StockChart } from '@/components/dashboard/StockChart';
import { useInventory } from '@/context/InventoryContext';
import { calculateTotalStockValue, calculatePotentialRevenue } from '@/lib/reports';
import { Package, Layers, AlertTriangle, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Index = () => {
  const { items, categories, getLowStockItems, movements } = useInventory();
  const lowStockItems = getLowStockItems();
  const totalValue = calculateTotalStockValue(items);
  const potentialRevenue = calculatePotentialRevenue(items);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  // Recent movements
  const recentMovements = movements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your inventory at a glance.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Items"
            value={items.length}
            icon={<Package className="h-6 w-6" />}
          />
          <StatsCard
            title="Categories"
            value={categories.length}
            icon={<Layers className="h-6 w-6" />}
          />
          <StatsCard
            title="Low Stock Items"
            value={lowStockItems.length}
            icon={<AlertTriangle className="h-6 w-6" />}
            variant={lowStockItems.length > 0 ? 'warning' : 'default'}
          />
          <StatsCard
            title="Total Stock Value"
            value={formatCurrency(totalValue)}
            icon={<DollarSign className="h-6 w-6" />}
            variant="success"
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StockChart />
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl p-6 shadow-card animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {recentMovements.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
              ) : (
                recentMovements.map(movement => {
                  const item = items.find(i => i.id === movement.itemId);
                  return (
                    <div key={movement.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className={cn(
                        "p-1.5 rounded-full mt-0.5",
                        movement.type === 'increase' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      )}>
                        {movement.type === 'increase' ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingUp className="h-3 w-3 rotate-180" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item?.name || 'Unknown Item'}</p>
                        <p className="text-xs text-muted-foreground">
                          {movement.type === 'increase' ? '+' : '-'}{movement.quantity} units
                        </p>
                        {movement.note && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">{movement.note}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(movement.date).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Revenue</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(potentialRevenue)}</p>
                <p className="text-xs text-muted-foreground mt-1">If all items sold at selling price</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10 text-accent">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>

          <Link to="/low-stock" className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Items Need Attention</p>
                <p className="text-2xl font-bold text-foreground mt-1">{lowStockItems.length} items</p>
                <p className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors">
                  Click to view low stock items →
                </p>
              </div>
              <div className={cn(
                "p-3 rounded-lg",
                lowStockItems.length > 0 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
              )}>
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
