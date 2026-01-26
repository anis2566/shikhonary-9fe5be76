import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableRowProps {
  id: string;
  children: React.ReactNode;
  isSelected?: boolean;
  disabled?: boolean;
}

const SortableRow: React.FC<SortableRowProps> = ({ id, children, isSelected, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        'hover:bg-muted/30 transition-colors',
        isSelected && 'bg-primary/5',
        isDragging && 'bg-muted/50 opacity-50 shadow-lg z-50'
      )}
      {...attributes}
    >
      <td className="px-2 py-3 w-10">
        <button
          {...listeners}
          className={cn(
            'p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing',
            disabled && 'opacity-30 cursor-not-allowed'
          )}
          disabled={disabled}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </td>
      {children}
    </tr>
  );
};

export default SortableRow;
