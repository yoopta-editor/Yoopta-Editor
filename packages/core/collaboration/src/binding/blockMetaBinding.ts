import type {
  InsertBlockOperation,
  MergeBlockOperation,
  SetBlockMetaOperation,
  SplitBlockOperation,
  YooptaBlockData,
} from '@yoopta/editor';
import * as Y from 'yjs';

export type BlockMetaYMap = Y.Map<string | number | undefined>;

export class BlockMetaBinding {
  constructor(
    private blockMeta: Y.Map<BlockMetaYMap>,
  ) { }

  // ---- Local -> Yjs ----

  insertBlock(op: InsertBlockOperation): void {
    const { id, type, meta } = op.block;
    const metaMap = new Y.Map<string | number | undefined>();
    metaMap.set('type', type);
    metaMap.set('depth', meta.depth);
    metaMap.set('align', meta.align || 'left');
    this.blockMeta.set(id, metaMap);
  }

  deleteBlock(blockId: string): void {
    this.blockMeta.delete(blockId);
  }

  updateMeta(op: SetBlockMetaOperation): void {
    const metaMap = this.blockMeta.get(op.id);
    if (!metaMap) return;

    const { properties } = op;
    if (properties.depth !== undefined) {
      metaMap.set('depth', properties.depth);
    }
    if (properties.align !== undefined) {
      metaMap.set('align', properties.align);
    }
  }

  splitBlock(op: SplitBlockOperation): void {
    const { nextBlock } = op.properties;
    const metaMap = new Y.Map<string | number | undefined>();
    metaMap.set('type', nextBlock.type);
    metaMap.set('depth', nextBlock.meta.depth);
    metaMap.set('align', nextBlock.meta.align || 'left');
    this.blockMeta.set(nextBlock.id, metaMap);
  }

  mergeBlock(op: MergeBlockOperation): void {
    // Remove the source block's meta
    this.blockMeta.delete(op.prevProperties.sourceBlock.id);

    // Update the merged block's meta if it changed
    const mergedMeta = this.blockMeta.get(op.properties.mergedBlock.id);
    if (mergedMeta) {
      const { meta } = op.properties.mergedBlock;
      mergedMeta.set('depth', meta.depth);
      mergedMeta.set('align', meta.align || 'left');
    }
  }

  toggleBlock(op: { prevProperties: { sourceBlock: YooptaBlockData }; properties: { toggledBlock: YooptaBlockData } }): void {
    const { sourceBlock } = op.prevProperties;
    const { toggledBlock } = op.properties;

    // Remove old block meta and add new one
    this.blockMeta.delete(sourceBlock.id);

    const metaMap = new Y.Map<string | number | undefined>();
    metaMap.set('type', toggledBlock.type);
    metaMap.set('depth', toggledBlock.meta.depth);
    metaMap.set('align', toggledBlock.meta.align || 'left');
    this.blockMeta.set(toggledBlock.id, metaMap);
  }

  // ---- Yjs -> Local ----

  /**
   * Read block metadata from Y.Map for a given block ID.
   * Used when building editor operations for remote changes.
   */
  getBlockMeta(blockId: string): { type: string; depth: number; align: string } | null {
    const metaMap = this.blockMeta.get(blockId);
    if (!metaMap) return null;

    return {
      type: (metaMap.get('type') as string) || 'Paragraph',
      depth: (metaMap.get('depth') as number) || 0,
      align: (metaMap.get('align') as string) || 'left',
    };
  }

  /**
   * Handle remote meta changes. Returns operations to apply to the editor.
   */
  handleRemoteChanges(
    event: Y.YMapEvent<BlockMetaYMap>,
  ): { blockId: string; type: string; depth: number; align: string }[] {
    const changes: { blockId: string; type: string; depth: number; align: string }[] = [];

    // Handle changes to existing block meta maps
    for (const [key, change] of event.changes.keys) {
      if (change.action === 'update' || change.action === 'add') {
        const metaMap = this.blockMeta.get(key);
        if (metaMap) {
          changes.push({
            blockId: key,
            type: (metaMap.get('type') as string) || 'Paragraph',
            depth: (metaMap.get('depth') as number) || 0,
            align: (metaMap.get('align') as string) || 'left',
          });
        }
      }
    }

    return changes;
  }
}
