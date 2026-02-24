import { useState } from 'preact/hooks';
import { Button } from '../shared/Button';
import { Select } from '../shared/Select';
import { DatePicker } from '../shared/DatePicker';
import { Toast } from '../shared/Toast';
import { CHECKUP_TYPES, type Checkup, type CheckupType } from '../../types/checkup';

interface CheckupFormProps {
  checkup?: Checkup;
  onSave: (checkup: Partial<Checkup>) => void;
  onCancel: () => void;
}

export function CheckupForm({ checkup, onSave, onCancel }: CheckupFormProps) {
  const [type, setType] = useState<CheckupType>(checkup?.type || '常规产检');
  const [date, setDate] = useState(
    checkup?.date ? new Date(checkup.date).toISOString().slice(0, 10) : ''
  );
  const [location, setLocation] = useState(checkup?.location || '');
  const [notes, setNotes] = useState(checkup?.notes || '');
  const [reminderEnabled, setReminderEnabled] = useState(checkup?.reminderEnabled ?? true);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!date) {
      setShowError(true);
      return;
    }

    const checkupData: Partial<Checkup> = {
      type,
      date: new Date(date),
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      reminderEnabled,
      reminderTimes: reminderEnabled ? [1440, 180] : [], // 1 day, 3 hours
      completed: checkup?.completed || false,
      createdAt: checkup?.createdAt || new Date(),
    };

    if (checkup?.id) {
      checkupData.id = checkup.id;
    }

    onSave(checkupData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type */}
      <div>
        <label className="form-label">
          产检类型 *
        </label>
        <Select
          value={type}
          onChange={(value) => setType(value as CheckupType)}
          options={CHECKUP_TYPES.map(t => ({ value: t, label: t }))}
          required
        />
      </div>

      {/* Date */}
      <div>
        <label className="form-label">
          产检日期 *
        </label>
        <DatePicker
          value={date}
          onChange={setDate}
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className="form-label">
          地点（可选）
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation((e.target as HTMLInputElement).value)}
          placeholder="例如：市妇幼保健院"
          className="form-input"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="form-label">
          备注（可选）
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
          placeholder="例如：需要空腹"
          rows={3}
          className="form-textarea"
        />
      </div>

      {/* Reminder */}
      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled((e.target as HTMLInputElement).checked)}
            className="form-checkbox"
          />
          <span className="text-sm font-bold text-text-primary">
            开启提醒（提前1天、3小时）
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} fullWidth>
          取消
        </Button>
        <Button type="submit" variant="primary" fullWidth>
          {checkup ? '更新' : '添加'}
        </Button>
      </div>

      {/* Error Toast */}
      {showError && (
        <Toast
          message="请选择产检日期"
          type="error"
          onClose={() => setShowError(false)}
        />
      )}
    </form>
  );
}
