import { useState, useEffect } from 'preact/hooks';
import { db } from '../../lib/db';
import { formatDate, formatTime } from '../../lib/date-utils';
import { Card } from '../shared/Card';
import { FileText, CheckCircle2 } from 'lucide-preact';
import type { MovementSession } from '../../types/movement';

export function MovementHistory() {
  const [sessions, setSessions] = useState<MovementSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const allSessions = await db.movementSessions
        .orderBy('startTime')
        .reverse()
        .limit(20)
        .toArray();

      setSessions(allSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="spinner" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 px-6">
        <div className="flex justify-center mb-2"><FileText size={32} className="text-text-secondary" /></div>
        <p className="text-text-secondary">还没有记录</p>
        <p className="text-sm text-text-secondary mt-2">开始数胎动来创建第一条记录吧</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4">
      <h2 className="text-xl font-bold text-text-primary mb-4">历史记录</h2>

      {sessions.map((session) => (
        <Card key={session.id}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-text-primary">
                {formatDate(new Date(session.date))}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                {formatTime(new Date(session.startTime))}
                {session.endTime && ` - ${formatTime(new Date(session.endTime))}`}
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{session.count}</p>
              <p className="text-xs text-text-secondary">次</p>
            </div>
          </div>

          {session.duration && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-sm text-text-secondary">
                用时: {session.duration} 分钟
                {session.completed && <span className="inline-flex items-center gap-1 ml-1"><CheckCircle2 size={13} className="text-primary" />完成</span>}
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
