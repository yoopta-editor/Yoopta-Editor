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
    Object.entries(meta).forEach(([k, v]) => {
      if (k !== 'order') metaMap.set(k, v as string | number | undefined);
    });
    this.blockMeta.set(id, metaMap);
  }

  deleteBlock(blockId: string): void {
    this.blockMeta.delete(blockId);
  }

  updateMeta(op: SetBlockMetaOperation): void {
    const metaMap = this.blockMeta.get(op.id);
    if (!metaMap) return;

    const { properties } = op;
    Object.entries(properties).forEach(([k, v]) => {
      if (k !== 'order') metaMap.set(k, v as string | number | undefined);
    });
  }

  splitBlock(op: SplitBlockOperation): void {
    const { nextBlock } = op.properties;
    const metaMap = new Y.Map<string | number | undefined>();
    metaMap.set('type', nextBlock.type);
    Object.entries(nextBlock.meta).forEach(([k, v]) => {
      if (k !== 'order') metaMap.set(k, v as string | number | undefined);
    });
    this.blockMeta.set(nextBlock.id, metaMap);
  }

  mergeBlock(op: MergeBlockOperation): void {
    // Remove the source block's meta
    this.blockMeta.delete(op.prevProperties.sourceBlock.id);

    // Update the merged block's meta if it changed
    const mergedMeta = this.blockMeta.get(op.properties.mergedBlock.id);
    if (mergedMeta) {
      const { meta } = op.properties.mergedBlock;
      Object.entries(meta).forEach(([k, v]) => {
        if (k !== 'order') mergedMeta.set(k, v as string | number | undefined);
      });
    }
  }

  toggleBlock(op: { prevProperties: { sourceBlock: YooptaBlockData }; properties: { toggledBlock: YooptaBlockData } }): void {
    const { sourceBlock } = op.prevProperties;
    const { toggledBlock } = op.properties;

    // Remove old block meta and add new one
    this.blockMeta.delete(sourceBlock.id);

    const metaMap = new Y.Map<string | number | undefined>();
    metaMap.set('type', toggledBlock.type);
    Object.entries(toggledBlock.meta).forEach(([k, v]) => {
      if (k !== 'order') metaMap.set(k, v as string | number | undefined);
    });
    this.blockMeta.set(toggledBlock.id, metaMap);
  }

  // ---- Yjs -> Local ----

  /**
   * Read block metadata from Y.Map for a given block ID.
   * Used when building editor operations for remote changes.
   */
  getBlockMeta(blockId: string): Record<string, unknown> | null {
    const metaMap = this.blockMeta.get(blockId);
    if (!metaMap) return null;

    const result: Record<string, unknown> = {};
    metaMap.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Handle remote meta changes. Returns operations to apply to the editor.
   */
  handleRemoteChanges(
    event: Y.YMapEvent<BlockMetaYMap>,
  ): { blockId: string; [key: string]: unknown }[] {
    const changes: { blockId: string; [key: string]: unknown }[] = [];

    // Handle changes to existing block meta maps
    for (const [key, change] of event.changes.keys) {
      if (change.action === 'update' || change.action === 'add') {
        const metaMap = this.blockMeta.get(key);
        if (metaMap) {
          const entry: { blockId: string; [key: string]: unknown } = { blockId: key };
          metaMap.forEach((value, k) => {
            entry[k] = value;
          });
          changes.push(entry);
        }
      }
    }

    return changes;
  }
}
