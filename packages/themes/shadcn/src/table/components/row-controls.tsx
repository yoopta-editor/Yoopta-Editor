import type React from 'react';
import { useCallback, useRef } from 'react';
import { useYooptaEditor } from '@yoopta/editor';
import { TableCommands } from '@yoopta/table';
import { Portal } from '@yoopta/ui';
import { ArrowDown, ArrowUp, MoreVertical, Trash2 } from 'lucide-react';
import type { Path } from 'slate';

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
  path: Path;
  position: {
    left: number;
    top: number;
    height: number;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  controlsRef?: React.RefObject<HTMLDivElement>;
};

export const RowControls = ({
  blockId,
  rowIndex,
  path,
  position,
  onMouseEnter,
  onMouseLeave,
  controlsRef: externalRef,
}: RowControlsProps) => {
  const editor = useYooptaEditor();
  const internalRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = externalRef || internalRef;
  const rowPath = path.slice(0, -1);

  const handleInsertRowAbove = useCallback(() => {
    TableCommands.insertTableRow(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: rowPath,
      insertMode: 'before',
    });
  }, [editor, blockId, rowPath]);

  const handleInsertRowBelow = useCallback(() => {
    TableCommands.insertTableRow(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: rowPath,
      insertMode: 'after',
    });
  }, [editor, blockId, rowPath]);

  const handleDeleteRow = useCallback(() => {
    TableCommands.deleteTableRow(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: rowPath,
    });
  }, [editor, blockId, rowPath]);

  return (
    <Portal id={`table-row-controls-${blockId}-${rowIndex}`}>
      <div
        ref={controlsRef}
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
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="left" className="w-48">
            <DropdownMenuItem onClick={handleInsertRowAbove}>
              <ArrowUp className="mr-2 h-4 w-4" />
              Insert row above
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleInsertRowBelow}>
              <ArrowDown className="mr-2 h-4 w-4" />
              Insert row below
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDeleteRow}
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

