import { route } from 'preact-router';
import clsx from 'clsx';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/movement', label: '胎动', icon: '👶' },
  { path: '/checkups', label: '产检', icon: '📋' },
  { path: '/settings', label: '设置', icon: '⚙️' },
];

export function BottomNav() {
  const currentPath = window.location.pathname;

  const handleNavClick = (path: string) => {
    route(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-border shadow-lg">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={clsx(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors no-select',
                isActive ? 'text-primary' : 'text-text-secondary'
              )}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
