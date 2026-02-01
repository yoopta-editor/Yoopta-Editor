import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import type { YooEditor } from '@yoopta/editor';
import { useYooptaEditor, useYooptaReadOnly } from '@yoopta/editor';

import { useRectangeSelectionBox } from './hooks';

export type SelectionBoxRoot = HTMLElement | { current: HTMLElement | null };

export type RectangeSelectionProps = {
  editor: YooEditor;
  root?: SelectionBoxRoot;
};

export type RectangeSelectionState = {
  origin: [number, number];
  coords: [number, number];
  selection: boolean;
};

export type SelectionBoxProps = {
  selectionBoxElement?: SelectionBoxRoot | null;
};

const getTransform = (origin: [number, number], coords: [number, number]): string | undefined => {
  if (origin[1] > coords[1] && origin[0] > coords[0]) return 'scaleY(-1) scaleX(-1)';
  if (origin[1] > coords[1]) return 'scaleY(-1)';
  if (origin[0] > coords[0]) return 'scaleX(-1)';
  return undefined;
};

const SelectionBox = ({ selectionBoxElement }: SelectionBoxProps) => {
  const editor = useYooptaEditor();
  const isReadOnly = useYooptaReadOnly();
  const { coords, origin, selection } = useRectangeSelectionBox({
    editor,
    root: selectionBoxElement ?? undefined,
  });

  const selectionBoxStyle = useMemo<CSSProperties>(
    () => ({
      zIndex: 10,
      left: origin[0],
      top: origin[1],
      height: Math.abs(coords[1] - origin[1] - 1),
      width: Math.abs(coords[0] - origin[0] - 1),
      userSelect: 'none',
      transformOrigin: 'top left',
      transform: getTransform(origin, coords),
      position: 'fixed',
      backgroundColor: 'rgba(35, 131, 226, 0.14)',
    }),
    [origin, coords],
  );

  if (!selection || isReadOnly) return null;

  return <div style={selectionBoxStyle} />;
};

export { SelectionBox };

