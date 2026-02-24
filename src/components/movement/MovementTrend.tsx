import { useState, useEffect } from 'preact/hooks';
import { format, subDays, startOfDay, isSameDay, isToday, isYesterday } from 'date-fns';
import { db } from '../../lib/db';
import { Card } from '../shared/Card';
import { Check } from 'lucide-preact';
import type { MovementSession } from '../../types/movement';

interface DayRecord {
  date: Date;
  sessions: MovementSession[];
}

export function MovementTrend() {
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 获取最近7天的日期
      const today = startOfDay(new Date());
      const days: DayRecord[] = [];

      for (let i = 0; i < 7; i++) {
        const date = subDays(today, i);
        days.push({ date, sessions: [] });
      }

      // 加载所有 session 数据
      const allSessions = await db.movementSessions.toArray();

      // 将sessions分组到对应的日期
      allSessions.forEach(session => {
        const sessionDate = startOfDay(new Date(session.date));
        const dayRecord = days.find(d => isSameDay(d.date, sessionDate));
        if (dayRecord) {
          dayRecord.sessions.push(session);
        }
      });

      // 每天的sessions按时间排序
      days.forEach(day => {
        day.sessions.sort((a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
      });

      setRecords(days);
    } catch (error) {
      console.error('Failed to load trend data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateLabel = (date: Date): string => {
    if (isToday(date)) return '今天';
    if (isYesterday(date)) return '昨天';
    return format(date, 'M月d日');
  };

  const getDayTotal = (sessions: MovementSession[]): number => {
    return sessions.reduce((sum, s) => sum + s.count, 0);
  };

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center py-8">
          <div className="spinner" />
        </div>
      </Card>
    );
  }

  // 计算总体统计
  const totalCount = records.reduce((sum, r) => sum + getDayTotal(r.sessions), 0);
  const avgCount = Math.round(totalCount / 7);
  const todayCount = getDayTotal(records[0]?.sessions || []);

  return (
    <Card>
      <h3 className="text-lg font-bold text-text-primary mb-4">最近7天记录</h3>

      {/* 统计信息 */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-center bg-bg-secondary rounded-xl p-4">
        <div>
          <p className="text-2xl font-black text-primary">{totalCount}</p>
          <p className="text-xs text-text-secondary mt-1">7天总计</p>
        </div>
        <div>
          <p className="text-2xl font-black text-primary">{avgCount}</p>
          <p className="text-xs text-text-secondary mt-1">日均次数</p>
        </div>
        <div>
          <p className="text-2xl font-black text-primary">{todayCount}</p>
          <p className="text-xs text-text-secondary mt-1">今日次数</p>
        </div>
      </div>

      {/* 7天记录列表 */}
      <div className="space-y-4">
        {records.map((record, index) => {
          const dayTotal = getDayTotal(record.sessions);
          const dateLabel = getDateLabel(record.date);
          const isCurrentDay = isToday(record.date);

          return (
            <div
              key={index}
              className={`border-l-4 pl-4 ${
                isCurrentDay ? 'border-primary' : 'border-border'
              }`}
            >
              {/* 日期标题 */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4
                    className={`font-bold ${
                      isCurrentDay ? 'text-primary text-lg' : 'text-text-primary'
                    }`}
                  >
                    {dateLabel}
                  </h4>
                  <span className="text-xs text-text-secondary">
                    {format(record.date, 'yyyy/M/d')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-text-primary">
                    {dayTotal}
                  </span>
                  <span className="text-xs text-text-secondary">次</span>
                </div>
              </div>

              {/* Session列表 */}
              {record.sessions.length > 0 ? (
                <div className="space-y-2">
                  {record.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between bg-bg-secondary rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        {/* 时间 */}
                        <div className="text-sm font-medium text-text-primary">
                          {format(new Date(session.startTime), 'HH:mm')}
                        </div>

                        {/* 次数 */}
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-primary">
                            {session.count}
                          </span>
                          <span className="text-xs text-text-secondary">次</span>
                        </div>

                        {/* 用时 */}
                        {session.duration && (
                          <div className="text-xs text-text-secondary">
                            {session.duration}分钟
                          </div>
                        )}
                      </div>

                      {/* 完成标记 */}
                      {session.completed && (
                        <div className="flex items-center gap-1">
                          <span className="flex items-center justify-center w-5 h-5 bg-primary text-white rounded-full">
                            <Check size={11} strokeWidth={3} />
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-text-secondary py-2">
                  无记录
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
