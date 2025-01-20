import { ListChecks } from 'lucide-react';

export function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-2">
        <ListChecks size={32} className="text-amber-400" />
        <h1 className="text-3xl font-bold text-amber-400">مدير المهام اليومية</h1>
      </div>
      <p className="text-amber-200/80">نظم مهامك بسهولة وفعالية</p>
    </div>
  );
}
