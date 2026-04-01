import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Trash2, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Todo } from '@/types/todo';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

interface TodoEditDialogProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export const TodoEditDialog: React.FC<TodoEditDialogProps> = ({ 
  todo, 
  isOpen, 
  onClose, 
  onSave,
  onDelete
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      priority: 'medium',
      dueDate: null,
      category: null,
      notes: null,
    },
  });

  useEffect(() => {
    if (todo) {
      form.reset({
        title: todo.title,
        priority: todo.priority,
        dueDate: todo.dueDate,
        category: todo.category,
        notes: todo.notes,
      });
    }
  }, [todo, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (todo) {
      onSave(todo.id, values);
      onClose();
    }
  };

  const handleDelete = () => {
    if (todo) {
      onDelete(todo.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[500px] p-0 overflow-hidden rounded-2xl gap-0">
        <DialogHeader className="px-6 py-6 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Edit Task</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What needs to be done?" {...field} className="text-lg font-medium bg-card h-12 border-muted-foreground/20 focus:border-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-card h-10 border-muted-foreground/20">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-0.5">
                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-card h-10 border-muted-foreground/20",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString() || null)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Work, Shopping" {...field} value={field.value || ''} className="bg-card h-10 border-muted-foreground/20" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add details or subtasks..." {...field} value={field.value || ''} className="min-h-[100px] resize-none bg-card border-muted-foreground/20" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between pt-4 border-t gap-2 sm:gap-3">
              <Button type="button" variant="ghost" onClick={handleDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full h-10 sm:h-11 px-4 sm:px-6">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none rounded-full h-10 sm:h-11 px-4 sm:px-6">Cancel</Button>
                <Button type="submit" className="flex-1 sm:flex-none rounded-full h-10 sm:h-11 px-4 sm:px-6">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
