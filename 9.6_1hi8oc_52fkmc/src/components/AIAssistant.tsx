import React, { useState, useCallback, useMemo } from 'react';
    import { Activity } from '../types/activity';
    import { Brain, Lightbulb, Target } from 'lucide-react';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { LIFE_DOMAINS } from '../types/domains';
    import { generateTaskSuggestions } from '../utils/ai';

    interface AIAssistantProps {
      activities: Activity[];
      onSuggestion: (suggestion: Partial<Activity>) => void;
      weekSelection: ReturnType<typeof useWeekSelection>;
    }

    export function AIAssistant({ activities, onSuggestion, weekSelection }: AIAssistantProps) {
      const [selectedDomain, setSelectedDomain] = useState('');

      const generateSuggestions = useCallback(() => {
        const suggestions = [
          {
            title: 'قراءة كتاب جديد',
            domainId: 'educational',
            description: 'قراءة كتاب في مجال التطوير الذاتي',
            targetCount: 1
          },
          {
            title: 'ممارسة الرياضة',
            domainId: 'health',
            description: 'تمارين رياضية لمدة 30 دقيقة',
            targetCount: 3
          },
          {
            title: 'مراجعة البريد الإلكتروني',
            domainId: 'professional',
            description: 'الرد على الرسائل الهامة',
          },
          {
            title: 'التواصل مع الأصدقاء',
            domainId: 'social',
            description: 'قضاء وقت ممتع مع الأصدقاء',
          },
          {
            title: 'تخصيص وقت للتأمل',
            domainId: 'spiritual',
            description: 'تأمل لمدة 15 دقيقة',
          },
          {
            title: 'التخطيط لوجبات صحية',
            domainId: 'health',
            description: 'تحضير قائمة وجبات صحية للأسبوع',
          },
          {
            title: 'تنظيم مساحة العمل',
            domainId: 'personal',
            description: 'ترتيب وتنظيم المكتب أو مساحة العمل',
          },
          {
            title: 'البحث عن دورة تدريبية',
            domainId: 'educational',
            description: 'البحث عن دورة لتطوير مهاراتك',
          }
        ];

        return suggestions.filter(s => !selectedDomain || s.domainId === selectedDomain);
      }, [selectedDomain]);

      const suggestions = useMemo(() => generateSuggestions(), [generateSuggestions]);

      return (
        <div className="bg-amber-900/20 p-6 rounded-lg border border-amber-400/20">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="text-amber-400" size={24} />
            <h2 className="text-xl font-medium text-amber-400">اقتراحات ذكية</h2>
          </div>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 bg-black/30 rounded-lg border border-amber-400/20 hover:border-amber-400/40 transition-colors cursor-pointer"
                onClick={() => onSuggestion(suggestion)}
              >
                <h3 className="text-amber-400 font-medium mb-2">{suggestion.title}</h3>
                <p className="text-amber-400/70 text-sm">{suggestion.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
