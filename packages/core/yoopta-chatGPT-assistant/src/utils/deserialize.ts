import type { YooptaBaseElement } from '@yoopta/editor';
import { generateId } from '@yoopta/editor';

export function deserialize(text) {
  const lines = text.trim().split('\n');
  const nodes: YooptaBaseElement<string>[] = [];

  let currentList: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (/^[\d]+[.)]/.test(line)) {
      // If the line starts with a number followed by a period or bracket,
      // create a new ordered list if we don't have one already, or add the
      // current list to the nodes if we do, and add the current line as a
      // new list item.
      const listItem = {
        id: generateId(),
        nodeType: 'block',
        type: 'list-item',
        children: [{ text: line.replace(/^[\d]+[.)]/, '').trim() }],
      };

      if (currentList === null || currentList.type !== 'numbered-list') {
        currentList = {
          id: generateId(),
          nodeType: 'block',
          type: 'numbered-list',
          children: [listItem],
          data: { depth: 1, skipDrag: true, skipSettings: true },
        };
        nodes.push(currentList);
      } else {
        currentList.children.push(listItem);
      }
    } else if (/^[-*+]/.test(line)) {
      // If the line starts with a hyphen, asterisk, or plus sign, create a
      // new bulleted list if we don't have one already, or add the current
      // list to the nodes if we do, and add the current line as a new list item.

      const listItem = {
        id: generateId(),
        type: 'list-item',
        nodeType: 'block',
        children: [{ text: line.replace(/^[-*+]/, '').trim() }],
      };

      if (currentList === null || currentList.type !== 'bulleted-list') {
        currentList = {
          id: generateId(),
          nodeType: 'block',
          type: 'bulleted-list',
          children: [listItem],
          data: { depth: 1, skipDrag: true, skipSettings: true },
        };
        nodes.push(currentList);
      } else {
        currentList.children.push(listItem);
      }
    } else {
      // Otherwise, add the current line as a paragraph.
      nodes.push({
        id: generateId(),
        nodeType: 'block',
        type: 'paragraph',
        children: [{ text: line }],
      });
      currentList = null;
    }
  }

  return nodes;
}
