import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Todo>) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const priorityColors = {
    high: 'bg-red-900/50 text-red-300',
    medium: 'bg-amber-900/50 text-amber-300',
    low: 'bg-green-900/50 text-green-300',
  };

  return (
    <div className="bg-black/50 p-4 rounded-lg border border-amber-400/20 hover:border-amber-400/40 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => onToggle(todo.id)}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${todo.completed ? 'bg-amber-400 border-amber-400' : 'border-amber-400/50'}`}
          >
            {todo.completed && <Check size={14} className="text-black" />}
          </button>
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-amber-400/50' : 'text-amber-400'}`} dir="rtl">
              {todo.title}
            </h3>
            {todo.description && (
              <p className="text-amber-400/70 mt-1" dir="rtl">{todo.description}</p>
            )}
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className={`px-2 py-1 rounded-full text-sm ${priorityColors[todo.priority]}`}>
                {todo.priority === 'high' ? 'عالية' : todo.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
              </span>
              <span className="bg-amber-900/50 text-amber-300 px-2 py-1 rounded-full text-sm">
                {todo.category}
              </span>
              {todo.dueDate && (
                <span className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full text-sm">
                  {new Date(todo.dueDate).toLocaleDateString('ar-SA')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(todo.id)}
            className="text-amber-400/70 hover:text-amber-400 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
