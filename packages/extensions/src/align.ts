import { Blocks, createMetaExtension } from '@yoopta/editor';

export type AlignValue = 'left' | 'center' | 'right';

export type AlignCommands = {
  set: (blockId: string, align: AlignValue) => void;
  get: (blockId: string) => AlignValue;
};

export const AlignExtension = createMetaExtension<'align', AlignValue>({
  key: 'align',
  defaultValue: 'left',
  commands: (editor) => ({
    set: (blockId: string, align: AlignValue) => {
      editor.updateBlock(blockId, { meta: { align } });
    },
    get: (blockId: string) => {
      const block = Blocks.getBlock(editor, { id: blockId });
      return (block?.meta.align as AlignValue) ?? 'left';
    },
  }),
  blockStyle: (align) => (align !== 'left' ? { textAlign: align } : undefined),
});
