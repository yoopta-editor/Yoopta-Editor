import { Elements, SlateElement, YooEditor } from '@yoopta/editor';
import { useFloating, inline, flip, shift, offset, autoUpdate } from '@floating-ui/react';
import { useState } from 'react';
import { TableRowOptions } from './TableRowOptions';
import DragIcon from '../icons/drag.svg';
import { Transforms } from 'slate';

type TableRowProps = {
  editor: YooEditor;
  blockId: string;
  tdElement: SlateElement;
};

const TableRowDragButton = ({ editor, blockId, tdElement }: TableRowProps) => {
  const [isTableRowActionsOpen, setIsTableRowActionsOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: 'right-start',
    open: isTableRowActionsOpen,
    onOpenChange: setIsTableRowActionsOpen,
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const onClick = () => {
    if (editor.readOnly) return;

    const slate = editor.blockEditorsMap[blockId];
    const tdElementPath = Elements.getElementPath(editor, blockId, tdElement);
    if (!tdElementPath) return;
    Transforms.select(slate, { path: tdElementPath.concat([0]), offset: 0 });

    setIsTableRowActionsOpen(true);
  };

  const onClose = () => {
    setIsTableRowActionsOpen(false);
  };

  return (
    <>
      <TableRowOptions
        refs={refs}
        isOpen={isTableRowActionsOpen}
        onClose={onClose}
        style={floatingStyles}
        editor={editor}
        blockId={blockId}
        tdElement={tdElement}
      />
      <button
        ref={refs.setReference}
        type="button"
        onClick={onClick}
        contentEditable={false}
        className="yoopta-table-row-button"
        style={isTableRowActionsOpen ? { opacity: 1 } : undefined}>
        <DragIcon
          className="yoo-table-w-[14px] yoo-table-h-[14px] yoo-table-block yoo-table-flex-shrink-0"
          style={{ transform: 'rotate(0deg)' }}
        />
      </button>
    </>
  );
};

export { TableRowDragButton };
