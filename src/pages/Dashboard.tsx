import React, { useState, useMemo, useEffect } from 'react';
import { useTodos } from '@/hooks/use-todos';
import { TodoInput } from '@/components/todo/TodoInput';
import { TodoList } from '@/components/todo/TodoList';
import { TodoFilters } from '@/components/todo/TodoFilters';
import { TodoEditDialog } from '@/components/todo/TodoEditDialog';
import { BulkActions } from '@/components/todo/BulkActions';
import { PwaInstallButton } from '@/components/PwaInstallButton';
import { OfflineAvailabilityBanner } from '@/components/OfflineAvailabilityBanner';
import { OfflineFeatureCard } from '@/components/OfflineFeatureCard';
import { Button } from '@/components/ui/button';
import { Moon, Sun, CheckCircle2, LayoutGrid, List } from 'lucide-react';
import { useTheme } from 'next-themes';
import { format } from 'date-fns';
import type { Todo, TodoFilter, TodoSort } from '@/types/todo';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { 
    todos, 
    addTodo, 
    updateTodo, 
    deleteTodo, 
    toggleTodo, 
    reorderTodos,
    bulkDelete,
    bulkToggle
  } = useTodos();

  const { theme, setTheme } = useTheme();
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sort, setSort] = useState<TodoSort>('date');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(
    window.matchMedia('(display-mode: standalone)').matches
  );

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Filtering & Sorting Logic
  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Filter
    if (filter === 'active') result = result.filter(t => !t.completed);
    if (filter === 'completed') result = result.filter(t => t.completed);

    // Sort
    result.sort((a, b) => {
      if (sort === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sort === 'priority') {
        const pMap = { high: 3, medium: 2, low: 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      return 0;
    });

    return result;
  }, [todos, filter, sort]);

  const counts = useMemo(() => ({
    all: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  }), [todos]);

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    bulkDelete(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkToggle = (completed: boolean) => {
    bulkToggle(selectedIds, completed);
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 pb-20">
      <OfflineAvailabilityBanner />
      {/* Header / App Bar */}
      <header className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Todify</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{format(new Date(), 'EEEE, MMM d')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PwaInstallButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full h-10 w-10 hover:bg-muted/50 transition-all active:scale-95"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-10 pb-20 space-y-8">
        {/* Offline Feature Card */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-500">
          <OfflineFeatureCard 
            isOnline={isOnline}
            isInstalled={isInstalled}
            onDownloadClick={() => {
              const downloadBtn = document.querySelector('[title="Download this app to use offline anytime"]') as HTMLButtonElement;
              if (downloadBtn) {
                downloadBtn.click();
              }
            }}
          />
        </section>

        {/* Task Input Area */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-500">
          <TodoInput onAdd={addTodo} />
        </section>

        {/* Filters & Sorting */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
          <TodoFilters 
            filter={filter} 
            setFilter={setFilter} 
            sort={sort} 
            setSort={setSort}
            counts={counts}
          />
        </section>

        {/* Task List */}
        <section className="pb-10 min-h-[400px]">
          <TodoList 
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={setEditingTodo}
            onReorder={reorderTodos}
            selectedIds={selectedIds}
            onSelect={handleSelect}
          />
        </section>
      </main>

      {/* Bulk Actions overlay */}
      <BulkActions 
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkDelete={handleBulkDelete}
        onBulkComplete={() => handleBulkToggle(true)}
        onBulkActive={() => handleBulkToggle(false)}
      />

      {/* Edit Dialog */}
      <TodoEditDialog 
        todo={editingTodo}
        isOpen={!!editingTodo}
        onClose={() => setEditingTodo(null)}
        onSave={updateTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
};

export default Dashboard;
