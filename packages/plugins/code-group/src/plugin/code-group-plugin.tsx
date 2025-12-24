import type { PluginElementRenderProps } from '@yoopta/editor';
import { YooptaPlugin } from '@yoopta/editor';
import { Transforms } from 'slate';

import { CodeGroupCommands } from '../commands';
import type { CodeGroupElementMap, CodeGroupPluginBlockOptions } from '../types';
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

const codeGroupContainerProps = {
  activeTabId: null,
};

const codeGroupContentProps = {
  referenceId: null,
  language: 'javascript',
  theme: 'github-dark',
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
    onKeyDown:
      (editor, slate, { hotkeys }) =>
      (event) => {
        if (!slate.selection) return;

        if (hotkeys.isEnter(event) || hotkeys.isShiftEnter(event)) {
          event.preventDefault();
          event.stopPropagation();

          Transforms.insertText(slate, '\n', { at: slate.selection });
        }
      },
    onPaste: (editor, slate) => (event) => {
      event.preventDefault();
      event.stopPropagation();
      const text = event.clipboardData.getData('text/plain');
      slate.insertText(text);
    },
  },
});

export { CodeGroup };
