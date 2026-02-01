import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { YooptaPlugin, generateId, serializeTextNodes, serializeTextNodesIntoMarkdown } from '@yoopta/editor';
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
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['DIV'],
        parse: (el) => {
          if (el.getAttribute('data-type') !== 'tabs-container') return;

          // Check if this is our tabs format (has tabs header with buttons)
          const tabsHeader = el.querySelector(':scope > div[style*="display: flex"]');
          if (!tabsHeader) return;

          const tabButtons = tabsHeader.querySelectorAll('button[data-tab-id]');
          if (tabButtons.length === 0) return;

          const tabHeadings: SlateElement[] = [];
          const tabContents: SlateElement[] = [];

          let firstTabId: string | null = null;

          tabButtons.forEach((button, index) => {
            const tabId = button.getAttribute('data-tab-id') || `tab-${index}`;
            if (index === 0) firstTabId = tabId;

            tabHeadings.push({
              id: tabId,
              type: 'tabs-item-heading',
              children: [{ text: button.textContent || `Tab ${index + 1}` }],
            } as SlateElement);
          });

          // Find corresponding content divs
          const contentDivs = el.querySelectorAll('[data-tab-content-id]');
          contentDivs.forEach((contentDiv) => {
            const referenceId = contentDiv.getAttribute('data-tab-content-id') || '';

            tabContents.push({
              id: `content-${referenceId}`,
              type: 'tabs-item-content',
              children: [{ text: contentDiv.textContent || '' }],
              props: { referenceId },
            } as SlateElement);
          });

          if (tabHeadings.length === 0) return;

          return {
            id: 'tabs-container',
            type: 'tabs-container',
            children: [
              {
                id: 'tabs-list',
                type: 'tabs-list',
                children: tabHeadings,
              },
              ...tabContents,
            ],
            props: { activeTabId: firstTabId, nodeType: 'block' },
          } as SlateElement;
        },
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta || {};

        if (element.type === 'tabs-container') {
          const tabsList = element.children?.find((c: SlateElement) => c.type === 'tabs-list');
          const contents = element.children?.filter(
            (c: SlateElement) => c.type === 'tabs-item-content',
          );

          const tabHeadings = tabsList?.children || [];
          const activeTabId = element.props?.activeTabId;

          const tabsHeaderHtml = tabHeadings
            .map((heading: SlateElement) => {
              const isActive = heading.id === activeTabId;
              const headingText = serializeTextNodes(heading.children);
              return `<button style="padding: 8px 16px; border: none; background: ${isActive ? '#f3f4f6' : 'transparent'}; cursor: pointer; font-weight: ${isActive ? '600' : '400'};" data-tab-id="${heading.id}">${headingText}</button>`;
            })
            .join('');

          const tabsContentHtml = (contents || [])
            .map((content: SlateElement) => {
              const isActive = content.props?.referenceId === activeTabId;
              const contentText = serializeTextNodes(content.children);
              return `<div style="display: ${isActive ? 'block' : 'none'}; padding: 16px; border: 1px solid #e5e7eb; border-top: none;" data-tab-content-id="${content.props?.referenceId}">${contentText}</div>`;
            })
            .join('');

          return `
            <div data-type="tabs-container" data-meta-depth="${depth}" style="margin-left: ${depth * 20}px;">
              <div style="display: flex; border-bottom: 1px solid #e5e7eb;">${tabsHeaderHtml}</div>
              ${tabsContentHtml}
            </div>`;
        }

        return '';
      },
    },
    markdown: {
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta || {};
        const indent = '  '.repeat(depth);

        if (element.type === 'tabs-container') {
          const tabsList = element.children?.find((c: SlateElement) => c.type === 'tabs-list');
          const contents = element.children?.filter(
            (c: SlateElement) => c.type === 'tabs-item-content',
          );

          const tabHeadings = tabsList?.children || [];

          return tabHeadings
            .map((heading: SlateElement, index: number) => {
              const headingText = serializeTextNodesIntoMarkdown(heading.children);
              const content = (contents || []).find(
                (c: SlateElement) => c.props?.referenceId === heading.id,
              );
              const contentText = content
                ? serializeTextNodesIntoMarkdown(content.children)
                : '';

              return `${indent}### ${headingText}\n${indent}${contentText}`;
            })
            .join('\n\n');
        }

        return '';
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta || {};

        if (element.type === 'tabs-container') {
          const tabsList = element.children?.find((c: SlateElement) => c.type === 'tabs-list');
          const contents = element.children?.filter(
            (c: SlateElement) => c.type === 'tabs-item-content',
          );

          const tabHeadings = tabsList?.children || [];

          // For email, show all tabs as sections since interactive tabs don't work
          const sectionsHtml = tabHeadings
            .map((heading: SlateElement) => {
              const headingText = serializeTextNodes(heading.children);
              const content = (contents || []).find(
                (c: SlateElement) => c.props?.referenceId === heading.id,
              );
              const contentText = content ? serializeTextNodes(content.children) : '';

              return `
                <tr>
                  <td style="padding: 12px 0;">
                    <div style="font-weight: 600; margin-bottom: 8px; padding: 8px; background: #f3f4f6;">${headingText}</div>
                    <div style="padding: 8px;">${contentText}</div>
                  </td>
                </tr>`;
            })
            .join('');

          return `
            <table style="width: 100%; margin-left: ${depth * 20}px; border: 1px solid #e5e7eb;">
              <tbody>
                ${sectionsHtml}
              </tbody>
            </table>`;
        }

        return '';
      },
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
