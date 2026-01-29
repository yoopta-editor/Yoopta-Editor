import type { YooptaClipboardData } from './getYooptaJSON';
import type { SlateElement, YooEditor, YooptaBlockData } from '../editor/types';
import { generateId } from '../utils/generateId';

type TextNode = { text: string; [key: string]: unknown };
type ChildNode = SlateElement | TextNode;
type IdMap = Map<string, string>;

/**
 * First pass: collect all element IDs and generate new ones.
 * Returns a map of old ID -> new ID.
 */
function collectAndMapIds(value: YooptaBlockData['value']): IdMap {
  const idMap: IdMap = new Map();

  function collectFromElement(element: SlateElement) {
    if (element.id) {
      idMap.set(element.id, generateId());
    }

    if (element.children) {
      for (const child of element.children) {
        if (!('text' in child)) {
          collectFromElement(child as SlateElement);
        }
      }
    }
  }

  for (const element of value) {
    collectFromElement(element as SlateElement);
  }

  return idMap;
}

/**
 * Second pass: apply new IDs and update referenceId props.
 */
function applyNewIds(value: YooptaBlockData['value'], idMap: IdMap): YooptaBlockData['value'] {
  function processElement(element: SlateElement): SlateElement {
    const newId = element.id ? idMap.get(element.id) ?? generateId() : generateId();

    // Update referenceId if it exists and points to a mapped ID
    let newProps = element.props;
    if (element.props?.referenceId && typeof element.props.referenceId === 'string') {
      const newReferenceId = idMap.get(element.props.referenceId);
      if (newReferenceId) {
        newProps = { ...element.props, referenceId: newReferenceId };
      }
    }

    return {
      ...element,
      id: newId,
      props: newProps,
      children: element.children?.map((child: ChildNode) => {
        if ('text' in child) {
          return child;
        }
        return processElement(child as SlateElement);
      }),
    };
  }

  return value.map((element) => processElement(element as SlateElement));
}

/**
 * Recursively generates new IDs for all elements in a block's value.
 * Also updates referenceId props to maintain relationships (e.g., tabs, code-groups).
 * This prevents ID conflicts when pasting content.
 */
function regenerateElementIds(value: YooptaBlockData['value']): YooptaBlockData['value'] {
  // First pass: collect all IDs and create mapping
  const idMap = collectAndMapIds(value);

  // Second pass: apply new IDs and update references
  return applyNewIds(value, idMap);
}

/**
 * Validates that a block has all required properties and matches a known plugin type.
 */
function isValidBlock(editor: YooEditor, block: unknown): block is YooptaBlockData {
  if (!block || typeof block !== 'object') return false;

  const b = block as Record<string, unknown>;

  // Check required properties
  if (typeof b.id !== 'string') return false;
  if (typeof b.type !== 'string') return false;
  if (!Array.isArray(b.value)) return false;
  if (!b.meta || typeof b.meta !== 'object') return false;

  const meta = b.meta as Record<string, unknown>;
  if (typeof meta.order !== 'number') return false;
  if (typeof meta.depth !== 'number') return false;

  // Check if plugin exists for this block type
  if (!editor.plugins[b.type]) {
    // eslint-disable-next-line no-console
    console.warn(`[Yoopta] Unknown block type "${b.type}" in clipboard data. Block will be skipped.`);
    return false;
  }

  return true;
}

/**
 * Deserializes Yoopta JSON clipboard data back to blocks.
 * This is the inverse of getYooptaJSON and preserves all block data exactly.
 *
 * @param editor - The Yoopta editor instance
 * @param jsonString - The JSON string from clipboard
 * @returns Array of YooptaBlockData ready to be inserted
 */
export function deserializeYooptaJSON(
  editor: YooEditor,
  jsonString: string,
): YooptaBlockData[] | null {
  try {
    const data = JSON.parse(jsonString) as YooptaClipboardData;

    // Validate clipboard data structure
    if (!data || typeof data !== 'object') {
      return null;
    }

    if (typeof data.version !== 'number') {
      // eslint-disable-next-line no-console
      console.warn('[Yoopta] Invalid clipboard data: missing version');
      return null;
    }

    if (!Array.isArray(data.blocks)) {
      // eslint-disable-next-line no-console
      console.warn('[Yoopta] Invalid clipboard data: blocks is not an array');
      return null;
    }

    // Filter and regenerate IDs for valid blocks
    const blocks = data.blocks
      .filter((block) => isValidBlock(editor, block))
      .map((block, index) => ({
        ...block,
        // Generate completely new IDs to avoid conflicts
        id: generateId(),
        value: regenerateElementIds(block.value),
        meta: {
          ...block.meta,
          order: index,
        },
      }));

    return blocks.length > 0 ? blocks : null;
  } catch (error) {
    // Invalid JSON, not Yoopta format
    return null;
  }
}

/**
 * Check if a string looks like Yoopta clipboard data.
 * Quick validation before attempting full parse.
 */
export function isYooptaClipboardData(data: string): boolean {
  if (!data || typeof data !== 'string') return false;

  try {
    // Quick check for expected structure
    return data.includes('"version"') && data.includes('"blocks"');
  } catch {
    return false;
  }
}
