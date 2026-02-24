import { ComponentChildren } from 'preact';
import { BottomNav } from './BottomNav';
import { InstallPrompt } from './InstallPrompt';
import { currentUrl, slideDir } from '../../stores/routerStore';

interface AppShellProps {
  children: ComponentChildren;
}

export function AppShell({ children }: AppShellProps) {
  const url = currentUrl.value;
  const direction = slideDir.value;

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'linear-gradient(160deg, #e8fcd4 0%, #f0fdf4 30%, #f7fef0 100%)' }}>
      {/* Install prompt */}
      <InstallPrompt />

      {/* Main content */}
      <main className="flex-1 pb-28 overflow-y-auto">
        <div
          key={url}
          className={direction === 'right' ? 'page-slide-from-right' : 'page-slide-from-left'}
        >
          {children}
        </div>
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
