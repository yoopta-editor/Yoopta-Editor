import type { YooEditor, YooptaBlockData } from '../types';

/**
 * Get all blocks in a column group, sorted by columnIndex then order.
 */
export function getColumnGroupBlocks(editor: YooEditor, columnGroup: string): YooptaBlockData[] {
  const blocks = Object.values(editor.children).filter(
    (block) => block.meta.columnGroup === columnGroup,
  );

  blocks.sort((a, b) => {
    const colDiff = (a.meta.columnIndex ?? 0) - (b.meta.columnIndex ?? 0);
    if (colDiff !== 0) return colDiff;
    return a.meta.order - b.meta.order;
  });

  return blocks;
}
