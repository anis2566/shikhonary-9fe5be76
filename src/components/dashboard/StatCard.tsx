import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'bg-primary/10 text-primary',
}) => {
  return (
    <div className="bg-card rounded-xl p-4 sm:p-5 border border-border shadow-soft">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground font-medium truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{value}</p>
          {change && (
            <p
              className={cn(
                'text-xs font-medium mt-2',
                changeType === 'positive' && 'text-green-600',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-lg flex-shrink-0', iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
