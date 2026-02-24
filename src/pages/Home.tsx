import { useState, useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import { userProfile, pregnancyInfo } from '../stores/userStore';
import { db } from '../lib/db';
import { DueDateCounter } from '../components/countdown/DueDateCounter';
import { Card } from '../components/shared/Card';
import { Toast } from '../components/shared/Toast';
import { getUpcomingCheckups } from '../lib/notifications';
import { Baby, ClipboardList, Lightbulb } from 'lucide-preact';
import type { Checkup } from '../types/checkup';

export function Home() {
  const [upcomingCheckups, setUpcomingCheckups] = useState<Checkup[]>([]);
  const [recentSessionCount, setRecentSessionCount] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const profile = userProfile.value;
  const info = pregnancyInfo.value;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load upcoming checkups
    const checkups = await db.checkups.toArray();
    const upcoming = getUpcomingCheckups(checkups, 72); // 3 days ahead

    setUpcomingCheckups(upcoming);

    if (upcoming.length > 0) {
      setShowToast(true);
    }

    // Load recent movement sessions
    const recentSessions = await db.movementSessions
      .orderBy('date')
      .reverse()
      .limit(7)
      .toArray();

    setRecentSessionCount(recentSessions.length);
  };

  return (
    <div className="px-4 py-6 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-text-primary mb-2">
          {profile?.userName ? `你好，${profile.userName}` : '你好'}
        </h1>
        <p className="text-text-secondary">
          {info ? `孕 ${info.weeks} 周 ${info.days} 天` : '欢迎回来'}
        </p>
      </div>

      {/* Due Date Countdown */}
      <div className="mb-6">
        <DueDateCounter />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card
            className="text-center cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => route('/movement')}
          >
            <div className="flex justify-center mb-2"><Baby size={40} className="text-primary" /></div>
            <p className="font-bold text-text-primary">数胎动</p>
            <p className="text-xs text-text-secondary mt-1">
              本周 {recentSessionCount} 次
            </p>
          </Card>

          <Card
            className="text-center cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => route('/checkups')}
          >
            <div className="flex justify-center mb-2"><ClipboardList size={40} className="text-accent" /></div>
            <p className="font-bold text-text-primary">产检提醒</p>
            <p className="text-xs text-text-secondary mt-1">
              {upcomingCheckups.length > 0
                ? `${upcomingCheckups.length} 个待办`
                : '暂无待办'}
            </p>
          </Card>
        </div>
      </div>

      {/* Tips */}
      <Card className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="flex items-start gap-3">
          <Lightbulb size={28} className="flex-shrink-0 text-yellow-200" />
          <div>
            <p className="font-bold mb-1">温馨提示</p>
            <p className="text-sm opacity-90">
              建议每天在宝宝活跃时数胎动，正常情况下2小时内应有10次胎动。如果胎动明显减少，请及时就医。
            </p>
          </div>
        </div>
      </Card>

      {/* Upcoming checkups toast */}
      {showToast && upcomingCheckups.length > 0 && (
        <Toast
          message={`您有 ${upcomingCheckups.length} 个即将到来的产检`}
          type="info"
          duration={5000}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
