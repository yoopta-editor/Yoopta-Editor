import { SlashCommandContent } from './components/SlashCommandContent';
import { SlashCommandEmpty } from './components/SlashCommandEmpty';
import { SlashCommandFooter } from './components/SlashCommandFooter';
import { SlashCommandGroup } from './components/SlashCommandGroup';
import { SlashCommandInput } from './components/SlashCommandInput';
import { SlashCommandItem } from './components/SlashCommandItem';
import { SlashCommandList } from './components/SlashCommandList';
import { SlashCommandLoading } from './components/SlashCommandLoading';
import { SlashCommandRoot } from './components/SlashCommandRoot';
import { SlashCommandSeparator } from './components/SlashCommandSeparator';

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
} from './context/SlashCommandContext';

// Hooks
export { useSlashCommand } from './hooks/useSlashCommand';

// Components
export { SlashCommandRoot } from './components/SlashCommandRoot';
export { SlashCommandContent } from './components/SlashCommandContent';
export { SlashCommandInput } from './components/SlashCommandInput';
export { SlashCommandList } from './components/SlashCommandList';
export { SlashCommandGroup } from './components/SlashCommandGroup';
export { SlashCommandItem } from './components/SlashCommandItem';
export { SlashCommandEmpty } from './components/SlashCommandEmpty';
export { SlashCommandSeparator } from './components/SlashCommandSeparator';
export { SlashCommandFooter } from './components/SlashCommandFooter';
export { SlashCommandLoading } from './components/SlashCommandLoading';

// Component Types
export type { SlashCommandRootProps } from './components/SlashCommandRoot';
export type { SlashCommandContentProps } from './components/SlashCommandContent';
export type { SlashCommandInputProps } from './components/SlashCommandInput';
export type { SlashCommandListProps } from './components/SlashCommandList';
export type { SlashCommandGroupProps } from './components/SlashCommandGroup';
export type { SlashCommandItemProps } from './components/SlashCommandItem';
export type { SlashCommandEmptyProps } from './components/SlashCommandEmpty';
export type { SlashCommandSeparatorProps } from './components/SlashCommandSeparator';
export type { SlashCommandFooterProps } from './components/SlashCommandFooter';
export type { SlashCommandLoadingProps } from './components/SlashCommandLoading';

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

export default SlashCommandMenu;
