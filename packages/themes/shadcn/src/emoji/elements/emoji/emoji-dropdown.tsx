import { useEffect, useRef } from 'react';
import { useEmojiDropdown } from '@yoopta/emoji';

import { EmojiItem } from './emoji-item';
import { ScrollArea } from '../../../ui/scroll-area';
import { cn } from '../../../utils';

type EmojiDropdownProps = {
  maxHeight?: number;
  className?: string;
};

export const EmojiDropdown = ({ maxHeight = 280, className }: EmojiDropdownProps) => {
  const {
    isOpen,
    query,
    trigger,
    items,
    loading,
    error,
    selectedIndex,
    setSelectedIndex,
    selectItem,
    refs,
    floatingStyles,
  } = useEmojiDropdown();

  const listRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRef.current && listRef.current) {
      selectedRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;
  if (!loading && !error && items.length === 0 && !query) return null;

  return (
    <div
      ref={refs.setFloating}
      style={floatingStyles}
      className={cn(
        'z-50 min-w-[200px] max-w-[280px] rounded-md border bg-popover text-popover-foreground shadow-md',
        'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        className,
      )}>
      {query && (
        <div className="px-3 py-2 border-b">
          <p className="text-xs text-muted-foreground">
            Searching for &ldquo;{trigger?.char}
            <span className="font-medium text-foreground">{query}</span>&rdquo;
          </p>
        </div>
      )}

      {loading && (
        <div className="p-2 space-y-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2.5 px-2 py-1.5 animate-pulse">
              <div className="w-6 h-6 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="px-2 py-3 text-center">
          <p className="text-sm text-destructive">{error.message}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && query && (
        <div className="px-2 py-3 text-center">
          <p className="text-sm text-muted-foreground">No emoji found</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <ScrollArea style={{ maxHeight, overflowY: 'auto' }} className="p-1">
          <div ref={listRef} role="listbox" aria-label="Emoji suggestions">
            {items.map((item, index) => (
              <div
                key={`${item.emoji}-${item.name}`}
                ref={index === selectedIndex ? selectedRef : undefined}
                role="option"
                aria-selected={index === selectedIndex}>
                <EmojiItem
                  item={item}
                  selected={index === selectedIndex}
                  onSelect={() => selectItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {items.length > 0 && (
        <div className="px-3 py-1.5 border-t text-[10px] text-muted-foreground flex items-center gap-2">
          <span>
            <kbd className="px-1 py-0.5 rounded bg-muted text-[9px]">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="px-1 py-0.5 rounded bg-muted text-[9px]">↵</kbd> select
          </span>
          <span>
            <kbd className="px-1 py-0.5 rounded bg-muted text-[9px]">esc</kbd> close
          </span>
        </div>
      )}
    </div>
  );
};
