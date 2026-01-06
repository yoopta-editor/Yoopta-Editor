import { useCallback, useEffect, useRef } from 'react';

import { KEYS } from '../constants';

type UseKeyboardNavigationOptions = {
  isOpen: boolean;
  itemCount: number;
  selectedIndex: number;
  onSelectIndex: (index: number | ((prev: number) => number)) => void;
  onExecute: () => void;
  onClose: () => void;
  loop?: boolean;
};

export function useKeyboardNavigation({
  isOpen,
  itemCount,
  onSelectIndex,
  onExecute,
  onClose,
  loop = true,
}: UseKeyboardNavigationOptions) {
  const itemCountRef = useRef(itemCount);
  itemCountRef.current = itemCount;

  const selectNext = useCallback(() => {
    const count = itemCountRef.current;
    if (count === 0) return;

    onSelectIndex((prevIndex: number) => {
      if (loop) {
        return (prevIndex + 1) % count;
      }
      return Math.min(prevIndex + 1, count - 1);
    });
  }, [onSelectIndex, loop]);

  const selectPrevious = useCallback(() => {
    const count = itemCountRef.current;
    if (count === 0) return;

    onSelectIndex((prevIndex: number) => {
      if (loop) {
        return prevIndex <= 0 ? count - 1 : prevIndex - 1;
      }
      return Math.max(prevIndex - 1, 0);
    });
  }, [onSelectIndex, loop]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case KEYS.ARROW_DOWN:
          event.preventDefault();
          event.stopPropagation();
          selectNext();
          break;

        case KEYS.ARROW_UP:
          event.preventDefault();
          event.stopPropagation();
          selectPrevious();
          break;

        case KEYS.ENTER:
          event.preventDefault();
          event.stopPropagation();
          onExecute();
          break;

        case KEYS.ESCAPE:
          event.preventDefault();
          event.stopPropagation();
          onClose();
          break;

        case KEYS.TAB:
          event.preventDefault();
          break;

        default:
          break;
      }
    },
    [isOpen, selectNext, selectPrevious, onExecute, onClose],
  );

  // Use capture phase to intercept before editor
  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, handleKeyDown]);

  return {
    selectNext,
    selectPrevious,
  };
}
