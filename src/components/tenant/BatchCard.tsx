import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import SwipeableCard from '@/components/ui/swipeable-card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BatchCardProps {
  batch: {
    id: string;
    name: string;
    className: string;
    academicYear: string;
    currentSize: number;
    capacity?: number;
    isActive: boolean;
  };
  enableSwipe?: boolean;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch, enableSwipe = true }) => {
  const navigate = useNavigate();
  const capacityPercent = batch.capacity
    ? Math.round((batch.currentSize / batch.capacity) * 100)
    : 0;

  const getCapacityColor = () => {
    if (capacityPercent >= 90) return 'text-destructive';
    if (capacityPercent >= 70) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const handleEdit = () => {
    navigate(`/tenant/batches/${batch.id}/edit`);
  };

  const handleDelete = () => {
    toast.error(`Delete "${batch.name}"?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: () => toast.success('Batch deleted'),
      },
    });
  };

  const cardContent = (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground truncate">
                {batch.name}
              </h3>
              <p className="text-sm text-muted-foreground">{batch.className}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant={batch.isActive ? 'default' : 'secondary'}
                className="text-[10px] px-1.5"
              >
                {batch.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/tenant/batches/${batch.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/tenant/batches/${batch.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 px-4 pb-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">{batch.academicYear}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className={cn('font-medium', getCapacityColor())}>
              {batch.currentSize}/{batch.capacity || '∞'}
            </span>
          </div>
        </div>

        {/* Capacity Progress */}
        {batch.capacity && (
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Capacity</span>
              <span className={cn('font-medium', getCapacityColor())}>
                {capacityPercent}%
              </span>
            </div>
            <Progress
              value={capacityPercent}
              className={cn(
                'h-2',
                capacityPercent >= 90 && '[&>div]:bg-destructive',
                capacityPercent >= 70 &&
                  capacityPercent < 90 &&
                  '[&>div]:bg-amber-500'
              )}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 p-3 border-t">
          <Button variant="outline" size="sm" className="flex-1 h-8" asChild>
            <Link to={`/tenant/batches/${batch.id}`}>
              <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
              View Students
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-8" asChild>
            <Link to={`/tenant/batches/${batch.id}/edit`}>
              <Edit className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (enableSwipe) {
    return (
      <SwipeableCard onEdit={handleEdit} onDelete={handleDelete}>
        {cardContent}
      </SwipeableCard>
    );
  }

  return cardContent;
};

export default BatchCard;
