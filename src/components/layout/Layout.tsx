import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useInventory } from '@/context/InventoryContext';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { getLowStockItems } = useInventory();
  const lowStockItems = getLowStockItems();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-0">
        {/* Low stock alert banner */}
        {lowStockItems.length > 0 && (
          <div className="bg-warning/10 border-b border-warning/20 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} running low on stock
                </span>
              </div>
              <Link 
                to="/low-stock" 
                className="text-sm font-medium text-warning hover:underline"
              >
                View all →
              </Link>
            </div>
          </div>
        )}
        
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
