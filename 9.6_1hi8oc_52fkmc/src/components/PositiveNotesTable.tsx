import React from 'react';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { DAYS } from '../constants/days';
    import { getDateOfWeek, getCurrentWeekDates, formatDate } from '../utils/dateUtils';
    import { makeLinksClickable } from '../utils/linkUtils';

    interface PositiveNotesTableProps {
    }

    export function PositiveNotesTable({ }: PositiveNotesTableProps) {
      const { selectedDate, weekNumber, year } = useWeekSelection();
      const weekStartDate = getDateOfWeek(weekNumber, year);
      const weekDates = getCurrentWeekDates(weekStartDate);

      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {DAYS.map((day, index) => (
                  <th key={day} className="p-4 text-white border border-white/20">
                    <div className="flex flex-col items-center">
                      <span>{day}</span>
                      <span className="text-sm text-white/70">{formatDate(weekDates[index])}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {DAYS.map((_, dayIndex) => {
                    const currentDate = weekDates[dayIndex];
                    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
                    const notes = localStorage.getItem(`positiveNotes-${dateKey}`);
                    let parsedNotes: string[] = [];
                    if (notes) {
                      try {
                        parsedNotes = JSON.parse(notes);
                      } catch (e) {
                        console.error("Error parsing positive notes:", notes, e);
                      }
                    }
                    return (
                      <td key={dayIndex} className="p-4 border border-white/20 align-top">
                        <ul className="list-disc list-inside text-white/70 text-sm" dir="rtl">
                          {parsedNotes[rowIndex] && (
                            <li dangerouslySetInnerHTML={{ __html: makeLinksClickable(parsedNotes[rowIndex]) }} />
                          )}
                        </ul>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
