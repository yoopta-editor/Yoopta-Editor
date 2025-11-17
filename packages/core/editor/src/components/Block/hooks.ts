import { useMemo } from 'react';
import type { Transform } from '@dnd-kit/utilities';

import type { YooptaBlockData } from '../../editor/types';

export const useBlockStyles = (
  block: YooptaBlockData,
  transform: Transform | null,
  transition: string | undefined,
  isDragging: boolean,
  isOver: boolean,
) =>
  useMemo(() => {
    if (block.meta.depth === 0 && !isDragging && !transform) return undefined;

    return {
      marginLeft: `${block.meta.depth * 20}px`,
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
      transition,
      opacity: isDragging ? 0.7 : 1,
      borderBottom: isOver && !isDragging ? '2px solid #007aff' : undefined,
    };
  }, [block.meta.depth, transform, transition, isDragging, isOver]);
