import type { CSSProperties } from 'react';

import type { YooEditor } from '../../editor/types';

export type RectangeSelectionProps = {
  editor: YooEditor;
  root?: HTMLElement | React.MutableRefObject<HTMLElement | null> | false;
};

export type RectangeSelectionState = {
  origin: [number, number];
  coords: [number, number];
  selection: boolean;
};

export type SelectionBoxProps = {
  origin: RectangeSelectionState['origin'];
  coords: RectangeSelectionState['coords'];
  isOpen: boolean;
};

const SelectionBox = ({ origin, coords, isOpen }: SelectionBoxProps) => {
  if (!isOpen) return null;

  const getTransform = () => {
    if (origin[1] > coords[1] && origin[0] > coords[0]) return 'scaleY(-1) scaleX(-1)';

    if (origin[1] > coords[1]) return 'scaleY(-1)';
    if (origin[0] > coords[0]) return 'scaleX(-1)';
    return undefined;
  };

  const selectionBoxStyle: CSSProperties = {
    zIndex: 10,
    left: origin[0],
    top: origin[1],
    height: Math.abs(coords[1] - origin[1] - 1),
    width: Math.abs(coords[0] - origin[0] - 1),
    userSelect: 'none',
    transformOrigin: 'top left',
    transform: getTransform(),
    position: 'fixed',
    backgroundColor: 'rgba(35, 131, 226, 0.14)',
  };

  return <div style={selectionBoxStyle} />;
};

export { SelectionBox };
