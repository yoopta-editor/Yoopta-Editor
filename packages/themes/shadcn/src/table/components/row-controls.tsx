import { useCallback, useMemo } from 'react';
import { useYooptaEditor } from '@yoopta/editor';
import { TableCommands } from '@yoopta/table';
import { Portal } from '@yoopta/ui/portal';
import { ArrowDown, ArrowUp, MoreVertical, Table2Icon, Trash2 } from 'lucide-react';

import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

type RowControlsProps = {
  blockId: string;
  rowIndex: number;
  position: {
    left: number;
    top: number;
    height: number;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export const RowControls = ({
  blockId,
  rowIndex,
  position,
  onMouseEnter,
  onMouseLeave,
}: RowControlsProps) => {
  const editor = useYooptaEditor();

  // Create a cell path for the target row: [table, row, firstCell, textNode]
  const cellPath = useMemo(() => [0, rowIndex, 0, 0], [rowIndex]);

  const insertRowAbove = useCallback(() => {
    TableCommands.insertTableRow(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: cellPath,
      insertMode: 'before',
    });
  }, [editor, blockId, cellPath]);

  const insertRowBelow = useCallback(() => {
    TableCommands.insertTableRow(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: cellPath,
      insertMode: 'after',
    });
  }, [editor, blockId, cellPath]);

  const deleteRow = useCallback(() => {
    TableCommands.deleteTableRow(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: cellPath,
    });
  }, [editor, blockId, cellPath]);

  const toggleHeaderRow = useCallback(() => {
    TableCommands.toggleHeaderRow(editor, blockId);
  }, [editor, blockId]);

  return (
    <Portal id={`table-row-controls-${blockId}-${rowIndex}`}>
      <div
        className="fixed z-[9998] pointer-events-auto"
        style={{
          left: `${position.left + 20}px`,
          top: `${position.top}px`,
          width: '18px',
          height: `${position.height}px`,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-full w-full bg-background/95 hover:bg-accent border border-border/50 shadow-sm rounded-md p-0 transition-all hover:shadow-md flex items-center justify-center"
              onMouseDown={(e) => e.preventDefault()}>
              <MoreVertical className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="left" className="w-48">
            {rowIndex === 0 && (
              <>
                <DropdownMenuItem onClick={toggleHeaderRow}>
                  <Table2Icon className="mr-2 h-4 w-4" />
                  Header row
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={insertRowAbove}>
              <ArrowUp className="mr-2 h-4 w-4" />
              Insert row above
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertRowBelow}>
              <ArrowDown className="mr-2 h-4 w-4" />
              Insert row below
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={deleteRow}
              className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete row
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Portal>
  );
};
