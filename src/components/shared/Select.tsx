import { useState, useRef } from 'preact/hooks';
import clsx from 'clsx';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useKeyboardNav } from '../../hooks/useKeyboardNav';

export interface SelectOption<T = string> {
  value: T;
  label: string;
}

interface SelectProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  required?: boolean;
}

export function Select<T = string>({
  value,
  onChange,
  options,
  placeholder = '请选择',
  disabled = false,
  error = false,
  className = '',
  required = false,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 找到当前选中的选项
  const selectedOption = options.find(opt => opt.value === value);

  // 点击外部关闭
  useClickOutside(containerRef, () => setIsOpen(false));

  // 键盘导航
  useKeyboardNav({
    isOpen,
    itemsCount: options.length,
    highlightedIndex,
    onHighlightChange: setHighlightedIndex,
    onSelect: () => {
      if (options[highlightedIndex]) {
        onChange(options[highlightedIndex].value);
        setIsOpen(false);
      }
    },
    onClose: () => setIsOpen(false),
  });

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      // 打开时高亮当前选中项
      if (!isOpen) {
        const currentIndex = options.findIndex(opt => opt.value === value);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
    }
  };

  const handleSelect = (option: SelectOption<T>) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      {/* 触发按钮 */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={clsx(
          'form-input-base w-full text-left flex items-center justify-between',
          error && 'form-input-error',
          disabled && 'cursor-not-allowed',
          !disabled && 'cursor-pointer'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required}
      >
        <span className={clsx(!selectedOption && 'text-text-secondary')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* 下拉箭头 */}
        <svg
          className={clsx(
            'w-5 h-5 transition-transform text-text-secondary',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* 下拉面板 */}
      {isOpen && (
        <div className="dropdown-panel" role="listbox">
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => handleSelect(option)}
                className={clsx(
                  'dropdown-item',
                  isHighlighted && 'dropdown-item-highlighted',
                  isSelected && 'dropdown-item-selected'
                )}
                role="option"
                aria-selected={isSelected}
              >
                <span>{option.label}</span>

                {/* 选中标记 */}
                {isSelected && (
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
