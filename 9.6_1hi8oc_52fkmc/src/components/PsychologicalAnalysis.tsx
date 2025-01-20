import React from 'react';
    import { Activity } from '../types/activity';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { analyzeActivityPatterns } from '../utils/aiAnalytics';
    import { makeLinksClickable } from '../utils/linkUtils';

    interface PsychologicalAnalysisProps {
      activities: Activity[];
      weekSelection: ReturnType<typeof useWeekSelection>;
    }

    export function PsychologicalAnalysis({ activities, weekSelection }: PsychologicalAnalysisProps) {
      const filteredActivities = activities.filter(activity =>
        activity.weekNumber === weekSelection.weekNumber &&
        activity.year === weekSelection.year
      );
      const analysis = analyzeActivityPatterns(filteredActivities);

      return (
        <div className="space-y-4">
          <h4 className="text-white font-medium">نقاط القوة</h4>
          <ul className="list-disc list-inside text-white/70" dir="rtl">
            {analysis.focusedDomains.length > 0 && (
              <li dangerouslySetInnerHTML={{ __html: makeLinksClickable(`لديك تركيز جيد في المجالات التالية: ${analysis.focusedDomains.join(', ')}`) }} />
            )}
            {analysis.completionRate > 80 && (
              <li dangerouslySetInnerHTML={{ __html: makeLinksClickable('لديك معدل إنجاز مرتفع، وهذا يدل على التزامك وتنظيمك الجيد.') }} />
            )}
            {analysis.streakDays > 0 && (
              <li dangerouslySetInnerHTML={{ __html: makeLinksClickable('لديك سلسلة إنجاز مستمرة، وهذا يدل على استمرارك في تحقيق أهدافك.') }} />
            )}
          </ul>

          <h4 className="text-white font-medium mt-4">نقاط الضعف</h4>
          <ul className="list-disc list-inside text-white/70" dir="rtl">
            {analysis.completionRate < 50 && (
              <li dangerouslySetInnerHTML={{ __html: makeLinksClickable('معدل الإنجاز منخفض، قد تحتاج إلى تقسيم المهام إلى أجزاء أصغر أو تحديد أوقات محددة للعمل.') }} />
            )}
            {analysis.focusedDomains.length < 8 && (
              <li dangerouslySetInnerHTML={{ __html: makeLinksClickable('قد تحتاج إلى إضافة أنشطة في مجالات أخرى لتحقيق توازن أكبر في حياتك.') }} />
            )}
          </ul>

          <h4 className="text-white font-medium mt-4">برنامج للحل</h4>
          <ul className="list-disc list-inside text-white/70" dir="rtl">
            {analysis.completionRate < 50 && (
              <>
                <li dangerouslySetInnerHTML={{ __html: makeLinksClickable('حاول تقسيم المهام الكبيرة إلى مهام أصغر وأكثر قابلية للإنجاز.') }} />
                <li dangerouslySetInnerHTML={{ __html: makeLinksClickable('حدد أوقاتًا محددة للعمل على الأنشطة والتزم بها.') }} />
              </>
            )}
            {analysis.focusedDomains.length < 8 && (
              <li dangerouslySetInnerHTML={{ __html: makeLinksClickable('قم بتحديد أنشطة في المجالات التي لم يتم التركيز عليها بشكل كافٍ.') }} />
            )}
            <li dangerouslySetInnerHTML={{ __html: makeLinksClickable('استمر في تتبع تقدمك وحاول تحسينه بشكل مستمر.') }} />
          </ul>
        </div>
      );
    }
