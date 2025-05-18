import { SlateElement } from '@yoopta/editor';

export type MentionPluginElementKeys = 'mention';
export type MentionUser = { id: string; name: string; avatar?: string };
export type MentionElementProps = { user: MentionUser; nodeType: 'inlineVoid' };
export type MentionElement = SlateElement<'mention', MentionElementProps>;

export type MentionElementMap = {
  mention: MentionElement;
};
