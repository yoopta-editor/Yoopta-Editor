import type React from 'react';
import { useCallback, useRef } from 'react';
import { useYooptaEditor } from '@yoopta/editor';
import { TableCommands } from '@yoopta/table';
import { Portal } from '@yoopta/ui/portal';
import { Plus } from 'lucide-react';

import { Button } from '../../ui/button';

type AddColumnButtonProps = {
  blockId: string;
  totalColumns: number;
  position: {
    left: number;
    top: number;
    height: number;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  buttonRef?: React.RefObject<HTMLDivElement>;
};

export const AddColumnButton = ({
  blockId,
  totalColumns,
  position,
  onMouseEnter,
  onMouseLeave,
  buttonRef: externalRef,
}: AddColumnButtonProps) => {
  const editor = useYooptaEditor();
  const internalRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = externalRef || internalRef;

  const handleAddColumn = useCallback(() => {
    const lastColumnCellPath = [0, 0, totalColumns - 1];
    TableCommands.insertTableColumn(editor, blockId, {
      // @ts-expect-error - Path type mismatch with Location
      path: lastColumnCellPath,
      insertMode: 'after',
    });
  }, [editor, blockId, totalColumns]);

  return (
    <Portal id={`table-add-column-button-${blockId}`}>
      <div
        ref={buttonRef}
        className="fixed z-[9999] pointer-events-auto"
        style={{
          left: `${position.left + 4}px`,
          top: `${position.top}px`,
          width: '18px',
          height: `${position.height}px`,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-full w-full bg-background/95 hover:bg-accent border border-border/50 shadow-sm rounded-md transition-all hover:shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground"
          onClick={handleAddColumn}
          onMouseDown={(e) => e.preventDefault()}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </Portal>
  );
};

