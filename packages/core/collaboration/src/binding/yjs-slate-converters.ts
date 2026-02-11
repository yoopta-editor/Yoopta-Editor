/**
 * Bidirectional converters between Slate elements and Yjs XML types.
 *
 * Y.Doc structure per block:
 *
 *   Y.XmlFragment (root — represents SlateElement[])
 *     └── Y.XmlElement (nodeName = element type, e.g. 'paragraph')
 *           attrs: { id, props? }
 *           └── Y.XmlText (text content with marks as attributes)
 *                 ├── "Hello "              (no attrs)
 *                 ├── "bold text"           ({ bold: true })
 *                 ├── Y.XmlElement('link')  (inline element embed)
 *                 │     └── Y.XmlText("click here")
 *                 └── " world"             (no attrs)
 *
 * Rules:
 *   - SlateElement → Y.XmlElement
 *   - Text-containing children (Text + inline Elements) → single Y.XmlText child
 *   - Block-containing children (only Elements) → nested Y.XmlElement children
 *   - Text marks (bold, italic, etc.) → Y.XmlText attributes
 *   - Element props → JSON-serialized attribute on Y.XmlElement
 */

import type { SlateElement } from '@yoopta/editor';
import type { Descendant } from 'slate';
import * as Y from 'yjs';

// ---- Slate → Yjs ----

/** Convert a Slate value (SlateElement[]) into a Y.XmlFragment */
export function slateValueToYXmlFragment(elements: SlateElement[]): Y.XmlFragment {
  const fragment = new Y.XmlFragment();

  for (const element of elements) {
    const xmlElement = slateElementToYXmlElement(element);
    fragment.insert(fragment.length, [xmlElement]);
  }

  return fragment;
}

/** Convert a single SlateElement into a Y.XmlElement */
export function slateElementToYXmlElement(element: SlateElement): Y.XmlElement {
  const xmlElement = new Y.XmlElement(element.type);

  // Store id and props as attributes
  xmlElement.setAttribute('id', element.id);
  if (element.props) {
    xmlElement.setAttribute('props', JSON.stringify(element.props));
  }

  // Determine if children are text-level (Text nodes + inline elements)
  // or block-level (only Element nodes)
  const hasTextChildren = element.children.some(
    (child: Descendant) => 'text' in child,
  );

  if (hasTextChildren) {
    // Text-level: create a single Y.XmlText holding all text + inline embeds
    const xmlText = new Y.XmlText();

    // Track offset manually — xmlText.length returns 0 on unintegrated types
    let offset = 0;
    for (const child of element.children) {
      if ('text' in child) {
        // Text node — extract marks as attributes
        const { text, ...marks } = child as { text: string;[key: string]: unknown };
        const attrs = Object.keys(marks).length > 0 ? marks : undefined;
        xmlText.insert(offset, text, attrs as Record<string, unknown> | undefined);
        offset += text.length;
      } else {
        // Inline element — embed as Y.XmlElement inside Y.XmlText
        const inlineXml = slateElementToYXmlElement(child as SlateElement);
        xmlText.insertEmbed(offset, inlineXml);
        offset += 1; // Embeds count as 1 character
      }
    }

    xmlElement.insert(0, [xmlText]);
  } else {
    // Block-level: nested Y.XmlElements
    for (const child of element.children) {
      if (!('text' in child)) {
        const childXml = slateElementToYXmlElement(child as SlateElement);
        xmlElement.insert(xmlElement.length, [childXml]);
      }
    }
  }

  return xmlElement;
}

// ---- Yjs → Slate ----

/** Convert a Y.XmlFragment back into SlateElement[] */
export function yXmlFragmentToSlateValue(fragment: Y.XmlFragment): SlateElement[] {
  const elements: SlateElement[] = [];

  for (let i = 0; i < fragment.length; i += 1) {
    const child = fragment.get(i);
    if (child instanceof Y.XmlElement) {
      elements.push(yXmlElementToSlateElement(child));
    }
  }

  return elements;
}

/** Convert a single Y.XmlElement back into a SlateElement */
function yXmlElementToSlateElement(xmlElement: Y.XmlElement): SlateElement {
  const type = xmlElement.nodeName;
  const id = (xmlElement.getAttribute('id') as string) || '';
  const propsStr = xmlElement.getAttribute('props') as string | undefined;
  const props = propsStr ? JSON.parse(propsStr) : undefined;

  const children: Descendant[] = [];

  // Check what kind of children this element has
  const firstChild = xmlElement.length > 0 ? xmlElement.get(0) : null;

  if (firstChild instanceof Y.XmlText) {
    // Text-level content — read delta from Y.XmlText
    const delta = firstChild.toDelta() as {
      insert: string | Y.XmlElement;
      attributes?: Record<string, unknown>;
    }[];

    for (const op of delta) {
      if (typeof op.insert === 'string') {
        // Text node with optional marks
        children.push({ text: op.insert, ...(op.attributes || {}) } as Descendant);
      } else if (op.insert instanceof Y.XmlElement) {
        // Inline element embed
        children.push(yXmlElementToSlateElement(op.insert));
      }
    }
  } else {
    // Block-level children — nested Y.XmlElements
    for (let i = 0; i < xmlElement.length; i += 1) {
      const child = xmlElement.get(i);
      if (child instanceof Y.XmlElement) {
        children.push(yXmlElementToSlateElement(child));
      }
    }
  }

  // Slate requires non-empty children
  if (children.length === 0) {
    children.push({ text: '' });
  }

  const element: SlateElement = { id, type, children };
  if (props) {
    element.props = props;
  }
  return element;
}
