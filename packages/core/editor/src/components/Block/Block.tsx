import type React from 'react';
import type { CSSProperties } from 'react';
import { memo } from 'react';

import { useYooptaEditor } from '../../contexts/YooptaContext/YooptaContext';
import { Paths } from '../../editor/paths';
import type { YooptaBlockData } from '../../editor/types';

type BlockProps = {
  children: React.ReactNode;
  block: YooptaBlockData;
  blockId: string;
};

const perfStyles: CSSProperties = {
  contentVisibility: 'auto',
};

const Block = memo(({ children, block, blockId }: BlockProps) => {
  const editor = useYooptaEditor();

  const align = block.meta.align || 'left';
  const className = `yoopta-block ${align === 'left' ? '' : `yoopta-align-${align}`}`;

  const isSelected = Paths.isBlockSelected(editor, block);

  return (
    <div
      className={className}
      data-yoopta-block
      data-yoopta-block-id={blockId}
      data-block-selected={isSelected}
      style={perfStyles}>
      {children}
    </div>
  );
});

Block.displayName = 'Block';

export { Block };
