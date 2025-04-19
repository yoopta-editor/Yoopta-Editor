import { Descendant, Editor, Element, Text } from 'slate';
import { buildBlockElementsStructure } from '../../utils/blockElements';

import { findPluginBlockByPath } from '../../utils/findPluginBlockByPath';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { generateId } from '../../utils/generateId';
import { YooptaOperation } from '../core/applyTransforms';
import { YooEditor, YooptaBlockData, SlateEditor, FocusAt, SlateElement, YooptaPathIndex } from '../types';

export type ToggleBlockOptions = {
  at?: YooptaPathIndex;
  deleteText?: boolean;
  slate?: SlateEditor;
  focus?: boolean;
  focusAt?: FocusAt;
};

const DEFAULT_BLOCK_TYPE = 'Paragraph';

function extractTextNodes(
  slate: SlateEditor,
  node: SlateElement | Descendant,
  blockData: YooptaBlockData,
  editor: YooEditor,
): (Text | SlateElement)[] {
  const blockEntity = editor.plugins[blockData.type];
  if (blockEntity?.customEditor) {
    return (blockData.value[0] as SlateElement).children;
  }

  if (Editor.isEditor(node)) return node.children.flatMap((child) => extractTextNodes(slate, child, blockData, editor));
  if (!Element.isElement(node)) return [node];
  if (Editor.isInline(slate, node)) return [node];

  return node.children.flatMap((child) => extractTextNodes(slate, child, blockData, editor));
}

function findFirstLeaf(node: SlateElement, options: ToggleBlockOptions): SlateElement | null {
  if (!Element.isElement(node)) {
    return null;
  }
  if (node.children.length === 0 || Text.isText(node.children[0])) {
    if (options.deleteText) {
      return { ...node, children: [{ text: '' }] };
    }

    return node;
  }
  return findFirstLeaf(node.children[0] as SlateElement, options);
}

export function toggleBlock(editor: YooEditor, toBlockTypeArg: string, options: ToggleBlockOptions = {}) {
  const fromBlock = findPluginBlockByPath(editor, {
    at: typeof options.at === 'number' ? options.at : editor.path.current,
  });

  if (!fromBlock) throw new Error('Block not found at current selection');

  let toBlockType = fromBlock.type === toBlockTypeArg ? DEFAULT_BLOCK_TYPE : toBlockTypeArg;
  const plugin = editor.plugins[toBlockType];
  const { onBeforeCreate } = plugin.events || {};

  const originalSlate = findSlateBySelectionPath(editor, { at: fromBlock.meta.order });
  if (!originalSlate) throw new Error(`Slate not found for block in position ${fromBlock.meta.order}`);

  const toBlockSlateChildren = onBeforeCreate?.(editor) || buildBlockElementsStructure(editor, toBlockType);
  const textNodes = extractTextNodes(originalSlate, originalSlate.children[0], fromBlock, editor);
  const firstLeaf = findFirstLeaf(toBlockSlateChildren, options);

  if (firstLeaf) {
    firstLeaf.children = textNodes;
  }

  const newBlock: YooptaBlockData = {
    id: generateId(),
    type: toBlockType,
    meta: { ...fromBlock.meta, align: undefined },
    value: [toBlockSlateChildren],
  };

  const operations: YooptaOperation[] = [
    {
      type: 'toggle_block',
      prevProperties: {
        sourceBlock: fromBlock,
        sourceSlateValue: originalSlate.children as SlateElement[],
      },
      properties: {
        toggledBlock: newBlock,
        toggledSlateValue: newBlock.value as SlateElement[],
      },
    },
  ];

  editor.applyTransforms(operations);

  if (options.focus) {
    editor.focusBlock(newBlock.id);
  }

  return newBlock.id;
}
