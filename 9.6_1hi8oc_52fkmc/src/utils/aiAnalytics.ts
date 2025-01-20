import { Activity } from '../types/activity';
    import { LIFE_DOMAINS } from '../types/domains';

    export interface ActivityPattern {
      mostProductiveDay: string;
      mostProductiveTime: string;
      completionRate: number;
      streakDays: number;
      focusedDomains: string[];
      suggestions: string[];
      timeDistribution: Record<string, number>;
      activityTypeDistribution: Record<string, number>;
    }

    export function analyzeActivityPatterns(activities: Activity[]): ActivityPattern {
      const completedActivities = activities.filter(a => a.completed);
      const completionRate = activities.length > 0 
        ? (completedActivities.length / activities.length) * 100 
        : 0;

      // Analyze domain focus
      const domainCounts = activities.reduce((acc, activity) => {
        acc[activity.domainId] = (acc[activity.domainId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const focusedDomains = Object.entries(domainCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([domainId]) => {
          const domain = LIFE_DOMAINS.find(d => d.id === domainId);
          return domain?.name || domainId;
        });

      // Analyze time distribution
      const timeDistribution = calculateTimeDistribution(activities);

      // Analyze activity type distribution
      const activityTypeDistribution = calculateActivityTypeDistribution(activities);

      // Generate personalized suggestions
      const suggestions = generateSmartSuggestions(activities, completionRate, focusedDomains, timeDistribution, activityTypeDistribution);

      return {
        mostProductiveDay: calculateMostProductiveDay(activities),
        mostProductiveTime: calculateMostProductiveTime(activities),
        completionRate,
        streakDays: calculateCurrentStreak(activities),
        focusedDomains,
        suggestions,
        timeDistribution,
        activityTypeDistribution
      };
    }

    function calculateMostProductiveDay(activities: Activity[]): string {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayCompletions = new Array(7).fill(0);
      
      activities.forEach(activity => {
        if (activity.completed) {
          const date = new Date(activity.createdAt);
          dayCompletions[date.getDay()]++;
        }
      });

      const maxDay = dayCompletions.indexOf(Math.max(...dayCompletions));
      return days[maxDay];
    }

    function calculateMostProductiveTime(activities: Activity[]): string {
      const completedActivities = activities.filter(a => a.completed);
      const timeSlots = {
        morning: 0,
        afternoon: 0,
        evening: 0
      };

      completedActivities.forEach(activity => {
        const date = new Date(activity.createdAt);
        const hour = date.getHours();
        
        if (hour < 12) timeSlots.morning++;
        else if (hour < 17) timeSlots.afternoon++;
        else timeSlots.evening++;
      });

      const maxTime = Object.entries(timeSlots).reduce((a, b) => 
        b[1] > a[1] ? b : a
      )[0];

      return maxTime.charAt(0).toUpperCase() + maxTime.slice(1);
    }

    function calculateTimeDistribution(activities: Activity[]): Record<string, number> {
      const timeSlots = {
        morning: 0,
        afternoon: 0,
        evening: 0
      };

      activities.forEach(activity => {
        const date = new Date(activity.createdAt);
        const hour = date.getHours();
        
        if (hour < 12) timeSlots.morning++;
        else if (hour < 17) timeSlots.afternoon++;
        else timeSlots.evening++;
      });

      return timeSlots;
    }

    function calculateActivityTypeDistribution(activities: Activity[]): Record<string, number> {
      const activityTypes = {};
      activities.forEach(activity => {
        const type = activity.title.split(' ')[0].toLowerCase();
        activityTypes[type] = (activityTypes[type] || 0) + 1;
      });
      return activityTypes;
    }

    function calculateCurrentStreak(activities: Activity[]): number {
      let streak = 0;
      const today = new Date();
      let currentDate = new Date(today);

      while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const hasCompletedActivity = activities.some(activity => 
          activity.completed && 
          activity.createdAt.startsWith(dateStr)
        );

        if (!hasCompletedActivity) break;
        
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }

      return streak;
    }

    function generateSmartSuggestions(
      activities: Activity[], 
      completionRate: number,
      focusedDomains: string[],
      timeDistribution: Record<string, number>,
      activityTypeDistribution: Record<string, number>
    ): string[] {
      const suggestions: string[] = [];

      // Completion rate based suggestions
      if (completionRate < 50) {
        suggestions.push('حاول تقسيم المهام إلى خطوات أصغر لتسهيل الإنجاز.');
        suggestions.push('خصص أوقاتًا محددة للعمل على الأنشطة والتزم بها.');
        suggestions.push('استخدم تقنيات إدارة الوقت مثل تقنية بومودورو لزيادة التركيز.');
      } else if (completionRate > 80) {
        suggestions.push('أداء ممتاز! حاول زيادة مستوى التحدي في الأنشطة.');
        suggestions.push('شارك استراتيجيات نجاحك مع الآخرين لتحفيزهم.');
        suggestions.push('استكشف مجالات جديدة لتطوير مهاراتك.');
      }

      // Domain balance suggestions
      const allDomains = LIFE_DOMAINS.map(d => d.name);
      const neglectedDomains = allDomains.filter(d => !focusedDomains.includes(d));
      
      if (neglectedDomains.length > 0) {
        suggestions.push(`حاول إضافة أنشطة في المجالات التالية: ${neglectedDomains.join(', ')}.`);
        suggestions.push('خصص وقتًا متساويًا لكل مجال لتحقيق التوازن.');
      }

      // Time distribution suggestions
      const maxTime = Object.entries(timeDistribution).reduce((a, b) => 
        b[1] > a[1] ? b : a
      )[0];

      if (maxTime === 'morning') {
        suggestions.push('أنت أكثر إنتاجية في الصباح، حاول استغلال هذه الفترة لإنجاز المهام الصعبة.');
        suggestions.push('ابدأ يومك بالمهام الأكثر أهمية لزيادة الإنتاجية.');
      } else if (maxTime === 'afternoon') {
        suggestions.push('فترة الظهيرة هي الأنسب لك، حاول التركيز على الأنشطة التي تتطلب تركيزًا أقل في الصباح.');
        suggestions.push('استغل فترة الظهيرة لإنجاز المهام الروتينية.');
      } else {
        suggestions.push('أنت أكثر إنتاجية في المساء، حاول استغلال هذه الفترة لإنجاز المهام التي تتطلب إبداعًا.');
        suggestions.push('خصص وقتًا للاسترخاء قبل البدء في مهام المساء.');
      }

      // Activity type suggestions
      const mostFrequentActivityType = Object.entries(activityTypeDistribution).reduce((a, b) => 
        b[1] > a[1] ? b : a
      , ['',''])[0];

      if (mostFrequentActivityType) {
        suggestions.push(`حاول تنويع أنواع الأنشطة التي تقوم بها، فقد تكون هناك مجالات أخرى تستحق الاستكشاف.`);
      }

      return suggestions;
    }
