import { YooEditor } from '@yoopta/editor';
import { SlateElement } from '@yoopta/editor';

export type MentionPluginElementKeys = 'mention';
export type MentionUser = { id: string; name: string; avatar?: string };
export type MentionElementProps = { user: MentionUser; nodeType: 'inlineVoid' };
export type MentionElement = SlateElement<'mention', MentionElementProps>;

export type MentionElementMap = {
  mention: MentionElement;
};

export type MentionPluginOptions = {
  onSearch: (query: string) => Promise<MentionUser[]>;
  onSelect?: (user: MentionUser) => void;
  renderMention?: (user: MentionUser) => React.ReactNode;
  renderDropdownItem?: (user: MentionUser) => React.ReactNode;
  char?: string;
};
