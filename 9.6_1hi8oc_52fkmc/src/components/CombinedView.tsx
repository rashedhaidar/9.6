import React, { useState, useRef, useContext, useCallback } from 'react';
    import { Activity } from '../types/activity';
    import { AIAssistant } from './AIAssistant';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { WeekDisplay } from './WeekDisplay';
    import { Download, Upload, Brain } from 'lucide-react';
    import { ActivityContext } from '../context/ActivityContext';
    import { ProgressView } from './ProgressView';
    import { DAYS } from '../constants/days';
    import { getDateOfWeek, getCurrentWeekDates, formatDate, getTotalWeeks } from '../utils/dateUtils';
    import { CombinedAI } from './CombinedAI';
    import { PsychologicalAnalysis } from './PsychologicalAnalysis';

    interface CombinedViewProps {
      activities: Activity[];
      onSuggestion: (suggestion: Partial<Activity>) => void;
    }

    export function CombinedView({ onSuggestion }: CombinedViewProps) {
      const weekSelection = useWeekSelection();
      const fileInputRef = useRef<HTMLInputElement>(null);
      const { activities, addActivity, updateActivity, deleteActivity } = useContext(ActivityContext);

      const handleExport = useCallback(() => {
        const allData = {};
        const currentYear = new Date().getFullYear();
        const totalWeeks = getTotalWeeks(currentYear);

        for (let year = currentYear - 2; year <= currentYear + 2; year++) {
          for (let weekNumber = 1; weekNumber <= totalWeeks; weekNumber++) {
            const weekStartDate = getDateOfWeek(weekNumber, year);
            const weekDates = getCurrentWeekDates(weekStartDate);
            const weekKey = `${weekNumber}-${year}`;

            const weekActivities = activities.filter(activity => activity.weekNumber === weekNumber && activity.year === year);

            const activitiesData = weekActivities.map(activity => {
              const dayData = {};
              weekDates.forEach((date, dayIndex) => {
                const dateKey = date.toISOString().split('T')[0];
                const positiveNotes = localStorage.getItem(`positiveNotes-${dateKey}`);
                const freeWriting = localStorage.getItem(`freeWriting-${dateKey}`);
                const decisions = localStorage.getItem(`decisions-${dateKey}`);
                dayData[dayIndex] = {
                  positiveNotes: positiveNotes ? JSON.parse(positiveNotes) : [],
                  freeWriting: freeWriting || '',
                  decisions: decisions || '',
                };
              });
              return { ...activity, dayData };
            });

            const achievements = localStorage.getItem(`achievements-${weekNumber}-${year}`)
              ? JSON.parse(localStorage.getItem(`achievements-${weekNumber}-${year}`)!)
              : [];

            allData[weekKey] = {
              activities: activitiesData,
              achievements,
            };
          }
        }

        const dataStr = JSON.stringify(allData, null, 2);
        const blob = new Blob([dataStr], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'all_data.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, [activities]);

      const handleImport = useCallback(() => {
        fileInputRef.current?.click();
      }, []);

      const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const fileContent = event.target?.result as string;
            const importedData = JSON.parse(fileContent);
            if (importedData && importedData.activities) {
              // Clear existing activities
              activities.forEach(activity => deleteActivity(activity.id));
              // Import new activities
              for (const weekKey in importedData.activities) {
                const weekData = importedData.activities[weekKey];
                const [weekNumber, year] = weekKey.split('-').map(Number);
                if (weekData.achievements) {
                  localStorage.setItem(`achievements-${weekNumber}-${year}`, JSON.stringify(weekData.achievements));
                }
                weekData.activities.forEach(activity => {
                  const { dayData, ...rest } = activity;
                  addActivity({ ...rest, weekNumber, year });
                  for (const dayIndex in dayData) {
                    const { positiveNotes, freeWriting, decisions } = dayData[dayIndex];
                    const date = weekDates[parseInt(dayIndex)].toISOString().split('T')[0];
                    if (positiveNotes) localStorage.setItem(`positiveNotes-${date}`, JSON.stringify(positiveNotes));
                    if (freeWriting) localStorage.setItem(`freeWriting-${date}`, freeWriting);
                    if (decisions) localStorage.setItem(`decisions-${date}`, decisions);
                  }
                });
              }
              alert('Data imported successfully!');
            } else {
              alert('Invalid data format. Please ensure the file contains an object with "activities".');
            }
          } catch (error) {
            console.error('Error parsing file:', error);
            alert('Error parsing file. Please ensure it is a valid text file.');
          }
        };
        reader.readAsText(file);
      }, [activities, addActivity, deleteActivity]);

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">نظرة عامة</h2>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md flex items-center gap-2"
              >
                <Download size={16} />
                تصدير
              </button>
              <button
                onClick={handleImport}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md flex items-center gap-2"
              >
                <Upload size={16} />
                استيراد
              </button>
              <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} accept="text/plain" />
            </div>
          </div>
          <WeekDisplay weekNumber={weekSelection.weekNumber} year={weekSelection.year} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CombinedAI
              activities={activities}
              onSuggestion={onSuggestion}
              weekSelection={weekSelection}
            />
            <PsychologicalAnalysis
              activities={activities}
              weekSelection={weekSelection}
            />
          </div>
          <ProgressView activities={activities.filter(activity =>
            activity.weekNumber === weekSelection.weekNumber &&
            activity.year === weekSelection.year
          )} />
        </div>
      );
    }
