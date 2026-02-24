import { JSX } from 'preact';
import clsx from 'clsx';

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-bold rounded-2xl transition-all border-b-4 active:border-b-2 active:translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed no-select';

  const variantClasses = {
    primary: 'bg-primary text-white border-primary-dark hover:bg-primary-light',
    secondary: 'bg-secondary text-white border-orange-700 hover:bg-orange-600',
    accent: 'bg-accent text-white border-blue-700 hover:bg-blue-500',
    outline: 'bg-white text-primary border-primary hover:bg-gray-50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
