import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

interface BatchCapacity {
  id: string;
  name: string;
  className: string;
  currentSize: number;
  capacity?: number;
  isActive: boolean;
}

interface CapacityHeatmapProps {
  batches: BatchCapacity[];
  className?: string;
}

const CapacityHeatmap: React.FC<CapacityHeatmapProps> = ({ batches, className }) => {
  const getCapacityColor = (percent: number) => {
    if (percent >= 95) return 'bg-destructive';
    if (percent >= 80) return 'bg-amber-500';
    if (percent >= 50) return 'bg-primary';
    if (percent >= 20) return 'bg-emerald-500';
    return 'bg-muted-foreground/30';
  };

  const getCapacityLabel = (percent: number) => {
    if (percent >= 95) return 'Critical';
    if (percent >= 80) return 'Near Full';
    if (percent >= 50) return 'Moderate';
    if (percent >= 20) return 'Low';
    return 'Empty';
  };

  const sortedBatches = [...batches]
    .filter((b) => b.isActive && b.capacity)
    .sort((a, b) => {
      const pA = a.capacity ? (a.currentSize / a.capacity) * 100 : 0;
      const pB = b.capacity ? (b.currentSize / b.capacity) * 100 : 0;
      return pB - pA;
    });

  if (sortedBatches.length === 0) return null;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Capacity Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <TooltipProvider>
          <div className="space-y-2">
            {/* Legend */}
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
              {[
                { label: 'Empty', cls: 'bg-muted-foreground/30' },
                { label: 'Low', cls: 'bg-emerald-500' },
                { label: 'Moderate', cls: 'bg-primary' },
                { label: 'Near Full', cls: 'bg-amber-500' },
                { label: 'Critical', cls: 'bg-destructive' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1">
                  <div className={cn('w-2.5 h-2.5 rounded-sm', item.cls)} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Heatmap bars */}
            <div className="space-y-1.5">
              {sortedBatches.map((batch) => {
                const percent = batch.capacity
                  ? Math.round((batch.currentSize / batch.capacity) * 100)
                  : 0;

                return (
                  <Tooltip key={batch.id}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 group cursor-default">
                        <span className="text-[11px] text-muted-foreground w-24 truncate shrink-0 group-hover:text-foreground transition-colors">
                          {batch.name}
                        </span>
                        <div className="flex-1 h-5 bg-muted rounded-sm overflow-hidden relative">
                          <div
                            className={cn(
                              'h-full rounded-sm transition-all duration-500',
                              getCapacityColor(percent)
                            )}
                            style={{ width: `${Math.max(percent, 2)}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-foreground mix-blend-difference">
                            {batch.currentSize}/{batch.capacity}
                          </span>
                        </div>
                        <span className={cn(
                          'text-[11px] font-medium w-10 text-right shrink-0',
                          percent >= 95 ? 'text-destructive' :
                          percent >= 80 ? 'text-amber-500' :
                          'text-muted-foreground'
                        )}>
                          {percent}%
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p className="font-medium">{batch.name} — {batch.className}</p>
                      <p>{batch.currentSize} of {batch.capacity} students ({getCapacityLabel(percent)})</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default CapacityHeatmap;
