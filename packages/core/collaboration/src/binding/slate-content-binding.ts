import type { SlateEditor, SlateElement } from '@yoopta/editor';
import type { Descendant, Operation } from 'slate';
import { Editor, Transforms } from 'slate';
import * as Y from 'yjs';

import { slateElementToYXmlElement, yXmlFragmentToSlateValue } from './yjs-slate-converters';
import { LOCAL_ORIGIN } from '../types';

/**
 * Per-block binding that syncs Slate operations bidirectionally with Y.XmlFragment.
 *
 * Supports arbitrarily nested element structures (e.g., Steps, Tabs, CodeGroup)
 * by navigating the Y.Xml tree using full Slate paths.
 *
 * Local flow:  slate.apply(op) → resolve Y.XmlElement by path → Y.XmlText.insert/delete/format
 * Remote flow: Y.XmlText/XmlElement observeDeep → find path via parent chain → slate.apply(op)
 */
export class SlateContentBinding {
  public isApplyingRemote = false;
  public readonly slate: SlateEditor;

  private fragment: Y.XmlFragment;
  private doc: Y.Doc;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private observer: ((events: Y.YEvent<any>[], txn: Y.Transaction) => void) | null = null;
  private originalApply: SlateEditor['apply'];

  constructor(fragment: Y.XmlFragment, slate: SlateEditor, doc: Y.Doc) {
    this.fragment = fragment;
    this.slate = slate;
    this.doc = doc;
    this.originalApply = slate.apply;

    this.wrapSlateApply();
    this.setupFragmentObserver();
  }

  // ======== Path navigation helpers ========

  /**
   * Navigate the Y.Xml tree to find the Y.XmlElement at the given Slate element path.
   * E.g. path [0, 0, 0, 0] traverses fragment → child[0] → child[0] → child[0] → child[0].
   */
  private resolveXmlElement(path: number[]): Y.XmlElement | null {
    let current: Y.XmlFragment | Y.XmlElement = this.fragment;

    for (const index of path) {
      if (index < 0 || index >= current.length) return null;
      const child = current.get(index);
      if (!(child instanceof Y.XmlElement)) return null;
      current = child;
    }

    return current instanceof Y.XmlElement ? current : null;
  }

  /**
   * Navigate the Slate tree to find the SlateElement at the given path.
   */
  private resolveSlateElement(path: number[]): SlateElement | null {
    if (path.length === 0) return null;

    let current = this.slate.children[path[0]] as SlateElement | undefined;
    if (!current) return null;

    for (let i = 1; i < path.length; i += 1) {
      const child = current.children[path[i]];
      if (!child || 'text' in child) return null;
      current = child as SlateElement;
    }

    return current || null;
  }

  /**
   * Find the full Slate element path for a Y.XmlElement by walking up the parent chain.
   * Returns null if the element is not within this fragment.
   */
  private findXmlElementPath(target: Y.XmlElement): number[] | null {
    const path: number[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = target;

    while (current && current !== this.fragment) {
      const parent = current.parent;
      if (!parent) return null;

      // Find index of current in parent
      let found = false;
      for (let i = 0; i < parent.length; i += 1) {
        if (parent.get(i) === current) {
          path.unshift(i);
          found = true;
          break;
        }
      }
      if (!found) return null;
      current = parent;
    }

    return current === this.fragment ? path : null;
  }

  /** Get the first Y.XmlText child of a Y.XmlElement (leaf elements store text here). */
  private getXmlTextChild(xmlElement: Y.XmlElement): Y.XmlText | null {
    if (xmlElement.length === 0) return null;
    const firstChild = xmlElement.get(0);
    return firstChild instanceof Y.XmlText ? firstChild : null;
  }

  /**
   * Compute absolute text offset within a resolved SlateElement.
   * Sums the lengths of all children before childIndex.
   */
  private computeAbsoluteOffset(element: SlateElement, childIndex: number, offset: number): number {
    let abs = 0;
    for (let i = 0; i < childIndex && i < element.children.length; i += 1) {
      const child = element.children[i] as Descendant;
      abs += 'text' in child ? (child as { text: string }).text.length : 1;
    }
    return abs + offset;
  }

  /** Get text marks from a specific child of a resolved SlateElement. */
  private getMarksFromElement(element: SlateElement, childIndex: number): Record<string, unknown> | null {
    const child = element.children[childIndex] as Descendant | undefined;
    if (!child || !('text' in child)) return null;

    const childObj = child as { text: string;[key: string]: unknown };
    const marks: Record<string, unknown> = {};
    for (const key of Object.keys(childObj)) {
      if (key !== 'text') {
        marks[key] = childObj[key];
      }
    }
    return Object.keys(marks).length > 0 ? marks : null;
  }

  /**
   * Convert absolute offset to (childIndex, childOffset) using a SlateElement's children.
   */
  private absoluteToChildOffset(
    slateElement: SlateElement,
    absoluteOffset: number,
  ): [number, number] {
    let remaining = absoluteOffset;

    for (let i = 0; i < slateElement.children.length; i += 1) {
      const child = slateElement.children[i] as Descendant;
      const len = 'text' in child ? (child as { text: string }).text.length : 1;

      if (remaining < len) {
        return [i, remaining];
      }
      remaining -= len;
    }

    // Past the end — return last child
    const lastIndex = Math.max(0, slateElement.children.length - 1);
    const lastChild = slateElement.children[lastIndex] as Descendant;
    const lastLen = lastChild && 'text' in lastChild ? (lastChild as { text: string }).text.length : 0;
    return [lastIndex, lastLen];
  }

  // ======== Local → Y.Doc ========

  private wrapSlateApply(): void {
    const self = this;
    const originalApply = this.originalApply;

    this.slate.apply = (op: Operation) => {
      if (!self.isApplyingRemote) {
        self.pushLocalOp(op);
      }
      originalApply(op);
    };
  }

  private pushLocalOp(op: Operation): void {
    if (op.type === 'insert_text') {
      this.handleLocalInsertText(op);
    } else if (op.type === 'remove_text') {
      this.handleLocalRemoveText(op);
    } else if (op.type === 'set_node') {
      this.handleLocalSetNode(op);
    } else if (op.type === 'insert_node') {
      this.handleLocalInsertNode(op);
    } else if (op.type === 'remove_node') {
      this.handleLocalRemoveNode(op);
    } else if (op.type === 'split_node') {
      this.handleLocalSplitNode(op);
    } else if (op.type === 'merge_node') {
      this.handleLocalMergeNode(op);
    } else if (op.type === 'move_node') {
      this.syncFullFragment();
    }
    // set_selection is ignored — local-only
  }

  private handleLocalInsertText(op: Operation & { type: 'insert_text' }): void {
    const { path, offset, text } = op;
    const elementPath = path.slice(0, -1);
    const childIndex = path[path.length - 1];

    const xmlElement = this.resolveXmlElement(elementPath);
    if (!xmlElement) return;

    const xmlText = this.getXmlTextChild(xmlElement);
    if (!xmlText) return;

    const slateElement = this.resolveSlateElement(elementPath);
    if (!slateElement) return;

    const absoluteOffset = this.computeAbsoluteOffset(slateElement, childIndex, offset);
    const marks = this.getMarksFromElement(slateElement, childIndex);

    this.doc.transact(() => {
      xmlText.insert(absoluteOffset, text, marks ?? undefined);
    }, LOCAL_ORIGIN);
  }

  private handleLocalRemoveText(op: Operation & { type: 'remove_text' }): void {
    const { path, offset, text } = op;
    const elementPath = path.slice(0, -1);
    const childIndex = path[path.length - 1];

    const xmlElement = this.resolveXmlElement(elementPath);
    if (!xmlElement) return;

    const xmlText = this.getXmlTextChild(xmlElement);
    if (!xmlText) return;

    const slateElement = this.resolveSlateElement(elementPath);
    if (!slateElement) return;

    const absoluteOffset = this.computeAbsoluteOffset(slateElement, childIndex, offset);

    this.doc.transact(() => {
      xmlText.delete(absoluteOffset, text.length);
    }, LOCAL_ORIGIN);
  }

  private handleLocalSetNode(op: Operation & { type: 'set_node' }): void {
    const { path, properties, newProperties } = op;
    const np = newProperties as Record<string, unknown>;

    // Determine if this targets an element (has props/type) or a text node (marks)
    if (np.props !== undefined || np.type !== undefined) {
      // Element prop/type update
      const xmlElement = this.resolveXmlElement(path);
      if (!xmlElement) return;

      if (np.props !== undefined) {
        this.doc.transact(() => {
          xmlElement.setAttribute('props', JSON.stringify(np.props));
        }, LOCAL_ORIGIN);
      }
      if (np.type !== undefined) {
        this.syncFullFragment();
      }
    } else {
      // Text node — format marks
      const elementPath = path.slice(0, -1);
      const childIndex = path[path.length - 1];

      const xmlElement = this.resolveXmlElement(elementPath);
      if (!xmlElement) return;

      const xmlText = this.getXmlTextChild(xmlElement);
      if (!xmlText) return;

      const slateElement = this.resolveSlateElement(elementPath);
      if (!slateElement) return;

      const startOffset = this.computeAbsoluteOffset(slateElement, childIndex, 0);
      const child = slateElement.children[childIndex] as Descendant;
      const len = child && 'text' in child ? (child as { text: string }).text.length : 1;

      const formatAttrs = this.computeFormatDiff(
        properties as Record<string, unknown>,
        newProperties as Record<string, unknown>,
      );

      if (Object.keys(formatAttrs).length > 0 && len > 0) {
        this.doc.transact(() => {
          xmlText.format(startOffset, len, formatAttrs);
        }, LOCAL_ORIGIN);
      }
    }
  }

  private handleLocalInsertNode(op: Operation & { type: 'insert_node' }): void {
    const { path, node } = op;
    const parentPath = path.slice(0, -1);
    const insertIndex = path[path.length - 1];

    if ('text' in node) {
      // Text node insertion into a leaf element's Y.XmlText
      const xmlElement = this.resolveXmlElement(parentPath);
      if (!xmlElement) return;

      const xmlText = this.getXmlTextChild(xmlElement);
      if (!xmlText) return;

      const slateElement = this.resolveSlateElement(parentPath);
      if (!slateElement) return;

      const offset = this.computeAbsoluteOffset(slateElement, insertIndex, 0);
      const { text, ...marks } = node as { text: string;[key: string]: unknown };
      const attrs = Object.keys(marks).length > 0 ? marks : undefined;
      this.doc.transact(() => {
        xmlText.insert(offset, text, attrs as Record<string, unknown> | undefined);
      }, LOCAL_ORIGIN);
    } else {
      // Element node — check if parent is a text-containing element (inline embed)
      const parentElement = parentPath.length > 0
        ? this.resolveSlateElement(parentPath)
        : null;

      if (parentElement?.children.some((c: Descendant) => 'text' in c)) {
        // Inline element — embed in parent's Y.XmlText
        const xmlParent = this.resolveXmlElement(parentPath);
        if (!xmlParent) return;

        const xmlText = this.getXmlTextChild(xmlParent);
        if (!xmlText) return;

        const offset = this.computeAbsoluteOffset(parentElement, insertIndex, 0);
        const yElement = slateElementToYXmlElement(node as SlateElement);
        this.doc.transact(() => {
          xmlText.insertEmbed(offset, yElement);
        }, LOCAL_ORIGIN);
      } else {
        // Block-level element insertion
        let parent: Y.XmlFragment | Y.XmlElement;
        if (parentPath.length === 0) {
          parent = this.fragment;
        } else {
          const xmlParent = this.resolveXmlElement(parentPath);
          if (!xmlParent) return;
          parent = xmlParent;
        }

        const xmlElement = slateElementToYXmlElement(node as SlateElement);
        this.doc.transact(() => {
          parent.insert(insertIndex, [xmlElement]);
        }, LOCAL_ORIGIN);
      }
    }
  }

  private handleLocalRemoveNode(op: Operation & { type: 'remove_node' }): void {
    const { path, node } = op;
    const parentPath = path.slice(0, -1);
    const removeIndex = path[path.length - 1];

    if ('text' in node) {
      // Text node removal from a leaf element's Y.XmlText
      const xmlElement = this.resolveXmlElement(parentPath);
      if (!xmlElement) return;

      const xmlText = this.getXmlTextChild(xmlElement);
      if (!xmlText) return;

      const slateElement = this.resolveSlateElement(parentPath);
      if (!slateElement) return;

      const offset = this.computeAbsoluteOffset(slateElement, removeIndex, 0);
      const len = (node as { text: string }).text.length;

      if (len > 0) {
        this.doc.transact(() => {
          xmlText.delete(offset, len);
        }, LOCAL_ORIGIN);
      }
    } else {
      // Element removal — check if parent has text children (inline element)
      const parentElement = parentPath.length > 0
        ? this.resolveSlateElement(parentPath)
        : null;

      if (parentElement?.children.some((c: Descendant) => 'text' in c)) {
        // Inline element removal from Y.XmlText
        const xmlParent = this.resolveXmlElement(parentPath);
        if (!xmlParent) return;

        const xmlText = this.getXmlTextChild(xmlParent);
        if (!xmlText) return;

        const offset = this.computeAbsoluteOffset(parentElement, removeIndex, 0);
        this.doc.transact(() => {
          xmlText.delete(offset, 1); // Inline embeds count as 1
        }, LOCAL_ORIGIN);
      } else {
        // Block-level element removal
        let parent: Y.XmlFragment | Y.XmlElement;
        if (parentPath.length === 0) {
          parent = this.fragment;
        } else {
          const xmlParent = this.resolveXmlElement(parentPath);
          if (!xmlParent) return;
          parent = xmlParent;
        }

        this.doc.transact(() => {
          parent.delete(removeIndex, 1);
        }, LOCAL_ORIGIN);
      }
    }
  }

  private handleLocalSplitNode(op: Operation & { type: 'split_node' }): void {
    // Text-level splits don't change Y.XmlText content — only Slate's child segmentation.
    // Element-level splits have 'type' in properties.
    if (!('type' in op.properties)) {
      return; // Text child split — no-op for Y.Doc
    }
    this.deferSyncFullFragment();
  }

  private handleLocalMergeNode(op: Operation & { type: 'merge_node' }): void {
    if (!('type' in op.properties)) {
      return; // Text child merge — no-op for Y.Doc
    }
    this.deferSyncFullFragment();
  }

  // ======== Remote → Local ========

  private setupFragmentObserver(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.observer = (events: Y.YEvent<any>[], transaction: Y.Transaction) => {
      if (transaction.origin === LOCAL_ORIGIN) return;

      this.isApplyingRemote = true;
      try {
        // If any event involves structural changes (children added/removed),
        // do a full fragment replace to ensure consistency
        const hasStructuralChanges = events.some(
          (e) =>
            e instanceof Y.YXmlEvent &&
            (e.changes.added.size > 0 || e.changes.deleted.size > 0),
        );

        if (hasStructuralChanges) {
          this.fallbackFullFragmentReplace();
          return;
        }

        // Process individual events (text changes + attribute updates only)
        for (const event of events) {
          if (event instanceof Y.YTextEvent) {
            this.handleRemoteTextChange(event);
          } else if (event instanceof Y.YXmlEvent) {
            this.handleRemoteXmlChange(event);
          }
        }
      } finally {
        this.isApplyingRemote = false;
      }
    };
    this.fragment.observeDeep(this.observer);
  }

  private handleRemoteTextChange(event: Y.YTextEvent): void {
    const textTarget = event.target;
    const parentXmlElement = textTarget.parent;
    if (!parentXmlElement || !(parentXmlElement instanceof Y.XmlElement)) return;

    const elementPath = this.findXmlElementPath(parentXmlElement);
    if (!elementPath) return;

    const slateElement = this.resolveSlateElement(elementPath);
    if (!slateElement) return;

    const applied = this.tryApplyCharacterLevel(event, elementPath, slateElement);
    if (!applied) {
      this.fallbackFullFragmentReplace();
    }
  }

  private handleRemoteXmlChange(event: Y.YXmlEvent): void {
    const target = event.target;

    if (target === this.fragment) return;
    if (!(target instanceof Y.XmlElement)) return;

    // Only attribute changes reach here (structural changes handled in observer)
    const changedKeys = event.keys;
    if (changedKeys.size === 0) return;

    const elementPath = this.findXmlElementPath(target);
    if (!elementPath) return;

    const newProps: Record<string, unknown> = {};
    let hasPropsChange = false;

    for (const [key] of changedKeys) {
      if (key === 'props') {
        const propsStr = target.getAttribute('props') as string | undefined;
        if (propsStr) {
          newProps.props = JSON.parse(propsStr);
          hasPropsChange = true;
        }
      }
    }

    if (hasPropsChange) {
      Editor.withoutNormalizing(this.slate, () => {
        Transforms.setNodes(this.slate, newProps, { at: elementPath });
      });
    }
  }

  private tryApplyCharacterLevel(
    event: Y.YTextEvent,
    elementPath: number[],
    slateElement: SlateElement,
  ): boolean {
    const delta = event.delta;

    // Only handle simple string insert/delete/retain without formatting changes
    for (const d of delta) {
      if (d.insert !== undefined && typeof d.insert !== 'string') return false;
      if (d.retain !== undefined && d.attributes) return false;
    }

    Editor.withoutNormalizing(this.slate, () => {
      let absoluteOffset = 0;

      for (const d of delta) {
        if (d.retain !== undefined) {
          absoluteOffset += d.retain;
        } else if (d.insert !== undefined && typeof d.insert === 'string') {
          const text = d.insert;
          const [childIndex, childOffset] = this.absoluteToChildOffset(
            slateElement,
            absoluteOffset,
          );

          this.slate.apply({
            type: 'insert_text',
            path: [...elementPath, childIndex],
            offset: childOffset,
            text,
          });

          absoluteOffset += text.length;
        } else if (d.delete !== undefined) {
          this.applyRemoteDelete(elementPath, absoluteOffset, d.delete);
        }
      }
    });

    return true;
  }

  private applyRemoteDelete(
    elementPath: number[],
    absoluteOffset: number,
    deleteLen: number,
  ): void {
    let remaining = deleteLen;

    while (remaining > 0) {
      const currentElement = this.resolveSlateElement(elementPath);
      if (!currentElement) break;

      const [childIndex, childOffset] = this.absoluteToChildOffset(
        currentElement,
        absoluteOffset,
      );
      const child = currentElement.children[childIndex];
      if (!child || !('text' in child)) break;

      const availableInNode = child.text.length - childOffset;
      const toDelete = Math.min(remaining, availableInNode);

      if (toDelete <= 0) break;

      const deletedText = child.text.slice(childOffset, childOffset + toDelete);

      this.slate.apply({
        type: 'remove_text',
        path: [...elementPath, childIndex],
        offset: childOffset,
        text: deletedText,
      });

      remaining -= toDelete;
    }
  }

  // ======== Fallbacks & sync ========

  private deferSyncFullFragment(): void {
    Promise.resolve().then(() => {
      this.syncFullFragment();
    });
  }

  private syncFullFragment(): void {
    this.doc.transact(() => {
      while (this.fragment.length > 0) {
        this.fragment.delete(0, 1);
      }
      for (let i = 0; i < this.slate.children.length; i += 1) {
        const element = this.slate.children[i] as SlateElement;
        const xmlElement = slateElementToYXmlElement(element);
        this.fragment.insert(i, [xmlElement]);
      }
    }, LOCAL_ORIGIN);
  }

  private fallbackFullFragmentReplace(): void {
    try {
      const newValue = yXmlFragmentToSlateValue(this.fragment);

      Editor.withoutNormalizing(this.slate, () => {
        for (let i = this.slate.children.length - 1; i >= 0; i -= 1) {
          Transforms.removeNodes(this.slate, { at: [i] });
        }
        for (let i = 0; i < newValue.length; i += 1) {
          Transforms.insertNodes(this.slate, newValue[i], { at: [i] });
        }
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[SlateContentBinding] Full fragment replace failed:', e);
    }
  }

  private computeFormatDiff(
    oldProps: Record<string, unknown>,
    newProps: Record<string, unknown>,
  ): Record<string, unknown> {
    const attrs: Record<string, unknown> = {};

    for (const key of Object.keys(newProps)) {
      if (key === 'text') continue;
      attrs[key] = newProps[key];
    }

    for (const key of Object.keys(oldProps)) {
      if (key === 'text') continue;
      if (!(key in newProps)) {
        attrs[key] = null;
      }
    }

    return attrs;
  }

  // ======== Cleanup ========

  destroy(): void {
    if (this.observer) {
      this.fragment.unobserveDeep(this.observer);
      this.observer = null;
    }

    this.slate.apply = this.originalApply;
  }
}
