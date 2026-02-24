import { useEffect } from 'preact/hooks';

interface UseKeyboardNavOptions {
  isOpen: boolean;
  itemsCount: number;
  highlightedIndex: number;
  onHighlightChange: (index: number) => void;
  onSelect: () => void;
  onClose: () => void;
}

export function useKeyboardNav({
  isOpen,
  itemsCount,
  highlightedIndex,
  onHighlightChange,
  onSelect,
  onClose,
}: UseKeyboardNavOptions) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          onHighlightChange(
            highlightedIndex < itemsCount - 1 ? highlightedIndex + 1 : 0
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          onHighlightChange(
            highlightedIndex > 0 ? highlightedIndex - 1 : itemsCount - 1
          );
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect();
          break;

        case 'Escape':
          e.preventDefault();
          onClose();
          break;

        case 'Tab':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, itemsCount, onHighlightChange, onSelect, onClose]);
}
