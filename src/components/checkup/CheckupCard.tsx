import { formatDate, formatTime } from '../../lib/date-utils';
import { Card } from '../shared/Card';
import { MapPin, MessageSquare, Check, AlertTriangle, Bell, Trash2, Pencil, RotateCcw } from 'lucide-preact';
import type { Checkup } from '../../types/checkup';

interface CheckupCardProps {
  checkup: Checkup;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleComplete?: () => void;
}

export function CheckupCard({ checkup, onEdit, onDelete, onToggleComplete }: CheckupCardProps) {
  const checkupDate = new Date(checkup.date);
  const isUpcoming = checkupDate > new Date();
  const isPast = checkupDate < new Date() && !checkup.completed;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Type badge */}
          <div className="inline-block px-3 py-1 bg-primary bg-opacity-10 rounded-lg mb-2">
            <span className="text-sm font-bold text-primary">{checkup.type}</span>
          </div>

          {/* Date and time */}
          <p className="font-bold text-text-primary">
            {formatDate(checkupDate)}
          </p>
          <p className="text-sm text-text-secondary">
            {formatTime(checkupDate)}
          </p>

          {/* Location */}
          {checkup.location && (
            <p className="text-sm text-text-secondary mt-2 flex items-center gap-1">
              <MapPin size={13} className="flex-shrink-0" />{checkup.location}
            </p>
          )}

          {/* Notes */}
          {checkup.notes && (
            <p className="text-sm text-text-secondary mt-2 flex items-start gap-1">
              <MessageSquare size={13} className="flex-shrink-0 mt-0.5" />{checkup.notes}
            </p>
          )}

          {/* Status */}
          <div className="mt-3 flex items-center gap-2">
            {checkup.completed && (
              <span className="text-xs px-2 py-1 bg-primary text-white rounded-full flex items-center gap-1">
                <Check size={11} strokeWidth={3} />已完成
              </span>
            )}
            {isUpcoming && !checkup.completed && (
              <span className="text-xs px-2 py-1 bg-accent text-white rounded-full">
                待产检
              </span>
            )}
            {isPast && (
              <span className="text-xs px-2 py-1 bg-warning text-text-primary rounded-full flex items-center gap-1">
                <AlertTriangle size={11} strokeWidth={2.5} />已过期
              </span>
            )}
            {checkup.reminderEnabled && (
              <span className="text-xs px-2 py-1 bg-gray-200 text-text-secondary rounded-full flex items-center gap-1">
                <Bell size={11} />已开启提醒
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 ml-4">
          {onToggleComplete && (
            <button
              onClick={onToggleComplete}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
              aria-label={checkup.completed ? '标记为未完成' : '标记为已完成'}
            >
              {checkup.completed ? <RotateCcw size={14} /> : <Check size={14} strokeWidth={2.5} />}
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-accent text-white hover:bg-blue-600 transition-colors"
              aria-label="编辑"
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-error text-white hover:bg-red-600 transition-colors"
              aria-label="删除"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
