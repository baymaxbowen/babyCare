import { useState } from 'preact/hooks';
import { navigate } from '../lib/navigate';
import { completeOnboarding } from '../stores/userStore';
import { Button } from '../components/shared/Button';
import { DatePicker } from '../components/shared/DatePicker';
import { Toast } from '../components/shared/Toast';
import { Baby, Lightbulb, Smartphone } from 'lucide-preact';

export function Onboarding() {
  const [dueDate, setDueDate] = useState('');
  const [userName, setUserName] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!dueDate) {
      setShowError(true);
      return;
    }

    completeOnboarding(dueDate, userName.trim() || undefined);

    // 跳转到首页
    navigate('/', true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border-2 border-border">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><Baby size={80} className="text-primary" /></div>
          <h1 className="text-4xl font-black text-text-primary mb-3">
            欢迎使用
          </h1>
          <h2 className="text-2xl font-bold text-primary mb-3">
            宝宝胎动记录
          </h2>
          <p className="text-text-secondary text-lg">
            让我们一起陪伴您的孕期时光
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <p className="text-xs text-text-secondary mt-2 flex items-center gap-1">
              <Lightbulb size={12} />不确定可以使用末次月经日期 + 280天
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button type="submit" variant="primary" fullWidth size="lg">
              开始使用
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 p-4 bg-blue-50 rounded-2xl">
          <p className="text-xs text-text-secondary text-center flex items-center justify-center gap-1">
            <Smartphone size={12} />本应用支持离线使用，数据保存在本地设备
          </p>
        </div>
      </div>

      {/* Error Toast */}
      {showError && (
        <Toast
          message="请选择预产期"
          type="error"
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}
