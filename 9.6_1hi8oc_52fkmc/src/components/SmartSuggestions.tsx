import { useState, useMemo } from 'react';
    import { Sparkles } from 'lucide-react';
    import { generateTaskSuggestions } from '../utils/ai';
    import { Activity } from '../types/activity';

    interface SmartSuggestionsProps {
      existingTasks: string[];
      onSelectSuggestion: (suggestion: string) => void;
    }

    export function SmartSuggestions({ existingTasks, onSelectSuggestion }: SmartSuggestionsProps) {
      const [suggestions] = useState(() => generateTaskSuggestions(existingTasks));

      if (suggestions.length === 0) return null;

      return (
        <div className="mb-6 p-4 bg-amber-900/20 rounded-lg border border-amber-400/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-amber-400" size={20} />
            <h3 className="text-amber-400 font-medium">اقتراحات ذكية</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSelectSuggestion(suggestion)}
                className="px-3 py-1.5 bg-black/50 text-amber-400 rounded-full text-sm hover:bg-amber-900/30 transition-colors border border-amber-400/20"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      );
    }
