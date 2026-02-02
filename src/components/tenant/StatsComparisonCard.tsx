import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ComparisonData {
  current: number;
  previous: number;
  label: string;
}

interface StatsComparisonCardProps {
  title: string;
  icon: React.ElementType;
  data: ComparisonData;
  format?: 'number' | 'percentage' | 'currency';
  periodLabel?: string;
  className?: string;
}

const StatsComparisonCard: React.FC<StatsComparisonCardProps> = ({
  title,
  icon: Icon,
  data,
  format = 'number',
  periodLabel = 'vs last month',
  className,
}) => {
  const change = data.current - data.previous;
  const percentChange = data.previous !== 0 
    ? ((change / data.previous) * 100).toFixed(1)
    : '0';
  
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const formatValue = (value: number) => {
    switch (format) {
      case 'percentage':
        return `${value}%`;
      case 'currency':
        return `৳${value.toLocaleString()}`;
      default:
        return value.toLocaleString();
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
          </div>
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs font-medium",
              isPositive && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
              !isPositive && !isNeutral && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {isNeutral ? (
              <Minus className="w-3 h-3 mr-1" />
            ) : isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-1" />
            )}
            {isNeutral ? '0%' : `${isPositive ? '+' : ''}${percentChange}%`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current value */}
        <div>
          <p className="text-3xl font-bold">{formatValue(data.current)}</p>
          <p className="text-xs text-muted-foreground">{data.label}</p>
        </div>

        {/* Comparison bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{periodLabel}</span>
            <span className="font-medium">{formatValue(data.previous)}</span>
          </div>
          
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-muted-foreground/30 rounded-full"
              style={{ width: `${Math.min((data.previous / Math.max(data.current, data.previous)) * 100, 100)}%` }}
            />
            <div 
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                isPositive ? "bg-primary" : isNeutral ? "bg-muted-foreground" : "bg-destructive"
              )}
              style={{ width: `${Math.min((data.current / Math.max(data.current, data.previous)) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Change indicator */}
        <div className={cn(
          "flex items-center gap-1.5 text-xs",
          isPositive ? "text-emerald-600" : isNeutral ? "text-muted-foreground" : "text-red-600"
        )}>
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : isNeutral ? (
            <Minus className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>
            {isNeutral ? 'No change' : `${isPositive ? '+' : ''}${formatValue(Math.abs(change))} from last period`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsComparisonCard;
