import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import Sparkline from './Sparkline';

export interface EnhancedStatCardProps {
  title: string;
  value: number;
  suffix?: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
  color: 'primary' | 'secondary' | 'accent' | 'success';
  sparklineData?: number[];
  href?: string;
  className?: string;
}

const EnhancedStatCard: React.FC<EnhancedStatCardProps> = ({
  title,
  value,
  suffix = '',
  subtitle,
  icon: Icon,
  trend,
  color,
  sparklineData,
  href,
  className,
}) => {
  const { count, ref } = useAnimatedCounter(value);

  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-emerald-500/10 text-emerald-600',
  };

  const sparklineColors = {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary-foreground))',
    accent: 'hsl(var(--accent))',
    success: 'rgb(16, 185, 129)',
  };

  const content = (
    <CardContent className="p-4" ref={ref}>
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold tabular-nums">
              {count}
              {suffix}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={cn('p-2.5 rounded-lg', colorClasses[color])}>
            <Icon className="w-5 h-5" />
          </div>
          {sparklineData && sparklineData.length > 1 && (
            <Sparkline
              data={sparklineData}
              color={sparklineColors[color]}
              width={60}
              height={20}
            />
          )}
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1">
            {trend.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
            )}
            <span
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-emerald-600' : 'text-destructive'
              )}
            >
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
          {href && (
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </div>
      )}
    </CardContent>
  );

  if (href) {
    return (
      <Card 
        className={cn(
          'transition-all hover:shadow-md hover:border-primary/20 cursor-pointer group',
          className
        )}
      >
        <Link to={href} className="block">
          {content}
        </Link>
      </Card>
    );
  }

  return <Card className={className}>{content}</Card>;
};

export default EnhancedStatCard;
