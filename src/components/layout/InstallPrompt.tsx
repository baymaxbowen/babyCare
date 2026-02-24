import { useState } from 'preact/hooks';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import { Button } from '../shared/Button';
import { Smartphone } from 'lucide-preact';

export function InstallPrompt() {
  const { isInstallable, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (!installed) {
      setDismissed(true);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary-dark text-white p-4 shadow-lg z-50 slide-up">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-bold mb-1 flex items-center gap-1.5"><Smartphone size={16} />安装应用到主屏幕</p>
          <p className="text-sm opacity-90">离线使用，更快速的访问</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setDismissed(true)}
            className="px-4 py-2 text-sm font-bold text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            暂不
          </button>
          <Button onClick={handleInstall} variant="secondary" size="sm">
            安装
          </Button>
        </div>
      </div>
    </div>
  );
}
