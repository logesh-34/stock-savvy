import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'warning' | 'success';
}

export function StatsCard({ title, value, icon, trend, variant = 'default' }: StatsCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl p-6 shadow-card transition-all duration-300 hover:shadow-card-hover animate-fade-in",
      variant === 'default' && "bg-card gradient-card",
      variant === 'warning' && "bg-warning/5 border border-warning/20",
      variant === 'success' && "bg-success/5 border border-success/20"
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn(
            "text-3xl font-bold tracking-tight",
            variant === 'warning' && "text-warning",
            variant === 'success' && "text-success"
          )}>
            {value}
          </p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-success" : "text-destructive"
            )}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg",
          variant === 'default' && "bg-primary/10 text-primary",
          variant === 'warning' && "bg-warning/10 text-warning",
          variant === 'success' && "bg-success/10 text-success"
        )}>
          {icon}
        </div>
      </div>
      
      {/* Decorative element */}
      <div className={cn(
        "absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10",
        variant === 'default' && "bg-primary",
        variant === 'warning' && "bg-warning",
        variant === 'success' && "bg-success"
      )} />
    </div>
  );
}
