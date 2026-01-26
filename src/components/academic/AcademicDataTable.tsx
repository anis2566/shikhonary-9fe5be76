import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import ActionDropdown from './ActionDropdown';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  hideOnMobile?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface AcademicDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onDuplicate?: (item: T) => void;
  onToggleStatus?: (item: T) => void;
  onMoveUp?: (item: T, index: number) => void;
  onMoveDown?: (item: T, index: number) => void;
  emptyMessage?: string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  getItemStatus?: (item: T) => boolean;
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      variant={active ? 'default' : 'secondary'}
      className={cn(
        'text-xs',
        active ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-muted text-muted-foreground'
      )}
    >
      {active ? 'Active' : 'Inactive'}
    </Badge>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    EASY: 'bg-green-100 text-green-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HARD: 'bg-red-100 text-red-700',
  };
  return (
    <Badge className={cn('text-xs', colors[difficulty as keyof typeof colors] || 'bg-muted text-muted-foreground')}>
      {difficulty}
    </Badge>
  );
}

function AcademicDataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onToggleStatus,
  onMoveUp,
  onMoveDown,
  emptyMessage = 'No data found',
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  getItemStatus,
}: AcademicDataTableProps<T>) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(data.map((item) => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const hasActions = onEdit || onDelete || onView || onDuplicate || onToggleStatus || onMoveUp || onMoveDown;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={cn(someSelected && 'data-[state=checked]:bg-primary/50')}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3',
                    column.hideOnMobile && 'hidden md:table-cell'
                  )}
                >
                  {column.header}
                </th>
              ))}
              {hasActions && (
                <th className="w-12 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item, index) => (
              <tr
                key={item.id}
                className={cn(
                  'hover:bg-muted/30 transition-colors',
                  selectedIds.includes(item.id) && 'bg-primary/5'
                )}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={() => handleSelectItem(item.id)}
                      aria-label={`Select item ${item.id}`}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      'px-4 py-3 text-sm',
                      column.hideOnMobile && 'hidden md:table-cell'
                    )}
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.key as keyof T] ?? '')}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-4 py-3 text-right">
                    <ActionDropdown
                      onView={onView ? () => onView(item) : undefined}
                      onEdit={onEdit ? () => onEdit(item) : undefined}
                      onDelete={onDelete ? () => onDelete(item) : undefined}
                      onDuplicate={onDuplicate ? () => onDuplicate(item) : undefined}
                      onToggleStatus={onToggleStatus ? () => onToggleStatus(item) : undefined}
                      onMoveUp={onMoveUp ? () => onMoveUp(item, index) : undefined}
                      onMoveDown={onMoveDown ? () => onMoveDown(item, index) : undefined}
                      isActive={getItemStatus?.(item) ?? true}
                      canMoveUp={index > 0}
                      canMoveDown={index < data.length - 1}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AcademicDataTable;
