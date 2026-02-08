import type {
  SlateElement,
  YooEditor,
  YooptaContentValue,
  YooptaOperation,
} from '@yoopta/editor';
import * as Y from 'yjs';

import { BlockContentBinding } from './blockContentBinding';
import { BlockMetaBinding } from './blockMetaBinding';
import type { BlockMetaYMap } from './blockMetaBinding';
import { BlockOrderBinding } from './blockOrderBinding';
import { LOCAL_ORIGIN } from '../types';

export class YDocBinding {
  public isApplyingRemote = false;

  private blockOrderBinding: BlockOrderBinding;
  private blockMetaBinding: BlockMetaBinding;
  private blockContentBinding: BlockContentBinding;

  private blockOrder: Y.Array<string>;
  private blockMeta: Y.Map<BlockMetaYMap>;
  private blockContents: Y.Map<Y.XmlText>;

  private blockOrderObserver: ((event: Y.YArrayEvent<string>, transaction: Y.Transaction) => void) | null = null;
  private blockMetaObserver: ((event: Y.YMapEvent<BlockMetaYMap>, transaction: Y.Transaction) => void) | null = null;

  constructor(
    private editor: YooEditor,
    private doc: Y.Doc,
  ) {
    this.blockOrder = doc.getArray<string>('blockOrder');
    this.blockMeta = doc.getMap<BlockMetaYMap>('blockMeta');
    this.blockContents = doc.getMap<Y.XmlText>('blockContents');

    this.blockOrderBinding = new BlockOrderBinding(this.blockOrder);
    this.blockMetaBinding = new BlockMetaBinding(this.blockMeta);
    this.blockContentBinding = new BlockContentBinding(this.blockContents);

    this.setupObservers();
  }

  // ---- Public accessors for collaboration integration ----

  /** Get the Y.XmlText shared root for a block (used by buildSlateEditorFn) */
  getSharedRoot(blockId: string): Y.XmlText | undefined {
    return this.blockContentBinding.getSharedRoot(blockId);
  }

  /** Create a Y.XmlText shared root for a block if it doesn't already exist */
  ensureSharedRoot(blockId: string, slateValue: SlateElement[]): Y.XmlText {
    const existing = this.blockContentBinding.getSharedRoot(blockId);
    if (existing) return existing;
    return this.blockContentBinding.createSharedRoot(blockId, slateValue);
  }

  /** Delete a block's Y.XmlText shared root */
  deleteSharedRoot(blockId: string): void {
    // this.blockContentBinding.deleteSharedRoot(blockId);
  }

  // ---- Initial Sync ----

  /**
   * Synchronize the Y.Doc with the editor.
   * If Y.Doc already has data, load it into the editor.
   * If Y.Doc is empty and initialValue is provided, seed it.
   */
  initialSync(initialValue?: YooptaContentValue): void {
    const hasYDocData = this.blockOrder.length > 0;

    if (hasYDocData) {
      this.loadFromYDoc();
    } else if (initialValue && Object.keys(initialValue).length > 0) {
      this.seedYDoc(initialValue);
    }
  }

  /** Load the current Y.Doc state into the editor */
  private loadFromYDoc(): void {
    const blockIds = this.blockOrder.toArray();
    const value: YooptaContentValue = {};

    for (let i = 0; i < blockIds.length; i += 1) {
      const blockId = blockIds[i];
      const meta = this.blockMetaBinding.getBlockMeta(blockId);
      const content = this.blockContentBinding.getSlateValue(blockId);

      if (meta && content) {
        value[blockId] = {
          id: blockId,
          type: meta.type,
          value: content,
          meta: {
            order: i,
            depth: meta.depth,
            align: meta.align as 'left' | 'center' | 'right' | undefined,
          },
        };
      }
    }

    if (Object.keys(value).length > 0) {
      this.applyRemote(() => {
        this.editor.setEditorValue(value);
      });
    }
  }

  /** Seed the Y.Doc from editor content */
  private seedYDoc(value: YooptaContentValue): void {
    const blocks = Object.values(value).sort((a, b) => a.meta.order - b.meta.order);

    this.doc.transact(() => {
      for (const block of blocks) {
        // Block order
        this.blockOrder.push([block.id]);

        // Block meta
        const metaMap = new Y.Map<string | number | undefined>();
        metaMap.set('type', block.type);
        metaMap.set('depth', block.meta.depth);
        metaMap.set('align', block.meta.align || 'left');
        this.blockMeta.set(block.id, metaMap);

        // Block content — create Y.XmlText via slate-yjs conversion
        this.blockContentBinding.createSharedRoot(block.id, block.value as SlateElement[]);
      }
    }, LOCAL_ORIGIN);
  }

  // ---- Local -> Yjs ----

  /** Push local structural operations to Y.Doc */
  pushLocalOperations(ops: YooptaOperation[]): void {
    this.doc.transact(() => {
      for (const op of ops) {
        this.pushOperation(op);
      }
    }, LOCAL_ORIGIN);
  }

  private pushOperation(op: YooptaOperation): void {
    switch (op.type) {
      case 'insert_block':
        this.blockOrderBinding.insertBlock(op);
        this.blockMetaBinding.insertBlock(op);
        // Y.XmlText already created via ensureSharedRoot (pre-processed by withCollaboration)
        break;

      case 'delete_block':
        this.blockOrderBinding.deleteBlock(op);
        this.blockMetaBinding.deleteBlock(op.block.id);
        this.blockContentBinding.deleteSharedRoot(op.block.id);
        break;

      case 'set_block_meta':
        this.blockMetaBinding.updateMeta(op);
        break;

      case 'move_block':
        this.blockOrderBinding.moveBlock(op);
        break;

      case 'split_block':
        this.blockOrderBinding.splitBlock(op);
        this.blockMetaBinding.splitBlock(op);
        // Y.XmlText for new block already created via ensureSharedRoot (pre-processed)
        break;

      case 'merge_block':
        this.blockOrderBinding.mergeBlock(op);
        this.blockMetaBinding.mergeBlock(op);
        this.blockContentBinding.deleteSharedRoot(op.prevProperties.sourceBlock.id);
        break;

      case 'toggle_block':
        this.blockMetaBinding.toggleBlock(op);
        // Y.XmlText already swapped in pre-processing (old deleted, new created)
        break;

      case 'set_editor_value':
        this.fullSync(op.properties.value);
        break;

      // Content sync is handled by slate-yjs per block — no Y.Doc changes needed
      case 'set_slate':
      case 'set_block_value':
        break;

      // Path operations: no Y.Doc changes needed
      case 'set_block_path':
      case 'validate_block_paths':
        break;

      default:
        break;
    }
  }

  /** Full document replacement — resync everything */
  private fullSync(value: YooptaContentValue): void {
    const blocks = Object.values(value).sort((a, b) => a.meta.order - b.meta.order);

    // Clear existing
    this.blockOrder.delete(0, this.blockOrder.length);

    for (const key of [...this.blockMeta.keys()]) {
      this.blockMeta.delete(key);
    }
    for (const key of [...this.blockContents.keys()]) {
      this.blockContents.delete(key);
    }

    // Re-add everything
    for (const block of blocks) {
      this.blockOrder.push([block.id]);

      const metaMap = new Y.Map<string | number | undefined>();
      metaMap.set('type', block.type);
      metaMap.set('depth', block.meta.depth);
      metaMap.set('align', block.meta.align || 'left');
      this.blockMeta.set(block.id, metaMap);

      this.blockContentBinding.createSharedRoot(block.id, block.value as SlateElement[]);
    }
  }

  // ---- Yjs -> Local (remote changes) ----

  private setupObservers(): void {
    // Observe block order changes (insert, delete, move, reorder)
    this.blockOrderObserver = (event: Y.YArrayEvent<string>, transaction: Y.Transaction) => {
      if (transaction.origin === LOCAL_ORIGIN) return;
      this.handleRemoteBlockOrderChange(event);
    };
    this.blockOrder.observe(this.blockOrderObserver);

    // Observe block meta changes (depth, align, type)
    this.blockMetaObserver = (event: Y.YMapEvent<BlockMetaYMap>, transaction: Y.Transaction) => {
      if (transaction.origin === LOCAL_ORIGIN) return;
      this.handleRemoteBlockMetaChange(event);
    };
    this.blockMeta.observe(this.blockMetaObserver);

    // No content observer needed — slate-yjs handles content sync per Slate editor
  }

  private handleRemoteBlockOrderChange(_event: Y.YArrayEvent<string>): void {
    // Rebuild editor state from Y.Doc — the Y.Array already has the correct final ordering.
    this.applyRemote(() => {
      this.rebuildEditorFromYDoc();
    });
  }

  private handleRemoteBlockMetaChange(event: Y.YMapEvent<BlockMetaYMap>): void {
    const changes = this.blockMetaBinding.handleRemoteChanges(event);

    this.applyRemote(() => {
      const operations: YooptaOperation[] = [];

      for (const change of changes) {
        const block = this.editor.children[change.blockId];
        if (!block) continue;

        const metaChanged =
          block.meta.depth !== change.depth ||
          (block.meta.align || 'left') !== change.align;

        if (metaChanged) {
          operations.push({
            type: 'set_block_meta',
            id: change.blockId,
            properties: {
              depth: change.depth,
              align: change.align as 'left' | 'center' | 'right' | undefined,
            },
            prevProperties: {
              depth: block.meta.depth,
              align: block.meta.align,
            },
          });
        }
      }

      if (operations.length > 0) {
        this.editor.applyTransforms(operations, { validatePaths: false });
      }
    });
  }

  /**
   * Rebuild the full editor value from the Y.Doc.
   * Used for remote block order changes (insert, delete, move) where the Y.Array
   * already represents the correct final state.
   */
  private rebuildEditorFromYDoc(): void {
    const blockIds = this.blockOrder.toArray();
    const value: YooptaContentValue = {};

    for (let i = 0; i < blockIds.length; i += 1) {
      const blockId = blockIds[i];

      // Reuse existing block data if the block already exists in the editor
      const existingBlock = this.editor.children[blockId];
      if (existingBlock) {
        value[blockId] = {
          ...existingBlock,
          meta: { ...existingBlock.meta, order: i },
        };
        continue;
      }

      // New block from remote — read meta and content from Y.Doc
      const meta = this.blockMetaBinding.getBlockMeta(blockId);
      const content = this.blockContentBinding.getSlateValue(blockId);

      if (meta && content) {
        value[blockId] = {
          id: blockId,
          type: meta.type,
          value: content,
          meta: {
            order: i,
            depth: meta.depth,
            align: meta.align as 'left' | 'center' | 'right' | undefined,
          },
        };
      }
    }

    if (Object.keys(value).length > 0) {
      this.editor.applyTransforms(
        [{
          type: 'set_editor_value',
          properties: { value },
          prevProperties: { value: this.editor.children },
        }],
        { validatePaths: true },
      );
    }
  }

  // ---- Helpers ----

  /** Apply remote changes without triggering Y.Doc updates or history */
  private applyRemote(fn: () => void): void {
    if (this.isApplyingRemote) {
      fn();
      return;
    }

    this.isApplyingRemote = true;
    try {
      this.editor.withoutSavingHistory(() => {
        fn();
      });
    } finally {
      this.isApplyingRemote = false;
    }
  }

  destroy(): void {
    if (this.blockOrderObserver) {
      this.blockOrder.unobserve(this.blockOrderObserver);
      this.blockOrderObserver = null;
    }

    if (this.blockMetaObserver) {
      this.blockMeta.unobserve(this.blockMetaObserver);
      this.blockMetaObserver = null;
    }

    this.blockContentBinding.destroy();
  }
}
