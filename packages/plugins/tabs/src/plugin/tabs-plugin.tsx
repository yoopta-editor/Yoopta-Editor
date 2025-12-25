import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { YooptaPlugin, generateId } from '@yoopta/editor';
import { Editor, Element, Range, Transforms } from 'slate';

import { TabsCommands } from '../commands/tabs-commands';
import { withTabs } from '../extenstions/with-tabs';
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
  lifecycle: {
    beforeCreate: (editor) => {
      const tabId = generateId();
      return editor.y('tabs-container', {
        props: { activeTabId: tabId },
        children: [
          editor.y('tabs-list', {
            children: [
              editor.y('tabs-item-heading', { id: tabId, children: [editor.y.text('Tab 1')] }),
            ],
          }),
          editor.y('tabs-item-content', {
            props: { referenceId: tabId },
            children: [editor.y.text('Tab 1 content')],
          }),
        ],
      });
    },
  },
  extensions: withTabs,
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

      if (options.hotkeys.isBackspace(event)) {
        if (!slate.selection) return;
        const nodeEntry = Editor.above<SlateElement>(slate, {
          at: slate.selection,
          match: (n) => Element.isElement(n),
        });

        if (!nodeEntry) return;

        const [node, path] = nodeEntry;

        const isStart = Editor.isStart(slate, slate.selection.anchor, path);
        const isCollapsed = Range.isCollapsed(slate.selection);
        if (
          isStart &&
          isCollapsed &&
          (node.type === 'tabs-item-content' || node.type === 'tabs-item-heading')
        ) {
          event.preventDefault();
        }
      }

      if (options.hotkeys.isSelect(event)) {
        if (!slate.selection) {
          event.preventDefault();
          return;
        }

        const nodeEntry = Editor.above<SlateElement>(slate, {
          at: slate.selection,
          match: (n) => Element.isElement(n),
        });

        if (!nodeEntry) {
          event.preventDefault();
          return;
        }

        const [node, path] = nodeEntry;

        if (node.type === 'tabs-item-content' || node.type === 'tabs-item-heading') {
          event.preventDefault();
          Transforms.select(slate, path);
          return;
        }

        event.preventDefault();
      }
    },
  },
});

export { Tabs };
