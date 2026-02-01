import type { MentionItem as MentionItemType } from '@yoopta/mention';

import { MentionAvatar } from './mention-avatar';
import { cn } from '../../../utils';
import { DEFAULT_TYPE_COLORS } from '../../types';

type MentionItemProps<TMeta = Record<string, unknown>> = {
  item: MentionItemType<TMeta>;
  selected: boolean;
  onSelect: () => void;
  onMouseEnter?: () => void;
  showTypeBadge?: boolean;
};

export const MentionItem = (props: MentionItemProps) => {
  const { item, selected, onSelect, onMouseEnter, showTypeBadge = true } = props;
  const typeColor = item.type ? DEFAULT_TYPE_COLORS[item.type] ?? DEFAULT_TYPE_COLORS.custom : null;

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={cn(
        'w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-sm transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:outline-none focus:bg-accent focus:text-accent-foreground',
        selected && 'bg-accent text-accent-foreground',
      )}>
      <MentionAvatar name={item.name} avatar={item.avatar} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm truncate">{item.name}</span>
          {showTypeBadge && item.type && (
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', typeColor)}>
              {item.type}
            </span>
          )}
        </div>
        {item.meta && typeof item.meta === 'object' && 'description' in item.meta && (
          <p className="text-xs text-muted-foreground truncate">
            {String((item.meta as { description?: string }).description)}
          </p>
        )}
      </div>
    </button>
  );
};
