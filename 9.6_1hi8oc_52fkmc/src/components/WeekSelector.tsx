import React, { useState, useMemo, useEffect } from 'react';
    import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
    import { getWeekNumber, getTotalWeeks, getDateOfWeek } from '../utils/dateUtils';

    interface WeekSelectorProps {
      currentDate: Date;
      onWeekChange: (weekNum: number, year: number) => void;
    }

    export function WeekSelector({ currentDate, onWeekChange }: WeekSelectorProps) {
      const [weekNumber, setWeekNumber] = useState(getWeekNumber(currentDate));
      const [year, setYear] = useState(currentDate.getFullYear());
      const [month, setMonth] = useState(currentDate.getMonth());
      const totalWeeks = useMemo(() => getTotalWeeks(year), [year]);
      const monthName = useMemo(() => {
        const newDate = getDateOfWeek(weekNumber, year);
        return newDate.toLocaleString('ar-LB', { month: 'long' });
      }, [weekNumber, year]);

      useEffect(() => {
        setWeekNumber(getWeekNumber(currentDate));
        setYear(currentDate.getFullYear());
        setMonth(currentDate.getMonth());
      }, [currentDate]);

      const handlePrevWeek = () => {
        if (weekNumber === 1) {
          // Go to last week of previous year
          const prevYear = year - 1;
          const lastWeek = getTotalWeeks(prevYear);
          onWeekChange(lastWeek, prevYear);
          setWeekNumber(lastWeek);
          setYear(prevYear);
          setMonth(11);
        } else {
          onWeekChange(weekNumber - 1, year);
          setWeekNumber(weekNumber - 1);
          const newDate = getDateOfWeek(weekNumber - 1, year);
          setMonth(newDate.getMonth());
        }
      };

      const handleNextWeek = () => {
        if (weekNumber === totalWeeks) {
          // Go to first week of next year
          onWeekChange(1, year + 1);
          setWeekNumber(1);
          setYear(year + 1);
          setMonth(0);
        } else {
          onWeekChange(weekNumber + 1, year);
          setWeekNumber(weekNumber + 1);
          const newDate = getDateOfWeek(weekNumber + 1, year);
          setMonth(newDate.getMonth());
        }
      };

      const handleWeekSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedWeek = parseInt(event.target.value);
        onWeekChange(selectedWeek, year);
        setWeekNumber(selectedWeek);
        const newDate = getDateOfWeek(selectedWeek, year);
        setMonth(newDate.getMonth());
      };

      const handleYearSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedYear = parseInt(event.target.value);
        onWeekChange(weekNumber, selectedYear);
        setYear(selectedYear);
        const newDate = getDateOfWeek(weekNumber, selectedYear);
        setMonth(newDate.getMonth());
      };

      const handleMonthSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMonth = parseInt(event.target.value);
        const newDate = new Date(year, selectedMonth, 1);
        const newWeekNumber = getWeekNumber(newDate);
        onWeekChange(newWeekNumber, year);
        setWeekNumber(newWeekNumber);
        setMonth(selectedMonth);
      };

      const getMonthName = (month: number) => {
        const monthNames = ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"];
        return monthNames[month];
      };

      // Generate year options (current year ± 2 years)
      const yearOptions = useMemo(() => Array.from({ length: 5 }, (_, i) => year - 2 + i), [year]);

      return (
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-2 md:p-4 rounded-lg shadow-lg">
          <button
            onClick={handlePrevWeek}
            className="p-1 md:p-2 rounded-full hover:bg-white/10 text-pink-400 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="flex items-center gap-1 md:gap-2 flex-wrap justify-center">
            <Calendar className="text-purple-400" size={16} md:size={20} />
            <select
              value={weekNumber}
              onChange={handleWeekSelect}
              className="bg-black/20 text-purple-400 rounded-lg px-2 py-1 border border-purple-400/20 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-xs md:text-base"
            >
              {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => (
                <option key={week} value={week}>الأسبوع {week}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={handleYearSelect}
              className="bg-black/20 text-purple-400 rounded-lg px-2 py-1 border border-purple-400/20 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-xs md:text-base"
            >
              {yearOptions.map(yearOption => (
                <option key={yearOption} value={yearOption}>{yearOption}</option>
              ))}
            </select>
            <select
              value={month}
              onChange={handleMonthSelect}
              className="bg-black/20 text-purple-400 rounded-lg px-2 py-1 border border-purple-400/20 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-xs md:text-base"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{getMonthName(i)}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNextWeek}
            className="p-1 md:p-2 rounded-full hover:bg-white/10 text-pink-400 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      );
    }
