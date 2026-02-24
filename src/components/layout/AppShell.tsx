import { ComponentChildren } from 'preact';
import { BottomNav } from './BottomNav';
import { InstallPrompt } from './InstallPrompt';

interface AppShellProps {
  children: ComponentChildren;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-screen flex flex-col bg-bg-secondary overflow-hidden">
      {/* Install prompt */}
      <InstallPrompt />

      {/* Main content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
