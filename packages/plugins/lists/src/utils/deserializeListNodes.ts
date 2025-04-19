import { Descendant, Element } from 'slate';
import { deserializeTextNodes, generateId, YooEditor, YooptaBlockData } from '@yoopta/editor';

type ListHTMLElement = HTMLUListElement | HTMLOListElement | HTMLElement;

type DeserializeListBlockOptions = {
  depth?: number;
  type: 'TodoList' | 'NumberedList' | 'BulletedList';
  align: YooptaBlockData['meta']['align'];
};

// recursive function to parse nested lists and return list of Blocks
export function deserializeListNodes(
  editor: YooEditor,
  listEl: ListHTMLElement,
  options: DeserializeListBlockOptions,
): YooptaBlockData[] {
  const deserializedListBlocks: YooptaBlockData[] = [];
  const depth = typeof options.depth === 'number' ? options.depth : 0;

  if (listEl.nodeName === 'UL' || listEl.nodeName === 'OL') {
    const listItems = Array.from(listEl.children).filter((el) => el.nodeName === 'LI');

    // check if the list is a TodoList or not
    const isTodoList = listItems.some((listItem) => {
      const hasCheckbox = listItem.querySelector('input[type="checkbox"]');
      const textContent = listItem.textContent || '';
      const hasBrackets = /\[\s*[xX\s]?\s*\]/.test(textContent);
      return hasCheckbox || hasBrackets;
    });

    if (isTodoList && options.type !== 'TodoList') {
      return deserializedListBlocks;
    }

    if (!isTodoList && options.type === 'TodoList') {
      return deserializedListBlocks;
    }

    listItems.forEach((listItem) => {
      const textContent = listItem.textContent || '';
      let blockData: YooptaBlockData | null = null;

      if (options.type === 'TodoList') {
        // check if the list item has a checkbox input or brackets `[]` in the text content
        const checkbox = listItem.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
        const checked = checkbox ? checkbox.checked : /\[\s*[xX]\s*\]/.test(textContent);

        blockData = {
          id: generateId(),
          type: 'TodoList',
          value: [
            {
              id: generateId(),
              type: 'todo-list',
              children: deserializeTextNodes(editor, listItem.childNodes),
              props: { nodeType: 'block', checked },
            },
          ],
          meta: { order: 0, depth, align: options.align },
        };
      } else {
        const listType = options.type === 'NumberedList' ? 'numbered-list' : 'bulleted-list';
        blockData = {
          id: generateId(),
          type: options.type,
          value: [
            {
              id: generateId(),
              type: listType,
              children: deserializeTextNodes(editor, listItem.childNodes),
              props: { nodeType: 'block' },
            },
          ],
          meta: { order: 0, depth, align: options.align },
        };
      }

      if (blockData) {
        const slateChildren = sanitizeTextNodes(blockData.value as Descendant[]).map((child) => {
          if (Element.isElement(child)) {
            return child.children.length > 0 ? child : { ...child, children: [{ text: '' }] };
          }
          return child;
        });

        const cleanedData = {
          ...blockData,
          value: slateChildren,
        };

        deserializedListBlocks.push(cleanedData);
      }

      const nestedLists = Array.from(listItem.children).filter((el) => el.nodeName === 'UL' || el.nodeName === 'OL');

      // if the list item has nested lists, then parse them recursively by increasing the depth
      if (nestedLists.length > 0) {
        nestedLists.forEach((nestedList) => {
          const nestedBlocks = deserializeListNodes(editor, nestedList as ListHTMLElement, {
            ...options,
            depth: depth + 1,
          });
          deserializedListBlocks.push(...nestedBlocks);
        });
      }
    });
  }

  return deserializedListBlocks;
}

function sanitizeTextNodes(descendants: Descendant[]): Descendant[] {
  return descendants
    .map((descendant) => {
      if ('children' in descendant) {
        return {
          ...descendant,
          children: sanitizeTextNodes(descendant.children),
        };
      }

      // Only include text nodes that has content
      if ('text' in descendant) {
        // Clean text content for todo lists or empty text nodes
        const cleanText = descendant.text
          .replace(/\[\s*[xX\s]?\s*\]/, '') // Remove [] for todo lists
          .replace(/\u00a0/g, ' '); // Replace non-breaking spaces

        return cleanText ? { ...descendant, text: cleanText } : null; // Remove if empty
      }

      return descendant;
    })
    .filter(Boolean) as Descendant[];
}
