import type { MouseEvent } from 'react';
import type { EmojiItem as EmojiItemType } from '@yoopta/emoji';

import { cn } from '../../../utils';

type EmojiItemProps = {
  item: EmojiItemType;
  selected: boolean;
  onSelect: () => void;
  onMouseEnter?: () => void;
};

export const EmojiItem = ({ item, selected, onSelect, onMouseEnter }: EmojiItemProps) => {
  const selectEmoji = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onSelect();
  }

  return (
    <button
      type="button"
      onClick={selectEmoji}
      onMouseEnter={onMouseEnter}
      className={cn(
        'w-full flex items-center gap-2.5 px-2 py-1.5 text-left rounded-sm transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:outline-none focus:bg-accent focus:text-accent-foreground',
        selected && 'bg-accent text-accent-foreground',
      )}>
      <span className="text-lg leading-none shrink-0 w-6 text-center">{item.emoji}</span>
      <span className="text-sm truncate text-muted-foreground">:{item.name}:</span>
    </button>
  );
};
