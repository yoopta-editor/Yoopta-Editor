import { MentionElement } from './elements/mention/mention-element';

export { MentionDropdown } from './elements/mention/mention-dropdown';
export { MentionItem } from './elements/mention/mention-item';
export { MentionAvatar } from './elements/mention/mention-avatar';
export { MentionElement } from './elements/mention/mention-element';
export type { MentionThemeConfig, MentionItemRenderProps } from './types';

export const MentionUI = {
  mention: {
    render: MentionElement,
  },
};
