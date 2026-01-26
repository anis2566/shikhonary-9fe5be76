import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, className }) => {
  return (
    <div className={cn('bg-card rounded-xl border border-border p-4 lg:p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p
              className={cn(
                'text-xs mt-2',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.isPositive ? '+' : '-'}
              {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className="p-2 lg:p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;
