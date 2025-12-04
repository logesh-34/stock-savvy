import { useParams, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ItemForm } from '@/components/items/ItemForm';
import { useInventory } from '@/context/InventoryContext';

const EditItem = () => {
  const { id } = useParams<{ id: string }>();
  const { getItemById } = useInventory();
  
  const item = id ? getItemById(id) : undefined;

  if (!item) {
    return <Navigate to="/items" replace />;
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Edit Item</h1>
          <p className="text-muted-foreground">Update details for {item.name}.</p>
        </div>

        {/* Form */}
        <ItemForm item={item} mode="edit" />
      </div>
    </Layout>
  );
};

export default EditItem;
