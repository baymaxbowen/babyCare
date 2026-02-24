import { useState } from 'preact/hooks';
import { navigate } from '../lib/navigate';
import { userProfile } from '../stores/userStore';
import { db } from '../lib/db';
import { clearUserProfile } from '../lib/storage';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { Modal } from '../components/shared/Modal';
import { Toast } from '../components/shared/Toast';
import { WeekProgress } from '../components/countdown/WeekProgress';
import { PageLayout } from '../components/layout/PageLayout';
import { Lightbulb, AlertTriangle } from 'lucide-preact';

export function Settings() {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const profile = userProfile.value;

  const showMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleEdit = () => {
    navigate('/settings/edit');
  };

  const handleReset = async () => {
    setShowResetModal(false);
    try {
      await db.movements.clear();
      await db.movementSessions.clear();
      await db.checkups.clear();
      clearUserProfile();
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset data:', error);
      showMessage('重置失败，请重试', 'error');
    }
  };

  const handleExportData = async () => {
    try {
      const movements = await db.movementSessions.toArray();
      const checkups = await db.checkups.toArray();
      const exportData = {
        profile,
        movements,
        checkups,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `baby-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage('数据导出成功', 'success');
    } catch (error) {
      console.error('Failed to export data:', error);
      showMessage('导出失败，请重试', 'error');
    }
  };

  return (
    <PageLayout>
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6 pb-24">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">个人信息</h2>
            <button
              onClick={handleEdit}
              className="text-primary font-bold text-sm hover:underline"
            >
              编辑
            </button>
          </div>
          <div className="space-y-2">
            {profile?.userName && (
              <div className="flex justify-between">
                <span className="text-text-secondary">昵称</span>
                <span className="font-bold text-text-primary">{profile.userName}</span>
              </div>
            )}
            {profile?.dueDate && (
              <div className="flex justify-between">
                <span className="text-text-secondary">预产期</span>
                <span className="font-bold text-text-primary">
                  {new Date(profile.dueDate).toLocaleDateString('zh-CN')}
                </span>
              </div>
            )}
          </div>
        </Card>

        <WeekProgress />

        <Card>
          <h2 className="text-lg font-bold text-text-primary mb-4">数据管理</h2>
          <div className="space-y-3">
            <Button variant="accent" fullWidth onClick={handleExportData}>
              导出数据
            </Button>
            <Button variant="outline" fullWidth onClick={() => setShowResetModal(true)}>
              重置所有数据
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-text-primary mb-4">关于</h2>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>版本: 0.0.1</p>
            <p>本应用数据存储在本地设备，不会上传到服务器</p>
            <p className="mt-4 text-xs flex items-start gap-1.5">
              <Lightbulb size={13} className="flex-shrink-0 mt-0.5" />
              <span>提示：本应用仅供参考，不能替代专业医疗建议。如有任何疑问或不适，请及时咨询医生。</span>
            </p>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="确认重置"
      >
        <div className="text-center py-4">
          <div className="flex justify-center mb-4"><AlertTriangle size={48} className="text-warning" /></div>
          <p className="text-text-primary font-bold mb-2">确定要重置所有数据吗？</p>
          <p className="text-sm text-text-secondary mb-6">
            这将删除所有胎动记录、产检记录和个人设置，此操作不可恢复！
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowResetModal(false)} fullWidth>
              取消
            </Button>
            <Button variant="secondary" onClick={handleReset} fullWidth>
              确认重置
            </Button>
          </div>
        </div>
      </Modal>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </PageLayout>
  );
}
