import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import Sparkline from '@/components/tenant/stats/Sparkline';
import { cn } from '@/lib/utils';
import {
  Users,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  LucideIcon,
} from 'lucide-react';

interface StatItem {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend?: { value: number; isPositive: boolean };
  sparklineData?: number[];
}

interface BatchAnimatedStatCardsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    totalStudents: number;
    capacityPercent: number;
    nearFull: number;
  };
  isMobile: boolean;
}

const AnimatedStatCard: React.FC<{ stat: StatItem; index: number }> = ({ stat, index }) => {
  const { count, ref } = useAnimatedCounter(stat.value, { delay: index * 100 });
  const Icon = stat.icon;

  return (
    <div ref={ref}>
      <Card className="overflow-hidden group hover:shadow-md transition-shadow">
        <CardContent className="p-4 relative">
          {stat.sparklineData && (
            <div className="absolute top-2 right-2 opacity-60">
              <Sparkline
                data={stat.sparklineData}
                width={60}
                height={20}
                color={stat.color}
                showArea
              />
            </div>
          )}
          <div className="flex items-start gap-3">
            <div className={cn('p-2 rounded-lg', stat.bgColor)}>
              <Icon className={cn('w-5 h-5', `text-[${stat.color}]`)} style={{ color: stat.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight">
                {count}{stat.suffix || ''}
              </p>
              <p className="text-xs text-muted-foreground">{stat.title}</p>
            </div>
          </div>
          {stat.trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-[11px] font-medium',
              stat.trend.isPositive ? 'text-emerald-500' : 'text-destructive'
            )}>
              {stat.trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {stat.trend.value}% from last month
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const MobileAnimatedStatCard: React.FC<{ stat: StatItem; index: number }> = ({ stat, index }) => {
  const { count, ref } = useAnimatedCounter(stat.value, { delay: index * 80 });
  const Icon = stat.icon;

  return (
    <div ref={ref}>
      <Card className="shrink-0 w-32 snap-start">
        <CardContent className="p-3 text-center relative overflow-hidden">
          {stat.sparklineData && (
            <div className="absolute bottom-0 left-0 right-0 opacity-30">
              <Sparkline
                data={stat.sparklineData}
                width={128}
                height={16}
                color={stat.color}
                showArea
              />
            </div>
          )}
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <Icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
            <p className="text-xl font-bold">{count}{stat.suffix || ''}</p>
          </div>
          <p className="text-[10px] text-muted-foreground">{stat.title}</p>
          {stat.trend && (
            <div className={cn(
              'flex items-center justify-center gap-0.5 mt-1 text-[9px] font-medium',
              stat.trend.isPositive ? 'text-emerald-500' : 'text-destructive'
            )}>
              {stat.trend.isPositive ? (
                <TrendingUp className="w-2.5 h-2.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5" />
              )}
              {stat.trend.value}%
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const BatchAnimatedStatCards: React.FC<BatchAnimatedStatCardsProps> = ({ stats, isMobile }) => {
  const statItems: StatItem[] = [
    {
      title: 'Total Batches',
      value: stats.total,
      icon: Users,
      color: 'hsl(var(--primary))',
      bgColor: 'bg-primary/10',
      trend: { value: 12, isPositive: true },
      sparklineData: [4, 5, 6, 5, 7, 8, stats.total],
    },
    {
      title: 'Active',
      value: stats.active,
      icon: GraduationCap,
      color: '#10b981',
      bgColor: 'bg-emerald-500/10',
      trend: { value: 5, isPositive: true },
      sparklineData: [3, 4, 4, 5, 5, 6, stats.active],
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: '#3b82f6',
      bgColor: 'bg-blue-500/10',
      trend: { value: 8, isPositive: true },
      sparklineData: [80, 95, 100, 110, 115, 120, stats.totalStudents],
    },
    {
      title: 'Capacity Used',
      value: stats.capacityPercent,
      suffix: '%',
      icon: BarChart3,
      color: '#f59e0b',
      bgColor: 'bg-amber-500/10',
      sparklineData: [55, 60, 65, 68, 70, 72, stats.capacityPercent],
    },
    {
      title: 'Near Full',
      value: stats.nearFull,
      icon: AlertTriangle,
      color: 'hsl(var(--destructive))',
      bgColor: 'bg-destructive/10',
      sparklineData: [1, 1, 2, 1, 2, 3, stats.nearFull],
    },
    {
      title: 'Inactive',
      value: stats.inactive,
      icon: Users,
      color: 'hsl(var(--muted-foreground))',
      bgColor: 'bg-muted',
    },
  ];

  if (isMobile) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {statItems.map((stat, i) => (
          <MobileAnimatedStatCard key={stat.title} stat={stat} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((stat, i) => (
        <AnimatedStatCard key={stat.title} stat={stat} index={i} />
      ))}
    </div>
  );
};

export default BatchAnimatedStatCards;
