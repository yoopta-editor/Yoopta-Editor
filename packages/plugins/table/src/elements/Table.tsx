import type { PluginElementRenderProps} from '@yoopta/editor';
import { useBlockData, useYooptaEditor } from '@yoopta/editor';

import { TableBlockOptions } from '../components/TableBlockOptions';
import type { TableElement } from '../types';
import { TABLE_SLATE_TO_SELECTION_SET } from '../utils/weakMaps';

const Table = ({
  attributes,
  children,
  blockId,
  element,
  HTMLAttributes,
  extendRender,
}: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const slate = editor.blockEditorsMap[blockId];
  const blockData = useBlockData(blockId);
  const isReadOnly = editor.readOnly;

  const isSelecting = TABLE_SLATE_TO_SELECTION_SET.get(slate);

  if (extendRender) {
    // @ts-ignore [FIXME] - add generic type for extendRender props
    return extendRender({ attributes, children, blockId, element, HTMLAttributes, isSelecting });
  }

  const { className, ...htmlAttrs } = HTMLAttributes || {};

  return (
    <div className={`yoopta-table-block ${className}`}>
      <table
        {...htmlAttrs}
        className={`yoopta-table ${isSelecting ? ' yoopta-table-selecting' : ''}`}>
        <tbody {...attributes}>{children}</tbody>
      </table>
      {!isReadOnly && (
        <TableBlockOptions block={blockData} editor={editor} table={element as TableElement} />
      )}
    </div>
  );
};

export { Table };
