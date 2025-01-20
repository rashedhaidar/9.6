import React, { useState, useMemo, useCallback } from 'react';
    import { Activity } from '../types/activity';
    import { Brain, Lightbulb, Target, Calendar } from 'lucide-react';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { LIFE_DOMAINS } from '../types/domains';
    import { generateTaskSuggestions } from '../utils/ai';
    import { analyzeActivityPatterns } from '../utils/aiAnalytics';

    interface CombinedAIProps {
      activities: Activity[];
      onSuggestion: (suggestion: Partial<Activity>) => void;
      weekSelection: ReturnType<typeof useWeekSelection>;
    }

    export function CombinedAI({ activities, onSuggestion, weekSelection }: CombinedAIProps) {
      const [selectedDomain, setSelectedDomain] = useState('');
      const filteredActivities = useMemo(() => activities.filter(activity =>
        activity.weekNumber === weekSelection.weekNumber &&
        activity.year === weekSelection.year
      ), [activities, weekSelection.weekNumber, weekSelection.year]);
      const analysis = useMemo(() => analyzeActivityPatterns(filteredActivities), [filteredActivities]);
      const allSuggestions = useMemo(() => generateTaskSuggestions(activities.map(a => a.title)), [activities]);

      const suggestionsByDomain = useMemo(() => LIFE_DOMAINS.reduce((acc, domain) => {
        acc[domain.id] = allSuggestions
          .filter(suggestion => suggestion.includes(domain.name.split(' ')[0]))
          .slice(0, 5);
        return acc;
      }, {} as Record<string, string[]>), [allSuggestions]);

      return (
        <div className="bg-amber-900/20 p-6 rounded-lg border border-amber-400/20">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="text-amber-400" size={24} />
            <h2 className="text-xl font-medium text-amber-400">اقتراحات ذكية</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="text-amber-400" />
              <span className="text-amber-400">معدل الإنجاز: {analysis.completionRate.toFixed(1)}%</span>
            </div>
            <p className="text-amber-400/70">{analysis.suggestions.join('، ')}</p>
            <div className="flex items-center gap-2 mt-4">
              <Calendar className="text-amber-400" />
              <span className="text-amber-400">أفضل أداء: {analysis.mostProductiveDay} في {analysis.mostProductiveTime}</span>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Lightbulb className="text-amber-400" />
              <span className="text-amber-400">مجالات التركيز: {analysis.focusedDomains.join(', ')}</span>
            </div>
            {Object.entries(suggestionsByDomain).map(([domainId, suggestions]) => (
              <div key={domainId} className="mt-4">
                <h4 className="text-amber-400 font-medium mb-2">
                  {LIFE_DOMAINS.find(d => d.id === domainId)?.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onSuggestion({ title: suggestion })}
                      className="px-3 py-1.5 bg-black/50 text-amber-400 rounded-full text-sm hover:bg-amber-900/30 transition-colors border border-amber-400/20"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
