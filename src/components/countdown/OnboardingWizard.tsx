import { useState } from 'preact/hooks';
import { completeOnboarding } from '../../stores/userStore';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { DatePicker } from '../shared/DatePicker';

interface OnboardingWizardProps {
  isOpen: boolean;
}

export function OnboardingWizard({ isOpen }: OnboardingWizardProps) {
  const [dueDate, setDueDate] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!dueDate) {
      alert('请选择预产期');
      return;
    }

    completeOnboarding(dueDate, userName.trim() || undefined);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} showCloseButton={false}>
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">👶</div>
        <h1 className="text-3xl font-black text-text-primary mb-2">
          欢迎使用
        </h1>
        <h2 className="text-xl font-bold text-primary mb-2">
          宝宝胎动记录
        </h2>
        <p className="text-text-secondary">
          让我们一起陪伴您的孕期时光
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name (optional) */}
        <div>
          <label className="form-label">
            您的昵称（可选）
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName((e.target as HTMLInputElement).value)}
            placeholder="例如：小美妈妈"
            className="form-input"
          />
        </div>

        {/* Due date */}
        <div>
          <label className="form-label">
            预产期 *
          </label>
          <DatePicker
            value={dueDate}
            onChange={setDueDate}
            required
          />
          <p className="text-xs text-text-secondary mt-2">
            💡 不确定可以使用末次月经日期 + 280天
          </p>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button type="submit" variant="primary" fullWidth size="lg">
            开始使用
          </Button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-xs text-text-secondary text-center">
          📱 本应用支持离线使用，数据保存在本地设备
        </p>
      </div>
    </Modal>
  );
}
