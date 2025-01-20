export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  createdAt: string;
  dueDate?: string;
}

export interface TodoCategory {
  id: string;
  name: string;
  color: string;
}
