import { useMemo } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import type { TableCellElement } from '@yoopta/table';
import { TABLE_CELLS_IN_SELECTION, TABLE_SLATE_TO_SELECTION_SET } from '@yoopta/table';

import { TableCell, TableHead } from '../../ui/table';
import { cn } from '../../utils';

export const TableDataCell = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;
  const cellElement = element as TableCellElement;
  const editor = useYooptaEditor();
  const slate = useMemo(
    () => Blocks.getBlockSlate(editor, { id: props.blockId }),
    [editor, props.blockId],
  );

  const CellTag = cellElement.props?.asHeader ? TableHead : TableCell;

  const onMouseDown = (e: React.MouseEvent<HTMLTableCellElement>) => {
    e.stopPropagation();

    if (slate) {
      TABLE_CELLS_IN_SELECTION.delete(slate);
      TABLE_SLATE_TO_SELECTION_SET.delete(slate);
    }
  };

  return (
    <CellTag
      {...attributes}
      onMouseDown={onMouseDown}
      colSpan={cellElement.props?.colSpan ?? 1}
      rowSpan={cellElement.props?.rowSpan ?? 1}
      align={cellElement.props?.align ?? 'left'}
      valign={cellElement.props?.verticalAlign ?? 'middle'}
      data-yoopta-element-id={cellElement.id}
      className={cn(
        'relative group transition-colors',
      )}
      style={{
        backgroundColor: cellElement.props?.backgroundColor,
        color: cellElement.props?.color ?? 'inherit',
      }}>
      {children}
    </CellTag>
  );
};
