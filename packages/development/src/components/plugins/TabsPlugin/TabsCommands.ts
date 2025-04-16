import { generateId, YooEditor } from '@yoopta/editor';
import { TabListElement } from './types';

type InsertOptions = {
  items: number;
};

type DeleteOptions = {
  at?: number;
};

export type TabsCommands = {
  buildTabsElements: (editor: YooEditor, options?: InsertOptions) => TabListElement;
  // insertTabItem: (editor: YooEditor, options?: { at?: number }) => void;
  // deleteTabs: (editor: YooEditor, blockId: string) => void;
};

export const TabsCommands: TabsCommands = {
  buildTabsElements: (editor, options) => {
    const { items = 2 } = options || {};

    const tabListElement: TabListElement = {
      id: generateId(),
      type: 'tabs-list',
      children: [],
    };

    for (let i = 0; i < items; i++) {
      const tabListItemElement = {
        id: generateId(),
        type: 'tabs-list-item',
        children: [] as any[],
        props: {
          opened: i === 0,
        },
      };

      const tabListItemTitleElement = {
        id: generateId(),
        type: 'tab-list-item-title',
        children: [{ text: `Title ${i + 1}` }],
      };

      const tabListItemElementContent = {
        id: generateId(),
        type: 'tab-list-item-content',
        children: [{ text: `` }],
      };

      tabListItemElement.children.push(tabListItemTitleElement);
      tabListItemElement.children.push(tabListItemElementContent);

      tabListElement.children.push(tabListItemElement);
    }

    return tabListElement;
  },
};
