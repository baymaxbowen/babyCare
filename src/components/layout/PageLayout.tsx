import { ComponentChildren } from 'preact';
import { ChevronLeft } from 'lucide-preact';

type BackVariant = 'primary' | 'secondary' | 'accent';

const backStyles: Record<BackVariant, string> = {
  primary: 'bg-primary border-primary-dark',
  secondary: 'bg-secondary border-orange-700',
  accent: 'bg-accent border-blue-700',
};

interface PageLayoutProps {
  children: ComponentChildren;
  onBack?: () => void;
  backVariant?: BackVariant;
}

export function PageLayout({ children, onBack, backVariant = 'primary' }: PageLayoutProps) {
  return (
    <div className="h-full flex flex-col bg-bg-secondary">
      <div className="flex-1 overflow-y-auto">
        {onBack && (
          <div className="px-4 pt-4">
            <button
              onClick={onBack}
              className={`w-11 h-11 flex items-center justify-center rounded-2xl text-white border-b-4 active:border-b-2 active:translate-y-0.5 shadow-md hover:shadow-lg transition-all ${backStyles[backVariant]}`}
              aria-label="返回"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
