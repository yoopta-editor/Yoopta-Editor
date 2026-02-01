import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { YooptaPlugin, generateId, serializeTextNodes, serializeTextNodesIntoMarkdown } from '@yoopta/editor';
import { Editor, Element, Range, Transforms } from 'slate';

import { CodeGroupCommands } from '../commands/code-group-commands';
import type {
  CodeGroupContainerElementProps,
  CodeGroupContentElementProps,
  CodeGroupElementMap,
  CodeGroupPluginBlockOptions,
} from '../types';
import { SHIKI_CODE_THEMES } from '../utils/shiki';

const CodeGroupContainer = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes}>{children}</div>
);

const CodeGroupList = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes}>{children}</div>
);

const CodeGroupItemHeading = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes}>{children}</div>
);

const CodeGroupContent = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes}>{children}</div>
);

const codeGroupContainerProps: CodeGroupContainerElementProps = {
  activeTabId: null,
  theme: 'github-dark',
};

const codeGroupContentProps: CodeGroupContentElementProps = {
  referenceId: null,
  language: 'typescript',
};

const CodeGroup = new YooptaPlugin<CodeGroupElementMap, CodeGroupPluginBlockOptions>({
  type: 'CodeGroup',
  elements: (
    <code-group-container render={CodeGroupContainer} props={codeGroupContainerProps}>
      <code-group-list render={CodeGroupList}>
        <code-group-item-heading render={CodeGroupItemHeading} />
      </code-group-list>
      <code-group-content render={CodeGroupContent} props={codeGroupContentProps} />
    </code-group-container>
  ),
  options: {
    display: {
      title: 'CodeGroup',
      description: 'A group of code blocks',
    },
    shortcuts: ['```tabs'],
  },
  commands: CodeGroupCommands,
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

        if (node.type === 'code-group-content') {
          event.preventDefault();
          Transforms.insertText(slate, '\n');
          return;
        }

        if (node.type === 'code-group-item-heading') {
          event.preventDefault();
          CodeGroupCommands.addTabItem(editor, options.currentBlock.id, { at: slate.selection });
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
          (node.type === 'code-group-content' || node.type === 'code-group-item-heading')
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

        if (node.type === 'code-group-content' || node.type === 'code-group-item-heading') {
          event.preventDefault();
          Transforms.select(slate, path);
          return;
        }

        event.preventDefault();
      }
    },
  },
  lifecycle: {
    beforeCreate: (editor) => {
      const tabId = generateId();

      return editor.y('code-group-container', {
        props: { activeTabId: tabId, theme: 'github-dark' },
        children: [
          editor.y('code-group-list', {
            children: [
              editor.y('code-group-item-heading', {
                id: tabId,
                children: [editor.y.text('hello-world.ts')],
              }),
            ],
          }),
          editor.y('code-group-content', {
            props: { referenceId: tabId, language: 'typescript' },
            children: [editor.y.text('console.log("Hello World");')],
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
          if (el.getAttribute('data-type') !== 'code-group-container') return;

          const theme = SHIKI_CODE_THEMES.find((t) => t.value === el.getAttribute('data-theme'))?.value ?? 'github-dark';

          // Find tabs header with buttons
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
              type: 'code-group-item-heading',
              children: [{ text: button.textContent || `file-${index + 1}.ts` }],
            } as SlateElement);
          });

          // Find corresponding pre/code blocks
          const codeBlocks = el.querySelectorAll('pre[data-tab-content-id]');
          codeBlocks.forEach((codeBlock) => {
            const referenceId = codeBlock.getAttribute('data-tab-content-id') || '';
            const language = codeBlock.getAttribute('data-language') || 'typescript';
            const codeContent = codeBlock.querySelector('code')?.textContent || codeBlock.textContent || '';

            tabContents.push({
              id: `content-${referenceId}`,
              type: 'code-group-content',
              children: [{ text: codeContent }],
              props: { referenceId, language },
            } as SlateElement);
          });

          if (tabHeadings.length === 0) return;

          return {
            id: 'code-group-container',
            type: 'code-group-container',
            children: [
              {
                id: 'code-group-list',
                type: 'code-group-list',
                children: tabHeadings,
              },
              ...tabContents,
            ],
            props: { activeTabId: firstTabId, theme, nodeType: 'block' },
          } as SlateElement;
        },
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta || {};

        if (element.type === 'code-group-container') {
          const tabsList = element.children?.find((c: SlateElement) => c.type === 'code-group-list');
          const contents = element.children?.filter(
            (c: SlateElement) => c.type === 'code-group-content',
          );

          const tabHeadings = tabsList?.children || [];
          const activeTabId = element.props?.activeTabId;
          const theme = element.props?.theme || 'github-dark';

          const tabsHeaderHtml = tabHeadings
            .map((heading: SlateElement) => {
              const isActive = heading.id === activeTabId;
              const headingText = serializeTextNodes(heading.children);
              return `<button style="padding: 6px 12px; border: none; background: ${isActive ? '#1e293b' : '#334155'}; color: #e2e8f0; cursor: pointer; font-size: 12px; font-family: monospace;" data-tab-id="${heading.id}">${headingText}</button>`;
            })
            .join('');

          const tabsContentHtml = (contents || [])
            .map((content: SlateElement) => {
              const isActive = content.props?.referenceId === activeTabId;
              const contentText = serializeTextNodes(content.children);
              const language = content.props?.language || 'plaintext';
              return `<pre style="display: ${isActive ? 'block' : 'none'}; margin: 0; padding: 16px; background: #0f172a; color: #e2e8f0; overflow-x: auto;" data-language="${language}" data-tab-content-id="${content.props?.referenceId}"><code>${contentText}</code></pre>`;
            })
            .join('');

          return `
            <div data-type="code-group-container" data-meta-depth="${depth}" data-theme="${theme}" style="margin-left: ${depth * 20}px; border-radius: 8px; overflow: hidden;">
              <div style="display: flex; background: #1e293b;">${tabsHeaderHtml}</div>
              ${tabsContentHtml}
            </div>`;
        }

        return '';
      },
    },
    markdown: {
      serialize: (element) => {
        if (element.type === 'code-group-container') {
          const tabsList = element.children?.find((c) => Element.isElement(c) && c.type === 'code-group-list');
          const contents = element.children?.filter(
            (c) => Element.isElement(c) && c.type === 'code-group-content',
          );

          const tabHeadings = tabsList?.children || [];

          return tabHeadings
            .map((heading) => {
              const headingText = serializeTextNodesIntoMarkdown(heading.children);
              const content = (contents || []).find(
                (c) => Element.isElement(c) && c.props?.referenceId === heading.id,
              );
              const contentText = content
                ? serializeTextNodesIntoMarkdown(content.children)
                : '';
              const language = content?.props?.language || '';

              return `\`\`\`${language} title="${headingText}"\n${contentText}\n\`\`\``;
            })
            .join('\n\n');
        }

        return '';
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta || {};

        if (element.type === 'code-group-container') {
          const tabsList = element.children?.find((c: SlateElement) => c.type === 'code-group-list');
          const contents = element.children?.filter(
            (c: SlateElement) => c.type === 'code-group-content',
          );

          const tabHeadings = tabsList?.children || [];

          // For email, show all code blocks stacked
          const blocksHtml = tabHeadings
            .map((heading: SlateElement) => {
              const headingText = serializeTextNodes(heading.children);
              const content = (contents || []).find(
                (c: SlateElement) => c.props?.referenceId === heading.id,
              );
              const contentText = content ? serializeTextNodes(content.children) : '';
              const language = content?.props?.language || 'plaintext';

              return `
                <tr>
                  <td style="padding-bottom: 16px;">
                    <div style="padding: 6px 12px; background: #1e293b; color: #e2e8f0; font-size: 12px; font-family: monospace; border-radius: 8px 8px 0 0;">${headingText}</div>
                    <pre style="margin: 0; padding: 16px; background: #0f172a; color: #e2e8f0; overflow-x: auto; border-radius: 0 0 8px 8px;"><code>${contentText}</code></pre>
                  </td>
                </tr>`;
            })
            .join('');

          return `
            <table style="width: 100%; margin-left: ${depth * 20}px;">
              <tbody>
                ${blocksHtml}
              </tbody>
            </table>`;
        }

        return '';
      },
    },
  },
});

export { CodeGroup };
