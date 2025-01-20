import React, { useCallback } from 'react';
    import { Plus, Minus, Check } from 'lucide-react';
    import { Activity } from '../types/activity';

    interface ActivityProgressProps {
      activity: Activity;
      onUpdate: (updates: Partial<Activity>) => void;
    }

    export function ActivityProgress({ activity, onUpdate }: ActivityProgressProps) {
      const handleIncrement = useCallback(() => {
        const currentCount = (activity.currentCount || 0) + 1;
        onUpdate({ 
          currentCount,
          completed: activity.targetCount ? currentCount >= activity.targetCount : true
        });
      }, [activity, onUpdate]);

      const handleDecrement = useCallback(() => {
        const currentCount = Math.max(0, (activity.currentCount || 0) - 1);
        onUpdate({ 
          currentCount,
          completed: activity.targetCount ? currentCount >= activity.targetCount : false
        });
      }, [activity, onUpdate]);

      const toggleCompleted = useCallback(() => {
        onUpdate({ completed: !activity.completed });
      }, [activity, onUpdate]);

      return (
        <div className="flex items-center gap-1 mt-1">
          {activity.targetCount ? (
            <>
              <button
                onClick={handleDecrement}
                className="p-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <Minus size={12} />
              </button>
              <span className="text-white/70 text-sm" dir="rtl">
                {activity.currentCount || 0} / {activity.targetCount}
              </span>
              <button
                onClick={handleIncrement}
                className="p-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <Plus size={12} />
              </button>
            </>
          ) : (
            <button
              onClick={toggleCompleted}
              className={`p-0.5 rounded-full ${
                activity.completed 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              <Check size={12} />
            </button>
          )}
        </div>
      );
    }
