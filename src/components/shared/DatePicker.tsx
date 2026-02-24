import { useState, useRef } from 'preact/hooks';
import { format, parse, isValid } from 'date-fns';
import clsx from 'clsx';
import { Calendar } from './Calendar';
import { useClickOutside } from '../../hooks/useClickOutside';

interface DatePickerProps {
  value: string; // ISO date string (yyyy-MM-dd)
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  required?: boolean;
  minDate?: string;
  maxDate?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = '选择日期',
  disabled = false,
  error = false,
  className = '',
  required = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // 转换字符串为 Date 对象
  const parsedDate = value ? parse(value, 'yyyy-MM-dd', new Date()) : null;
  const selectedDate = parsedDate && isValid(parsedDate) ? parsedDate : null;

  const minDateObj = minDate ? parse(minDate, 'yyyy-MM-dd', new Date()) : undefined;
  const maxDateObj = maxDate ? parse(maxDate, 'yyyy-MM-dd', new Date()) : undefined;

  // 点击外部关闭
  useClickOutside(containerRef, () => setIsOpen(false));

  // 格式化显示文本
  const displayText = selectedDate
    ? format(selectedDate, 'yyyy年MM月dd日')
    : placeholder;

  // 选择日期
  const handleSelectDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    onChange(formattedDate);
    setIsOpen(false);
  };

  // 打开日历时，初始化为选中日期的月份或当前月份
  const handleOpen = () => {
    if (!disabled) {
      setCurrentMonth(selectedDate || new Date());
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setOpenUpward(window.innerHeight - rect.bottom < 340);
      }
      setIsOpen(true);
    }
  };

  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      {/* 触发按钮 */}
      <button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
        disabled={disabled}
        className={clsx(
          'form-input-base w-full text-left flex items-center justify-between',
          error && 'form-input-error',
          disabled && 'cursor-not-allowed',
          !disabled && 'cursor-pointer',
          !selectedDate && 'text-text-secondary'
        )}
        aria-required={required}
      >
        <span>{displayText}</span>

        {/* 日历图标 */}
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

      {/* 日历面板 */}
      {isOpen && (
        <div className={clsx(
          'absolute left-0 right-0 z-50',
          'bg-white rounded-2xl border-2 border-border shadow-lg',
          openUpward ? 'bottom-full mb-2' : 'top-full mt-2',
        )} style={{ animation: 'dropdown-slide-down 0.2s ease-out' }}>
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            minDate={minDateObj}
            maxDate={maxDateObj}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        </div>
      )}
    </div>
  );
}
