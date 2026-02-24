import { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ComponentChildren;
  showCloseButton?: boolean;
}

export function Modal({ isOpen, onClose, title, children, showCloseButton = true }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-3xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="px-6 py-4 border-b-2 border-border">
            <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
          </div>
        )}

        <div className="p-6">{children}</div>

        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            aria-label="关闭"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        )}
      </div>
    </div>
  );
}
