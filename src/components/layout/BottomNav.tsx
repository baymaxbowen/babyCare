import { route } from 'preact-router';
import clsx from 'clsx';
import { Home, Activity, Stethoscope, Settings2 } from 'lucide-preact';
import type { ComponentType } from 'preact';
import { currentUrl } from '../../stores/routerStore';

interface NavItem {
  path: string;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
  { path: '/', label: '首页', icon: Home },
  { path: '/movement', label: '胎动', icon: Activity },
  { path: '/checkups', label: '产检', icon: Stethoscope },
  { path: '/settings', label: '设置', icon: Settings2 },
];

export function BottomNav() {
  const currentPath = currentUrl.value;

  const activeIndex = navItems.findIndex(item =>
    item.path === '/'
      ? currentPath === '/'
      : currentPath.startsWith(item.path)
  );

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center px-4 pointer-events-none">
      <nav className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-border pointer-events-auto">
        <div className="relative flex items-center px-2 py-2">

          {/* Sliding pill — absolutely positioned, transitions on `left` */}
          <div
            className="absolute top-2 bottom-2 rounded-2xl bg-primary shadow-sm"
            style={{
              width: 'calc((100% - 16px) / 4)',
              left: `calc(8px + ${Math.max(0, activeIndex)} * (100% - 16px) / 4)`,
              transition: 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />

          {/* Nav items */}
          {navItems.map((item) => {
            const isActive = item.path === '/'
              ? currentPath === '/'
              : currentPath.startsWith(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => route(item.path)}
                className={clsx(
                  'relative z-10 flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-2xl no-select',
                  'transition-colors duration-250',
                  isActive ? 'text-white' : 'text-text-secondary'
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-bold mt-0.5">{item.label}</span>
              </button>
            );
          })}

        </div>
      </nav>
    </div>
  );
}
