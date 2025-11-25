import { Blocks, getAllowedPluginsFromElement, getRootBlockElement } from '@yoopta/editor';
import type { YooEditor, YooptaBlock, YooptaBlockData } from '@yoopta/editor';

import type { ActionMenuItem } from './types';

const filterBy = (
  item: YooptaBlockData | YooptaBlock['options'],
  text: string,
  field: string,
): boolean => {
  if (!item || typeof item[field] === 'undefined') return false;

  const value = item[field];
  const searchText = text.toLowerCase().trim();

  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .map((v) => String(v).toLowerCase())
      .some((v) => v.includes(searchText));
  }

  return String(value).toLowerCase().includes(searchText);
};

export const filterActionMenuItems = (block: YooptaBlock, searchText: string): boolean => {
  if (!searchText.trim()) return true;
  if (!block) return false;

  const searchTerms = searchText.toLowerCase().split(/\s+/);

  return searchTerms.every((term) => {
    const typeMatch = filterBy(block, term, 'type');
    if (typeMatch) return true;

    const titleMatch = block.options?.display && filterBy(block.options.display, term, 'title');
    if (titleMatch) return true;

    const shortcutMatch = block.options && filterBy(block.options, term, 'shortcuts');
    if (shortcutMatch) return true;

    const descriptionMatch =
      block.options?.display && filterBy(block.options.display, term, 'description');
    if (descriptionMatch) return true;

    const aliasMatch = block.options?.aliases && filterBy(block.options, term, 'aliases');
    if (aliasMatch) return true;

    return false;
  });
};

export function mapActionMenuItems(editor: YooEditor): ActionMenuItem[] {
  const items: string[] | ActionMenuItem[] = Object.keys(editor.blocks);
  // Check if we're inside an element with allowedPlugins
  let allowedPlugins: string[] | null = null;

  if (typeof editor.path.current === 'number') {
    const slate = Blocks.getBlockSlate(editor, { at: editor.path.current });
    if (slate) {
      allowedPlugins = getAllowedPluginsFromElement(editor, slate);
    }
  }

  // Filter items based on allowedPlugins
  let filteredItems = items;

  if (allowedPlugins && allowedPlugins.length > 0) {
    if (typeof items[0] === 'string') {
      filteredItems = (items as string[]).filter((item) => allowedPlugins!.includes(item));
    } else {
      filteredItems = items.filter((item) => allowedPlugins!.includes(item.type));
    }
  }

  return filteredItems.map((item: string | ActionMenuItem) => {
    if (typeof item === 'string') {
      const title = editor.blocks[item].options?.display?.title || item;
      const description = editor.blocks[item].options?.display?.description;
      const icon = editor.blocks[item].options?.display?.icon;
      return { type: item, title, description, icon };
    }
    return item;
  });
}

export function filterToggleActions(editor: YooEditor, type: string) {
  const block = editor.blocks[type];
  if (!block) return false;

  const rootBlock = getRootBlockElement(block.elements);
  if (rootBlock?.props?.nodeType === 'void') return false;
  return true;
}

export function isSlashPressed(event: KeyboardEvent): boolean {
  return (
    event.key === '/' ||
    event.keyCode === 191 ||
    event.which === 191 ||
    event.code === 'Slash' ||
    event.key === '/' ||
    (event.key === '.' && event.shiftKey)
  );
}
