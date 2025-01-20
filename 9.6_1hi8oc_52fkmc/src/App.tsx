import React, { useState, useEffect, useCallback, useMemo } from 'react';
    import { TabNavigation } from './components/TabNavigation';
    import { DomainGrid } from './components/DomainGrid';
    import { WeeklySchedule } from './components/WeeklySchedule';
    import { CombinedView } from './components/CombinedView';
    import { useTodos } from './hooks/useTodos';
    import { useWeekSelection } from './hooks/useWeekSelection';
    import { ActivityContext } from './context/ActivityContext';
    import { Evaluation } from './components/Evaluation';
    import { Financial } from './components/Financial';
    import { Writings } from './components/Writings';

    export default function App() {
      const [activeTab, setActiveTab] = useState<'domains' | 'weekly' | 'evaluation' | 'financial' | 'writings'>('weekly');
      const { 
        todos: activities, 
        addTodo: addActivity, 
        toggleTodo: toggleActivity,
        deleteTodo: deleteActivity,
        updateTodo: updateActivity 
      } = useTodos();
      const weekSelection = useWeekSelection();

      const createStars = useMemo(() => {
        return () => {
          const stars = [];
          for (let i = 0; i < 200; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 2;
            const z = Math.random() * 100; // Z-position for parallax
            const style = {
              top: `${y}vh`,
              left: `${x}vw`,
              width: `${size}px`,
              height: `${size}px`,
              transform: `translateZ(${z}px)`, // Apply Z-position
            };
            stars.push(<div key={i} className="star" style={style} />);
          }
          return stars;
        };
      }, []);

      const handleAddActivity = useCallback((activity: any) => {
        addActivity({
          ...activity,
          weekNumber: weekSelection.weekNumber,
          year: weekSelection.year
        });
      }, [addActivity, weekSelection]);

      useEffect(() => {
        setActiveTab('weekly');
      }, []);

      return (
        <ActivityContext.Provider value={{ activities, addActivity, toggleActivity, deleteActivity, updateActivity }}>
          <div className="min-h-screen bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-gray-100 relative">
            <div className="starfield">
              {createStars()}
            </div>
            <div className="container mx-auto px-4 py-4">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
              {activeTab === 'domains' && (
                <DomainGrid
                  activities={activities}
                  onAddActivity={handleAddActivity}
                  onEditActivity={updateActivity}
                  onDeleteActivity={deleteActivity}
                  weekSelection={weekSelection}
                />
              )}
              {activeTab === 'weekly' && (
                <WeeklySchedule
                  activities={activities}
                  onToggleReminder={(activityId, dayIndex) => {
                    const activity = activities.find(a => a.id === activityId);
                    if (activity) {
                      const days = activity.reminder?.days || [];
                      updateActivity(activityId, { 
                        reminder: { 
                          ...activity.reminder,
                          days: days.includes(dayIndex) 
                            ? days.filter(d => d !== dayIndex)
                            : [...days, dayIndex]
                        } 
                      });
                    }
                  }}
                  onEditActivity={updateActivity}
                  onDeleteActivity={deleteActivity}
                  weekSelection={weekSelection}
                />
              )}
              {activeTab === 'evaluation' && (
                <Evaluation activities={activities} />
              )}
              {activeTab === 'financial' && (
                <Financial />
              )}
              {activeTab === 'writings' && (
                <Writings />
              )}
            </div>
          </div>
        </ActivityContext.Provider>
      );
    }
