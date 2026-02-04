import { SlashCommandContent } from './components/slash-command-content';
import { SlashCommandEmpty } from './components/slash-command-empty';
import { SlashCommandFooter } from './components/slash-command-footer';
import { SlashCommandGroup } from './components/slash-command-group';
import { SlashCommandInput } from './components/slash-command-input';
import { SlashCommandItem } from './components/slash-command-item';
import { SlashCommandList } from './components/slash-command-list';
import { SlashCommandLoading } from './components/slash-command-loading';
import { SlashCommandRoot } from './components/slash-command-root';
import { SlashCommandSeparator } from './components/slash-command-separator';

export type {
  SlashCommandItem as SlashCommandItemType,
  SlashCommandGroup as SlashCommandGroupType,
  SlashCommandState,
  SlashCommandActions,
  SlashCommandContextValue,
  MenuPosition,
} from './types';

// Context
export {
  SlashCommandContext,
  useSlashCommandContext,
  useSlashCommandState,
  useSlashCommandActions,
  useSlashCommandItems,
  useSlashCommandRefs,
} from './context/slash-command-context';

// Hooks
export { useSlashCommand } from './hooks/useSlashCommand';

// Components
export { SlashCommandRoot } from './components/slash-command-root';
export { SlashCommandContent } from './components/slash-command-content';
export { SlashCommandInput } from './components/slash-command-input';
export { SlashCommandList } from './components/slash-command-list';
export { SlashCommandGroup } from './components/slash-command-group';
export { SlashCommandItem } from './components/slash-command-item';
export { SlashCommandEmpty } from './components/slash-command-empty';
export { SlashCommandSeparator } from './components/slash-command-separator';
export { SlashCommandFooter } from './components/slash-command-footer';
export { SlashCommandLoading } from './components/slash-command-loading';

// Component Types
export type { SlashCommandRootProps } from './components/slash-command-root';
export type { SlashCommandContentProps } from './components/slash-command-content';
export type { SlashCommandInputProps } from './components/slash-command-input';
export type { SlashCommandListProps } from './components/slash-command-list';
export type { SlashCommandGroupProps } from './components/slash-command-group';
export type { SlashCommandItemProps } from './components/slash-command-item';
export type { SlashCommandEmptyProps } from './components/slash-command-empty';
export type { SlashCommandSeparatorProps } from './components/slash-command-separator';
export type { SlashCommandFooterProps } from './components/slash-command-footer';
export type { SlashCommandLoadingProps } from './components/slash-command-loading';

export const SlashCommandMenu = Object.assign(SlashCommandRoot, {
  Root: SlashCommandRoot,
  Content: SlashCommandContent,
  Input: SlashCommandInput,
  List: SlashCommandList,
  Group: SlashCommandGroup,
  Item: SlashCommandItem,
  Empty: SlashCommandEmpty,
  Separator: SlashCommandSeparator,
  Footer: SlashCommandFooter,
  Loading: SlashCommandLoading,
});
