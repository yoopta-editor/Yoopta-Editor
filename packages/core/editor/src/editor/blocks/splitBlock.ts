import cloneDeep from 'lodash.clonedeep';
import type { Location } from 'slate';
import { Editor, Node, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { buildSlateNodeElement } from '../../utils/block-elements';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { generateId } from '../../utils/generateId';
import type { YooptaOperation } from '../core/applyTransforms';
import type { SlateElement, YooEditor, YooptaBlockData, YooptaPathIndex } from '../types';
import { getBlock } from './getBlock';
import { getBlockSlate } from './getBlockSlate';

export type SplitBlockOptions = {
  /**
   * Block to split
   * @default editor.path.current
   */
  at?: YooptaPathIndex;
  blockId?: string;

  /**
   * Split position (selection point)
   * If not provided, uses current selection
   * @default slate.selection
   */
  splitAt?: Location;

  /**
   * Focus after split
   * @default true
   */
  focus?: boolean;

  /**
   * Focus target after split
   * - 'new': focus the new block (default)
   * - 'original': focus the original block
   * - 'none': don't focus anything
   * @default 'new'
   */
  focusTarget?: 'new' | 'original' | 'none';

  /**
   * Preserve content in both blocks
   * @default true
   */
  preserveContent?: boolean;
};

function splitSlate(slateChildren, slateSelection) {
  const { path, offset } = slateSelection.focus;
  const [, ...childPath] = path;

  const firstPart = JSON.parse(JSON.stringify(slateChildren[0]));

  function splitNode(node: any, remainingPath: number[], currentOffset: number): [any, any] {
    if (remainingPath.length === 0) {
      if (Node.string(node).length <= currentOffset) {
        return [node, null];
      }
      if ('text' in node) {
        return [
          { ...node, text: node.text.slice(0, currentOffset) },
          { ...node, text: node.text.slice(currentOffset) },
        ];
      }
      if (node.type === 'link') {
        const [leftChild, rightChild] = splitNode(node.children[0], [], currentOffset);
        return [
          { ...node, children: [leftChild] },
          { ...node, children: [rightChild] },
        ];
      }
    } else {
      const [childIndex, ...nextPath] = remainingPath;
      const [left, right] = splitNode(node.children[childIndex], nextPath, currentOffset);
      const leftChildren = node.children.slice(0, childIndex).concat(left ? [left] : []);
      const rightChildren = (right ? [right] : []).concat(node.children.slice(childIndex + 1));
      return [
        { ...node, children: leftChildren },
        { ...node, children: rightChildren },
      ];
    }
    return [node, null];
  }

  const [leftContent, rightContent] = splitNode(firstPart, childPath, offset);

  function cleanNode(node: any): any {
    if ('children' in node) {
      if (node.props?.nodeType === 'inlineVoid' || node.props?.nodeType === 'inline') {
        if (node.children.length === 0) {
          return { ...node, children: [{ text: '' }] };
        }
        return node;
      }

      const cleanedChildren = node.children
        .filter(
          (child: any) =>
            (child.text !== '' && child.text !== undefined) ||
            (child.children && child.children.length > 0),
        )
        .map(cleanNode);

      return { ...node, children: cleanedChildren };
    }
    return node;
  }

  return [cleanNode(leftContent), cleanNode(rightContent)]
    .map((part) => [part])
    .filter((part) => part[0].children.length > 0);
}

/**
 * Split a block at the selection point or specified position
 *
 * @param editor - YooEditor instance
 * @param options - Split options
 * @returns ID of the newly created block, or undefined if split failed
 *
 * @example
 * ```typescript
 * // Split current block at selection
 * const newBlockId = editor.splitBlock();
 *
 * // Split specific block
 * const newBlockId = editor.splitBlock({ at: 3 });
 *
 * // Split and focus original block
 * const newBlockId = editor.splitBlock({ focusTarget: 'original' });
 * ```
 */
export function splitBlock(editor: YooEditor, options: SplitBlockOptions = {}): string | undefined {
  const {
    at,
    blockId,
    splitAt,
    focus = true,
    focusTarget = 'new',
    preserveContent = true,
  } = options;

  // Determine which block to split
  const blockPath = typeof at === 'number' ? at : editor.path.current;
  const blockToSplit = getBlock(editor, { id: blockId, at: blockPath });

  if (!blockToSplit) {
    return undefined;
  }

  // Get slate editor for this block
  const slate = blockId
    ? getBlockSlate(editor, { id: blockId })
    : findSlateBySelectionPath(editor, { at: blockToSplit.meta.order });

  if (!slate) {
    return undefined;
  }

  // Determine split position
  const splitSelection = splitAt ?? slate.selection;

  if (!splitSelection) {
    return undefined;
  }

  // Temporarily set selection if splitAt was provided and different from current
  const originalSelection = slate.selection;
  const needsSelectionRestore = splitAt && splitAt !== slate.selection;

  if (needsSelectionRestore) {
    Transforms.select(slate, splitAt);
  }

  let newBlockId: string | undefined;

  try {
    Editor.withoutNormalizing(slate, () => {
      const originalSlateChildren = cloneDeep(slate.children);
      const operations: YooptaOperation[] = [];

      let splitValue;
      let nextSlateValue;

      if (preserveContent) {
        [splitValue, nextSlateValue] = splitSlate(slate.children, splitSelection);
      } else {
        // If not preserving content, create empty block
        splitValue = slate.children;
        nextSlateValue = undefined;
      }

      const nextBlock: YooptaBlockData = {
        id: generateId(),
        type: blockToSplit.type,
        meta: {
          order: blockToSplit.meta.order + 1,
          depth: blockToSplit.meta.depth,
          align: blockToSplit.meta.align,
        },
        value: [],
      };

      newBlockId = nextBlock.id;

      operations.push({
        type: 'split_block',
        prevProperties: {
          originalBlock: blockToSplit,
          originalValue: originalSlateChildren as SlateElement[],
        },
        properties: {
          nextBlock,
          nextSlateValue: !nextSlateValue ? [buildSlateNodeElement('paragraph')] : nextSlateValue,
          splitSlateValue: splitValue,
        },
        path: editor.path,
      });

      editor.applyTransforms(operations);

      // Handle focus based on focusTarget
      if (focus && focusTarget !== 'none') {
        if (focusTarget === 'new') {
          editor.focusBlock(nextBlock.id);
        } else if (focusTarget === 'original') {
          // Focus the original block
          const originalSlate = getBlockSlate(editor, { id: blockToSplit.id });
          if (originalSlate) {
            try {
              ReactEditor.focus(originalSlate);
              // Move cursor to end of original block
              Transforms.select(originalSlate, Editor.end(originalSlate, []));
            } catch (error) {
              // Ignore focus errors
            }
          }
        }
      }
    });
  } finally {
    // Restore original selection if we changed it
    if (needsSelectionRestore && originalSelection) {
      try {
        Transforms.select(slate, originalSelection);
      } catch (error) {
        // Selection might be invalid after split, ignore
      }
    }
  }

  return newBlockId;
}
