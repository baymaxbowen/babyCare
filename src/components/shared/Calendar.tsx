import { useState } from 'preact/hooks';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  addMonths,
  subMonths,
  isAfter,
  isBefore,
  startOfDay,
} from 'date-fns';
import clsx from 'clsx';

interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  currentMonth?: Date;
  onMonthChange?: (date: Date) => void;
}

export function Calendar({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
  currentMonth: controlledMonth,
  onMonthChange,
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(new Date());

  // 使用受控或内部状态
  const currentMonth = controlledMonth || internalMonth;
  const setCurrentMonth = (date: Date) => {
    if (onMonthChange) {
      onMonthChange(date);
    } else {
      setInternalMonth(date);
    }
  };

  // 检查日期是否可选
  const isDateDisabled = (date: Date): boolean => {
    const dayStart = startOfDay(date);
    if (minDate && isBefore(dayStart, startOfDay(minDate))) {
      return true;
    }
    if (maxDate && isAfter(dayStart, startOfDay(maxDate))) {
      return true;
    }
    return false;
  };

  // 渲染日历网格
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // 周一开始
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // 分组为周
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="space-y-2">
        {/* 周几表头 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['一', '二', '三', '四', '五', '六', '日'].map(day => (
            <div
              key={day}
              className="text-center text-xs font-bold text-text-secondary py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 日历网格 */}
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-1">
            {week.map(day => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const disabled = isDateDisabled(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => !disabled && onSelectDate(day)}
                  disabled={disabled}
                  className={clsx(
                    'calendar-day',
                    !isCurrentMonth && 'calendar-day-other-month',
                    isSelected && 'calendar-day-selected',
                    isToday && 'calendar-day-today',
                    disabled && 'calendar-day-disabled'
                  )}
                >
                  <div className="flex items-center justify-center h-full">
                    <span className="text-sm font-bold">{format(day, 'd')}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      {/* 月份导航 */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="calendar-nav-button"
          aria-label="上个月"
        >
          ←
        </button>

        <h2 className="text-lg font-bold text-text-primary">
          {format(currentMonth, 'yyyy年MM月')}
        </h2>

        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="calendar-nav-button"
          aria-label="下个月"
        >
          →
        </button>
      </div>

      {renderCalendar()}
    </div>
  );
}
