import type { MentionItem, MentionType } from '@yoopta/mention';

export type MentionThemeConfig = {
  /** Show avatar in mention element */
  showAvatar?: boolean;
  /** Show type badge */
  showTypeBadge?: boolean;
  /** Custom colors per mention type */
  typeColors?: Partial<Record<MentionType, string>>;
};

export type MentionItemRenderProps<TMeta = Record<string, unknown>> = {
  item: MentionItem<TMeta>;
  index: number;
  selected: boolean;
  onSelect: () => void;
};

export const DEFAULT_TYPE_COLORS: Record<string, string> = {
  user: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  channel: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  page: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  custom: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};
