import type { PluginElementRenderProps } from '@yoopta/editor';
import { YooptaPlugin } from '@yoopta/editor';

import { TabsCommands } from '../commands/tabs-commands';
import type { TabsElementMap } from '../types';

const TabsContainer = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes}>{children}</div>
);

const TabsList = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes}>{children}</div>
);

const TabsItemHeading = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes}>{children}</div>
);

const TabsItemContent = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes}>{children}</div>
);

// const elements = editor.y('tabs-container', {
//   children: [
//     editor.y('tabs-list', {
//       children: [
//         editor.y('tabs-item-heading', { children: [editor.y.text('Tab 1')] }),
//         editor.y('tabs-item-heading', { children: [editor.y.text('Tab 2')] }),
//         editor.y('tabs-item-heading', { children: [editor.y.text('Tab 3')] }),
//       ],
//     }),
//     editor.y('tabs-item-content', { children: [editor.y.text('Tab 1 content')] }),
//     editor.y('tabs-item-content', { children: [editor.y.text('Tab 2 content')] }),
//     editor.y('tabs-item-content', { children: [editor.y.text('Tab 3 content')] }),
//   ],
// });

const Tabs = new YooptaPlugin<TabsElementMap>({
  type: 'Tabs',
  elements: (
    <tabs-container render={TabsContainer}>
      <tabs-list render={TabsList}>
        <tabs-item-heading render={TabsItemHeading} />
      </tabs-list>
      <tabs-item-content render={TabsItemContent} />
    </tabs-container>
  ),
  commands: TabsCommands,
  options: {
    display: {
      title: 'Tabs',
      description: 'Toggle content in tabs',
    },
  },
});

export { Tabs };
