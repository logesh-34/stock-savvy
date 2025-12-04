import { useInventory } from '@/context/InventoryContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function StockChart() {
  const { items } = useInventory();

  const data = items.slice(0, 8).map(item => ({
    name: item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name,
    quantity: item.quantity,
    minStock: item.minStock,
    isLow: item.quantity <= item.minStock,
  }));

  return (
    <div className="bg-card rounded-xl p-6 shadow-card animate-slide-up">
      <h3 className="text-lg font-semibold mb-6">Stock Levels Overview</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)',
              }}
              labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
              formatter={(value: number, name: string) => [
                value,
                name === 'quantity' ? 'Current Stock' : 'Minimum Stock'
              ]}
            />
            <Bar dataKey="quantity" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isLow ? 'hsl(var(--destructive))' : 'hsl(var(--accent))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-muted-foreground">Normal Stock</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Low Stock</span>
        </div>
      </div>
    </div>
  );
}
