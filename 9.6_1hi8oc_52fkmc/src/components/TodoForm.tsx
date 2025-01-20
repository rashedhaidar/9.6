import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { Priority } from '../types/todo';
import { predictPriority, estimateTaskDuration } from '../utils/ai';

interface TodoFormProps {
  onSubmit: (todo: {
    title: string;
    description?: string;
    priority: Priority;
    category: string;
    dueDate?: string;
    completed: boolean;
  }) => void;
  categories: string[];
}

export function TodoForm({ onSubmit, categories }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState(categories[0] || '');
  const [dueDate, setDueDate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState<string>('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    const predictedPriority = predictPriority(newTitle, description);
    setPriority(predictedPriority);
    setEstimatedTime(estimateTaskDuration(newTitle, description));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    const predictedPriority = predictPriority(title, newDescription);
    setPriority(predictedPriority);
    setEstimatedTime(estimateTaskDuration(title, newDescription));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      priority,
      category,
      dueDate: dueDate || undefined,
      completed: false,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setEstimatedTime('');
  };

  const inputClasses = "w-full p-2 border rounded-md bg-black text-amber-400 border-amber-400/30 placeholder-amber-400/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-black/50 p-6 rounded-lg border border-amber-400/20">
      <div>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="عنوان المهمة"
          className={inputClasses}
          dir="rtl"
        />
      </div>
      <div>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="وصف المهمة"
          className={inputClasses}
          dir="rtl"
        />
      </div>
      {estimatedTime && (
        <div className="flex items-center gap-2 text-amber-400/70 text-sm" dir="rtl">
          <Clock size={16} />
          <span>الوقت المتوقع: {estimatedTime}</span>
        </div>
      )}
      <div className="flex gap-4">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className={inputClasses}
          dir="rtl"
        >
          <option value="high">عالية</option>
          <option value="medium">متوسطة</option>
          <option value="low">منخفضة</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClasses}
          dir="rtl"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={inputClasses}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-amber-400 text-black p-2 rounded-md hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <Plus size={20} />
        إضافة مهمة
      </button>
    </form>
  );
}
