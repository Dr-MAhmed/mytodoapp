import React, { useState, useMemo, useEffect } from 'react';
import { useTodos } from '@/hooks/use-todos';
import { TodoInput } from '@/components/todo/TodoInput';
import { TodoList } from '@/components/todo/TodoList';
import { TodoFilters } from '@/components/todo/TodoFilters';
import { TodoEditDialog } from '@/components/todo/TodoEditDialog';
import { Button } from '@/components/ui/button';
import { Moon, Sun, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import { format } from 'date-fns';
import type { Todo, TodoFilter, TodoSort } from '@/types/todo';
import { PwaInstallButton } from '@/components/PwaInstallButton';
// import { motion, AnimatePresence } from 'framer-motion';
const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reorderTodos,
  } = useTodos();

  const { theme, setTheme } = useTheme();
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sort, setSort] = useState<TodoSort>('date');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // const [isInstalled, setIsInstalled] = useState(
  //   window.matchMedia('(display-mode: standalone)').matches
  // );

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


  return (
    <div className="min-h-screen bg-background transition-colors duration-500 pb-20 overflow-x-hidden">
      {/* Header / App Bar */}
      <header className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
              <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-extrabold tracking-tight">Todify</h1>
              <p className="hidden sm:block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{format(new Date(), 'EEEE, MMM d')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {!isOnline && (
              <span className="text-xs font-medium text-destructive flex items-center gap-1 bg-destructive/10 px-2 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="hidden xs:inline">Offline</span>
              </span>
            )}
            <PwaInstallButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10 hover:bg-muted/50 transition-all active:scale-95"
            >
              <Sun className="h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              title={`Sign out (${user?.email})`}
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10 hover:bg-destructive/10 hover:text-destructive transition-all active:scale-95"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-3 sm:px-4 pt-6 sm:pt-10 pb-20 space-y-5 sm:space-y-8">
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
          />
        </section>
      </main>


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
