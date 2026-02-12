import type {
  DeleteBlockOperation,
  InsertBlockOperation,
  MergeBlockOperation,
  MoveBlockOperation,
  SplitBlockOperation,
  ToogleBlockOperation,
} from '@yoopta/editor';
import type * as Y from 'yjs';

export class BlockOrderBinding {
  constructor(
    private blockOrder: Y.Array<string>,
  ) { }

  // ---- Local -> Yjs ----

  insertBlock(op: InsertBlockOperation): void {
    const order = op.block.meta.order;
    // Clamp to valid range
    const index = Math.min(order, this.blockOrder.length);
    this.blockOrder.insert(index, [op.block.id]);
  }

  deleteBlock(op: DeleteBlockOperation): void {
    const index = this.findBlockIndex(op.block.id);
    if (index !== -1) {
      this.blockOrder.delete(index, 1);
    }
  }

  moveBlock(op: MoveBlockOperation): void {
    const fromIndex = this.findBlockIndex(op.prevProperties.id);
    if (fromIndex === -1) return;

    const blockId = op.prevProperties.id;
    this.blockOrder.delete(fromIndex, 1);

    const toIndex = Math.min(op.properties.order, this.blockOrder.length);
    this.blockOrder.insert(toIndex, [blockId]);
  }

  splitBlock(op: SplitBlockOperation): void {
    const originalIndex = this.findBlockIndex(op.prevProperties.originalBlock.id);
    if (originalIndex === -1) return;

    // Insert the new block after the original
    this.blockOrder.insert(originalIndex + 1, [op.properties.nextBlock.id]);
  }

  toggleBlock(op: ToogleBlockOperation): void {
    const { sourceBlock } = op.prevProperties;
    const { toggledBlock } = op.properties;

    if (sourceBlock.id === toggledBlock.id) return; // No ID change

    const index = this.findBlockIndex(sourceBlock.id);
    if (index === -1) return;

    this.blockOrder.delete(index, 1);
    this.blockOrder.insert(index, [toggledBlock.id]);
  }

  mergeBlock(op: MergeBlockOperation): void {
    // Remove the source block (the one being merged into the target)
    const sourceIndex = this.findBlockIndex(op.prevProperties.sourceBlock.id);
    if (sourceIndex !== -1) {
      this.blockOrder.delete(sourceIndex, 1);
    }
  }

  // ---- Yjs -> Local ----

  /**
   * Build editor operations from Y.Array changes.
   * Returns block IDs that were added/removed so the caller can coordinate
   * with blockMeta and blockContent bindings.
   */
  handleRemoteChanges(
    event: Y.YArrayEvent<string>,
  ): { added: { id: string; order: number }[]; removed: string[] } {
    const added: { id: string; order: number }[] = [];
    const removed: string[] = [];

    let index = 0;
    for (const delta of event.changes.delta) {
      if (delta.retain) {
        index += delta.retain;
      }
      if (delta.insert) {
        const ids = delta.insert as string[];
        for (let i = 0; i < ids.length; i += 1) {
          added.push({ id: ids[i], order: index + i });
        }
        index += ids.length;
      }
      if (delta.delete) {
        // We need to figure out which block IDs were removed.
        // Y.Array delete events don't tell us the removed values directly,
        // so we track removed IDs from the deleted set.
        // The caller provides this via the transaction.
      }
    }

    // Track removed block IDs from deleted items
    for (const item of event.changes.deleted) {
      if (item.content && item.content.getContent) {
        const content = item.content.getContent();
        for (const val of content) {
          if (typeof val === 'string') {
            removed.push(val);
          }
        }
      }
    }

    return { added, removed };
  }

  // ---- Helpers ----

  /** Get the current block order as an array of block IDs */
  getBlockIds(): string[] {
    return this.blockOrder.toArray();
  }

  /** Find the index of a block ID in the Y.Array */
  private findBlockIndex(blockId: string): number {
    const arr = this.blockOrder.toArray();
    return arr.indexOf(blockId);
  }
}
