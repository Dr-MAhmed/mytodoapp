import React, { useState } from 'react';
import { Plus, Calendar, Flag, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { Priority } from '@/types/todo';

interface TodoInputProps {
  onAdd: (data: { title: string; priority: Priority; dueDate?: string; category?: string }) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [date, setDate] = useState<Date>();
  const [category, setCategory] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim().slice(0, 200),
      priority,
      dueDate: date?.toISOString(),
      category: category.trim() || undefined,
    });

    setTitle('');
    setPriority('medium');
    setDate(undefined);
    setCategory('');
    setIsExpanded(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <form 
        onSubmit={handleSubmit}
        className="bg-card border rounded-xl shadow-sm overflow-hidden"
      >
        <div className="flex items-center p-3 sm:p-4 gap-2 sm:gap-3">
          <Input
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border-none focus-visible:ring-0 text-base sm:text-lg placeholder:text-muted-foreground"
            maxLength={200}
          />
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn("rounded-full", isExpanded && "bg-accent text-accent-foreground")}
            >
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
            <Button 
              type="submit" 
              size="icon"
              disabled={!title.trim()}
              className="rounded-full h-10 w-10 shrink-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-3 sm:p-4 border-t bg-muted/30 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* Priority Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Flag className="h-3 w-3" /> Priority
                  </label>
                  <Select value={priority} onValueChange={(val: Priority) => setPriority(val)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Due Date Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Due Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Category Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Category
                  </label>
                  <Input 
                    placeholder="e.g., Work, Life"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-background"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      <div className="flex justify-between items-center px-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
          {title.length}/200 characters
        </p>
        <p className="hidden sm:block text-[10px] text-muted-foreground">Press Enter to add task</p>
      </div>
    </div>
  );
};
