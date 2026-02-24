import { h } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { format, parse, isValid } from 'date-fns';
import clsx from 'clsx';
import { Calendar } from './Calendar';
import { useClickOutside } from '../../hooks/useClickOutside';

interface DateTimePickerProps {
  value: string; // ISO datetime string (yyyy-MM-ddTHH:mm)
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  required?: boolean;
  minDate?: string;
  maxDate?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = '选择日期和时间',
  disabled = false,
  error = false,
  className = '',
  required = false,
  minDate,
  maxDate,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 解析当前值
  const parsedDateTime = value ? parse(value, "yyyy-MM-dd'T'HH:mm", new Date()) : null;
  const isValidDateTime = parsedDateTime && isValid(parsedDateTime);

  // 分离日期和时间
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    isValidDateTime ? parsedDateTime : null
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    isValidDateTime ? format(parsedDateTime, 'HH:mm') : '09:00'
  );

  const minDateObj = minDate ? parse(minDate, 'yyyy-MM-dd', new Date()) : undefined;
  const maxDateObj = maxDate ? parse(maxDate, 'yyyy-MM-dd', new Date()) : undefined;

  // 点击外部关闭
  useClickOutside(containerRef, () => setIsOpen(false));

  // 格式化显示文本
  const displayText = isValidDateTime
    ? format(parsedDateTime, 'yyyy年MM月dd日 HH:mm')
    : placeholder;

  // 选择日期
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  // 确定按钮
  const handleConfirm = () => {
    if (!selectedDate) return;

    // 组合日期和时间
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const dateTimeStr = `${dateStr}T${selectedTime}`;

    onChange(dateTimeStr);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      {/* 触发按钮 */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'form-input-base w-full text-left flex items-center justify-between',
          error && 'form-input-error',
          disabled && 'cursor-not-allowed',
          !disabled && 'cursor-pointer',
          !isValidDateTime && 'text-text-secondary'
        )}
        aria-required={required}
      >
        <span>{displayText}</span>

        {/* 日历时钟图标 */}
        <svg
          className="w-5 h-5 text-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* 日历和时间选择面板 */}
      {isOpen && (
        <div className="dropdown-panel dropdown-panel-calendar">
          {/* 日历 */}
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            minDate={minDateObj}
            maxDate={maxDateObj}
            currentMonth={selectedDate || new Date()}
          />

          {/* 时间选择 */}
          <div className="px-4 py-3 border-t border-border">
            <label className="form-label">时间</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime((e.target as HTMLInputElement).value)}
              className="form-input"
            />
          </div>

          {/* 确定按钮 */}
          <div className="px-4 pb-4">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedDate}
              className={clsx(
                'w-full py-3 rounded-xl font-bold transition-all',
                selectedDate
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
