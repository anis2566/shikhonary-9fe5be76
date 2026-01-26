import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';

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
  emptyMessage?: string;
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
  emptyMessage = 'No data found',
}: AcademicDataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
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
              {(onEdit || onDelete || onView) && (
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
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
                {(onEdit || onDelete || onView) && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onView && (
                        <Button variant="ghost" size="icon" onClick={() => onView(item)} className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="icon" onClick={() => onDelete(item)} className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
