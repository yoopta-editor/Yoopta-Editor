import { Editor, Text, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { getLastNodePoint } from '../../utils/get-node-points';
import type { YooptaOperation } from '../core/applyTransforms';
import { Elements } from '../elements';
import { Paths } from '../paths';
import type { SlateElement, YooEditor, YooptaPathIndex } from '../types';
import { getBlock } from './getBlock';
import { getBlockSlate } from './getBlockSlate';

export type MergeBlockOptions = {
  /**
   * Source block to merge (the one that will be merged into target)
   * @default editor.path.current
   */
  at?: YooptaPathIndex;
  blockId?: string;

  /**
   * Target block to merge into (the one that will receive content)
   * If not provided, uses previous block
   * @default previous block
   */
  targetAt?: YooptaPathIndex;
  targetBlockId?: string;

  /**
   * Focus after merge
   * @default true
   */
  focus?: boolean;

  /**
   * Preserve content from source block
   * @default true
   */
  preserveContent?: boolean;
};

function mergeSlateChildren(target, source, preserveContent: boolean) {
  if (!preserveContent) {
    return target.children;
  }

  const targetChildren = JSON.parse(JSON.stringify(target.children));
  const sourceChildren = JSON.parse(JSON.stringify(source.children));

  const lastTargetChild = targetChildren[targetChildren.length - 1];
  const firstSourceChild = sourceChildren[0];

  if (Text.isText(lastTargetChild) && Text.isText(firstSourceChild)) {
    lastTargetChild.text += firstSourceChild.text;
    return [...targetChildren.slice(0, -1), lastTargetChild, ...sourceChildren.slice(1)];
  }
  return [...targetChildren, ...sourceChildren];
}

/**
 * Merge a block into another block
 *
 * @param editor - YooEditor instance
 * @param options - Merge options
 *
 * @example
 * ```typescript
 * // Merge current block into previous (default behavior)
 * editor.mergeBlock();
 *
 * // Merge specific block into previous
 * editor.mergeBlock({ at: 5 });
 *
 * // Merge block at index 5 into block at index 3
 * editor.mergeBlock({ at: 5, targetAt: 3 });
 *
 * // Merge without focusing
 * editor.mergeBlock({ focus: false });
 * ```
 */
export function mergeBlock(editor: YooEditor, options: MergeBlockOptions = {}): void {
  const { at, blockId, targetAt, targetBlockId, focus = true, preserveContent = true } = options;

  // Determine source block
  const sourceBlockPath = typeof at === 'number' ? at : editor.path.current;
  const sourceBlock = getBlock(editor, { id: blockId, at: sourceBlockPath });

  if (!sourceBlock) {
    return;
  }

  // Get source slate
  const sourceSlate = blockId
    ? getBlockSlate(editor, { id: blockId })
    : findSlateBySelectionPath(editor, { at: sourceBlock.meta.order });

  if (!sourceSlate) {
    return;
  }

  // Determine target block
  let targetBlock;
  let targetSlate;

  if (targetBlockId) {
    targetBlock = getBlock(editor, { id: targetBlockId });
    targetSlate = getBlockSlate(editor, { id: targetBlockId });
  } else if (typeof targetAt === 'number') {
    targetBlock = getBlock(editor, { at: targetAt });
    targetSlate = findSlateBySelectionPath(editor, { at: targetAt });
  } else {
    // Default: use previous block
    const prevBlockPath = Paths.getPreviousBlockOrder(editor, sourceBlock.meta.order);
    if (prevBlockPath === null) {
      return;
    }
    targetBlock = getBlock(editor, { at: prevBlockPath });
    targetSlate = findSlateBySelectionPath(editor, { at: prevBlockPath });
  }

  if (!targetBlock || !targetSlate) {
    return;
  }

  // Check if target block can accept merge
  const targetBlockEntity = editor.plugins[targetBlock.type];
  if (!targetBlockEntity) {
    return;
  }

  const targetBlockElementRoot = Elements.getElement(editor, targetBlock.id);
  if (targetBlockElementRoot?.props?.nodeType === 'void') {
    return;
  }

  // Position cursor at the end of target block
  try {
    const point = getLastNodePoint(targetSlate);
    Transforms.select(targetSlate, point);
  } catch (error) {
    Transforms.select(targetSlate, Editor.start(targetSlate, []));
  }

  Editor.withoutNormalizing(targetSlate, () => {
    const operations: YooptaOperation[] = [];
    const mergedChildren = mergeSlateChildren(
      targetSlate.children[0],
      sourceSlate.children[0],
      preserveContent,
    );
    const mergedSlateValue = [
      {
        ...targetSlate.children[0],
        children: mergedChildren,
      },
    ];

    const mergedBlock = {
      ...targetBlock,
      value: mergedSlateValue,
    };

    operations.push({
      type: 'merge_block',
      prevProperties: {
        sourceBlock,
        sourceSlateValue: sourceSlate.children as SlateElement[],
        targetBlock,
        targetSlateValue: targetSlate.children as SlateElement[],
      },
      properties: {
        mergedBlock,
        mergedSlateValue: mergedSlateValue as SlateElement[],
      },
      path: editor.path,
    });

    editor.applyTransforms(operations);
    editor.setPath({ current: targetBlock.meta.order });

    if (focus) {
      try {
        setTimeout(() => {
          ReactEditor.focus(targetSlate);
        }, 0);
      } catch (error) {
        // Ignore focus errors
      }
    }
  });
}
