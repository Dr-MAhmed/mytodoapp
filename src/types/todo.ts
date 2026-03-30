export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string | null;
  priority: Priority;
  category?: string | null;
  notes?: string | null;
  createdAt: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoSort = 'date' | 'dueDate' | 'priority';
