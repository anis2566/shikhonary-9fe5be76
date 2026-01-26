import React from 'react';
import { Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BulkActionsProps {
  selectedCount: number;
  onClear: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onClear,
  onDelete,
  onActivate,
  onDeactivate,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
      <span className="text-sm font-medium text-foreground">
        {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-1 ml-auto">
        {onActivate && (
          <Button variant="outline" size="sm" onClick={onActivate}>
            <ToggleRight className="h-4 w-4 mr-1" />
            Activate
          </Button>
        )}
        {onDeactivate && (
          <Button variant="outline" size="sm" onClick={onDeactivate}>
            <ToggleLeft className="h-4 w-4 mr-1" />
            Deactivate
          </Button>
        )}
        {onDelete && (
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClear}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;
