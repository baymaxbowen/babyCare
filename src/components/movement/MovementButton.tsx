import { useEffect, useState } from 'preact/hooks';
import clsx from 'clsx';

interface MovementButtonProps {
  count: number;
  onClick: () => void;
  disabled?: boolean;
}

export function MovementButton({ count, onClick, disabled = false }: MovementButtonProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'w-52 h-52 rounded-full font-black text-6xl text-white shadow-lg transition-transform border-8 no-select',
        'bg-gradient-to-br from-primary to-primary-dark border-primary-light',
        'active:scale-95',
        disabled && 'opacity-50 cursor-not-allowed',
        animate && 'number-bounce'
      )}
      aria-label="记录胎动"
    >
      {count}
    </button>
  );
}
