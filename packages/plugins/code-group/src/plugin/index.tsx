import { YooptaPlugin, generateId } from '@yoopta/editor';
import { Transforms } from 'slate';

import { CodeGroupCommands } from '../commands';
import type { CodeGroupElementMap, CodeGroupPluginBlockOptions } from '../types';
import { initHighlighter } from '../utils/shiki';

initHighlighter();

const CodeGroup = new YooptaPlugin<CodeGroupElementMap, CodeGroupPluginBlockOptions>({
  type: 'CodeGroup',
  elements: (
    <code-group>
      <code-filename-list>
        <code-filename />
      </code-filename-list>
      <code-group-content></code-group-content>
    </code-group>
  ),
  options: {
    display: {
      title: 'CodeGroup',
      description: 'Write the best code ever!',
    },
    shortcuts: ['```', 'code', 'js'],
  },
  commands: CodeGroupCommands,
});

export { CodeGroup };
