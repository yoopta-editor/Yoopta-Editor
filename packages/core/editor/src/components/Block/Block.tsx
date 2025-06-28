import React, { memo } from 'react';
import { useYooptaEditor } from '../../contexts/YooptaContext';
import { YooptaBlockData } from '../../editor/types';
import { Paths } from '../../editor/paths';

type BlockProps = {
  children: React.ReactNode;
  block: YooptaBlockData;
  blockId: string;
  renderBlock?: ({ blockRender, block }: { blockRender: React.ReactNode; block: YooptaBlockData }) => React.ReactNode;
};

const Block = memo(({ children, block, blockId, renderBlock }: BlockProps): React.ReactElement => {
  const editor = useYooptaEditor();

  const align = block.meta.align || 'left';
  const className = `yoopta-block yoopta-align-${align}`;

  const isSelected = Paths.isBlockSelected(editor, block);

  const blockRender = (
    <div className={className} data-yoopta-block data-yoopta-block-id={blockId}>
      {children}
      {!editor.readOnly && <div data-block-selected={isSelected} className="yoopta-selection-block" />}
    </div>
  );

  return typeof renderBlock === 'function'
    ? (renderBlock({ blockRender, block }) as React.ReactElement) || blockRender
    : blockRender;
});

Block.displayName = 'Block';

export { Block };
