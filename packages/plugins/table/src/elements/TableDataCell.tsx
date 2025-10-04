import { useMemo } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Elements, useYooptaEditor } from '@yoopta/editor';
import { Editor, Element } from 'slate';

import { TableCommands } from '../commands';
import { ResizeHandle } from '../components/ResizeHandle';
import { TableColumnDragButton } from '../components/TableColumnDragButton';
import { TableRowDragButton } from '../components/TableRowDragButton';
import type { TableCellElement, TableElement, TableElementProps } from '../types';
import { TABLE_SLATE_TO_SELECTION_SET } from '../utils/weakMaps';

const TableDataCell = ({
  attributes,
  children,
  element,
  blockId,
  HTMLAttributes,
  extendRender,
}: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const slate = editor.blockEditorsMap[blockId];

  const path = Elements.getElementPath(editor, blockId, element);
  const selected = TABLE_SLATE_TO_SELECTION_SET.get(slate)?.has(element as TableCellElement);
  const asHeader = element?.props?.asHeader || false;

  const tableProps = useMemo<TableElementProps | null>(() => {
    const tableElementEntry = Editor.above<TableElement>(slate, {
      at: path,
      match: (n) => Element.isElement(n) && n.type === 'table',
    });

    if (!tableElementEntry) return null;
    const [tableElement] = tableElementEntry;

    const headerRow = tableElement?.props?.headerRow || false;
    const headerColumn = tableElement?.props?.headerColumn || false;

    return {
      headerColumn,
      headerRow,
    };
  }, [asHeader]);

  const { headerRow, headerColumn } = tableProps || {};

  const columnIndex = path?.[path.length - 1] || 0;
  const elementWidth = element?.props?.width || 200;

  const isFirstDataCell = path?.[path.length - 1] === 0;
  const isFirstRow = path?.[path.length - 2] === 0;

  let isDataCellAsHeader = false;

  if (isFirstRow && headerRow) {
    isDataCellAsHeader = true;
  }

  if (isFirstDataCell && headerColumn) {
    isDataCellAsHeader = true;
  }

  const onResize = (newWidth: number) => {
    TableCommands.updateColumnWidth(editor, blockId, columnIndex, newWidth);
  };

  const Node = isDataCellAsHeader ? 'th' : 'td';
  const style = {
    maxWidth: elementWidth,
    minWidth: elementWidth,
  };

  const { className: extendedClassName = '', ...htmlAttrs } = HTMLAttributes || {};

  const className = isDataCellAsHeader
    ? `yoopta-table-data-cell yoopta-table-data-cell-head ${extendedClassName}`
    : `yoopta-table-data-cell ${extendedClassName}`;

  if (extendRender) {
    return extendRender({
      attributes,
      children,
      blockId,
      element,
      HTMLAttributes,
      // @ts-ignore [FIXME] - add generic type for extendRender props
      isDataCellAsHeader,
      onResize,
      width: elementWidth,
      height: elementWidth,
      selected,
    });
  }

  return (
    <Node
      scope={isDataCellAsHeader ? 'col' : undefined}
      data-cell-selected={selected}
      style={style}
      colSpan={1}
      rowSpan={1}
      {...htmlAttrs}
      className={className}>
      <div className="yoopta-table-data-cell-content" {...attributes}>
        {children}
      </div>
      {!editor.readOnly && isFirstRow && (
        <ResizeHandle onResize={onResize} tdWidth={elementWidth} columnIndex={columnIndex} />
      )}
      {!editor.readOnly && isFirstRow && (
        <TableColumnDragButton editor={editor} blockId={blockId} tdElement={element} />
      )}
      {!editor.readOnly && isFirstDataCell && (
        <TableRowDragButton editor={editor} blockId={blockId} tdElement={element} />
      )}
    </Node>
  );
};

export { TableDataCell };
