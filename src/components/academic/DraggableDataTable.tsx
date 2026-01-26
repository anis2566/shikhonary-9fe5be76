import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical } from 'lucide-react';
import ActionDropdown from './ActionDropdown';
import SortableRow from './SortableRow';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  hideOnMobile?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DraggableDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onReorder: (newData: T[]) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onDuplicate?: (item: T) => void;
  onToggleStatus?: (item: T) => void;
  emptyMessage?: string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  getItemStatus?: (item: T) => boolean;
  reorderDisabled?: boolean;
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

function DraggableDataTable<T extends { id: string }>({
  columns,
  data,
  onReorder,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onToggleStatus,
  emptyMessage = 'No data found',
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  getItemStatus,
  reorderDisabled = false,
}: DraggableDataTableProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = data.findIndex((item) => item.id === active.id);
      const newIndex = data.findIndex((item) => item.id === over.id);
      const newData = arrayMove(data, oldIndex, newIndex).map((item, index) => ({
        ...item,
        position: index,
      }));
      onReorder(newData);
    }
  };

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const hasActions = onEdit || onDelete || onView || onDuplicate || onToggleStatus;
  const activeItem = activeId ? data.find((item) => item.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-10 px-2 py-3">
                  <span className="sr-only">Reorder</span>
                </th>
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
              <SortableContext items={data.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                {data.map((item, index) => (
                  <SortableRow
                    key={item.id}
                    id={item.id}
                    isSelected={selectedIds.includes(item.id)}
                    disabled={reorderDisabled}
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
                          isActive={getItemStatus?.(item) ?? true}
                        />
                      </td>
                    )}
                  </SortableRow>
                ))}
              </SortableContext>
            </tbody>
          </table>
        </div>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="bg-card border border-primary/50 rounded-lg shadow-xl p-3 flex items-center gap-3">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {(activeItem as any).displayName || (activeItem as any).question?.slice(0, 50) || activeItem.id}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default DraggableDataTable;
