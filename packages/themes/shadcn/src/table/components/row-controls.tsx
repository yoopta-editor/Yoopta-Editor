import type React from 'react';
import { useCallback, useRef } from 'react';
import { useYooptaEditor } from '@yoopta/editor';
import { TableCommands } from '@yoopta/table';
import { Portal } from '@yoopta/ui';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import type { Path } from 'slate';

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
        className="fixed z-[9999] pointer-events-auto"
        style={{
          left: `${position.left}px`,
          top: `${position.top}px`,
          width: '8px',
          height: `${position.height}px`,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '4px',
                cursor: 'pointer',
                background: 'hsl(var(--muted))',
                border: '1px solid hsl(var(--border))',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'hsl(var(--accent))';
                e.currentTarget.style.borderColor = 'hsl(var(--ring))';
                e.currentTarget.style.width = '10px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'hsl(var(--muted))';
                e.currentTarget.style.borderColor = 'hsl(var(--border))';
                e.currentTarget.style.width = '8px';
              }}
              onMouseDown={(e) => e.preventDefault()}
            />
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

