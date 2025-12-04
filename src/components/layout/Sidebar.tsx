import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  AlertTriangle, 
  FileText,
  Box,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInventory } from '@/context/InventoryContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/items', icon: Package, label: 'Items' },
  { to: '/add-item', icon: PlusCircle, label: 'Add Item' },
  { to: '/low-stock', icon: AlertTriangle, label: 'Low Stock' },
  { to: '/reports', icon: FileText, label: 'Reports' },
];

export function Sidebar() {
  const location = useLocation();
  const { getLowStockItems } = useInventory();
  const lowStockCount = getLowStockItems().length;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sidebar-primary/10">
                <Box className="h-6 w-6 text-sidebar-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Inventix</h1>
                <p className="text-xs text-sidebar-muted">Inventory Manager</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              const isLowStock = item.to === '/low-stock';
              
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-sidebar-primary" : "group-hover:text-sidebar-primary"
                  )} />
                  <span className="font-medium">{item.label}</span>
                  
                  {/* Low stock badge */}
                  {isLowStock && lowStockCount > 0 && (
                    <span className="absolute right-3 px-2 py-0.5 text-xs font-semibold rounded-full bg-destructive text-destructive-foreground animate-pulse-slow">
                      {lowStockCount}
                    </span>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sidebar-primary rounded-r-full" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="p-4 rounded-lg bg-sidebar-accent/50">
              <p className="text-xs text-sidebar-muted mb-1">Need help?</p>
              <p className="text-sm font-medium">View Documentation</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
