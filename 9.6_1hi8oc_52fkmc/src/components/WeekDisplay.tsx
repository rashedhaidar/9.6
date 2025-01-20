import React from 'react';
import { Calendar } from 'lucide-react';

interface WeekDisplayProps {
  weekNumber: number;
  year: number;
}

export function WeekDisplay({ weekNumber, year }: WeekDisplayProps) {
  return (
    <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
      <Calendar size={16} />
      <span>الأسبوع {weekNumber} - {year}</span>
    </div>
  );
}
