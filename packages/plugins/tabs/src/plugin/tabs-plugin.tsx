import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { YooptaPlugin } from '@yoopta/editor';
import { Editor, Element, Transforms } from 'slate';

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

const tabsContainerProps = {
  activeTabId: null,
};

const tabsContentProps = {
  referenceId: null,
};

const Tabs = new YooptaPlugin<TabsElementMap>({
  type: 'Tabs',
  elements: (
    <tabs-container render={TabsContainer} props={tabsContainerProps}>
      <tabs-list render={TabsList}>
        <tabs-item-heading render={TabsItemHeading} />
      </tabs-list>
      <tabs-item-content render={TabsItemContent} props={tabsContentProps} />
    </tabs-container>
  ),
  commands: TabsCommands,
  options: {
    display: {
      title: 'Tabs',
      description: 'Toggle content in tabs',
    },
  },
  events: {
    onKeyDown: (editor, slate, options) => (event) => {
      if (options.hotkeys.isEnter(event)) {
        if (!slate.selection) return;
        event.preventDefault();

        const nodeEntry = Editor.above<SlateElement>(slate, {
          at: slate.selection,
          match: (n) => Element.isElement(n),
        });

        if (!nodeEntry) return;

        const [node] = nodeEntry;

        if (node.type === 'tabs-item-content') {
          event.preventDefault();
          Transforms.insertText(slate, '\n');
          return;
        }

        if (node.type === 'tabs-item-heading') {
          event.preventDefault();
          TabsCommands.addTabItem(editor, options.currentBlock.id, { at: slate.selection });
          return;
        }

        Transforms.insertText(slate, '\n');
      }
    },
  },
});

export { Tabs };
