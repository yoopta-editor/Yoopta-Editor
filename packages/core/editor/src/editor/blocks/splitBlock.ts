import { Editor, Node } from 'slate';

import { buildSlateNodeElement } from '../../utils/blockElements';
import { deepClone } from '../../utils/deepClone';
import { findPluginBlockByPath } from '../../utils/findPluginBlockByPath';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { generateId } from '../../utils/generateId';
import type { YooptaOperation } from '../core/applyTransforms';
import type { SlateEditor, SlateElement, YooEditor, YooptaBlockData } from '../types';

export type SplitBlockOptions = {
  focus?: boolean;
  slate?: SlateEditor;
};

export function splitBlock(editor: YooEditor, options: SplitBlockOptions = {}) {
  const { focus = true } = options;

  const blockToSplit = findPluginBlockByPath(editor);
  const slate = options.slate || findSlateBySelectionPath(editor);
  if (!slate || !blockToSplit) return;

  Editor.withoutNormalizing(slate, () => {
    if (!slate.selection) return;

    const originalSlateChildren = deepClone(slate.children);
    const operations: YooptaOperation[] = [];
    const [splitValue, nextSlateValue] = splitSlate(slate.children, slate.selection);

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

    if (focus) {
      editor.focusBlock(nextBlock.id);
    }
  });
}

function splitSlate(slateChildren, slateSelection) {
  const { path, offset } = slateSelection.focus;
  const [, ...childPath] = path;

  const firstPart = JSON.parse(JSON.stringify(slateChildren[0]));

  function splitNode(node, remainingPath, currentOffset) {
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
      const [left, right]: any = splitNode(node.children[childIndex], nextPath, currentOffset);
      const leftChildren = node.children.slice(0, childIndex).concat(left ? [left] : []);
      const rightChildren = (right ? [right] : []).concat(node.children.slice(childIndex + 1));
      return [
        { ...node, children: leftChildren },
        { ...node, children: rightChildren },
      ];
    }
  }

  const [leftContent, rightContent] = splitNode(firstPart, childPath, offset);

  function cleanNode(node) {
    if ('children' in node) {
      if (node.props?.nodeType === 'inlineVoid' || node.props?.nodeType === 'inline') {
        if (node.children.length === 0) {
          node.children = [{ text: '' }];
        }
        return node;
      }

      node.children = node.children.filter(
        (child) =>
          (child.text !== '' && child.text !== undefined) ||
          (child.children && child.children.length > 0),
      );
      node.children.forEach(cleanNode);
    }
    return node;
  }

  return [cleanNode(leftContent), cleanNode(rightContent)]
    .map((part) => [part])
    .filter((part) => part[0].children.length > 0);
}
