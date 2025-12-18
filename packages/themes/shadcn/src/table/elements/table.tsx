import { useMemo } from 'react';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { Editor, Element } from 'slate';

import { TableBody, Table as TableUI } from '../../ui/table';

export const Table = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();

  const slate = useMemo(() => Blocks.getBlockSlate(editor, { id: blockId }), [editor, blockId]);

  // const { headerRow } = (element as SlateElement).props || {};

  // // Find first row to determine column widths
  // const firstRow = useMemo(() => {
  //   if (!slate) return null;

  //   const [firstRowNode] = Editor.nodes<SlateElement>(slate, {
  //     at: [0],
  //     match: (n) => Element.isElement(n) && (n as SlateElement).type === 'table-row',
  //     mode: 'lowest',
  //   });

  //   return firstRowNode?.[0] as SlateElement | null;
  // }, [slate]);

  // Check if first row has header cells
  // const hasHeaderRow = useMemo(() => {
  //   if (!firstRow || !headerRow) return false;

  //   return firstRow.children.some(
  //     (cell) =>
  //       Element.isElement(cell) &&
  //       (cell as SlateElement).type === 'table-data-cell' &&
  //       (cell as SlateElement).props?.asHeader,
  //   );
  // }, [firstRow, headerRow]);

  return (
    <TableUI {...attributes}>
      <TableBody>{children}</TableBody>
    </TableUI>
  );

  // return (
  //   <div className="my-6 w-full overflow-auto">
  //     <table {...attributes} className="w-full border-collapse border border-border">
  //       {firstRow && (
  //         <colgroup>
  //           {firstRow.children.map((cell) => {
  //             if (!Element.isElement(cell)) return null;
  //             const cellElement = cell as SlateElement;
  //             const width = cellElement.props?.width || 200;

  //             return <col key={cellElement.id} style={{ width: `${width}px` }} />;
  //           })}
  //         </colgroup>
  //       )}
  //       {hasHeaderRow ? (
  //         <thead className="bg-muted/50">{children}</thead>
  //       ) : (
  //         <tbody>{children}</tbody>
  //       )}
  //     </table>
  //   </div>
  // );
};
