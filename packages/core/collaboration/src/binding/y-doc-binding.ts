import type {
  SlateEditor,
  SlateElement,
  YooEditor,
  YooptaContentValue,
  YooptaOperation,
} from '@yoopta/editor';
import * as Y from 'yjs';

import { BlockContentBinding } from './block-content-binding';
import { BlockMetaBinding } from './block-meta-binding';
import type { BlockMetaYMap } from './block-meta-binding';
import { BlockOrderBinding } from './block-order-binding';
import { SlateContentBinding } from './slate-content-binding';
import { LOCAL_ORIGIN } from '../types';

/**
 * Y.Doc structure:
 *
 *   Y.Doc
 *   ├── blockOrder:    Y.Array<string>              — ordered block IDs
 *   ├── blockMeta:     Y.Map<Y.Map>                 — per-block metadata (type, depth, align)
 *   └── blockContents: Y.Map<Y.XmlFragment>         — per-block Slate content
 *                        └── Y.XmlElement            — slate element (type as nodeName)
 *                              attrs: { id, props? }
 *                              └── Y.XmlText         — text content, marks as attributes
 */
export class YDocBinding {
  public isApplyingRemote = false;

  private blockOrderBinding: BlockOrderBinding;
  private blockMetaBinding: BlockMetaBinding;
  private blockContentBinding: BlockContentBinding;

  private blockOrder: Y.Array<string>;
  private blockMeta: Y.Map<BlockMetaYMap>;
  private blockContents: Y.Map<Y.XmlFragment>;

  private contentBindings: Map<string, SlateContentBinding> = new Map();
  private undoManager: Y.UndoManager;

  private blockOrderObserver: ((event: Y.YArrayEvent<string>, transaction: Y.Transaction) => void) | null = null;
  private blockMetaObserver: ((event: Y.YMapEvent<BlockMetaYMap>, transaction: Y.Transaction) => void) | null = null;

  constructor(
    private editor: YooEditor,
    private doc: Y.Doc,
  ) {
    this.blockOrder = doc.getArray<string>('blockOrder');
    this.blockMeta = doc.getMap<BlockMetaYMap>('blockMeta');
    this.blockContents = doc.getMap<Y.XmlFragment>('blockContents');

    this.blockOrderBinding = new BlockOrderBinding(this.blockOrder);
    this.blockMetaBinding = new BlockMetaBinding(this.blockMeta);
    this.blockContentBinding = new BlockContentBinding(this.blockContents);

    this.undoManager = new Y.UndoManager(
      [this.blockOrder, this.blockMeta, this.blockContents],
      { trackedOrigins: new Set([LOCAL_ORIGIN]) },
    );

    this.setupObservers();
  }

  // ---- Public accessors ----

  /** Get the Y.XmlFragment for a block's content */
  getFragment(blockId: string): Y.XmlFragment | undefined {
    return this.blockContentBinding.getFragment(blockId);
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

    // Clear undo stacks — initial load/seed should not be undoable
    this.undoManager.clear();
  }

  /** Undo the last local change via Y.UndoManager (preserves remote changes) */
  undo(): void {
    if (this.undoManager.undoStack.length === 0) return;
    this.applyRemote(() => {
      this.undoManager.undo();
    });
  }

  /** Redo the last undone local change via Y.UndoManager */
  redo(): void {
    if (this.undoManager.redoStack.length === 0) return;
    this.applyRemote(() => {
      this.undoManager.redo();
    });
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

        // Block content — convert Slate value to Y.XmlFragment
        this.blockContentBinding.createContent(block.id, block.value as SlateElement[]);
      }
    }, LOCAL_ORIGIN);
  }

  // ---- Local -> Yjs ----

  /** Push local operations to Y.Doc */
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
        this.blockContentBinding.createContent(op.block.id, op.block.value as SlateElement[]);
        break;

      case 'delete_block':
        this.blockOrderBinding.deleteBlock(op);
        this.blockMetaBinding.deleteBlock(op.block.id);
        this.blockContentBinding.deleteContent(op.block.id);
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
        this.blockContentBinding.createContent(
          op.properties.nextBlock.id,
          op.properties.nextSlateValue,
        );
        // Update original block's content (truncated after split).
        // applyTransforms directly assigns splitSlate.children, bypassing slate.apply,
        // so SlateContentBinding doesn't see this change.
        this.blockContentBinding.updateContent(
          op.prevProperties.originalBlock.id,
          op.properties.splitSlateValue,
        );
        break;

      case 'merge_block':
        this.blockOrderBinding.mergeBlock(op);
        this.blockMetaBinding.mergeBlock(op);
        this.blockContentBinding.deleteContent(op.prevProperties.sourceBlock.id);
        // Update merged block's content (now includes merged text).
        // applyTransforms directly assigns slate.children, bypassing slate.apply.
        this.blockContentBinding.updateContent(
          op.properties.mergedBlock.id,
          op.properties.mergedSlateValue,
        );
        break;

      case 'toggle_block':
        this.blockOrderBinding.toggleBlock(op);
        this.blockMetaBinding.toggleBlock(op);
        this.blockContentBinding.deleteContent(op.prevProperties.sourceBlock.id);
        this.blockContentBinding.createContent(
          op.properties.toggledBlock.id,
          op.properties.toggledSlateValue,
        );
        break;

      case 'set_editor_value':
        // this.fullSync(op.properties.value);
        break;

      // TODO: set_slate will be handled by per-block content binding (next step)
      case 'set_slate':
        break;

      // set_block_value is handled via set_slate at the Yjs level
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

      this.blockContentBinding.createContent(block.id, block.value as SlateElement[]);
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

    // TODO: Content observers will be added in per-block binding step
  }

  private handleRemoteBlockOrderChange(_event: Y.YArrayEvent<string>): void {
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

  // ---- Content bindings lifecycle ----

  /**
   * Reconcile per-block content bindings with the current editor state.
   * Creates bindings for new blocks, removes bindings for deleted blocks,
   * and recreates bindings when slate references change.
   */
  reconcileContentBindings(): void {
    const currentBlockIds = new Set(Object.keys(this.editor.blockEditorsMap));

    // Remove bindings for blocks that no longer exist or whose slate changed
    for (const [blockId, binding] of this.contentBindings) {
      const slate = this.editor.blockEditorsMap[blockId];
      if (!slate || binding.slate !== slate) {
        binding.destroy();
        this.contentBindings.delete(blockId);
      }
    }

    // Create bindings for blocks that don't have one yet
    for (const blockId of currentBlockIds) {
      if (this.contentBindings.has(blockId)) continue;

      const fragment = this.blockContentBinding.getFragment(blockId);
      const slate = this.editor.blockEditorsMap[blockId];

      if (fragment && slate) {
        const contentBinding = new SlateContentBinding(fragment, slate, this.doc);
        this.contentBindings.set(blockId, contentBinding);
      }
    }
  }

  /**
   * Check if the given Slate editor is currently applying a remote change
   * (either structural from YDocBinding or character-level from SlateContentBinding).
   */
  isRemoteForSlate(slate: SlateEditor): boolean {
    // Check structural remote changes
    if (this.isApplyingRemote) return true;

    // Check per-block content bindings
    for (const [, binding] of this.contentBindings) {
      if (binding.slate === slate && binding.isApplyingRemote) {
        return true;
      }
    }

    return false;
  }

  destroy(): void {
    // Clean up undo manager
    this.undoManager.destroy();

    // Clean up content bindings
    for (const [, binding] of this.contentBindings) {
      binding.destroy();
    }
    this.contentBindings.clear();

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
