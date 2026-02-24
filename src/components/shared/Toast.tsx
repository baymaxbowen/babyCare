import { useEffect } from 'preact/hooks';
import clsx from 'clsx';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-primary text-white',
    error: 'bg-error text-white',
    warning: 'bg-warning text-text-primary',
    info: 'bg-accent text-white',
  };

  return (
    <div
      className={clsx(
        'fixed top-4 left-4 right-4 p-4 rounded-2xl shadow-lg slide-down z-50 max-w-md mx-auto',
        typeStyles[type]
      )}
    >
      <p className="font-bold text-center">{message}</p>
    </div>
  );
}
