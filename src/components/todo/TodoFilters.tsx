import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TodoFilter, TodoSort } from '@/types/todo';
import { ArrowUpDown } from 'lucide-react';

interface TodoFiltersProps {
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
  sort: TodoSort;
  setSort: (sort: TodoSort) => void;
  counts: { all: number; active: number; completed: number };
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({ 
  filter, 
  setFilter, 
  sort, 
  setSort,
  counts
}) => {
  const filterTabs: { id: TodoFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-3 sm:py-5 border-b border-t mb-2 bg-background/80 backdrop-blur-sm">
      {/* Filter Tabs — full-width pill on mobile */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-full sm:w-auto">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap",
              filter === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card/30"
            )}
          >
            {tab.label}
            <Badge
              variant={filter === tab.id ? "default" : "secondary"}
              className="h-4 min-w-4 px-1 flex items-center justify-center rounded-full text-[10px]"
            >
              {tab.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Sort Selector */}
      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
          <ArrowUpDown className="h-3 w-3" /> Sort
        </label>
        <Select value={sort} onValueChange={(val: TodoSort) => setSort(val)}>
          <SelectTrigger className="flex-1 sm:w-[150px] h-8 sm:h-9 bg-card text-xs sm:text-sm">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date Created</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
