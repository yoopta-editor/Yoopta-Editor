import type { SlateElement, YooEditor } from '@yoopta/editor';
import {
  YooptaPlugin,
  deserializeTextNodes,
  generateId,
  serializeTextNodes,
  serializeTextNodesIntoMarkdown,
} from '@yoopta/editor';

import { TodoListCommands } from '../commands';
import { onKeyDown } from '../events/onKeyDown';
import type { ListElementMap } from '../types';

const TodoList = new YooptaPlugin<Pick<ListElementMap, 'todo-list'>>({
  type: 'TodoList',
  elements: (
    <todo-list
      render={(props) => (
        <ul {...props.attributes} style={{ listStyleType: 'none' }}>
          {props.children}
        </ul>
      )}
      nodeType="block">
      <todo-list-item
        render={(props) => <li {...props.attributes}>{props.children}</li>}
        nodeType="block"
      />
    </todo-list>
  ),
  options: {
    display: {
      title: 'Todo List',
      description: 'Track tasks',
    },
    shortcuts: ['[]'],
  },
  events: {
    onKeyDown,
  },
  commands: TodoListCommands,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['OL', 'UL'],
        parse(el, editor: YooEditor) {
          if (el.nodeName === 'OL' || el.nodeName === 'UL') {
            const listItems = Array.from(el.children).filter((child) => child.nodeName === 'LI');

            // Always ensure at least one list item
            // if (listItems.length === 0) {
            //   return editor.y('todo-list', {
            //     children: [
            //       editor.y('todo-list-item', {
            //         children: [{ text: '' }],
            //         props: { nodeType: 'block', checked: false },
            //       }),
            //     ],
            //   });
            // }

            const listItemElements = listItems
              .map((listItem) => {
                const textContent = listItem.textContent ?? '';
                const checkbox = listItem.querySelector(
                  'input[type="checkbox"]',
                ) as HTMLInputElement | null;

                if (!checkbox) return;
                console.log('TodoList checkbox', checkbox);
                const checked = checkbox ? checkbox.checked : /\[\s*[xX]\s*\]/.test(textContent);
                const textNodes = deserializeTextNodes(editor, listItem.childNodes);

                // If we have a checkbox, remove it from the text nodes
                let cleanedTextNodes = textNodes;
                if (checkbox) {
                  cleanedTextNodes = Array.from(listItem.childNodes)
                    .filter((node) => node !== checkbox && node.nodeName !== '#text')
                    .reduce((acc, node) => {
                      if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.textContent?.replace(/\[\s*[xX\s]?\s*\]/, '').trim();
                        if (text) {
                          return [...acc, { text }];
                        }
                      } else if (node.nodeType === Node.ELEMENT_NODE) {
                        return [...acc, ...deserializeTextNodes(editor, node.childNodes)];
                      }
                      return acc;
                    }, [] as ReturnType<typeof deserializeTextNodes>);
                }

                return {
                  id: generateId(),
                  type: 'todo-list-item',
                  children: cleanedTextNodes.length > 0 ? cleanedTextNodes : [{ text: '' }],
                  props: { nodeType: 'block', checked },
                };
              })
              .filter(Boolean);

            if (listItemElements.length === 0) return;

            return {
              id: generateId(),
              type: 'todo-list',
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
            (child): child is SlateElement<'todo-list-item', { checked?: boolean }> =>
              'type' in child && child.type === 'todo-list-item',
          )
          .map((item) => {
            const checked = item.props?.checked ?? false;
            return `<li>[${checked ? 'x' : ' '}] ${serializeTextNodes(item.children)}</li>`;
          })
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
            (child): child is SlateElement<'todo-list-item', { checked?: boolean }> =>
              'type' in child && child.type === 'todo-list-item',
          )
          .map((item) => {
            const checked = item.props?.checked ?? false;
            return `${indent}- ${checked ? '[x]' : '[ ]'} ${serializeTextNodesIntoMarkdown(
              item.children,
            )}`;
          })
          .join('\n');
        return listItems;
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta ?? {};
        const listItems = element.children
          .filter(
            (child): child is SlateElement<'todo-list-item', { checked?: boolean }> =>
              'type' in child && child.type === 'todo-list-item',
          )
          .map((item) => {
            const checked = item.props?.checked ?? false;
            return `<li>[${checked ? 'x' : ' '}] ${serializeTextNodes(item.children)}</li>`;
          })
          .join('');

        return `
          <table style="width:100%;">
           <tbody style="width:100%;">
              <tr>
                <td>
                  <ul data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; text-align: ${align}; font-size: 16px;
    line-height: 28px;
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

export { TodoList };
