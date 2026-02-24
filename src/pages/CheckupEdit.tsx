import { useState, useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import { db } from '../lib/db';
import { CheckupForm } from '../components/checkup/CheckupForm';
import { Toast } from '../components/shared/Toast';
import { requestNotificationPermission, scheduleCheckupNotification } from '../lib/notifications';
import { updateProfile } from '../stores/userStore';
import { PageLayout } from '../components/layout/PageLayout';
import type { Checkup } from '../types/checkup';

interface CheckupEditProps {
  id?: string;
}

export function CheckupEdit({ id }: CheckupEditProps) {
  const [checkup, setCheckup] = useState<Checkup | undefined>();
  const [loading, setLoading] = useState(!!id);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (id) {
      loadCheckup(Number(id));
    }
  }, [id]);

  const loadCheckup = async (checkupId: number) => {
    try {
      const data = await db.checkups.get(checkupId);
      setCheckup(data);
    } catch (error) {
      console.error('Failed to load checkup:', error);
      showMessage('加载失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (checkupData: Partial<Checkup>) => {
    try {
      if (checkupData.reminderEnabled) {
        const permission = await requestNotificationPermission();
        updateProfile({ notificationPermission: permission });
        if (permission === 'denied') {
          updateProfile({ preferInAppNotifications: true });
          showMessage('通知权限被拒绝，将使用应用内提醒');
        }
      }

      if (id) {
        await db.checkups.update(Number(id), checkupData);
        showMessage('产检已更新');
      } else {
        const newId = await db.checkups.add(checkupData as Checkup);
        showMessage('产检已添加');
        if (checkupData.reminderEnabled) {
          const savedCheckup = await db.checkups.get(newId);
          if (savedCheckup) {
            scheduleCheckupNotification(savedCheckup);
          }
        }
      }

      setTimeout(() => {
        route('/checkups');
      }, 500);
    } catch (error) {
      console.error('Failed to save checkup:', error);
      showMessage('保存失败，请重试');
    }
  };

  const handleCancel = () => {
    route('/checkups');
  };

  const showMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  if (loading) {
    return (
      <PageLayout onBack={handleCancel} backVariant="accent">
        <div className="flex-1 flex justify-center items-center py-24">
          <div className="spinner" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout onBack={handleCancel} backVariant="accent">
      <div className="px-4 py-4 max-w-2xl mx-auto pb-24">
        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-border">
          <CheckupForm
            checkup={checkup}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </PageLayout>
  );
}
