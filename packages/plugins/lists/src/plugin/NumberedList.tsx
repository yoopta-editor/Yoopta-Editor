import type { SlateElement } from '@yoopta/editor';
import {
  YooptaPlugin,
  deserializeTextNodes,
  generateId,
  serializeTextNodes,
  serializeTextNodesIntoMarkdown,
} from '@yoopta/editor';

import { NumberedListCommands } from '../commands';
import { onKeyDown } from '../events/onKeyDown';
import type { ListElementMap } from '../types';

const NumberedList = new YooptaPlugin<Pick<ListElementMap, 'numbered-list'>>({
  type: 'NumberedList',
  elements: (
    <numbered-list
      render={(props) => <ol {...props.attributes}>{props.children}</ol>}
      nodeType="block">
      <numbered-list-item
        render={(props) => <li {...props.attributes}>{props.children}</li>}
        nodeType="block"
      />
    </numbered-list>
  ),
  options: {
    display: {
      title: 'Numbered List',
      description: 'Create list with numbering',
    },
    shortcuts: ['1.'],
  },
  events: { onKeyDown },
  commands: NumberedListCommands,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['OL'],
        parse(el, editor) {
          if (el.nodeName === 'OL') {
            const listItems = Array.from(el.children).filter((child) => child.nodeName === 'LI');

            // Always ensure at least one list item
            if (listItems.length === 0) {
              return {
                id: generateId(),
                type: 'numbered-list',
                children: [
                  {
                    id: generateId(),
                    type: 'numbered-list-item',
                    children: [{ text: '' }],
                    props: { nodeType: 'block' },
                  },
                ],
                props: { nodeType: 'block' },
              };
            }

            const listItemElements = listItems.map((listItem) => {
              const textNodes = deserializeTextNodes(editor, listItem.childNodes);
              return {
                id: generateId(),
                type: 'numbered-list-item',
                children: textNodes.length > 0 ? textNodes : [{ text: '' }],
                props: { nodeType: 'block' },
              };
            });

            return {
              id: generateId(),
              type: 'numbered-list',
              children: listItemElements,
              props: { nodeType: 'block' },
            };
          }
        },
      },
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta ?? {};

        const listItems = element.children
          .filter(
            (child): child is SlateElement =>
              'type' in child && child.type === 'numbered-list-item',
          )
          .map((item) => `<li>${serializeTextNodes(item.children)}</li>`)
          .join('');

        return `<ol data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; text-align: ${align}">${listItems}</ol>`;
      },
    },
    markdown: {
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta ?? {};
        const indent = '  '.repeat(depth);
        const listItems = element.children
          .filter(
            (child): child is SlateElement =>
              'type' in child && child.type === 'numbered-list-item',
          )
          .map(
            (item, index) =>
              `${indent}${index + 1}. ${serializeTextNodesIntoMarkdown(item.children)}`,
          )
          .join('\n');
        return listItems;
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta ?? {};
        const listItems = element.children
          .filter(
            (child): child is SlateElement =>
              'type' in child && child.type === 'numbered-list-item',
          )
          .map((item) => `<li>${serializeTextNodes(item.children)}</li>`)
          .join('');

        return `
          <table style="width:100%;">
            <tbody style="width:100%;">
              <tr>
                <td>
                  <ol data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${depth}px; text-align: ${align};     font-size: 16px;
    line-height: 28px;
    padding-bottom: 2px;
    padding-left: 1rem;
    padding-top: 2px;
    margin: 0;
    ">${listItems}</ol>
                </td>
              </tr>
            </tbody>
          </table>
        `;
      },
    },
  },
});

export { NumberedList };
