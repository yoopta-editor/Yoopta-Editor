import { useCallback, useMemo } from 'react';
import { useYooptaEditor } from '@yoopta/editor';
import { TableCommands } from '@yoopta/table';
import { Portal } from '@yoopta/ui/portal';
import { ArrowLeft, ArrowRight, MoreHorizontal, Table2Icon, Trash2 } from 'lucide-react';

import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

type ColumnControlsProps = {
  blockId: string;
  colIndex: number;
  position: {
    left: number;
    top: number;
    width: number;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export const ColumnControls = ({
  blockId,
  colIndex,
  position,
  onMouseEnter,
  onMouseLeave,
}: ColumnControlsProps) => {
  const editor = useYooptaEditor();

  // Create a cell path for the target column: [table, firstRow, column, textNode]
  const cellPath = useMemo(() => [0, 0, colIndex, 0], [colIndex]);

  const handleInsertColumnLeft = useCallback(() => {
    TableCommands.insertTableColumn(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: cellPath,
      insertMode: 'before',
    });
  }, [editor, blockId, cellPath]);

  const handleInsertColumnRight = useCallback(() => {
    TableCommands.insertTableColumn(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: cellPath,
      insertMode: 'after',
    });
  }, [editor, blockId, cellPath]);

  const handleDeleteColumn = useCallback(() => {
    TableCommands.deleteTableColumn(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: cellPath,
    });
  }, [editor, blockId, cellPath]);

  const handleToggleHeaderColumn = useCallback(() => {
    TableCommands.toggleHeaderColumn(editor, blockId);
  }, [editor, blockId]);

  return (
    <Portal id={`table-column-controls-${blockId}-${colIndex}`}>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-full w-full bg-background/95 hover:bg-accent border border-border/50 shadow-sm rounded-md p-0 transition-all hover:shadow-md"
              onMouseDown={(e) => e.preventDefault()}>
              <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-48">
            {colIndex === 0 && (
              <>
                <DropdownMenuItem onClick={handleToggleHeaderColumn}>
                  <Table2Icon className="mr-2 h-4 w-4" />
                  Header column
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleInsertColumnLeft}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Insert column left
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleInsertColumnRight}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Insert column right
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDeleteColumn}
              className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Portal>
  );
};
