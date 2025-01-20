import { useState, useEffect } from 'react';
    import { Activity } from '../types/activity';
    import { classifyActivity } from '../utils/activityClassifier';

    export function useActivities() {
      const [activities, setActivities] = useState<Activity[]>(() => {
        const saved = localStorage.getItem('activities');
        return saved ? JSON.parse(saved) : [];
      });

      useEffect(() => {
        localStorage.setItem('activities', JSON.stringify(activities));
      }, [activities]);

      const addActivity = (activity: Omit<Activity, 'id' | 'createdAt' | 'domainId'>) => {
        const domainId = activity.domainId || classifyActivity(activity.title, activity.description || '');
        const now = new Date();
        
        const newActivity: Activity = {
          ...activity,
          id: crypto.randomUUID(),
          createdAt: now.toISOString(),
          domainId,
          completed: false,
          currentCount: 0
        };
        
        setActivities(prev => [...prev, newActivity]);
        return newActivity;
      };

      const updateActivity = (id: string, updates: Partial<Activity>) => {
        setActivities(prev =>
          prev.map(activity => {
            if (activity.id !== id) return activity;
            return { ...activity, ...updates };
          })
        );
      };

      const deleteActivity = (id: string) => {
        setActivities(prev => prev.filter(activity => activity.id !== id));
      };

      const getActivitiesByWeek = (weekNumber: number, year: number) => {
        return activities.filter(activity => 
          activity.weekNumber === weekNumber && 
          activity.year === year
        );
      };

      const getActivitiesByDomain = (domainId: string, weekNumber: number, year: number) => {
        return activities.filter(activity => 
          activity.domainId === domainId &&
          activity.weekNumber === weekNumber &&
          activity.year === year
        );
      };

      return {
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        getActivitiesByWeek,
        getActivitiesByDomain
      };
    }
