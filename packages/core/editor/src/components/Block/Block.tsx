import type React from 'react';
import type { CSSProperties } from 'react';
import { memo, useMemo } from 'react';

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

  const extensionStyles = useMemo(() => {
    const extensions = editor.extensions;
    if (!extensions) return perfStyles;

    const styles = Object.values(extensions).reduce<CSSProperties>((acc, ext) => {
      if (ext.blockStyle) {
        const s = ext.blockStyle(block.meta[ext.key]);
        if (s) return { ...acc, ...s };
      }
      return acc;
    }, {});

    if (Object.keys(styles).length === 0) return perfStyles;
    return { ...perfStyles, ...styles };
  }, [editor.extensions, block.meta]);

  const isSelected = Paths.isBlockSelected(editor, block);

  return (
    <div
      className="yoopta-block"
      data-yoopta-block
      data-yoopta-block-id={blockId}
      data-block-selected={isSelected}
      style={extensionStyles}>
      {children}
    </div>
  );
});

Block.displayName = 'Block';

export { Block };
