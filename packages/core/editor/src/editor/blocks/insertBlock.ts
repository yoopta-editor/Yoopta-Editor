import { buildBlockElementsStructure } from '../../utils/blockElements';
import { generateId } from '../../utils/generateId';
import type { YooptaOperation } from '../core/applyTransforms';
import type { YooEditor, YooptaBlockData, YooptaPathIndex } from '../types';

export type InsertBlockOptions = {
  at?: YooptaPathIndex;
  focus?: boolean;
  blockData?: Omit<Partial<YooptaBlockData>, 'type'>;
};

// [TEST]
// [TEST] - TEST EVENTS
export function insertBlock(editor: YooEditor, type: string, options: InsertBlockOptions = {}) {
  const { at = editor.path.current, focus = false, blockData } = options;

  const plugin = editor.plugins[type];
  const { onBeforeCreate, onCreate } = plugin.events || {};

  let slateStructure;
  if (blockData && Array.isArray(blockData?.value)) slateStructure = blockData.value[0];
  else slateStructure = onBeforeCreate?.(editor) || buildBlockElementsStructure(editor, type);

  const newBlock: YooptaBlockData = {
    id: blockData?.id || generateId(),
    type,
    value: [slateStructure],
    meta: {
      align: blockData?.meta?.align || 'left',
      depth: blockData?.meta?.depth || 0,
      order: typeof at === 'number' ? at : Object.keys(editor.children).length,
    },
  };

  const operations: YooptaOperation[] = [];

  operations.push({
    type: 'insert_block',
    path: { current: newBlock.meta.order },
    block: newBlock,
  });

  editor.applyTransforms(operations);
  onCreate?.(editor, newBlock.id);

  if (focus) {
    editor.focusBlock(newBlock.id);
  }

  return newBlock.id;
}
