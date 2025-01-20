import React, { useState, useContext, useCallback, useMemo } from 'react';
    import { Plus, X } from 'lucide-react';
    import { LIFE_DOMAINS } from '../types/domains';
    import { Activity } from '../types/activity';
    import { ActivityCard } from './ActivityCard';
    import { WeekSelector } from './WeekSelector';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { ActivityForm } from './ActivityForm';
    import { ActivityContext } from '../context/ActivityContext';
    import { Check, AlertTriangle, X as XIcon } from 'lucide-react';
    import { SmartSuggestions } from './SmartSuggestions';
    import { DomainBalance } from './DomainBalance';

    interface DomainGridProps {
      activities: Activity[];
      onAddActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
      onEditActivity: (id: string, updates: Partial<Activity>) => void;
      onDeleteActivity: (id: string) => void;
      weekSelection: ReturnType<typeof useWeekSelection>;
    }

    export function DomainGrid({ 
      activities, 
      onAddActivity, 
      onEditActivity, 
      onDeleteActivity,
      weekSelection
    }: DomainGridProps) {
      const { selectedDate, weekNumber, year, changeWeek } = weekSelection;
      const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
      const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
      const { updateActivity } = useContext(ActivityContext);

      const getActivitiesByDomain = useCallback((domainId: string) => 
        activities.filter(activity => 
          activity.domainId === domainId && 
          activity.weekNumber === weekNumber &&
          activity.year === year
        ), [activities, weekNumber, year]);

      const handleAddActivity = useCallback((activity: Omit<Activity, 'id' | 'createdAt'>) => {
        if (selectedDomain) {
          onAddActivity({
            ...activity,
            domainId: selectedDomain,
            weekNumber,
            year
          });
          setSelectedDomain(null);
        }
      }, [selectedDomain, onAddActivity, weekNumber, year]);

      const domainColors = useMemo(() => ({
        'professional': 'text-amber-100',
        'educational': 'text-amber-300',
        'health': 'text-green-400',
        'family': 'text-red-400',
        'social': 'text-orange-400',
        'financial': 'text-green-700',
        'personal': 'text-sky-400',
        'spiritual': 'text-teal-400',
      }), []);

      const handleSelectSuggestion = useCallback((suggestion: string) => {
        if (selectedDomain) {
          onAddActivity({
            title: suggestion,
            domainId: selectedDomain,
            weekNumber,
            year
          });
          setSelectedDomain(null);
        }
      }, [selectedDomain, onAddActivity, weekNumber, year]);

      return (
        <div className="space-y-6" dir="rtl">
          <WeekSelector 
            currentDate={selectedDate}
            onWeekChange={changeWeek}
          />
          {selectedDomain && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 p-6 rounded-lg w-full max-w-2xl relative">
                <button
                  onClick={() => setSelectedDomain(null)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white"
                >
                  <X size={24} />
                </button>
                <h2 className="text-2xl font-bold text-white mb-4 text-right">
                  {LIFE_DOMAINS.find(d => d.id === selectedDomain)?.name} إضافة نشاط في مجال
                </h2>
                <ActivityForm
                  onSubmit={handleAddActivity}
                  initialDomainId={selectedDomain}
                  hideDomainsSelect
                  weekNumber={weekNumber}
                  year={year}
                />
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {LIFE_DOMAINS.map(domain => {
                    const DomainIcon = domain.icon;
                    const domainActivities = getActivitiesByDomain(domain.id);
                    const plannedCount = useMemo(() => domainActivities.reduce((acc, activity) => acc + activity.selectedDays.length, 0), [domainActivities]);
                    const completedCount = useMemo(() => domainActivities.reduce((acc, activity) => acc + activity.selectedDays.filter(dayIndex => activity.completedDays && activity.completedDays[dayIndex]).length, 0), [domainActivities]);
                    return (
                      <th key={domain.id} 
                        className={`p-4 text-white border border-white/20 ${hoveredDomain !== null && domain.id !== hoveredDomain && selectedDomain === null ? 'opacity-50 blur-sm' : ''}`}
                        onMouseEnter={() => setHoveredDomain(domain.id)}
                        onMouseLeave={() => setHoveredDomain(null)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedDomain(domain.id)}
                            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                          <div className="flex items-center gap-2 text-center">
                            <span className={`text-center text-sm ${domainColors[domain.id] || 'text-white'}`}>{domain.name}</span>
                            <DomainIcon size={18} className={`${domainColors[domain.id] || 'text-white'}`} />
                            </div>
                            <span className="text-white text-xs ml-2">({plannedCount}/{completedCount})</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {LIFE_DOMAINS.map(domain => {
                    const domainActivities = getActivitiesByDomain(domain.id);
                    return (
                      <td key={domain.id} 
                        className={`p-4 border border-white/20 align-top bg-gradient-to-br from-purple-500/5 to-pink-500/5
                        ${hoveredDomain !== null && domain.id !== hoveredDomain && selectedDomain === null ? 'opacity-50 blur-sm' : ''}`}
                        onMouseEnter={() => setHoveredDomain(domain.id)}
                        onMouseLeave={() => setHoveredDomain(null)}
                      >
                        <div className="space-y-3 min-h-[200px]">
                          {domainActivities.map(activity => {
                            const completedDaysCount = activity.selectedDays.filter(dayIndex => activity.completedDays && activity.completedDays[dayIndex]).length;
                            const totalDays = activity.selectedDays.length;
                            let statusIcon = null;
                            if (completedDaysCount === totalDays) {
                              statusIcon = <Check size={14} className="text-green-500" />;
                            } else if (completedDaysCount > 0) {
                              statusIcon = <AlertTriangle size={14} className="text-amber-500" />;
                            } else {
                              statusIcon = <XIcon size={14} className="text-red-500" />;
                            }
                            return (
                              <div key={activity.id} className="flex items-center justify-between">
                                <ActivityCard
                                  activity={activity}
                                  onEdit={onEditActivity}
                                  onDelete={onDeleteActivity}
                                />
                                {statusIcon}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-center">
            <DomainBalance activities={activities} weekSelection={weekSelection} />
          </div>
          <div className="flex justify-center mt-4 items-center gap-2">
            <img
              src="https://i.ibb.co/MGwXWBd/image.png"
              alt="Mohammad Hussein Farhat Logo"
              className="h-8 w-auto"
            />
            <p className="text-white text-sm font-mono">تصميم وتطوير: محمد حسين علي فرحات</p>
          </div>
          {selectedDomain && (
            <SmartSuggestions
              existingTasks={activities.map(a => a.title)}
              onSelectSuggestion={handleSelectSuggestion}
            />
          )}
        </div>
      );
    }
