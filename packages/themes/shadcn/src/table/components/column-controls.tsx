import type React from 'react';
import { useCallback, useRef } from 'react';
import { useYooptaEditor } from '@yoopta/editor';
import { TableCommands } from '@yoopta/table';
import { Portal } from '@yoopta/ui';
import { ArrowLeft, ArrowRight, MoreHorizontal, Trash2 } from 'lucide-react';
import type { Path } from 'slate';

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
  path: Path;
  position: {
    left: number;
    top: number;
    width: number;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  controlsRef?: React.RefObject<HTMLDivElement>;
};

export const ColumnControls = ({
  blockId,
  colIndex,
  path,
  position,
  onMouseEnter,
  onMouseLeave,
  controlsRef: externalRef,
}: ColumnControlsProps) => {
  const editor = useYooptaEditor();
  const internalRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = externalRef || internalRef;

  const handleInsertColumnLeft = useCallback(() => {
    TableCommands.insertTableColumn(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path,
      insertMode: 'before',
    });
  }, [editor, blockId, path]);

  const handleInsertColumnRight = useCallback(() => {
    TableCommands.insertTableColumn(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path,
      insertMode: 'after',
    });
  }, [editor, blockId, path]);

  const handleDeleteColumn = useCallback(() => {
    TableCommands.deleteTableColumn(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path,
    });
  }, [editor, blockId, path]);

  return (
    <Portal id={`table-column-controls-${blockId}-${colIndex}`}>
      <div
        ref={controlsRef}
        className="fixed z-[9999] pointer-events-auto"
        style={{
          left: `${position.left}px`,
          top: `${position.top}px`,
          width: `${position.width}px`,
          height: '28px',
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
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="top" className="w-48">
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

