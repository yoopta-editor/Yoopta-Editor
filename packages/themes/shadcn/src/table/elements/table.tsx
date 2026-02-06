import { useMemo } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import type { TableElement } from '@yoopta/table';
import { TABLE_SLATE_TO_SELECTION_SET } from '@yoopta/table';
import { ElementOptions } from '@yoopta/ui/element-options';

import { TableBody, Table as TableUI } from '../../ui/table';
import { cn } from '../../utils';
import { ColumnResizeHandles } from '../components/column-resize-handles';
import { TableControls } from '../components/table-controls';
import { TableElementOptions } from '../components/table-element-options';
import { TableSelectionOverlay } from '../components/table-selection-overlay';

export const Table = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const tableElement = element as TableElement;
  const editor = useYooptaEditor();
  const slate = useMemo(
    () => Blocks.getBlockSlate(editor, { id: blockId }),
    [editor, blockId],
  );

  const isSelecting = slate ? TABLE_SLATE_TO_SELECTION_SET.get(slate) : null;
  const bordered = tableElement.props?.bordered ?? true;
  const compact = tableElement.props?.compact ?? false;
  const scrollable = tableElement.props?.scrollable ?? true;
  const columnWidths = tableElement.props?.columnWidths;

  // Calculate total table width for scrollable mode
  const tableWidth = useMemo(() => {
    if (!scrollable || !columnWidths || columnWidths.length === 0) return undefined;
    return columnWidths.reduce<number>((sum, w) => sum + (typeof w === 'number' ? w : parseFloat(String(w)) || 0), 0);
  }, [scrollable, columnWidths]);

  return (
    <div
      className={cn(
        'group relative p-4',
        bordered ? 'yoopta-table-bordered' : 'yoopta-table-no-borders',
        compact && 'yoopta-table-compact',
        scrollable && 'yoopta-table-scrollable',
      )}
      data-yoopta-block-id={blockId}
      data-table-container>
      <ElementOptions.Root blockId={blockId} element={element}>
        <ElementOptions.Trigger
          className="absolute right-0 top-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 hover:bg-accent"
        />
        <TableElementOptions />
      </ElementOptions.Root>
      <div className={cn(scrollable && 'overflow-x-auto')}>
        <TableUI
          {...attributes}
          style={scrollable && tableWidth ? { width: `${tableWidth}px` } : undefined}
          data-is-selecting={!!isSelecting}>
          <colgroup>
            {columnWidths?.map((width, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <col key={i} style={{ width: `${width}px` }} />
            ))}
          </colgroup>
          <TableBody>{children}</TableBody>
        </TableUI>
      </div>

      {!editor.readOnly && (
        <>
          <TableSelectionOverlay blockId={blockId} />
          <TableControls blockId={blockId} />
          <ColumnResizeHandles blockId={blockId} />
        </>
      )}
    </div>
  );
};
