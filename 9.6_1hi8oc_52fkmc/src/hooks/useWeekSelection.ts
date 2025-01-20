import { useState, useEffect } from 'react';
    import { getWeekNumber, getDateOfWeek, getCurrentWeekDates } from '../utils/dateUtils';

    export function useWeekSelection() {
      const [selectedDate, setSelectedDate] = useState(new Date());
      const weekNumber = getWeekNumber(selectedDate);
      const year = selectedDate.getFullYear();

      // Initialize with current week
      useEffect(() => {
        const today = new Date();
        setSelectedDate(today);
      }, []);

      const changeWeek = (weekNum: number, yearNum: number = year) => {
        const newDate = getDateOfWeek(weekNum, yearNum);
        setSelectedDate(newDate);
      };

      return {
        selectedDate,
        weekNumber,
        year,
        changeWeek
      };
    }
