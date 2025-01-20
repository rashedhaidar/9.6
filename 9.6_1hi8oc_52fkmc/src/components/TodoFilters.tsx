interface TodoFiltersProps {
  filter: 'all' | 'active' | 'completed';
  categoryFilter: string;
  categories: string[];
  onFilterChange: (value: 'all' | 'active' | 'completed') => void;
  onCategoryChange: (value: string) => void;
}

export function TodoFilters({
  filter,
  categoryFilter,
  categories,
  onFilterChange,
  onCategoryChange,
}: TodoFiltersProps) {
  const selectClass = "p-2 border rounded-md bg-black text-amber-400 border-amber-400/30";
  
  return (
    <div className="mb-6 flex gap-4 justify-center">
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value as typeof filter)}
        className={selectClass}
        dir="rtl"
      >
        <option value="all">جميع المهام</option>
        <option value="active">المهام النشطة</option>
        <option value="completed">المهام المكتملة</option>
      </select>
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={selectClass}
        dir="rtl"
      >
        <option value="all">جميع التصنيفات</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
}
