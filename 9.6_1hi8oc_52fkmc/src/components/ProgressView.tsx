import React from 'react';
    import { Activity } from '../types/activity';
    import { LIFE_DOMAINS } from '../types/domains';
    import { BarChart, Target, CheckCircle } from 'lucide-react';

    interface ProgressViewProps {
      activities: Activity[];
      useMainCheckbox?: boolean;
    }

    export function ProgressView({ activities, useMainCheckbox = false }: ProgressViewProps) {
      const calculateDomainProgress = (domainId: string) => {
        const domainActivities = activities.filter(a => a.domainId === domainId);
        if (domainActivities.length === 0) return 0;

        let totalCount = 0;
        let completedCount = 0;

        domainActivities.forEach(activity => {
          totalCount += activity.selectedDays.length; // Count each day the activity is scheduled
          completedCount += activity.selectedDays.filter(dayIndex => activity.completedDays && activity.completedDays[dayIndex]).length; // Count completed days
        });

        return Math.round((completedCount / totalCount) * 100);
      };

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {LIFE_DOMAINS.map(domain => {
              const progress = calculateDomainProgress(domain.id);
              const DomainIcon = domain.icon;
              return (
                <div
                  key={domain.id}
                  className={`p-2 rounded-lg bg-${domain.color}-100/10 border border-${domain.color}-400/20 flex flex-col items-center`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <DomainIcon size={16} className={`text-${domain.color}-400`} />
                    <h3 className={`text-sm font-medium text-${domain.color}-400`}>{domain.name}</h3>
                  </div>
                  <div className="relative h-1 bg-black/30 rounded-full overflow-hidden w-full">
                    <div
                      className={`absolute top-0 left-0 h-full bg-${domain.color}-400 transition-all`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-white/70">
                    {progress}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
