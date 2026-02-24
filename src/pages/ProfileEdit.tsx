import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { userProfile, updateProfile } from '../stores/userStore';
import { Button } from '../components/shared/Button';
import { DatePicker } from '../components/shared/DatePicker';
import { Toast } from '../components/shared/Toast';
import { PageLayout } from '../components/layout/PageLayout';

export function ProfileEdit() {
  const [userName, setUserName] = useState(userProfile.value?.userName || '');
  const [dueDate, setDueDate] = useState(
    userProfile.value?.dueDate ? new Date(userProfile.value.dueDate).toISOString().split('T')[0] : ''
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleSave = () => {
    if (!dueDate) {
      showMessage('请选择预产期', 'error');
      return;
    }

    const dueDateObj = new Date(dueDate);
    const startDate = new Date(dueDateObj);
    startDate.setDate(startDate.getDate() - 280);

    updateProfile({
      userName: userName.trim() || undefined,
      dueDate,
      pregnancyStartDate: startDate.toISOString(),
    });

    showMessage('个人信息已更新', 'success');
    setTimeout(() => {
      route('/settings');
    }, 500);
  };

  const handleCancel = () => {
    route('/settings');
  };

  return (
    <PageLayout onBack={handleCancel} backVariant="secondary">
      <div className="px-4 py-4 max-w-2xl mx-auto pb-24">
        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-border">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="form-label">您的昵称（可选）</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName((e.target as HTMLInputElement).value)}
                placeholder="例如：小美妈妈"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">预产期 *</label>
              <DatePicker
                value={dueDate}
                onChange={setDueDate}
                required
              />
              <p className="text-xs text-text-secondary mt-2">
                💡 不确定可以使用末次月经日期 + 280天
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} fullWidth>
                取消
              </Button>
              <Button type="submit" variant="primary" fullWidth>
                保存
              </Button>
            </div>
          </form>
        </div>
      </div>

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
