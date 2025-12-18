import { useMemo } from 'react';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { Editor } from 'slate';
import { ReactEditor } from 'slate-react';

import { TableCell, TableHead } from '../../ui/table';

export const TableDataCell = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();

  const slate = Blocks.getBlockSlate(editor, { id: blockId });

  const cellElement = element as SlateElement;
  const isHeader = cellElement.props?.asHeader ?? false;
  // const width = cellElement.props?.width ?? 200;

  // Check if this cell is in the first row (for header row)
  const isInFirstRow = useMemo(() => {
    if (!slate) return false;

    try {
      const cellPath = ReactEditor.findPath(slate, element as SlateElement);
      const rowPath = cellPath.slice(0, -1);
      const isFirstRow = rowPath[rowPath.length - 1] === 0;

      return isFirstRow;
    } catch {
      return false;
    }
  }, [slate, element]);

  // Check if this cell is in the first column (for header column)
  const isInFirstColumn = useMemo(() => {
    if (!slate) return false;

    try {
      const cellPath = ReactEditor.findPath(slate, element as SlateElement);
      const isFirstColumn = cellPath[cellPath.length - 1] === 0;

      return isFirstColumn;
    } catch {
      return false;
    }
  }, [slate, element]);

  // Determine if cell should be rendered as header
  // Check table props for headerRow and headerColumn
  const tableElement = useMemo(() => {
    if (!slate) return null;

    try {
      const [tableNode] = Editor.nodes<SlateElement>(slate, {
        at: [0],
        match: (n) => (n as SlateElement).type === 'table',
        mode: 'highest',
      });

      return tableNode?.[0] as SlateElement | null;
    } catch {
      return null;
    }
  }, [slate]);

  const { headerRow, headerColumn } = tableElement?.props || {};

  const shouldRenderAsHeader =
    isHeader || (headerRow && isInFirstRow) || (headerColumn && isInFirstColumn);

  const CellTag = shouldRenderAsHeader ? TableHead : TableCell;

  return <CellTag {...attributes}>{children}</CellTag>;
};
