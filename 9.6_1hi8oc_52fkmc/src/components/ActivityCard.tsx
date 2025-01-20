import React, { useState, useCallback, useMemo } from 'react';
    import { Edit2, Trash2, Check, X, Bell } from 'lucide-react';
    import { Activity } from '../types/activity';
    import { LIFE_DOMAINS } from '../types/domains';
    import { ActivityProgress } from './ActivityProgress';
    import { makeLinksClickable } from '../utils/linkUtils';

    interface ActivityCardProps {
      activity: Activity;
      onEdit: (id: string, updates: Partial<Activity>) => void;
      onDelete: (id: string) => void;
    }

    export function ActivityCard({ activity, onEdit, onDelete }: ActivityCardProps) {
      const [isEditing, setIsEditing] = useState(false);
      const [editedTitle, setEditedTitle] = useState(activity.title);
      const [editedDescription, setEditedDescription] = useState(activity.description || '');
      const [editedTargetCount, setEditedTargetCount] = useState(activity.targetCount?.toString() || '');
      const [showConfirmation, setShowConfirmation] = useState(false);
      
      const domain = useMemo(() => LIFE_DOMAINS.find(d => d.id === activity.domainId), [activity.domainId]);
      const Icon = useMemo(() => domain?.icon || Edit2, [domain]);

      const handleSave = useCallback(() => {
        onEdit(activity.id, {
          title: editedTitle,
          description: editedDescription,
          targetCount: editedTargetCount ? parseInt(editedTargetCount) : undefined,
        });
        setIsEditing(false);
      }, [activity.id, editedTitle, editedDescription, editedTargetCount, onEdit]);

      const handleToggleCompleted = useCallback(() => {
        onEdit(activity.id, { completed: !activity.completed });
      }, [activity.id, onEdit]);

      const handleDelete = useCallback(() => {
        setShowConfirmation(true);
      }, []);

      const confirmDelete = useCallback(() => {
        onDelete(activity.id);
        setShowConfirmation(false);
      }, [activity.id, onDelete]);

      const cancelDelete = useCallback(() => {
        setShowConfirmation(false);
      }, []);

      if (isEditing) {
        return (
          <div className={`p-2 rounded-lg bg-${domain?.color}-100/10 border border-${domain?.color}-400/20`}>
            <div className="space-y-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full p-1 rounded bg-black/20 border border-white/10 text-white text-sm"
                dir="rtl"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full p-1 rounded bg-black/20 border border-white/10 text-white text-sm"
                dir="rtl"
              />
              <input
                type="number"
                value={editedTargetCount}
                onChange={(e) => setEditedTargetCount(e.target.value)}
                className="w-full p-1 rounded bg-black/20 border border-white/10 text-white text-sm"
                placeholder="العدد المستهدف"
                dir="rtl"
              />
              <div className="flex justify-end gap-1">
                <button
                  onClick={handleSave}
                  className={`p-1 rounded-full bg-${domain?.color}-400/20 text-${domain?.color}-400 hover:bg-${domain?.color}-400/30`}
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-full bg-red-400/20 text-red-400 hover:bg-red-400/30"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className={`p-2 rounded-lg bg-${domain?.color}-100/10 border border-${domain?.color}-400/20 group ${
          activity.completed ? 'opacity-50' : ''
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <div className={`p-1 rounded-full bg-${domain?.color}-400/20 text-${domain?.color}-400`}>
                <Icon size={16} />
              </div>
              <div>
                <h3 className={`text-base font-medium text-${domain?.color}-400`} dir="rtl">
                  {activity.title}
                </h3>
                {activity.description && (
                  <p className={`mt-0.5 text-sm text-${domain?.color}-400/70`} dir="rtl" dangerouslySetInnerHTML={{ __html: makeLinksClickable(activity.description) }} />
                )}
                {activity.reminder && (
                  <div className={`flex items-center gap-1 text-xs text-${domain?.color}-400/70 mt-0.5`}>
                    <Bell size={12} />
                    <span>{activity.reminder.time}</span>
                  </div>
                )}
                {activity.targetCount !== undefined && (
                  <ActivityProgress activity={activity} onUpdate={(updates) => onEdit(activity.id, updates)} />
                )}
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className={`p-1 rounded-full bg-${domain?.color}-400/20 text-${domain?.color}-400 hover:bg-${domain?.color}-400/30`}
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 rounded-full bg-red-400/20 text-red-400 hover:bg-red-400/30"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={handleToggleCompleted}
                className={`p-1 rounded-full ${
                  activity.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Check size={14} />
              </button>
            </div>
          </div>
          {showConfirmation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg text-black">
                <p className="mb-4">هل أنت متأكد من أنك تريد إلغاء هذا النشاط؟</p>
                <div className="flex justify-end gap-4">
                  <button onClick={confirmDelete} className="bg-green-500 text-white p-2 rounded">
                    نعم
                  </button>
                  <button onClick={cancelDelete} className="bg-red-500 text-white p-2 rounded">
                    لا
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
