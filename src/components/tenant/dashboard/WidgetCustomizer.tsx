import React from 'react';
import { Settings2, Eye, EyeOff, RotateCcw, X, GripVertical } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { WidgetConfig } from '@/hooks/useDashboardWidgets';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface WidgetCustomizerProps {
  widgets: WidgetConfig[];
  onToggleVisibility: (widgetId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onReset: () => void;
}

interface SortableWidgetItemProps {
  widget: WidgetConfig;
  onToggle: () => void;
}

const SortableWidgetItem: React.FC<SortableWidgetItemProps> = ({ widget, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border bg-card',
        isDragging && 'shadow-lg opacity-90 z-50',
        !widget.visible && 'opacity-60'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{widget.title}</p>
      </div>
      
      <Switch
        checked={widget.visible}
        onCheckedChange={onToggle}
        aria-label={`Toggle ${widget.title} visibility`}
      />
    </div>
  );
};

const WidgetCustomizer: React.FC<WidgetCustomizerProps> = ({
  widgets,
  onToggleVisibility,
  onReorder,
  onReset,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  const visibleCount = widgets.filter((w) => w.visible).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" />
          <span className="hidden sm:inline">Customize</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Customize Dashboard
          </SheetTitle>
          <SheetDescription>
            Drag to reorder widgets. Toggle visibility with the switch.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Status bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {visibleCount} of {widgets.length} visible
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="gap-2 text-muted-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>

          <Separator />

          {/* Widget list */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={widgets.map((w) => w.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {widgets.map((widget) => (
                  <SortableWidgetItem
                    key={widget.id}
                    widget={widget}
                    onToggle={() => onToggleVisibility(widget.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <Separator />

          {/* Quick actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => widgets.forEach((w) => !w.visible && onToggleVisibility(w.id))}
            >
              <Eye className="w-3.5 h-3.5 mr-2" />
              Show All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => widgets.forEach((w) => w.visible && onToggleVisibility(w.id))}
            >
              <EyeOff className="w-3.5 h-3.5 mr-2" />
              Hide All
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WidgetCustomizer;
