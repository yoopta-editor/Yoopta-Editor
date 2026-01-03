import type { YooEditor, YooptaBlockData } from '@yoopta/editor';
import { useYooptaEditor } from '@yoopta/editor';

function getNumberedListCount(editor: YooEditor, block: YooptaBlockData) {
  const sortedBlockIds = Object.keys(editor.children).sort((a, b) => {
    const blockA = editor.children[a];
    const blockB = editor.children[b];
    return blockA.meta.order - blockB.meta.order;
  });

  const depthCounters: Record<number, number> = {};
  const lastBlockTypeAtDepth: Record<number, string> = {};
  const targetDepth = block.meta.depth;

  for (const blockId of sortedBlockIds) {
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

      depthCounters[currentDepth] += 1;
    }

    lastBlockTypeAtDepth[currentDepth] = currentType;

    if (currentDepth < targetDepth) {
      Object.keys(depthCounters).forEach((depth) => {
        if (Number(depth) > currentDepth) {
          depthCounters[depth] = 0;
          lastBlockTypeAtDepth[depth] = '';
        }
      });
    }
  }

  if (depthCounters[targetDepth] === undefined) {
    depthCounters[targetDepth] = 0;
  }

  if (lastBlockTypeAtDepth[targetDepth] !== 'NumberedList') {
    depthCounters[targetDepth] = 0;
  }

  depthCounters[targetDepth] += 1;

  return depthCounters[targetDepth];
}

export function useNumberListCount(block: YooptaBlockData) {
  const editor = useYooptaEditor();
  return getNumberedListCount(editor, block);
}
