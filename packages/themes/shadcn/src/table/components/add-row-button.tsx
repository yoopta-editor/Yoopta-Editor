import { useCallback } from 'react';
import { useYooptaEditor } from '@yoopta/editor';
import { TableCommands } from '@yoopta/table';
import { Portal } from '@yoopta/ui/portal';
import { Plus } from 'lucide-react';

import { Button } from '../../ui/button';

type AddRowButtonProps = {
  blockId: string;
  totalRows: number;
  position: {
    left: number;
    top: number;
    width: number;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export const AddRowButton = ({
  blockId,
  totalRows,
  position,
  onMouseEnter,
  onMouseLeave,
}: AddRowButtonProps) => {
  const editor = useYooptaEditor();

  const handleAddRow = useCallback(() => {
    // Path to any cell in the last row: [table, lastRow, firstCell, textNode]
    const lastRowCellPath = [0, totalRows - 1, 0, 0];
    TableCommands.insertTableRow(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: lastRowCellPath,
      insertMode: 'after',
    });
  }, [editor, blockId, totalRows]);

  return (
    <Portal id={`table-add-row-button-${blockId}`}>
      <div
        className="fixed z-[9999] pointer-events-auto"
        style={{
          left: `${position.left}px`,
          top: `${position.top + 4}px`,
          width: `${position.width}px`,
          height: '18px',
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        <Button
          variant="ghost"
          size="sm"
          className="h-full w-full bg-background/95 hover:bg-accent border border-border/50 shadow-sm rounded-md transition-all hover:shadow-md flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={handleAddRow}
          onMouseDown={(e) => e.preventDefault()}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </Portal>
  );
};
