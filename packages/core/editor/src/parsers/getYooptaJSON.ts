import { Paths } from '../editor/paths';
import type { YooEditor, YooptaBlockData, YooptaContentValue } from '../editor/types';
import { generateId } from '../utils/generateId';

export type YooptaClipboardData = {
  version: number;
  editorId: string;
  blocks: YooptaBlockData[];
};

const CLIPBOARD_VERSION = 1;

/**
 * Serializes Yoopta content to JSON format for clipboard.
 * This preserves all block data including complex props, marks, and metadata.
 *
 * @param editor - The Yoopta editor instance
 * @param content - The content to serialize
 * @returns JSON string with full block data
 */
export function getYooptaJSON(editor: YooEditor, content: YooptaContentValue): string {
  const blocks = Object.values(content)
    .filter((block) => {
      const selectedPaths = Paths.getSelectedPaths(editor);
      if (Array.isArray(selectedPaths) && selectedPaths.length > 0) {
        return selectedPaths.includes(block.meta.order);
      }
      return true;
    })
    .sort((a, b) => a.meta.order - b.meta.order)
    .map((block, index) => ({
      ...block,
      // Generate new IDs to avoid conflicts when pasting
      id: generateId(),
      meta: {
        ...block.meta,
        // Normalize order to start from 0
        order: index,
      },
    }));

  const clipboardData: YooptaClipboardData = {
    version: CLIPBOARD_VERSION,
    editorId: editor.id,
    blocks,
  };

  return JSON.stringify(clipboardData);
}

/**
 * The data attribute name used to store JSON in HTML clipboard
 */
export const YOOPTA_JSON_DATA_ATTR = 'data-yoopta-json';
