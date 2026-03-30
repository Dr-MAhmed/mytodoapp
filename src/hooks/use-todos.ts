import { useState, useEffect, useCallback, useRef } from 'react';
import type { Todo, Priority } from '@/types/todo';
import { toast } from 'sonner';

const STORAGE_KEY = 'todify_tasks';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const lastDeletedRef = useRef<{ todo: Todo; index: number } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((data: Partial<Todo>) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: data.title || '',
      completed: false,
      priority: data.priority || 'medium',
      dueDate: data.dueDate || null,
      category: data.category || null,
      notes: data.notes || null,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);
    return newTodo;
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, ...updates } : todo)));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => {
      const index = prev.findIndex(t => t.id === id);
      if (index === -1) return prev;
      
      const todoToDelete = prev[index];
      lastDeletedRef.current = { todo: todoToDelete, index };

      toast('Task deleted', {
        action: {
          label: 'Undo',
          onClick: () => {
            if (lastDeletedRef.current) {
              const { todo, index } = lastDeletedRef.current;
              setTodos(current => {
                const newTodos = [...current];
                newTodos.splice(index, 0, todo);
                return newTodos;
              });
              lastDeletedRef.current = null;
            }
          },
        },
        duration: 5000,
      });

      return prev.filter(t => t.id !== id);
    });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  }, []);

  const bulkDelete = useCallback((ids: string[]) => {
    setTodos(prev => prev.filter(todo => !ids.includes(todo.id)));
  }, []);

  const bulkToggle = useCallback((ids: string[], completed: boolean) => {
    setTodos(prev => prev.map(todo => (ids.includes(todo.id) ? { ...todo, completed } : todo)));
  }, []);

  const reorderTodos = useCallback((activeId: string, overId: string) => {
    setTodos(prev => {
      const oldIndex = prev.findIndex(t => t.id === activeId);
      const newIndex = prev.findIndex(t => t.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return prev;
      
      const newTodos = [...prev];
      const [removed] = newTodos.splice(oldIndex, 1);
      newTodos.splice(newIndex, 0, removed);
      return newTodos;
    });
  }, []);

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    bulkDelete,
    bulkToggle,
    reorderTodos,
  };
}
