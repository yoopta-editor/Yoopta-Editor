import type { Descendant } from 'slate';
import { Editor, Element, Text, Transforms } from 'slate';

import {
  buildBlockElementsStructure,
  getAllowedPluginsFromElement,
} from '../../utils/block-elements';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { generateId } from '../../utils/generateId';
import type { YooptaOperation } from '../core/applyTransforms';
import type {
  SlateEditor,
  SlateElement,
  YooEditor,
  YooptaBlockData,
  YooptaPathIndex,
} from '../types';
import { getBlock } from './getBlock';
import { y } from '../elements/create-element-structure';
import { ReactEditor } from 'slate-react';

export type ToggleBlockOptions = {
  /**
   * Position of the block to toggle
   * @default editor.path.current
   */
  at?: YooptaPathIndex;

  /**
   * Scope of the toggle operation:
   * - 'auto': automatically determine from context (default)
   * - 'block': transform the entire block (Paragraph → Heading)
   * - 'element': insert element in current leaf with allowedPlugins
   *
   * @default 'auto'
   */
  scope?: 'auto' | 'block' | 'element';

  /**
   * Whether to preserve existing content
   * - true: keep text and transfer to new block/element
   * - false: start with empty content
   * @default true
   */
  preserveContent?: boolean;

  /**
   * Focus after toggle
   * @default false
   */
  focus?: boolean;

  /**
   * Custom element structure created with editor.y()
   * If provided, this will be used instead of default structure
   */
  elements?: SlateElement;
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

  if (Editor.isEditor(node))
    return node.children.flatMap((child) => extractTextNodes(slate, child, blockData, editor));
  if (!Element.isElement(node)) return [node];
  if (Editor.isInline(slate, node)) return [node];

  return node.children.flatMap((child) => extractTextNodes(slate, child, blockData, editor));
}

function findFirstLeaf(node: SlateElement, preserveContent: boolean): SlateElement | null {
  if (!Element.isElement(node)) {
    return null;
  }
  if (node.children.length === 0 || Text.isText(node.children[0])) {
    if (!preserveContent) {
      return { ...node, children: [{ text: '' }] };
    }

    return node;
  }
  return findFirstLeaf(node.children[0] as SlateElement, preserveContent);
}

function determineScope(
  editor: YooEditor,
  slate: SlateEditor,
  explicitScope?: 'auto' | 'block' | 'element',
): 'block' | 'element' {
  // Always use block scope if explicitly requested
  if (explicitScope === 'block') return 'block';

  // Check if current element has allowedPlugins
  const allowedPlugins = getAllowedPluginsFromElement(editor, slate);
  const hasAllowedPlugins = Array.isArray(allowedPlugins) && allowedPlugins.length > 0;

  // If element scope is explicitly requested, verify that current element can contain other elements
  if (explicitScope === 'element') {
    // Fallback to block scope if current element doesn't have allowedPlugins
    return hasAllowedPlugins ? 'element' : 'block';
  }

  // Auto mode: use element scope only if allowedPlugins exist
  return hasAllowedPlugins ? 'element' : 'block';
}

/**
 * Toggle in 'block' scope: transform the entire block
 */
function toggleBlockScope(
  editor: YooEditor,
  fromBlock: YooptaBlockData,
  slate: SlateEditor,
  toTypeArg: string,
  options: ToggleBlockOptions,
): string {
  const { preserveContent = true, elements } = options;

  // If toggling to same type, toggle back to Paragraph
  const toType = fromBlock.type === toTypeArg ? DEFAULT_BLOCK_TYPE : toTypeArg;
  const plugin = editor.plugins[toType];

  if (!plugin) {
    throw new Error(`Plugin "${toTypeArg}" not found`);
  }

  const { onBeforeCreate } = plugin.events ?? {};

  // Build structure for the new block
  let toBlockSlateStructure: SlateElement;

  if (elements) {
    toBlockSlateStructure = elements;
  } else if (onBeforeCreate) {
    toBlockSlateStructure = onBeforeCreate(editor);
  } else {
    toBlockSlateStructure = buildBlockElementsStructure(editor, toType);
  }

  // Extract and transfer text nodes if preserving content
  if (preserveContent) {
    const textNodes = extractTextNodes(slate, slate.children[0], fromBlock, editor);
    const firstLeaf = findFirstLeaf(toBlockSlateStructure, preserveContent);

    if (firstLeaf) {
      firstLeaf.children = textNodes;
    }
  }

  const newBlock: YooptaBlockData = {
    id: generateId(),
    type: toType,
    meta: { ...fromBlock.meta, align: undefined },
    value: [toBlockSlateStructure],
  };

  const operations: YooptaOperation[] = [
    {
      type: 'toggle_block',
      prevProperties: {
        sourceBlock: fromBlock,
        sourceSlateValue: slate.children as SlateElement[],
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

/**
 * Toggle in 'element' scope: insert element in current leaf
 */
function toggleBlockElementScope(
  editor: YooEditor,
  block: YooptaBlockData,
  slate: SlateEditor,
  type: string,
  options: ToggleBlockOptions,
): string {
  const { preserveContent = true, elements } = options;

  if (!slate.selection) {
    throw new Error('No selection found');
  }

  // Get the plugin and its root element
  const selectedPlugin = editor.plugins[type];
  if (!selectedPlugin) {
    throw new Error(`Plugin "${type}" not found`);
  }

  const rootElementType =
    Object.keys(selectedPlugin.elements).find((key) => selectedPlugin.elements[key].asRoot) ??
    Object.keys(selectedPlugin.elements)[0];

  if (!rootElementType) {
    throw new Error(`No root element found for plugin "${type}"`);
  }

  // Build element structure
  let elementStructure: SlateElement;

  if (elements) {
    elementStructure = elements;
  } else {
    elementStructure = y(editor, rootElementType);
  }

  // Get the current element
  const blockElementEntry = Editor.above(slate, {
    match: (n) => Element.isElement(n) && Editor.isBlock(slate, n),
    mode: 'lowest',
  });

  if (!blockElementEntry) {
    throw new Error('No block element found at selection');
  }

  const [currentElement, currentNodePath] = blockElementEntry;

  // Check if current element has allowedPlugins (can contain other elements)
  const currentPlugin = editor.plugins[block.type];
  const currentElementType = (currentElement as SlateElement).type;
  const currentElementConfig = currentPlugin?.elements[currentElementType];
  const hasAllowedPlugins =
    Array.isArray(currentElementConfig?.allowedPlugins) &&
    currentElementConfig.allowedPlugins.length > 0;

  // Extract text nodes if preserving content
  if (preserveContent) {
    const textNodes = extractTextNodes(slate, currentElement, block, editor);
    const firstLeaf = findFirstLeaf(elementStructure, preserveContent);

    if (firstLeaf) {
      firstLeaf.children = textNodes;
    }
  }

  if (hasAllowedPlugins) {
    // If current element has allowedPlugins (e.g., callout, accordion-list-item-heading)
    // Insert inside it, don't replace
    const childrenCount = (currentElement as SlateElement).children.length;
    for (let i = childrenCount - 1; i >= 0; i -= 1) {
      Transforms.removeNodes(slate, { at: [...currentNodePath, i] });
    }

    // Insert the new element as child
    Transforms.insertNodes(slate, elementStructure, {
      at: [...currentNodePath, 0],
      select: true,
    });
  } else {
    // If current element doesn't have allowedPlugins, replace it
    Transforms.removeNodes(slate, { at: currentNodePath });
    Transforms.insertNodes(slate, elementStructure, {
      at: currentNodePath,
      select: true,
    });
  }

  if (options.focus) {
    // when scope is element, we need to focus/select first leaf text node of the new element
    ReactEditor.focus(slate);
    // const pathToSelect =
    //   currentNodePath.length > 1 ? [...currentNodePath, 0, 0] : [currentNodePath[0], 0];
    Transforms.select(slate, currentNodePath);
  }

  return block.id;
}

/**
 * Toggle block type or insert element in leaf with allowedPlugins
 *
 * Behavior depends on scope:
 * - scope: 'block' → transforms the block (Paragraph → Heading)
 * - scope: 'element' → inserts element in current leaf with allowedPlugins
 * - scope: 'auto' → automatically determines based on context
 *
 * @example
 * // Transform block
 * editor.toggleBlock('Heading', { preserveContent: true });
 *
 * // Insert element in leaf
 * editor.toggleBlock('Paragraph', { scope: 'element', preserveContent: false });
 *
 * // With custom structure
 * editor.toggleBlock('Accordion', {
 *   elements: editor.y('accordion-list', { ... })
 * });
 */
export function toggleBlock(
  editor: YooEditor,
  type: string,
  options: ToggleBlockOptions = {},
): string {
  const { scope = 'auto' } = options;

  const at = typeof options.at === 'number' ? options.at : editor.path.current;
  const block = getBlock(editor, { at });

  if (!block) throw new Error(`Block not found at current selection: ${at}`);

  const slate = findSlateBySelectionPath(editor, { at: block.meta.order });
  if (!slate) throw new Error(`Slate not found for block in position ${block.meta.order}`);

  const actualScope = determineScope(editor, slate, scope);

  if (actualScope === 'element') {
    return toggleBlockElementScope(editor, block, slate, type, options);
  }

  return toggleBlockScope(editor, block, slate, type, options);
}
