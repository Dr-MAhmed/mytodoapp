import { useState, useEffect, useCallback, useRef } from 'react';
import type { Todo } from '@/types/todo';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Helper: map Supabase row → local Todo shape
function rowToTodo(row: any): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    priority: row.priority,
    dueDate: row.due_date ?? null,
    category: row.category ?? null,
    notes: row.notes ?? null,
    createdAt: row.created_at,
  };
}

// Helper: map local Todo → Supabase row shape (for inserts/updates)
function todoToRow(todo: Partial<Todo> & { user_id?: string }) {
  return {
    ...(todo.id ? { id: todo.id } : {}),
    ...(todo.user_id ? { user_id: todo.user_id } : {}),
    ...(todo.title !== undefined ? { title: todo.title } : {}),
    ...(todo.completed !== undefined ? { completed: todo.completed } : {}),
    ...(todo.priority !== undefined ? { priority: todo.priority } : {}),
    ...(todo.dueDate !== undefined ? { due_date: todo.dueDate } : {}),
    ...(todo.category !== undefined ? { category: todo.category } : {}),
    ...(todo.notes !== undefined ? { notes: todo.notes } : {}),
  };
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const lastDeletedRef = useRef<{ todo: Todo; index: number } | null>(null);

  // ─── Fetch all todos from Supabase on mount ──────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const loadTodos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!cancelled) {
        if (error) {
          toast.error('Failed to load todos: ' + error.message);
        } else {
          setTodos((data ?? []).map(rowToTodo));
        }
        setLoading(false);
      }
    };

    loadTodos();

    // ─── Real-time subscription ─────────────────────────────────────────────
    const channel = supabase
      .channel('todos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTodos(prev => {
              // Avoid duplicates (optimistic update may have added it)
              if (prev.find(t => t.id === payload.new.id)) return prev;
              return [rowToTodo(payload.new), ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setTodos(prev =>
              prev.map(t => (t.id === payload.new.id ? rowToTodo(payload.new) : t))
            );
          } else if (payload.eventType === 'DELETE') {
            setTodos(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  // ─── Add ─────────────────────────────────────────────────────────────────
  const addTodo = useCallback(async (data: Partial<Todo>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Please sign in to add tasks.'); return; }

    const optimistic: Todo = {
      id: crypto.randomUUID(),
      title: data.title || '',
      completed: false,
      priority: data.priority || 'medium',
      dueDate: data.dueDate || null,
      category: data.category || null,
      notes: data.notes || null,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setTodos(prev => [optimistic, ...prev]);

    const { data: inserted, error } = await supabase
      .from('todos')
      .insert([todoToRow({ ...optimistic, user_id: user.id })])
      .select()
      .single();

    if (error) {
      // Rollback
      setTodos(prev => prev.filter(t => t.id !== optimistic.id));
      toast.error('Failed to add todo: ' + error.message);
      return;
    }

    // Replace optimistic with server row (real id confirmed)
    setTodos(prev =>
      prev.map(t => (t.id === optimistic.id ? rowToTodo(inserted) : t))
    );

    return rowToTodo(inserted);
  }, []);

  // ─── Update ───────────────────────────────────────────────────────────────
  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
    // Optimistic
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));

    const { error } = await supabase
      .from('todos')
      .update(todoToRow(updates))
      .eq('id', id);

    if (error) {
      toast.error('Failed to update todo: ' + error.message);
      // Reload to get consistent state
      const { data } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setTodos(data.map(rowToTodo));
    }
  }, []);

  // ─── Delete ───────────────────────────────────────────────────────────────
  const deleteTodo = useCallback(async (id: string) => {
    setTodos(prev => {
      const index = prev.findIndex(t => t.id === id);
      if (index === -1) return prev;
      lastDeletedRef.current = { todo: prev[index], index };

      toast('Task deleted', {
        action: {
          label: 'Undo',
          onClick: async () => {
            if (!lastDeletedRef.current) return;
            const { todo } = lastDeletedRef.current;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
              .from('todos')
              .insert([todoToRow({ ...todo, user_id: user.id })]);

            if (!error) {
              setTodos(current => {
                const next = [...current];
                next.splice(lastDeletedRef.current!.index, 0, todo);
                return next;
              });
            }
            lastDeletedRef.current = null;
          },
        },
        duration: 5000,
      });

      return prev.filter(t => t.id !== id);
    });

    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) toast.error('Failed to delete: ' + error.message);
  }, []);

  // ─── Toggle ───────────────────────────────────────────────────────────────
  const toggleTodo = useCallback(async (id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', id);

    if (error) toast.error('Failed to toggle: ' + error.message);
  }, [todos]);

  // ─── Bulk delete ──────────────────────────────────────────────────────────
  const bulkDelete = useCallback(async (ids: string[]) => {
    setTodos(prev => prev.filter(t => !ids.includes(t.id)));
    const { error } = await supabase.from('todos').delete().in('id', ids);
    if (error) toast.error('Failed to delete selected tasks.');
  }, []);

  // ─── Bulk toggle ──────────────────────────────────────────────────────────
  const bulkToggle = useCallback(async (ids: string[], completed: boolean) => {
    setTodos(prev =>
      prev.map(t => (ids.includes(t.id) ? { ...t, completed } : t))
    );
    const { error } = await supabase
      .from('todos')
      .update({ completed })
      .in('id', ids);
    if (error) toast.error('Failed to update selected tasks.');
  }, []);

  // ─── Reorder (local only — Supabase ordering handled by created_at) ───────
  const reorderTodos = useCallback((activeId: string, overId: string) => {
    setTodos(prev => {
      const oldIndex = prev.findIndex(t => t.id === activeId);
      const newIndex = prev.findIndex(t => t.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const next = [...prev];
      const [removed] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, removed);
      return next;
    });
  }, []);

  return {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    bulkDelete,
    bulkToggle,
    reorderTodos,
  };
}
