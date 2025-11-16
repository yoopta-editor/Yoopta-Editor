import type { YooEditor, YooptaBlock, YooptaBlockData } from '@yoopta/editor';
import { getRootBlockElement } from '@yoopta/editor';
import type { ActionMenuItem, ActionMenuRenderProps } from './types';

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

export function mapActionMenuItems(
  editor: YooEditor,
  items: ActionMenuItem[] | string[],
): ActionMenuItem[] {
  return items.map((item: string | ActionMenuItem) => {
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

type BuildRenderPropsParams = {
  editor: YooEditor;
  onClose: () => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  empty?: boolean;
  view?: ActionMenuRenderProps['view'];
  mode?: ActionMenuRenderProps['mode'];
  selectedAction?: ActionMenuItem;
};

export function buildActionMenuRenderProps({
  editor,
  onClose,
  onMouseEnter = () => undefined,
  empty = false,
  mode = 'toggle',
  view = 'default',
  selectedAction,
}: BuildRenderPropsParams): ActionMenuRenderProps {
  const getActions = () => {
    let items = Object.keys(editor.blocks);
    if (mode === 'toggle') {
      items = items.filter((type) => filterToggleActions(editor, type));
    }

    return mapActionMenuItems(editor, items);
  };

  const getRootProps = () => ({
    'data-action-menu-list': true,
  });

  const getItemProps = (type: string) => ({
    onMouseEnter,
    'data-action-menu-item': true,
    'data-action-menu-item-type': type,
    'aria-selected': type === selectedAction?.type,
    onClick: () => {
      editor.toggleBlock(type, { deleteText: mode === 'create', focus: true });
      onClose();
    },
  });

  return {
    actions: getActions(),
    onClose,
    empty,
    getItemProps,
    getRootProps,
    editor,
    view,
    mode,
  };
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
