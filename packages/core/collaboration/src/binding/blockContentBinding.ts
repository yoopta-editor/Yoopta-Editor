import { slateNodesToInsertDelta, yTextToSlateElement } from '@slate-yjs/core';
import type { SlateElement } from '@yoopta/editor';
import * as Y from 'yjs';

/**
 * Thin manager for block content stored as Y.XmlText per block.
 * Content sync is handled by @slate-yjs/core (withYjs per Slate editor).
 * This class only manages the Y.Map<Y.XmlText> entries for structural operations
 * (insert, delete, split, merge, toggle).
 */
export class BlockContentBinding {
  constructor(private blockContents: Y.Map<Y.XmlText>) { }

  /** Create a Y.XmlText for a new block with initial Slate content */
  createSharedRoot(blockId: string, slateValue: SlateElement[]): Y.XmlText {
    const sharedRoot = new Y.XmlText();
    const insertDelta = slateNodesToInsertDelta(slateValue);
    sharedRoot.applyDelta(insertDelta, { sanitize: false });
    this.blockContents.set(blockId, sharedRoot);
    return sharedRoot;
  }

  /** Remove a block's Y.XmlText */
  deleteSharedRoot(blockId: string): void {
    this.blockContents.delete(blockId);
  }

  /** Get the Y.XmlText for a block (used by buildSlateEditorFn) */
  getSharedRoot(blockId: string): Y.XmlText | undefined {
    return this.blockContents.get(blockId);
  }

  /** Check if a shared root exists for a block */
  has(blockId: string): boolean {
    return this.blockContents.has(blockId);
  }

  /** Read current Slate elements from Y.XmlText */
  getSlateValue(blockId: string): SlateElement[] | null {
    const sharedRoot = this.blockContents.get(blockId);
    if (!sharedRoot) return null;

    try {
      const element = yTextToSlateElement(sharedRoot);
      return element.children as SlateElement[];
    } catch {
      return null;
    }
  }

  /** Get all block IDs in the content map */
  keys(): IterableIterator<string> {
    return this.blockContents.keys();
  }

  destroy(): void {
    // No observers to clean up — slate-yjs manages observation per Slate editor
  }
}
