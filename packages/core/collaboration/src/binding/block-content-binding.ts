import type { SlateElement } from '@yoopta/editor';
import type { Descendant } from 'slate';
import * as Y from 'yjs';

import { slateElementToYXmlElement, yXmlFragmentToSlateValue } from './yjs-slate-converters';

/**
 * Manages block content stored as Y.XmlFragment per block.
 *
 * Each block's Slate value (SlateElement[]) maps to a Y.XmlFragment:
 *   Y.XmlFragment
 *     └── Y.XmlElement (element type as nodeName)
 *           └── Y.XmlText (text content, marks as attributes)
 */
export class BlockContentBinding {
  constructor(private blockContents: Y.Map<Y.XmlFragment>) { }

  /** Create a Y.XmlFragment for a new block with initial Slate content */
  createContent(blockId: string, slateValue: SlateElement[]): Y.XmlFragment {
    const xmlFragment = new Y.XmlFragment();
    this.blockContents.set(blockId, xmlFragment); // Integrate into Y.Doc first
    this.populateFragment(xmlFragment, slateValue); // Then populate on integrated types
    return xmlFragment;
  }

  /** Update an existing block's Y.XmlFragment content in-place */
  updateContent(blockId: string, slateValue: SlateElement[]): void {
    const fragment = this.blockContents.get(blockId);
    console.log('BlockContentBinding updateContent fragment', fragment)
    if (!fragment) return;

    // Clear existing content
    while (fragment.length > 0) {
      fragment.delete(0, 1);
    }

    // Re-populate on the already-integrated fragment
    this.populateFragment(fragment, slateValue);
  }

  /** Remove a block's Y.XmlFragment */
  deleteContent(blockId: string): void {
    this.blockContents.delete(blockId);
  }

  /** Get the Y.XmlFragment for a block */
  getFragment(blockId: string): Y.XmlFragment | undefined {
    return this.blockContents.get(blockId);
  }

  /** Check if content exists for a block */
  has(blockId: string): boolean {
    return this.blockContents.has(blockId);
  }

  /** Read current Slate elements from a block's Y.XmlFragment */
  getSlateValue(blockId: string): SlateElement[] | null {
    const fragment = this.blockContents.get(blockId);
    if (!fragment) return null;

    try {
      return yXmlFragmentToSlateValue(fragment);
    } catch {
      return null;
    }
  }

  /** Get all block IDs in the content map */
  keys(): IterableIterator<string> {
    return this.blockContents.keys();
  }

  destroy(): void {
    // Observers will be managed by YDocBinding
  }

  // ---- Private helpers ----

  /**
   * Populate an integrated Y.XmlFragment from Slate elements.
   * Must be called AFTER the fragment is integrated into a Y.Doc
   * to ensure text formatting attributes are preserved.
   */
  private populateFragment(fragment: Y.XmlFragment, elements: SlateElement[]): void {
    for (const element of elements) {
      this.populateElement(fragment, element);
    }
  }

  private populateElement(parent: Y.XmlFragment | Y.XmlElement, element: SlateElement): void {
    const xmlElement = new Y.XmlElement(element.type);
    parent.insert(parent.length, [xmlElement]); // Integrate before populating

    xmlElement.setAttribute('id', element.id);
    if (element.props) {
      xmlElement.setAttribute('props', JSON.stringify(element.props));
    }

    const hasTextChildren = element.children.some(
      (child: Descendant) => 'text' in child,
    );

    if (hasTextChildren) {
      const xmlText = new Y.XmlText();
      xmlElement.insert(0, [xmlText]); // Integrate before inserting text

      for (const child of element.children) {
        if ('text' in child) {
          const { text, ...marks } = child as { text: string;[key: string]: unknown };
          // Use {} for plain text (not undefined) — on integrated types,
          // undefined attrs inherits formatting from the preceding character.
          const attrs = Object.keys(marks).length > 0 ? marks : {};
          xmlText.insert(xmlText.length, text, attrs as Record<string, unknown>);
        } else {
          // Inline element — embed as Y.XmlElement
          const inlineXml = slateElementToYXmlElement(child as SlateElement);
          xmlText.insertEmbed(xmlText.length, inlineXml);
        }
      }
    } else {
      // Block-level children — recurse
      for (const child of element.children) {
        if (!('text' in child)) {
          this.populateElement(xmlElement, child as SlateElement);
        }
      }
    }
  }
}
