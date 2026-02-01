import { useEffect, useState } from 'react';
import type { YooEditor, YooptaContentValue } from '@yoopta/editor';
import { Element } from 'slate';

import type { TableOfContentsElementProps } from './types';
import { DEFAULT_HEADING_TYPES, HEADING_TYPE_LEVEL } from './types';
import { getPlainTextFromNodes } from './utils/getPlainTextFromNodes';


export type TableOfContentsItem = {
  id: string;
  text: string;
  level: number;
};

export type UseTableOfContentsItemsOptions = Pick<
  TableOfContentsElementProps,
  'depth' | 'headingTypes'
>;

function computeItems(
  content: YooptaContentValue,
  blockId: string,
  options: UseTableOfContentsItemsOptions,
): TableOfContentsItem[] {
  const { depth = 3, headingTypes = DEFAULT_HEADING_TYPES } = options;

  const blockIds = Object.keys(content).filter((id) => id !== blockId);
  const blocks = blockIds
    .map((id) => content[id])
    .filter((b): b is NonNullable<typeof b> & { meta: { order: number } } => Boolean(b?.meta))
    .sort((a, b) => a.meta.order - b.meta.order);

  return blocks
    .filter((block) => {
      if (!headingTypes.includes(block.type)) return false;
      const level = HEADING_TYPE_LEVEL[block.type] ?? 99;
      return level <= depth;
    })
    .map((block) => {
      const rootNode = block.value?.[0];
      const rootElement = rootNode && Element.isElement(rootNode) ? rootNode : null;
      const text = rootElement?.children?.length
        ? getPlainTextFromNodes(rootElement.children as Parameters<typeof getPlainTextFromNodes>[0])
        : '';
      const level = HEADING_TYPE_LEVEL[block.type] ?? 1;
      return { id: block.id, text, level };
    });
}

/**
 * Returns TOC items (headings) from the editor content, updated on every change.
 * Subscribes to editor.on('change') so the list stays in sync.
 * Use this in theme components to render the table of contents.
 *
 * @param editor - Yoopta editor instance (e.g. from useYooptaEditor())
 * @param blockId - Current TOC block id (to exclude it from content)
 * @param options - depth, headingTypes from the TOC element props
 */
export function useTableOfContentsItems(
  editor: YooEditor | null,
  blockId: string,
  options: UseTableOfContentsItemsOptions,
): TableOfContentsItem[] {
  const { depth = 3, headingTypes = DEFAULT_HEADING_TYPES } = options;

  const [items, setItems] = useState<TableOfContentsItem[]>([]);

  useEffect(() => {
    if (!editor) return;

    const changeHandler = () => {
      const content = editor.getEditorValue?.() ?? editor.children ?? {};
      setItems(computeItems(content, blockId, { depth, headingTypes }));
    };

    changeHandler();
    editor.on('change', changeHandler);
    return () => {
      editor.off('change', changeHandler);
    };
  }, [editor, blockId, depth, headingTypes]);

  return items;
}
