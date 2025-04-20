import { getRootBlockElement, YooEditor } from '@yoopta/editor';
import { ActionMenuRenderProps, ActionMenuToolItem } from '../types';

type Params = {
  editor: YooEditor;
  onClose: () => void;
  empty?: boolean;
  view?: ActionMenuRenderProps['view'];
  mode?: ActionMenuRenderProps['mode'];
  onMouseEnter?: (e: React.MouseEvent) => void;
  selectedAction?: ActionMenuToolItem;
};

export function mapActionMenuItems(editor: YooEditor, items: ActionMenuToolItem[] | string[]): ActionMenuToolItem[] {
  return items.map((item: string | ActionMenuToolItem) => {
    if (typeof item === 'string') {
      const title = editor.blocks[item].options?.display?.title || item;
      const description = editor.blocks[item].options?.display?.description;
      const icon = editor.blocks[item].options?.display?.icon;
      return { type: item, title, description, icon };
    }
    return item;
  });
}

function filterToggleActions(editor: YooEditor, type: string) {
  const block = editor.blocks[type];
  if (!block) return false;

  const rootBlock = getRootBlockElement(block.elements);
  if (rootBlock?.props?.nodeType === 'void') return false;
  return true;
}

export function buildActionMenuRenderProps({
  editor,
  onClose,
  onMouseEnter = () => undefined,
  empty = false,
  mode = 'toggle',
  view = 'default',
  selectedAction,
}: Params): ActionMenuRenderProps {
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

  const getItemProps = (type) => ({
    onMouseEnter,
    'data-action-menu-item': true,
    'data-action-menu-item-type': type,
    'aria-selected': type === selectedAction?.type,
    onClick: () => {
      // [TEST]
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
  };
}
