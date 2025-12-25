import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { YooptaPlugin, generateId } from '@yoopta/editor';
import { Editor, Element, Range, Transforms } from 'slate';

import { CodeGroupCommands } from '../commands';
import type {
  CodeGroupContainerElementProps,
  CodeGroupContentElementProps,
  CodeGroupElementMap,
  CodeGroupPluginBlockOptions,
} from '../types';
import { initHighlighter } from '../utils/shiki';

initHighlighter();

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
    // shortcuts: ['```', 'code', 'js'],
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
});

export { CodeGroup };
