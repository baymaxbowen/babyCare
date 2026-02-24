import { useState, useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import { currentSession, isTracking, incrementCount, endSession, resetSession } from '../../stores/movementStore';
import { db } from '../../lib/db';
import { vibrate } from '../../lib/notifications';
import { MovementButton } from './MovementButton';
import { Button } from '../shared/Button';
import { Toast } from '../shared/Toast';
import { Sparkles } from 'lucide-preact';
import type { Movement } from '../../types/movement';

export function MovementCounter() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const session = currentSession.value;
  const tracking = isTracking.value;

  // Timer effect
  useEffect(() => {
    if (!tracking || !session) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - session.startTime.getTime()) / 1000
      );
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [tracking, session]);

  // Check for completion
  useEffect(() => {
    if (session && session.count === 10 && !showCelebration) {
      setShowCelebration(true);
      vibrate([200, 100, 200]);
      showMessage('太棒了！完成今天的计数！');

      // Auto-save after 2 seconds
      setTimeout(() => {
        handleSave();
      }, 2000);
    }
  }, [session?.count]);

  const handleRecord = async () => {
    if (!session) return;

    // Vibration feedback
    vibrate(50);

    // Increment count
    incrementCount();

    // Save movement to database
    const movement: Movement = {
      sessionId: session.id,
      timestamp: new Date(),
    };

    await db.movements.add(movement);
  };

  const handleSave = async () => {
    if (!session) return;

    endSession();

    // Save session to database
    const finalSession = currentSession.value;
    if (finalSession) {
      await db.movementSessions.add({
        ...finalSession,
        date: new Date(finalSession.date),
        startTime: new Date(finalSession.startTime),
        endTime: finalSession.endTime ? new Date(finalSession.endTime) : undefined,
      });
    }

    showMessage('已保存计数记录');
    resetSession();
    setElapsedTime(0);
    setShowCelebration(false);

    // 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      route('/movement');
    }, 500);
  };

  const handleCancel = () => {
    resetSession();
    setElapsedTime(0);
    setShowCelebration(false);
  };

  const showMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      {/* Timer */}
      <div className="text-center mb-6">
        <div className="text-5xl font-black text-primary mb-2">
          {formatTime(elapsedTime)}
        </div>
        <p className="text-text-secondary">已用时间</p>
      </div>

      {/* Counter Button */}
      <div className="mb-6">
        <MovementButton
          count={session?.count || 0}
          onClick={handleRecord}
          disabled={(session?.count ?? 0) >= 10}
        />
      </div>

      {/* Count Display */}
      <div className="text-center mb-8">
        <p className="text-lg text-text-secondary">
          {session?.count || 0} / 10 次胎动
        </p>
        {session && session.count < 10 && (
          <p className="text-sm text-text-secondary mt-2">
            点击按钮记录每次胎动
          </p>
        )}
      </div>

      {/* Celebration */}
      {showCelebration && (
        <div className="mb-6 p-4 bg-primary bg-opacity-10 rounded-2xl">
          <p className="text-xl font-bold text-primary text-center flex items-center justify-center gap-2">
            <Sparkles size={20} />宝宝很活跃呢！<Sparkles size={20} />
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 w-full max-w-sm">
        <Button variant="outline" onClick={handleCancel} fullWidth>
          取消
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          fullWidth
          disabled={!session || session.count === 0}
        >
          保存记录
        </Button>
      </div>

      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
