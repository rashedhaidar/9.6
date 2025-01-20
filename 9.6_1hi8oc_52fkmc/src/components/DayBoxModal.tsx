import React, { useState, useEffect } from 'react';
    import { X } from 'lucide-react';
    import { formatDate } from '../utils/dateUtils';
    import { DAYS } from '../constants/days';

    interface DayBoxModalProps {
      dateKey: string;
      onClose: () => void;
      weekNumber: number;
      year: number;
      date: Date;
    }

    export function DayBoxModal({ dateKey, onClose, weekNumber, year, date }: DayBoxModalProps) {
      const [positiveNotes, setPositiveNotes] = useState<string[]>(() => {
        const savedNotes = localStorage.getItem(`positiveNotes-${dateKey}`);
        return savedNotes ? JSON.parse(savedNotes) : ['', '', '', '', ''];
      });
      const [freeWriting, setFreeWriting] = useState<string>(() => {
        return localStorage.getItem(`freeWriting-${dateKey}`) || '';
      });
      const [decisions, setDecisions] = useState<string>(() => {
        return localStorage.getItem(`decisions-${dateKey}`) || '';
      });

      useEffect(() => {
        localStorage.setItem(`positiveNotes-${dateKey}`, JSON.stringify(positiveNotes));
      }, [positiveNotes, dateKey]);

      useEffect(() => {
        localStorage.setItem(`freeWriting-${dateKey}`, freeWriting);
      }, [freeWriting, dateKey]);

      useEffect(() => {
        localStorage.setItem(`decisions-${dateKey}`, decisions);
      }, [decisions, dateKey]);

      const handlePositiveNoteChange = (index: number, value: string) => {
        const newNotes = [...positiveNotes];
        newNotes[index] = value;
        setPositiveNotes(newNotes);
      };

      const handleFreeWritingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFreeWriting(e.target.value);
      };

      const handleDecisionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDecisions(e.target.value);
      };

      const handleSave = () => {
        localStorage.setItem(`positiveNotes-${dateKey}`, JSON.stringify(positiveNotes));
        localStorage.setItem(`freeWriting-${dateKey}`, freeWriting);
        localStorage.setItem(`decisions-${dateKey}`, decisions);
        onClose();
      };

      const dayName = DAYS[date.getDay()];

      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 p-6 rounded-lg w-full max-w-sm max-h-screen overflow-y-auto" style={{ direction: 'rtl' }}>
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-white/70 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {dayName} - {formatDate(date)} - الأسبوع {weekNumber} - {year}
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-md hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 font-medium"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      );
    }
