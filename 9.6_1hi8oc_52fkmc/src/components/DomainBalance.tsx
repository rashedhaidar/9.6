import React, { useMemo } from 'react';
    import { Activity } from '../types/activity';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { LIFE_DOMAINS } from '../types/domains';

    interface DomainBalanceProps {
      activities: Activity[];
      weekSelection: ReturnType<typeof useWeekSelection>;
    }

    export function DomainBalance({ activities, weekSelection }: DomainBalanceProps) {
      const { weekNumber, year } = weekSelection;

      const domainActivityCounts = useMemo(() => {
        return activities.filter(activity => activity.weekNumber === weekNumber && activity.year === year).reduce((acc, activity) => {
          acc[activity.domainId] = (acc[activity.domainId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      }, [activities, weekNumber, year]);

      const totalActivities = useMemo(() => Object.values(domainActivityCounts).reduce((acc, count) => acc + count, 0), [domainActivityCounts]);

      const domainPercentages = useMemo(() => {
        return Object.entries(domainActivityCounts).reduce((acc, [domainId, count]) => {
          acc[domainId] = totalActivities > 0 ? (count / totalActivities) * 100 : 0;
          return acc;
        }, {} as Record<string, number>);
      }, [domainActivityCounts, totalActivities]);

      const maxPercentage = useMemo(() => {
        return Math.max(...Object.values(domainPercentages));
      }, [domainPercentages]);

      return (
        <div className="bg-black/20 p-4 rounded-lg">
          <h3 className="text-white font-medium mb-4">مؤشر التوازن بين المجالات</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {LIFE_DOMAINS.map(domain => {
              const percentage = domainPercentages[domain.id] || 0;
              const isMax = percentage === maxPercentage && maxPercentage > 0;
              const radius = 45;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (circumference * percentage / 100);
              const strokeColor = domain.id === 'educational' ? '#34D399' :
                                  domain.id === 'health' ? '#F472B6' :
                                  domain.id === 'financial' ? '#F59E0B' :
                                  domain.color;
              return (
                <div key={domain.id} className="flex flex-col items-center">
                  <div className="relative w-16 h-16">
                    <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r={radius} fill="none" stroke="#ffffff" strokeWidth="5" strokeOpacity="0.2" />
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-bold">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <span className={`text-sm mt-2 ${isMax ? 'text-amber-400' : 'text-white/70'}`}>{domain.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
