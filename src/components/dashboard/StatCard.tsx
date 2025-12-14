import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'mint' | 'yellow' | 'sky' | 'default';
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: StatCardProps) {
  const variants = {
    mint: 'zoo-card-mint',
    yellow: 'zoo-card-yellow',
    sky: 'zoo-card-sky',
    default: 'zoo-card',
  };

  const iconColors = {
    mint: 'bg-primary/20 text-primary',
    yellow: 'bg-zoo-yellow-dark/20 text-zoo-yellow-dark',
    sky: 'bg-zoo-sky-dark/20 text-zoo-sky-dark',
    default: 'bg-muted text-muted-foreground',
  };

  return (
    <div className={cn(variants[variant], 'animate-fade-in')}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold font-display text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                'mt-2 inline-flex items-center gap-1 text-sm font-medium',
                trend.isPositive ? 'text-primary' : 'text-destructive'
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', iconColors[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
