import { SlateElement } from '@yoopta/editor';

export type TabListElement = SlateElement<'tabs-list'>;
export type TabListItemElement = SlateElement<'tabs-list-item', { active: boolean }>;
export type TabListItemContentElement = SlateElement<'tab-list-item-content'>;
export type TabListItemTitleElement = SlateElement<'tab-list-item-title'>;

export type TabsPluginElements = {
  'tabs-list': TabListElement;
  'tabs-list-item': TabListItemElement;
  'tab-list-item-content': TabListItemContentElement;
  'tab-list-item-title': TabListItemTitleElement;
};
