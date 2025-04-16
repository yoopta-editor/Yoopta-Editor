import { YooptaPlugin } from '@yoopta/editor';
import { TabsCommands } from './TabsCommands';
import { TabsList } from './TabsList';
import { TabsListItem } from './TabsListItem';
import { TabsListItemContent } from './TabsListItemContent';
import { TabsListItemTitle } from './TabsListItemTitle';
import { TabsPluginElements } from './types';

const TabsPlugin = new YooptaPlugin<TabsPluginElements>({
  type: 'Tabs',
  elements: {
    'tabs-list': {
      render: TabsList,
      children: ['tabs-list-item'],
      asRoot: true,
    },
    'tabs-list-item': {
      render: TabsListItem,
      children: ['tab-list-item-content', 'tab-list-item-title'],
      props: {
        active: false,
      },
    },
    'tab-list-item-title': {
      render: TabsListItemTitle,
    },
    'tab-list-item-content': {
      render: TabsListItemContent,
    },
  },
  events: {
    onBeforeCreate: (editor) => {
      return TabsCommands.buildTabsElements(editor, { items: 3 });
    },
  },
  commands: TabsCommands,
});

export { TabsPlugin };
