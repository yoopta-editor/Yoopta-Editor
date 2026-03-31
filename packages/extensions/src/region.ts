import { Blocks, createMetaExtension } from '@yoopta/editor';

export type RegionCommands = {
  set: (blockId: string, region: string) => void;
  get: (blockId: string) => string;
  getBlocksByRegion: (region: string) => string[];
};

export const RegionExtension = createMetaExtension<'region', string>({
  key: 'region',
  defaultValue: 'content',
  commands: (editor) => ({
    set: (blockId: string, region: string) => {
      editor.updateBlock(blockId, { meta: { region } });
    },
    get: (blockId: string) => {
      const block = Blocks.getBlock(editor, { id: blockId });
      return (block?.meta.region as string) ?? 'content';
    },
    getBlocksByRegion: (region: string) => Object.keys(editor.children).filter((blockId) => {
      const block = editor.children[blockId];
      return (block?.meta.region ?? 'content') === region;
    }),
  }),
});
