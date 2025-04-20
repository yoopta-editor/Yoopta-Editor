import { PluginElementRenderProps, useBlockData, useYooptaEditor, YooEditor, YooptaBlockData } from '@yoopta/editor';
import { useMemo } from 'react';

function getNumberedListCount(editor: YooEditor, block: YooptaBlockData) {
  const sortedBlockIds = Object.keys(editor.children).sort((a, b) => {
    const blockA = editor.children[a];
    const blockB = editor.children[b];
    return blockA.meta.order - blockB.meta.order;
  });

  const depthCounters: Record<number, number> = {};
  const lastBlockTypeAtDepth: Record<number, string> = {};
  const targetDepth = block.meta.depth;

  for (let blockId of sortedBlockIds) {
    const currentBlock = editor.children[blockId];
    const currentDepth = currentBlock.meta.depth;
    const currentType = currentBlock.type;

    if (blockId === block.id) break;

    if (currentType === 'NumberedList') {
      if (depthCounters[currentDepth] === undefined) {
        depthCounters[currentDepth] = 0;
      }

      const shouldResetCounter = lastBlockTypeAtDepth[currentDepth] !== 'NumberedList';

      if (shouldResetCounter) {
        depthCounters[currentDepth] = 0;
      }

      depthCounters[currentDepth]++;
    }

    lastBlockTypeAtDepth[currentDepth] = currentType;

    if (currentDepth < targetDepth) {
      for (let depth in depthCounters) {
        if (Number(depth) > currentDepth) {
          depthCounters[depth] = 0;
          lastBlockTypeAtDepth[depth] = '';
        }
      }
    }
  }

  if (depthCounters[targetDepth] === undefined) {
    depthCounters[targetDepth] = 0;
  }

  if (lastBlockTypeAtDepth[targetDepth] !== 'NumberedList') {
    depthCounters[targetDepth] = 0;
  }

  depthCounters[targetDepth]++;

  return depthCounters[targetDepth];
}

const NumberedListRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { attributes, children, blockId, HTMLAttributes = {} } = props;
  const { className = '', ...htmlAttrs } = HTMLAttributes;
  const block = useBlockData(blockId);
  const editor = useYooptaEditor();

  const count = useMemo(() => getNumberedListCount(editor, block), [block, editor.children]);

  const currentAlign = block?.meta?.align || 'left';
  const alignClass = `yoopta-align-${currentAlign}`;

  if (extendRender) {
    // @ts-ignore [FIXME] - add generic type for extendRender props
    return extendRender({ ...props, count });
  }

  return (
    <div className={`yoopta-numbered-list ${alignClass} ${className}`} {...htmlAttrs} {...attributes}>
      <span className="yoopta-numbered-list-count" contentEditable={false}>
        {count}.
      </span>
      <span className="yoopta-numbered-list-content">{children}</span>
    </div>
  );
};

export { NumberedListRender };
