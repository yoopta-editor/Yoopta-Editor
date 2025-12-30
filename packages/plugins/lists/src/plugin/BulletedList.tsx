import type { SlateElement } from '@yoopta/editor';
import {
  YooptaPlugin,
  deserializeTextNodes,
  generateId,
  serializeTextNodes,
  serializeTextNodesIntoMarkdown,
} from '@yoopta/editor';

import { BulletedListCommands } from '../commands';
import { onKeyDown } from '../events/onKeyDown';
import type { ListElementMap } from '../types';

const BulletedList = new YooptaPlugin<Pick<ListElementMap, 'bulleted-list'>>({
  type: 'BulletedList',
  elements: (
    <bulleted-list
      render={(props) => <ul {...props.attributes}>{props.children}</ul>}
      nodeType="block">
      <bulleted-list-item
        render={(props) => <li {...props.attributes}>{props.children}</li>}
        nodeType="block"
      />
    </bulleted-list>
  ),
  options: {
    display: {
      title: 'Bulleted List',
      description: 'Create bullet list',
    },
    shortcuts: ['-'],
  },
  events: {
    onKeyDown,
  },
  commands: BulletedListCommands,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['UL'],
        parse(el, editor) {
          if (el.nodeName === 'UL') {
            const listItems = Array.from(el.children).filter((child) => child.nodeName === 'LI');

            // Always ensure at least one list item
            if (listItems.length === 0) {
              return {
                id: generateId(),
                type: 'bulleted-list',
                children: [
                  {
                    id: generateId(),
                    type: 'bulleted-list-item',
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
                type: 'bulleted-list-item',
                children: textNodes.length > 0 ? textNodes : [{ text: '' }],
                props: { nodeType: 'block' },
              };
            });

            return {
              id: generateId(),
              type: 'bulleted-list',
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
              'type' in child && child.type === 'bulleted-list-item',
          )
          .map((item) => `<li>${serializeTextNodes(item.children)}</li>`)
          .join('');

        return `<ul data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; text-align: ${align}">${listItems}</ul>`;
      },
    },
    markdown: {
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta ?? {};
        const indent = '  '.repeat(depth);
        const listItems = element.children
          .filter(
            (child): child is SlateElement =>
              'type' in child && child.type === 'bulleted-list-item',
          )
          .map((item) => `${indent}- ${serializeTextNodesIntoMarkdown(item.children)}`)
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
              'type' in child && child.type === 'bulleted-list-item',
          )
          .map((item) => `<li style="margin: 0">${serializeTextNodes(item.children)}</li>`)
          .join('');

        return `
          <table style="width:100%;">
            <tbody style="width:100%;">
              <tr>
                <td>
                  <ul data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; text-align: ${align}; 
        font-size: 16px;
        line-height: 1.75rem;
        padding-bottom: 2px;
        padding-left: 1rem;
        padding-top: 2px;
        margin: 0;
        ">${listItems}</ul>
                </td>
              </tr>
            </tbody>
          </table>
        `;
      },
    },
  },
});

export { BulletedList };
