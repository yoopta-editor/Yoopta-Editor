import { Elements, SlateElement, YooEditor } from '@yoopta/editor';
import { useFloating, inline, flip, shift, offset, autoUpdate } from '@floating-ui/react';
import { useState } from 'react';
import DragIcon from '../icons/drag.svg';
import { TableColumnOptions } from './TableColumnOptions';
import { Transforms } from 'slate';

type TableRowProps = {
  editor: YooEditor;
  blockId: string;
  tdElement: SlateElement;
};

const TableColumnDragButton = ({ editor, blockId, tdElement }: TableRowProps) => {
  const [isTableColumnActionsOpen, setIsTableColumnActionsOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    open: isTableColumnActionsOpen,
    onOpenChange: setIsTableColumnActionsOpen,
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const onClick = () => {
    if (editor.readOnly) return;
    const slate = editor.blockEditorsMap[blockId];
    const tdElementPath = Elements.getElementPath(editor, blockId, tdElement);
    if (!tdElementPath) return;

    Transforms.select(slate, { path: tdElementPath.concat([0]), offset: 0 });
    setIsTableColumnActionsOpen(true);
  };

  const onClose = () => {
    setIsTableColumnActionsOpen(false);
  };

  return (
    <>
      <TableColumnOptions
        refs={refs}
        isOpen={isTableColumnActionsOpen}
        onClose={onClose}
        style={floatingStyles}
        editor={editor}
        blockId={blockId}
        element={tdElement}
      />
      <button
        type="button"
        ref={refs.setReference}
        onClick={onClick}
        contentEditable={false}
        style={isTableColumnActionsOpen ? { opacity: 1 } : undefined}
        className="yoopta-table-column-button">
        <DragIcon />
      </button>
    </>
  );
};

export { TableColumnDragButton };
