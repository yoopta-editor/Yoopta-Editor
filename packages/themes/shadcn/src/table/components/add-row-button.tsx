import type React from 'react';
import { useCallback, useRef } from 'react';
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
  buttonRef?: React.RefObject<HTMLDivElement>;
};

export const AddRowButton = ({
  blockId,
  totalRows,
  position,
  onMouseEnter,
  onMouseLeave,
  buttonRef: externalRef,
}: AddRowButtonProps) => {
  const editor = useYooptaEditor();
  const internalRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = externalRef || internalRef;

  const handleAddRow = useCallback(() => {
    const lastRowPath = [totalRows - 1];
    TableCommands.insertTableRow(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: lastRowPath,
      insertMode: 'after',
    });
  }, [editor, blockId, totalRows]);

  return (
    <Portal id={`table-add-row-button-${blockId}`}>
      <div
        ref={buttonRef}
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

