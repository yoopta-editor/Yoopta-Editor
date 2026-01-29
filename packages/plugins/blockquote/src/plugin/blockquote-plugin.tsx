import { YooptaPlugin, serializeTextNodes, serializeTextNodesIntoMarkdown } from '@yoopta/editor';

import { BlockquoteCommands } from '../commands/BlockquoteCommands';
import { withBlockquote } from '../extensions/withBlockquote';
import type { BlockquoteElement } from '../types';

const Blockquote = new YooptaPlugin<Record<'blockquote', BlockquoteElement>>({
  type: 'Blockquote',
  elements: {
    blockquote: {
      render: (props) => <blockquote {...props.attributes}>{props.children}</blockquote>,
    },
  },
  options: {
    display: {
      title: 'Blockquote',
      description: 'Capture quote',
    },
    shortcuts: ['>'],
  },
  commands: BlockquoteCommands,
  extensions: withBlockquote,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['BLOCKQUOTE'],
      },
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta || {};
        return `<blockquote data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; text-align: ${align}; border-left: 3px solid; color: #292929; padding: 2px 14px; margin-top: 8px;">${serializeTextNodes(
          element.children,
        )}</blockquote>`;
      },
    },
    markdown: {
      serialize: (element) => `> ${serializeTextNodesIntoMarkdown(element.children)}`,
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta || {};
        return `
        <table style="width:100%;">
          <tbody style="width:100%;">
            <tr>
              <td>
                <blockquote data-meta-align="${align}" data-meta-depth="${depth}" style="
    line-height: 1.75rem;
    margin: 8px 0 0; border-color: #e5e7eb; margin-left: ${
      depth * 20
    }px; text-align: ${align}; border-left: 3px solid; color: #292929; padding: 2px 14px; margin-top: 8px;">${serializeTextNodes(
          element.children,
        )}</blockquote>
              </td>
            </tr>
          </tbody>
        </table>`;
      },
    },
  },
});

export { Blockquote };
