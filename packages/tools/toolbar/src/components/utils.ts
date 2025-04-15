import { getRootBlockElement, YooEditor } from '@yoopta/editor';

type Params = {
  editor: YooEditor;
  onClose: () => void;
  empty?: boolean;
  view?: 'small' | 'default';
};

export function buildActionMenuRenderProps({ editor, view, onClose }: Params) {
  function filterToggleActions(editor: YooEditor, type: string) {
    const block = editor.blocks[type];
    if (!block) return false;

    const rootBlock = getRootBlockElement(block.elements);
    if (rootBlock?.props?.nodeType === 'void') return false;
    return true;
  }

  const getActions = () => {
    const items = Object.keys(editor.blocks)
      .filter((type) => filterToggleActions(editor, type))
      .map((action) => {
        const title = editor.blocks[action].options?.display?.title || action;
        const description = editor.blocks[action].options?.display?.description;
        const icon = editor.blocks[action].options?.display?.icon;
        return { type: action, title, description, icon };
      });

    return items;
  };

  const getRootProps = () => ({
    'data-action-menu-list': true,
  });

  const getItemProps = (type) => ({
    onMouseEnter: () => undefined,
    'data-action-menu-item': true,
    'data-action-menu-item-type': type,
    'aria-selected': false,
    onClick: () => {
      console.log('__TO__', type);
      console.log('getItemProps editor.path.selected', editor.path.selected);
      if (Array.isArray(editor.path.selected) && editor.path.selected.length > 0) {
        editor.batchOperations(() => {
          for (const selectedPath of editor.path.selected!) {
            const block = editor.getBlock({ at: selectedPath });
            if (block?.type !== type) {
              editor.toggleBlock(type, { focus: true, at: selectedPath });
            }
          }
        });

        return;
      }

      editor.toggleBlock(type, { focus: true });
      onClose();
    },
  });

  return {
    actions: getActions(),
    onClose,
    empty: false,
    getItemProps,
    getRootProps,
    editor,
    view,
  };
}
