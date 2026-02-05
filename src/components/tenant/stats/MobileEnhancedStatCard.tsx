import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import Sparkline from './Sparkline';

export interface MobileEnhancedStatCardProps {
  title: string;
  value: number;
  suffix?: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
  color: 'primary' | 'secondary' | 'accent' | 'success';
  sparklineData?: number[];
  href?: string;
}

const MobileEnhancedStatCard: React.FC<MobileEnhancedStatCardProps> = ({
  title,
  value,
  suffix = '',
  subtitle,
  icon: Icon,
  trend,
  color,
  sparklineData,
  href,
}) => {
  const { count, ref } = useAnimatedCounter(value, { duration: 1200 });

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
    <CardContent className="p-3" ref={ref}>
      <div className="flex items-center gap-2 mb-2">
        <div className={cn('p-1.5 rounded-lg', colorClasses[color])}>
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold tabular-nums">
            {count}
            {suffix}
          </p>
          <p className="text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
        
        {sparklineData && sparklineData.length > 1 && (
          <Sparkline
            data={sparklineData}
            color={sparklineColors[color]}
            width={50}
            height={18}
          />
        )}
      </div>
      
      {trend && (
        <div className="flex items-center gap-0.5 mt-2">
          {trend.isPositive ? (
            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
          ) : (
            <ArrowDownRight className="w-3 h-3 text-destructive" />
          )}
          <span
            className={cn(
              'text-[10px] font-medium',
              trend.isPositive ? 'text-emerald-600' : 'text-destructive'
            )}
          >
            {trend.value}%
          </span>
        </div>
      )}
    </CardContent>
  );

  if (href) {
    return (
      <Card className="min-w-[140px] snap-start shrink-0 transition-all hover:shadow-md">
        <Link to={href} className="block">
          {content}
        </Link>
      </Card>
    );
  }

  return (
    <Card className="min-w-[140px] snap-start shrink-0">
      {content}
    </Card>
  );
};

export default MobileEnhancedStatCard;
