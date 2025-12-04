import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '@/context/InventoryContext';
import { InventoryItem } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';

interface ItemFormProps {
  item?: InventoryItem;
  mode: 'add' | 'edit';
}

const defaultCategories = ['Electronics', 'Furniture', 'Stationery', 'Tools', 'Food & Beverages', 'Clothing', 'Other'];

export function ItemForm({ item, mode }: ItemFormProps) {
  const navigate = useNavigate();
  const { addItem, updateItem, categories: existingCategories } = useInventory();
  
  const allCategories = [...new Set([...defaultCategories, ...existingCategories])];

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    minStock: '',
    purchasePrice: '',
    sellingPrice: '',
    supplier: '',
    customCategory: '',
  });

  const [useCustomCategory, setUseCustomCategory] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity.toString(),
        minStock: item.minStock.toString(),
        purchasePrice: item.purchasePrice.toString(),
        sellingPrice: item.sellingPrice.toString(),
        supplier: item.supplier || '',
        customCategory: '',
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const category = useCustomCategory ? formData.customCategory : formData.category;

    if (!formData.name.trim()) {
      toast.error('Item name is required');
      return;
    }
    if (!category.trim()) {
      toast.error('Category is required');
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      toast.error('Valid quantity is required');
      return;
    }
    if (!formData.minStock || parseInt(formData.minStock) < 0) {
      toast.error('Valid minimum stock level is required');
      return;
    }
    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) < 0) {
      toast.error('Valid purchase price is required');
      return;
    }
    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) < 0) {
      toast.error('Valid selling price is required');
      return;
    }

    const itemData = {
      name: formData.name.trim(),
      category: category.trim(),
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock),
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      supplier: formData.supplier.trim() || undefined,
    };

    if (mode === 'add') {
      addItem(itemData);
      toast.success('Item added successfully');
    } else if (item) {
      updateItem(item.id, itemData);
      toast.success('Item updated successfully');
    }

    navigate('/items');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card rounded-xl p-6 shadow-card space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Item Name */}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Wireless Mouse"
              className="text-lg"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            {useCustomCategory ? (
              <div className="flex gap-2">
                <Input
                  value={formData.customCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                  placeholder="Enter custom category"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUseCustomCategory(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setUseCustomCategory(true);
                  } else {
                    setFormData(prev => ({ ...prev, category: value }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                  <SelectItem value="custom">+ Add Custom Category</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Supplier */}
          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier (optional)</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
              placeholder="e.g., TechSupply Co."
            />
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Current Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              placeholder="0"
            />
          </div>

          {/* Minimum Stock */}
          <div className="space-y-2">
            <Label htmlFor="minStock">Minimum Stock Level *</Label>
            <Input
              id="minStock"
              type="number"
              min="0"
              value={formData.minStock}
              onChange={(e) => setFormData(prev => ({ ...prev, minStock: e.target.value }))}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">Alert when stock falls below this level</p>
          </div>

          {/* Purchase Price */}
          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Purchase Price ($) *</Label>
            <Input
              id="purchasePrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          {/* Selling Price */}
          <div className="space-y-2">
            <Label htmlFor="sellingPrice">Selling Price ($) *</Label>
            <Input
              id="sellingPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.sellingPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => navigate('/items')}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          {mode === 'add' ? 'Add Item' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
