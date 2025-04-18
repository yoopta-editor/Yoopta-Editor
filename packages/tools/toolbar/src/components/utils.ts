import { getRootBlockElement, YooEditor, YooptaBlockData } from '@yoopta/editor';

type Params = {
  editor: YooEditor;
  onClose: () => void;
  empty?: boolean;
  view?: 'small' | 'default';
};

type BlockToToggle = {
  id: string;
  type: string;
  path: number;
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

  const getItemProps = (toBlockType: string) => ({
    onMouseEnter: () => undefined,
    'data-action-menu-item': true,
    'data-action-menu-item-type': toBlockType,
    'aria-selected': false,
    onClick: () => {
      if (Array.isArray(editor.path.selected) && editor.path.selected.length > 0) {
        const blocksToToggle: BlockToToggle[] = [];

        for (const selectedPath of editor.path.selected!) {
          const block = editor.getBlock({ at: selectedPath });
          const blockEntity = editor.blocks[block?.type || ''];
          const rootElement = getRootBlockElement(blockEntity?.elements);
          if (
            block &&
            rootElement?.props?.nodeType !== 'void' &&
            rootElement?.props?.nodeType !== 'inline' &&
            rootElement?.props?.nodeType !== 'inlineVoid'
          ) {
            blocksToToggle.push({ id: block.id, type: block.type, path: block.meta.order });
          }
        }

        if (blocksToToggle.length > 0) {
          const isAllBlocksSameType = blocksToToggle.every(({ type }) => type === toBlockType);

          editor.batchOperations(() => {
            blocksToToggle.forEach(({ path, type }) => {
              if (isAllBlocksSameType) {
                editor.toggleBlock('Paragraph', { focus: false, at: path });
              } else if (type !== toBlockType) {
                editor.toggleBlock(toBlockType, { focus: false, at: path });
              }
            });
          });
        }

        onClose();
        return;
      }

      editor.toggleBlock(toBlockType, { focus: true });
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
