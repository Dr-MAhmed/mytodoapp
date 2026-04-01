import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, isToday, isPast } from 'date-fns';
import type { Todo, Priority } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const priorityConfig: Record<Priority, { color: string; label: string }> = {
  low: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Low' },
  medium: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Medium' },
  high: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'High' },
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const getUrgencyColor = (dueDate: string | null | undefined) => {
    if (!dueDate) return 'text-muted-foreground';
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return 'text-destructive font-semibold';
    if (isToday(date)) return 'text-amber-600 dark:text-amber-500 font-semibold';
    return 'text-muted-foreground';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-card border rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200",
        todo.completed && "bg-muted/50 border-transparent"
      )}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Drag Handle — hidden on mobile to save space */}
        <button
          {...attributes}
          {...listeners}
          className="hidden sm:flex mt-1 p-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Completion Checkbox */}
        <div className="mt-0.5 sm:mt-1 shrink-0">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
            className="h-5 w-5 rounded-full"
          />
        </div>

        {/* Task Details */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Title row with action buttons always visible on mobile */}
          <div className="flex items-start justify-between gap-1">
            <h3 className={cn(
              "text-sm sm:text-base font-medium transition-all duration-300 break-words min-w-0 pr-1",
              todo.completed && "text-muted-foreground line-through decoration-2"
            )}>
              {todo.title}
            </h3>
            {/* Action buttons: always visible on mobile (touch), hover-only on desktop */}
            <div className="flex items-center gap-0.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(todo)}
              >
                <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(todo.id)}
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Meta badges row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className={cn("px-2 py-0 h-5 text-[10px] font-bold uppercase", priorityConfig[todo.priority].color)}>
              {priorityConfig[todo.priority].label}
            </Badge>

            {todo.category && (
              <Badge variant="outline" className="px-2 py-0 h-5 text-[10px] bg-background">
                <Tag className="mr-1 h-3 w-3" />
                {todo.category}
              </Badge>
            )}

            {todo.dueDate && (
              <div className={cn("flex items-center text-xs gap-1", getUrgencyColor(todo.dueDate))}>
                <Calendar className="h-3 w-3" />
                {format(new Date(todo.dueDate), 'MMM d, yyyy')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
