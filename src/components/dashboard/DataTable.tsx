import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}

function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    'font-semibold text-foreground',
                    column.hideOnMobile && 'hidden sm:table-cell',
                    column.className
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={cn(onRowClick && 'cursor-pointer hover:bg-muted/50')}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${item.id}-${String(column.key)}`}
                      className={cn(
                        column.hideOnMobile && 'hidden sm:table-cell',
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DataTable;

// Common badge helpers
export const StatusBadge: React.FC<{ active: boolean }> = ({ active }) => (
  <Badge variant={active ? 'default' : 'secondary'} className={cn(
    active ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-muted text-muted-foreground'
  )}>
    {active ? 'Active' : 'Inactive'}
  </Badge>
);

export const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const roleColors: Record<string, string> = {
    SUPER_ADMIN: 'bg-purple-100 text-purple-700',
    TENANT_ADMIN: 'bg-blue-100 text-blue-700',
    TEACHER: 'bg-green-100 text-green-700',
    STUDENT: 'bg-amber-100 text-amber-700',
    PARENT: 'bg-pink-100 text-pink-700',
  };

  return (
    <Badge className={cn('hover:opacity-90', roleColors[role] || 'bg-muted text-muted-foreground')}>
      {role.replace('_', ' ')}
    </Badge>
  );
};

export const TenantTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const typeColors: Record<string, string> = {
    SCHOOL: 'bg-blue-100 text-blue-700',
    COACHING_CENTER: 'bg-green-100 text-green-700',
    INDIVIDUAL: 'bg-purple-100 text-purple-700',
    TRAINING_CENTER: 'bg-amber-100 text-amber-700',
    UNIVERSITY: 'bg-indigo-100 text-indigo-700',
    OTHER: 'bg-muted text-muted-foreground',
  };

  return (
    <Badge className={cn('hover:opacity-90', typeColors[type] || 'bg-muted text-muted-foreground')}>
      {type.replace('_', ' ')}
    </Badge>
  );
};
