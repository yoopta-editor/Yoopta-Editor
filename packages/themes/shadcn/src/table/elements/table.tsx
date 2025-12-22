import { useMemo } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import type { TableElement } from '@yoopta/table';
import { TABLE_SLATE_TO_SELECTION_SET } from '@yoopta/table';

import { TableBody, Table as TableUI } from '../../ui/table';
import { TableControls } from '../components/table-controls';
import { TableMultiSelectionToolbar } from '../components/table-multi-selection-toolbar';
import { TableSelectionOverlay } from '../components/table-selection-overlay';

export const Table = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;
  const tableElement = element as TableElement;
  const editor = useYooptaEditor();
  const slate = useMemo(
    () => Blocks.getBlockSlate(editor, { id: props.blockId }),
    [editor, props.blockId],
  );

  const isSelecting = slate ? TABLE_SLATE_TO_SELECTION_SET.get(slate) : null;

  return (
    <>
      <TableUI {...attributes} data-is-selecting={!!isSelecting}>
        <colgroup>
          {tableElement.props?.columnWidths?.map((width, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <col key={i} style={{ width: `${width}px` }} />
          ))}
        </colgroup>
        <TableBody>{children}</TableBody>
      </TableUI>

      <TableSelectionOverlay blockId={props.blockId} />
      <TableControls blockId={props.blockId} />
    </>
  );
};
