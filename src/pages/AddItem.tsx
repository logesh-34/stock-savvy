import { Layout } from '@/components/layout/Layout';
import { ItemForm } from '@/components/items/ItemForm';

const AddItem = () => {
  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Add New Item</h1>
          <p className="text-muted-foreground">Add a new item to your inventory.</p>
        </div>

        {/* Form */}
        <ItemForm mode="add" />
      </div>
    </Layout>
  );
};

export default AddItem;
