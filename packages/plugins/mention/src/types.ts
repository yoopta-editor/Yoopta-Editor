import { SlateElement } from '@yoopta/editor';

export type MentionPluginElementKeys = 'mention';
export type MentionItem = { id: string; name: string; avatar?: string };
export type MentionElementProps = { mention: MentionItem; nodeType: 'inlineVoid' };
export type MentionElement = SlateElement<'mention', MentionElementProps>;

export type MentionElementMap = {
  mention: MentionElement;
};

export type MentionPluginOptions = {
  onSearch: (query: string) => Promise<MentionItem[]>;
  onSelect?: (mention: MentionItem) => void;
  renderMention?: (mention: MentionItem) => React.ReactNode;
  renderDropdownItem?: (mention: MentionItem) => React.ReactNode;
  char?: string;
};

export interface MentionEditor {
  mentions: {
    target: { domRect: DOMRect; clientRect: DOMRectList } | null;
    search: string;
  };
}
