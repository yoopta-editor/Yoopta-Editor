import { findPluginBlockByPath } from '../../utils/findPluginBlockByPath';
import { YooEditor, YooptaPathIndex } from '../types';
import { YooptaOperation } from '../core/applyTransforms';

export type BlockDepthOptions = {
  blockId?: string;
  at?: YooptaPathIndex;
};

export function increaseBlockDepth(editor: YooEditor, options: BlockDepthOptions = {}) {
  const { at = editor.path.current, blockId } = options;

  const block = blockId ? editor.children[blockId] : findPluginBlockByPath(editor, { at });
  if (!block) return;

  const newDepth = block.meta.depth + 1;

  const operation: YooptaOperation = {
    type: 'set_block_meta',
    id: block.id,
    properties: { ...block.meta, depth: newDepth },
    prevProperties: { ...block.meta, depth: block.meta.depth },
  };

  editor.applyTransforms([operation]);
}
