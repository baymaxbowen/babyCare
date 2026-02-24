import { useState, useEffect } from 'preact/hooks';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, startOfWeek, endOfWeek, isSameMonth, addMonths, subMonths } from 'date-fns';
import { db } from '../../lib/db';
import { Card } from '../shared/Card';
import { Check, X } from 'lucide-preact';
import type { MovementSession } from '../../types/movement';

interface DayData {
  date: Date;
  count: number;
  sessions: MovementSession[];
}

export function MovementCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dayData, setDayData] = useState<Map<string, DayData>>(new Map());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  useEffect(() => {
    loadMonthData();
  }, [currentMonth]);

  const loadMonthData = async () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    // Load all sessions for this month
    const sessions = await db.movementSessions
      .where('date')
      .between(monthStart, monthEnd, true, true)
      .toArray();

    // Group by date
    const dataMap = new Map<string, DayData>();

    sessions.forEach(session => {
      const dateKey = format(new Date(session.date), 'yyyy-MM-dd');
      const existing = dataMap.get(dateKey);

      if (existing) {
        existing.count += session.count;
        existing.sessions.push(session);
      } else {
        dataMap.set(dateKey, {
          date: new Date(session.date),
          count: session.count,
          sessions: [session],
        });
      }
    });

    setDayData(dataMap);
  };

  const getDayColor = (count: number): string => {
    if (count === 0) return 'bg-gray-100 text-text-secondary';
    if (count >= 10) return 'bg-primary text-white';
    if (count >= 5) return 'bg-warning text-text-primary';
    return 'bg-orange-200 text-text-primary';
  };

  const getDayStatus = (count: number): string => {
    if (count === 0) return '无记录';
    if (count >= 10) return '正常';
    if (count >= 5) return '偏少';
    return '较少';
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="space-y-2">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['一', '二', '三', '四', '五', '六', '日'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-text-secondary py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-1">
            {week.map(day => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const data = dayData.get(dateKey);
              const count = data?.count || 0;
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={dateKey}
                  onClick={() => data && setSelectedDay(data)}
                  disabled={!data}
                  className={`
                    aspect-square rounded-lg p-1 transition-all
                    ${isCurrentMonth ? getDayColor(count) : 'bg-gray-50 text-gray-300'}
                    ${isToday ? 'ring-2 ring-accent' : ''}
                    ${data ? 'hover:shadow-md cursor-pointer' : 'cursor-default'}
                    disabled:cursor-default
                  `}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-xs font-bold">{format(day, 'd')}</span>
                    {data && (
                      <span className="text-[10px] font-bold mt-0.5">{count}</span>
                    )}
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
    <div className="px-4 py-6 space-y-4">
      {/* Month navigation */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="上个月"
          >
            ←
          </button>

          <h2 className="text-xl font-bold text-text-primary">
            {format(currentMonth, 'yyyy年MM月')}
          </h2>

          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="下个月"
          >
            →
          </button>
        </div>

        {renderCalendar()}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs font-bold text-text-secondary mb-2">图例：</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary"></div>
              <span>≥10次 正常</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning"></div>
              <span>5-9次 偏少</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-200"></div>
              <span>&lt;5次 较少</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100"></div>
              <span>无记录</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Selected day details */}
      {selectedDay && (
        <Card>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-text-primary">
                {format(selectedDay.date, 'MM月dd日')}
              </h3>
              <p className="text-sm text-text-secondary">
                {format(selectedDay.date, 'EEEE', { locale: undefined })}
              </p>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-text-secondary hover:text-text-primary"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary">
                {selectedDay.count}
              </span>
              <span className="text-text-secondary">次胎动</span>
            </div>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
              selectedDay.count >= 10 ? 'bg-primary bg-opacity-10 text-primary' :
              selectedDay.count >= 5 ? 'bg-warning bg-opacity-20 text-orange-700' :
              'bg-orange-200 text-orange-800'
            }`}>
              {getDayStatus(selectedDay.count)}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-text-secondary">本日记录：</p>
            {selectedDay.sessions.map((session, idx) => (
              <div key={session.id} className="bg-bg-secondary rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-text-primary">
                      第 {idx + 1} 次 - {session.count} 次胎动
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {format(new Date(session.startTime), 'HH:mm')}
                      {session.endTime && ` - ${format(new Date(session.endTime), 'HH:mm')}`}
                    </p>
                  </div>
                  {session.completed && (
                    <span className="flex items-center justify-center w-5 h-5 bg-primary text-white rounded-full">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  )}
                </div>
                {session.duration && (
                  <p className="text-xs text-text-secondary mt-2">
                    用时: {session.duration} 分钟
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Statistics */}
      <Card>
        <h3 className="text-lg font-bold text-text-primary mb-3">本月统计</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-black text-primary">
              {Array.from(dayData.values()).filter(d => d.count > 0).length}
            </p>
            <p className="text-xs text-text-secondary mt-1">记录天数</p>
          </div>
          <div>
            <p className="text-2xl font-black text-primary">
              {Array.from(dayData.values()).reduce((sum, d) => sum + d.count, 0)}
            </p>
            <p className="text-xs text-text-secondary mt-1">总次数</p>
          </div>
          <div>
            <p className="text-2xl font-black text-primary">
              {Array.from(dayData.values()).filter(d => d.count >= 10).length}
            </p>
            <p className="text-xs text-text-secondary mt-1">正常天数</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
