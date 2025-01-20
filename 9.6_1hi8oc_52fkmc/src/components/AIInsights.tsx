import React, { useMemo } from 'react';
    import { Brain, TrendingUp, Award, Calendar } from 'lucide-react';
    import { analyzeActivityPatterns } from '../utils/aiAnalytics';
    import { Activity } from '../types/activity';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { DAYS } from '../constants/days';

    interface AIInsightsProps {
      activities: Activity[];
      weekSelection: ReturnType<typeof useWeekSelection>;
    }

    export function AIInsights({ activities, weekSelection }: AIInsightsProps) {
      const { weekNumber, year } = weekSelection;
      const filteredActivities = useMemo(() => activities.filter(activity =>
        activity.weekNumber === weekNumber &&
        activity.year === year
      ), [activities, weekNumber, year]);

      const calculateCompletionRate = () => {
        const totalActivities = filteredActivities.length;
        if (totalActivities === 0) return 0;

        let completedCount = 0;
        filteredActivities.forEach(activity => {
          const completedDays = activity.completedDays || {};
          if (Object.keys(completedDays).length > 0 && Object.values(completedDays).every(Boolean)) {
            completedCount++;
          }
        });
        return Math.round((completedCount / totalActivities) * 100);
      };

      const completionRate = calculateCompletionRate();

      const analysis = useMemo(() => analyzeActivityPatterns(filteredActivities), [filteredActivities]);

      return (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="text-purple-400" size={24} />
              <h2 className="text-xl font-medium text-purple-400">تحليلات الأداء</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-purple-400" size={20} />
                  <h3 className="text-purple-400">معدل الإنجاز</h3>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  {completionRate}%
                </p>
              </div>

              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="text-purple-400" size={20} />
                  <h3 className="text-purple-400">سلسلة الإنجاز الحالية</h3>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  {analysis.streakDays} أيام
                </p>
              </div>

              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-purple-400" size={20} />
                  <h3 className="text-purple-400">أفضل أداء</h3>
                </div>
                <p className="text-purple-400">
                  {analysis.mostProductiveDay}s في {analysis.mostProductiveTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
