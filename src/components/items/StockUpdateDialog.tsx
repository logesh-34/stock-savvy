import { useState, useEffect } from 'react';
import { InventoryItem } from '@/types/inventory';
import { useInventory } from '@/context/InventoryContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface StockUpdateDialogProps {
  item: InventoryItem | null;
  type: 'increase' | 'decrease';
  onClose: () => void;
}

export function StockUpdateDialog({ item, type, onClose }: StockUpdateDialogProps) {
  const { updateStock } = useInventory();
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (item) {
      setQuantity('1');
      setNote('');
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (type === 'decrease' && qty > item.quantity) {
      toast.error('Cannot decrease more than current stock');
      return;
    }

    updateStock(item.id, qty, type, note || undefined);
    toast.success(
      type === 'increase' 
        ? `Added ${qty} units to ${item.name}`
        : `Removed ${qty} units from ${item.name}`
    );
    onClose();
  };

  return (
    <Dialog open={!!item} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {type === 'increase' ? (
                <Plus className="h-5 w-5 text-success" />
              ) : (
                <Minus className="h-5 w-5 text-warning" />
              )}
              {type === 'increase' ? 'Add Stock' : 'Remove Stock'}
            </DialogTitle>
            <DialogDescription>
              {item?.name} - Current stock: {item?.quantity} units
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={type === 'decrease' ? item?.quantity : undefined}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Received from supplier, Sold to customer..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className={type === 'increase' ? 'bg-success hover:bg-success/90' : 'bg-warning hover:bg-warning/90'}
            >
              {type === 'increase' ? 'Add Stock' : 'Remove Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
