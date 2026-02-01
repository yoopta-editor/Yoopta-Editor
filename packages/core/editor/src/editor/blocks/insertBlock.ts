import { buildBlockElementsStructure } from '../../utils/block-elements';
import { generateId } from '../../utils/generateId';
import type { YooptaOperation } from '../core/applyTransforms';
import type { SlateElement, YooEditor, YooptaBlockData, YooptaPathIndex } from '../types';

export type InsertBlockOptions = {
  at?: YooptaPathIndex;
  focus?: boolean;
  blockData?: Omit<Partial<YooptaBlockData>, 'type'>;
  /**
   * Element structure created with editor.y()
   * If provided, this will be used as the block's value
   *
   * @example
   * ```typescript
   * editor.insertBlock('Accordion', {
   *   elements: editor.y('accordion-list', {
   *     children: [
   *       editor.y('accordion-list-item', {
   *         props: { isExpanded: false },
   *         children: [
   *           editor.y('accordion-list-item-heading'),
   *           editor.y('accordion-list-item-content', {
   *             children: [
   *               editor.y('paragraph'),
   *               editor.y('heading-one')
   *             ]
   *           })
   *         ]
   *       })
   *     ]
   *   })
   * });
   * ```
   */
  elements?: SlateElement;
};

// [TEST]
// [TEST] - TEST EVENTS
export function insertBlock(editor: YooEditor, type: string, options: InsertBlockOptions = {}) {
  const { at = editor.path.current, focus = false, blockData, elements } = options;

  const plugin = editor.plugins[type];
  if (!plugin) {
    throw new Error(`Plugin "${type}" not defined in plugins`);
  }
  const { beforeCreate, onCreate } = plugin.lifecycle || {};

  let slateStructure;
  if (blockData && Array.isArray(blockData?.value)) {
    slateStructure = blockData.value[0];
  } else if (elements) {
    slateStructure = elements;
  } else {
    slateStructure = beforeCreate?.(editor) || buildBlockElementsStructure(editor, type);
  }

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
