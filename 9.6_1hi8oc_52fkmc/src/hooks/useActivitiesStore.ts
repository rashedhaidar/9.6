import { create } from 'zustand';
    import { persist } from 'zustand/middleware';
    import { Activity } from '../types/activity';
    import { classifyActivity } from '../utils/activityClassifier';

    interface ActivitiesState {
      activities: Record<string, Activity[]>; // Key: 'weekNumber-year'
      addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'domainId'>) => void;
      updateActivity: (id: string, updates: Partial<Activity>) => void;
      deleteActivity: (id: string) => void;
      getActivitiesByWeek: (weekNumber: number, year: number) => Activity[];
    }

    export const useActivitiesStore = create<ActivitiesState>()(
      persist(
        (set, get) => ({
          activities: {},

          addActivity: (activity) => {
            const now = new Date();
            const weekKey = `${activity.weekNumber}-${activity.year}`;
            const domainId = classifyActivity(activity.title, activity.description || '');

            const newActivity: Activity = {
              ...activity,
              id: crypto.randomUUID(),
              createdAt: now.toISOString(),
              domainId,
            };

            set((state) => ({
              activities: {
                ...state.activities,
                [weekKey]: [...(state.activities[weekKey] || []), newActivity],
              },
            }));
          },

          updateActivity: (id, updates) => {
            set((state) => {
              const newActivities = { ...state.activities };

              // Find and update the activity in the correct week
              Object.keys(newActivities).forEach((weekKey) => {
                newActivities[weekKey] = newActivities[weekKey].map((activity) => {
                  if (activity.id !== id) return activity;

                  // Preserve original domainId if not explicitly changed
                  const updatedActivity = { ...activity, ...updates };
                  
                  return updatedActivity;
                });
              });

              return { activities: newActivities };
            });
          },

          deleteActivity: (id) => {
            set((state) => {
              const newActivities = { ...state.activities };
              Object.keys(newActivities).forEach((weekKey) => {
                newActivities[weekKey] = newActivities[weekKey].filter(
                  (activity) => activity.id !== id
                );
              });
              return { activities: newActivities };
            });
          },

          getActivitiesByWeek: (weekNumber, year) => {
            const weekKey = `${weekNumber}-${year}`;
            return get().activities[weekKey] || [];
          },
        }),
        {
          name: 'activities-storage',
        }
      )
    );
