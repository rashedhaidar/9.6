import React from 'react';
    import { Activity } from '../types/activity';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { DAYS } from '../constants/days';
    import { BarChart } from 'lucide-react';

    interface DomainChartProps {
      activities: Activity[];
      weekSelection: ReturnType<typeof useWeekSelection>;
    }

    export function DomainChart({ activities, weekSelection }: DomainChartProps) {
      const { weekNumber, year } = weekSelection;

      const domainActivityCounts = activities.reduce((acc, activity) => {
        if (activity.weekNumber === weekNumber && activity.year === year) {
          acc[activity.domainId] = acc[activity.domainId] || new Array(7).fill(0);
          if (activity.completed) {
            activity.selectedDays?.forEach(dayIndex => {
              acc[activity.domainId][dayIndex]++;
            });
          }
        }
        return acc;
      }, {} as Record<string, number[]>);

      return (
        <div className="space-y-4">
          {Object.entries(domainActivityCounts).map(([domainId, counts]) => (
            <div key={domainId} className="bg-black/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart size={20} className="text-white" />
                <h4 className="text-white font-medium">{domainId}</h4>
              </div>
              <div className="flex items-end gap-1">
                {counts.map((count, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="bg-white/20 rounded-t-md"
                      style={{ height: `${count * 10}px`, width: '10px' }}
                    />
                    <span className="text-xs text-white/70">{DAYS[index][0]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
