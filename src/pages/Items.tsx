import { Layout } from '@/components/layout/Layout';
import { ItemsTable } from '@/components/items/ItemsTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Items = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Inventory Items</h1>
            <p className="text-muted-foreground">Manage your stock and track inventory levels.</p>
          </div>
          <Button asChild>
            <Link to="/add-item">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Item
            </Link>
          </Button>
        </div>

        {/* Table */}
        <ItemsTable />
      </div>
    </Layout>
  );
};

export default Items;
