import { Blocks, HOTKEYS, Paths, createMetaExtension } from '@yoopta/editor';

export type DepthCommands = {
  increase: (options?: { blockId?: string }) => void;
  decrease: (options?: { blockId?: string }) => void;
  set: (blockId: string, depth: number) => void;
  get: (blockId: string) => number;
};

export const DepthExtension = createMetaExtension<'depth', number>({
  key: 'depth',
  defaultValue: 0,
  commands: (editor) => ({
    increase: (options?: { blockId?: string }) => {
      const block = options?.blockId
        ? Blocks.getBlock(editor, { id: options.blockId })
        : Blocks.getBlock(editor, { at: editor.path.current });

      if (!block) return;

      const currentDepth = (block.meta.depth as number) ?? 0;
      editor.updateBlock(block.id, { meta: { depth: currentDepth + 1 } });
    },
    decrease: (options?: { blockId?: string }) => {
      const block = options?.blockId
        ? Blocks.getBlock(editor, { id: options.blockId })
        : Blocks.getBlock(editor, { at: editor.path.current });

      if (!block) return;

      const currentDepth = (block.meta.depth as number) ?? 0;
      if (currentDepth <= 0) return;
      editor.updateBlock(block.id, { meta: { depth: currentDepth - 1 } });
    },
    set: (blockId: string, depth: number) => {
      editor.updateBlock(blockId, { meta: { depth } });
    },
    get: (blockId: string) => {
      const block = Blocks.getBlock(editor, { id: blockId });
      return (block?.meta.depth as number) ?? 0;
    },
  }),
  blockStyle: (depth) => (depth ? { marginLeft: depth * 26 } : undefined),
  events: {
    onKeyDown: (editor, event) => {
      if (HOTKEYS.isTab(event)) {
        const selectedBlocks = Paths.getSelectedPaths(editor);
        if (Array.isArray(selectedBlocks) && selectedBlocks.length > 0) {
          event.preventDefault();

          editor.batchOperations(() => {
            selectedBlocks.forEach((index) => {
              const block = Blocks.getBlock(editor, { at: index });
              if (block) editor.depth?.increase({ blockId: block.id });
            });
          });
        }
        return true;
      }

      if (HOTKEYS.isShiftTab(event)) {
        const selectedBlocks = Paths.getSelectedPaths(editor);
        if (Array.isArray(selectedBlocks) && selectedBlocks.length > 0) {
          event.preventDefault();

          editor.batchOperations(() => {
            selectedBlocks.forEach((index) => {
              const block = Blocks.getBlock(editor, { at: index });
              if (block) editor.depth?.decrease({ blockId: block.id });
            });
          });
        }
        return true;
      }

      return false;
    },
  },
});
