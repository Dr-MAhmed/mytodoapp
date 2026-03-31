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
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-b border-t mb-2 bg-background/50 sticky top-0 z-10">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-full md:w-auto overflow-x-auto no-scrollbar">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap",
              filter === tab.id 
                ? "bg-card text-foreground shadow-sm scale-100" 
                : "text-muted-foreground hover:text-foreground hover:bg-card/30 scale-95"
            )}
          >
            {tab.label}
            <Badge 
              variant={filter === tab.id ? "default" : "secondary"} 
              className="ml-1 h-5 min-w-5 px-1 flex items-center justify-center rounded-full text-[10px]"
            >
              {tab.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Sort Selector */}
      <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap">
          <ArrowUpDown className="h-3 w-3" /> Sort by
        </label>
        <Select value={sort} onValueChange={(val: TodoSort) => setSort(val)}>
          <SelectTrigger className="w-full md:w-[160px] h-9 bg-card">
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
