import React from 'react';
import { X, Trash2, Download, Mail, Tag, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive';
  onClick: (selectedIds: string[]) => void;
}

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onClearSelection: () => void;
  onSelectAll: () => void;
  actions: BulkAction[];
  className?: string;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  totalCount,
  onClearSelection,
  onSelectAll,
  actions,
  className,
}) => {
  if (selectedCount === 0) return null;

  const primaryActions = actions.slice(0, 3);
  const moreActions = actions.slice(3);
  const allSelected = selectedCount === totalCount;

  return (
    <div
      className={cn(
        "fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-40",
        "bg-card border shadow-lg rounded-full px-4 py-2",
        "flex items-center gap-2 animate-fade-in",
        className
      )}
    >
      {/* Selection info */}
      <div className="flex items-center gap-2 pr-2 border-r border-border">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium whitespace-nowrap">
          {selectedCount} selected
        </span>
        {!allSelected && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-primary"
            onClick={onSelectAll}
          >
            Select all {totalCount}
          </Button>
        )}
      </div>

      {/* Primary actions */}
      <div className="flex items-center gap-1">
        {primaryActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant={action.variant === 'destructive' ? 'destructive' : 'ghost'}
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => action.onClick([])}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{action.label}</span>
            </Button>
          );
        })}

        {/* More actions dropdown */}
        {moreActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {moreActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <React.Fragment key={action.id}>
                    <DropdownMenuItem
                      onClick={() => action.onClick([])}
                      className={cn(
                        action.variant === 'destructive' && 'text-destructive focus:text-destructive'
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </DropdownMenuItem>
                    {index < moreActions.length - 1 && action.variant === 'destructive' && (
                      <DropdownMenuSeparator />
                    )}
                  </React.Fragment>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

// Pre-defined common actions
export const commonBulkActions = {
  delete: (onDelete: (ids: string[]) => void): BulkAction => ({
    id: 'delete',
    label: 'Delete',
    icon: Trash2,
    variant: 'destructive',
    onClick: onDelete,
  }),
  export: (onExport: (ids: string[]) => void): BulkAction => ({
    id: 'export',
    label: 'Export',
    icon: Download,
    onClick: onExport,
  }),
  email: (onEmail: (ids: string[]) => void): BulkAction => ({
    id: 'email',
    label: 'Send Email',
    icon: Mail,
    onClick: onEmail,
  }),
  tag: (onTag: (ids: string[]) => void): BulkAction => ({
    id: 'tag',
    label: 'Add Tag',
    icon: Tag,
    onClick: onTag,
  }),
};

export default BulkActionsBar;
