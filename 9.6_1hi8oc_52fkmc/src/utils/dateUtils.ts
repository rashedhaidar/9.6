export function getCurrentWeekDates(date: Date = new Date()) {
      const currentDay = date.getDay();
      const diff = date.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
      const monday = new Date(date.setDate(diff));
      
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i - 1); // Subtract 1 day here
        weekDates.push(date);
      }
      
      return weekDates;
    }

    export function getNextWeekDates(date: Date = new Date()) {
      const nextWeek = new Date(date);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return getCurrentWeekDates(nextWeek);
    }

    export function getWeekNumber(date: Date) {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    export function getDateOfWeek(weekNum: number, year: number) {
      const firstDayOfYear = new Date(year, 0, 1);
      const daysToAdd = (weekNum - 1) * 7;
      const result = new Date(firstDayOfYear);
      result.setDate(firstDayOfYear.getDate() + daysToAdd);
      return result;
    }

    export function formatDate(date: Date) {
      return new Intl.DateTimeFormat('ar-LB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    }

    export function getTotalWeeks(year: number) {
      const lastDay = new Date(year, 11, 31);
      return getWeekNumber(lastDay);
    }
