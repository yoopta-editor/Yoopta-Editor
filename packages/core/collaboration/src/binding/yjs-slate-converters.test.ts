import { describe, expect, it } from 'vitest';
import * as Y from 'yjs';

import {
  slateElementToYXmlElement,
  slateValueToYXmlFragment,
  yXmlFragmentToSlateValue,
} from './yjs-slate-converters';

// ---- Helpers ----

function makeElement(
  type: string,
  children: any[],
  id = 'elem-1',
  props?: any,
) {
  const el: any = { id, type, children };
  if (props) el.props = props;
  return el;
}

/**
 * Integrate a Y.XmlElement (from slateElementToYXmlElement) into a Y.Doc
 * so we can read attributes and children from it.
 * Returns the integrated element.
 */
function integrate(xmlElement: Y.XmlElement): Y.XmlElement {
  const doc = new Y.Doc();
  const fragment = doc.getXmlFragment('test');
  fragment.insert(0, [xmlElement]);
  return fragment.get(0) as Y.XmlElement;
}

/**
 * Build a Y.XmlFragment on integrated types (inside a Y.Doc) from Slate elements.
 * Uses explicit {} for plain text attrs to prevent formatting inheritance.
 */
function buildIntegratedFragment(elements: any[]): { doc: Y.Doc; fragment: Y.XmlFragment } {
  const doc = new Y.Doc();
  const fragment = doc.getXmlFragment('test');

  doc.transact(() => {
    for (const element of elements) {
      buildIntegratedElement(fragment, element);
    }
  });

  return { doc, fragment };
}

function buildIntegratedElement(parent: Y.XmlFragment | Y.XmlElement, element: any): void {
  const xmlElement = new Y.XmlElement(element.type);
  parent.insert(parent.length, [xmlElement]);

  xmlElement.setAttribute('id', element.id);
  if (element.props) {
    xmlElement.setAttribute('props', JSON.stringify(element.props));
  }

  const hasTextChildren = element.children.some((c: any) => 'text' in c);

  if (hasTextChildren) {
    const xmlText = new Y.XmlText();
    xmlElement.insert(0, [xmlText]);

    for (const child of element.children) {
      if ('text' in child) {
        const { text, ...marks } = child;
        // Use {} for plain text — undefined inherits context formatting on integrated types
        const attrs = Object.keys(marks).length > 0 ? marks : {};
        xmlText.insert(xmlText.length, text, attrs);
      } else {
        // Inline element — embed (build recursively)
        const inlineXml = new Y.XmlElement(child.type);
        xmlText.insertEmbed(xmlText.length, inlineXml);
        inlineXml.setAttribute('id', child.id);
        if (child.props) {
          inlineXml.setAttribute('props', JSON.stringify(child.props));
        }
        // Add text content inside the inline element
        if (child.children?.some((c: any) => 'text' in c)) {
          const inlineText = new Y.XmlText();
          inlineXml.insert(0, [inlineText]);
          for (const inlineChild of child.children) {
            if ('text' in inlineChild) {
              const { text: t, ...m } = inlineChild;
              inlineText.insert(inlineText.length, t, Object.keys(m).length > 0 ? m : {});
            }
          }
        }
      }
    }
  } else {
    for (const child of element.children) {
      if (!('text' in child)) {
        buildIntegratedElement(xmlElement, child);
      }
    }
  }
}

// ---- Tests ----

describe('yjs-slate-converters', () => {
  // ====================
  // slateElementToYXmlElement
  // ====================

  describe('slateElementToYXmlElement', () => {
    it('should create Y.XmlElement with correct nodeName', () => {
      const element = makeElement('paragraph', [{ text: 'Hello' }]);
      const xmlElement = integrate(slateElementToYXmlElement(element));

      expect(xmlElement.nodeName).toBe('paragraph');
    });

    it('should set the id attribute', () => {
      const element = makeElement('paragraph', [{ text: 'Hello' }], 'my-id');
      const xmlElement = integrate(slateElementToYXmlElement(element));

      expect(xmlElement.getAttribute('id')).toBe('my-id');
    });

    it('should set props as JSON-serialized attribute', () => {
      const props = { nodeType: 'block', align: 'center' };
      const element = makeElement('paragraph', [{ text: '' }], 'elem-1', props);
      const xmlElement = integrate(slateElementToYXmlElement(element));

      const propsStr = xmlElement.getAttribute('props') as string;
      expect(JSON.parse(propsStr)).toEqual(props);
    });

    it('should not set props attribute when props are absent', () => {
      const element = makeElement('paragraph', [{ text: '' }]);
      const xmlElement = integrate(slateElementToYXmlElement(element));

      expect(xmlElement.getAttribute('props')).toBeUndefined();
    });

    it('should create a Y.XmlText child for text-level content', () => {
      const element = makeElement('paragraph', [{ text: 'Hello' }]);
      const xmlElement = integrate(slateElementToYXmlElement(element));

      expect(xmlElement.length).toBe(1);
      const child = xmlElement.get(0);
      expect(child).toBeInstanceOf(Y.XmlText);
    });

    it('should store plain text in Y.XmlText', () => {
      const element = makeElement('paragraph', [{ text: 'Hello World' }]);
      const xmlElement = integrate(slateElementToYXmlElement(element));

      const xmlText = xmlElement.get(0) as Y.XmlText;
      expect(xmlText.toString()).toBe('Hello World');
    });

    it('should store multiple text children as a single Y.XmlText', () => {
      const element = makeElement('paragraph', [
        { text: 'Hello' },
        { text: ' World' },
      ]);
      const xmlElement = integrate(slateElementToYXmlElement(element));

      expect(xmlElement.length).toBe(1); // Single Y.XmlText, not two
      const xmlText = xmlElement.get(0) as Y.XmlText;
      expect(xmlText.toString()).toBe('Hello World');
    });

    it('should embed inline elements inside Y.XmlText', () => {
      const linkElement = makeElement(
        'link',
        [{ text: 'click here' }],
        'link-1',
        { url: 'https://example.com', nodeType: 'inline' },
      );
      const element = makeElement('paragraph', [
        { text: 'Visit ' },
        linkElement,
        { text: ' for more' },
      ]);
      const xmlElement = integrate(slateElementToYXmlElement(element));

      expect(xmlElement.length).toBe(1);
      const xmlText = xmlElement.get(0) as Y.XmlText;
      const delta = xmlText.toDelta();

      // Delta: "Visit " (string) + Y.XmlElement embed + " for more" (string)
      expect(delta).toHaveLength(3);
      expect(delta[0].insert).toBe('Visit ');
      expect(delta[1].insert).toBeInstanceOf(Y.XmlElement);
      expect((delta[1].insert as Y.XmlElement).nodeName).toBe('link');
      expect(delta[2].insert).toBe(' for more');
    });

    it('should create nested Y.XmlElements for block-level children', () => {
      const element = makeElement('table-row', [
        makeElement('table-cell', [{ text: 'Cell 1' }], 'cell-1'),
        makeElement('table-cell', [{ text: 'Cell 2' }], 'cell-2'),
      ]);
      const xmlElement = integrate(slateElementToYXmlElement(element));

      expect(xmlElement.length).toBe(2);
      expect(xmlElement.get(0)).toBeInstanceOf(Y.XmlElement);
      expect(xmlElement.get(1)).toBeInstanceOf(Y.XmlElement);
      expect((xmlElement.get(0) as Y.XmlElement).nodeName).toBe('table-cell');
      expect((xmlElement.get(1) as Y.XmlElement).nodeName).toBe('table-cell');
    });

    it('should handle deeply nested block-level elements', () => {
      const element = makeElement('table', [
        makeElement('table-row', [
          makeElement('table-cell', [{ text: 'A' }], 'cell-a'),
        ], 'row-1'),
      ], 'table-1');
      const xmlElement = integrate(slateElementToYXmlElement(element));

      expect(xmlElement.nodeName).toBe('table');
      const row = xmlElement.get(0) as Y.XmlElement;
      expect(row.nodeName).toBe('table-row');
      const cell = row.get(0) as Y.XmlElement;
      expect(cell.nodeName).toBe('table-cell');
      const text = cell.get(0) as Y.XmlText;
      expect(text.toString()).toBe('A');
    });

    it('should handle empty text node', () => {
      const element = makeElement('paragraph', [{ text: '' }]);
      const xmlElement = integrate(slateElementToYXmlElement(element));

      const xmlText = xmlElement.get(0) as Y.XmlText;
      expect(xmlText.toString()).toBe('');
    });

    it('should handle element with many text children', () => {
      const children = [];
      for (let i = 0; i < 20; i += 1) {
        children.push({ text: `segment${i}` });
      }
      const element = makeElement('paragraph', children);
      const xmlElement = integrate(slateElementToYXmlElement(element));

      const xmlText = xmlElement.get(0) as Y.XmlText;
      expect(xmlText.toString()).toBe(children.map((c: any) => c.text).join(''));
    });

    it('should handle props with complex nested objects', () => {
      const complexProps = {
        nodeType: 'void',
        sizes: { width: 100, height: 200 },
        tags: ['a', 'b', 'c'],
        nested: { deep: { value: true } },
      };
      const element = makeElement('image', [{ text: '' }], 'img-1', complexProps);
      const xmlElement = integrate(slateElementToYXmlElement(element));

      const propsStr = xmlElement.getAttribute('props') as string;
      expect(JSON.parse(propsStr)).toEqual(complexProps);
    });

    it('should handle various element types', () => {
      const types = ['paragraph', 'heading-one', 'heading-two', 'blockquote', 'code', 'divider'];

      for (const type of types) {
        const element = makeElement(type, [{ text: '' }], `${type}-1`);
        const xmlElement = integrate(slateElementToYXmlElement(element));
        expect(xmlElement.nodeName).toBe(type);
      }
    });

    it('should handle element with only element children (no text)', () => {
      // Element whose children are all SlateElements (no text nodes)
      const element = makeElement('table-row', [
        makeElement('table-cell', [{ text: 'Cell' }], 'cell-1'),
      ]);
      const xmlElement = integrate(slateElementToYXmlElement(element));

      // Should have a Y.XmlElement child, not Y.XmlText
      expect(xmlElement.length).toBe(1);
      expect(xmlElement.get(0)).toBeInstanceOf(Y.XmlElement);
    });
  });

  // ====================
  // slateValueToYXmlFragment
  // ====================

  describe('slateValueToYXmlFragment', () => {
    it('should create a fragment with the correct number of elements', () => {
      const elements = [
        makeElement('heading-one', [{ text: 'Title' }], 'h1'),
        makeElement('paragraph', [{ text: 'Body' }], 'p1'),
        makeElement('paragraph', [{ text: 'More body' }], 'p2'),
      ];

      // Integrate by inserting individual elements into a doc fragment
      const doc = new Y.Doc();
      const fragment = doc.getXmlFragment('test');
      for (const el of elements) {
        fragment.insert(fragment.length, [slateElementToYXmlElement(el)]);
      }

      expect(fragment.length).toBe(3);
    });

    it('should preserve element order when integrated', () => {
      const elements = [
        makeElement('heading-one', [{ text: 'First' }], 'h1'),
        makeElement('paragraph', [{ text: 'Second' }], 'p1'),
      ];
      const doc = new Y.Doc();
      const fragment = doc.getXmlFragment('test');
      for (const el of elements) {
        fragment.insert(fragment.length, [slateElementToYXmlElement(el)]);
      }

      expect((fragment.get(0) as Y.XmlElement).nodeName).toBe('heading-one');
      expect((fragment.get(1) as Y.XmlElement).nodeName).toBe('paragraph');
    });

    it('should handle empty elements array', () => {
      const fragment = slateValueToYXmlFragment([]);
      expect(fragment.length).toBe(0);
    });

    it('should convert single element', () => {
      const doc = new Y.Doc();
      const fragment = doc.getXmlFragment('test');
      fragment.insert(0, [slateElementToYXmlElement(
        makeElement('paragraph', [{ text: 'Only one' }]),
      )]);

      expect(fragment.length).toBe(1);
      const xmlText = (fragment.get(0) as Y.XmlElement).get(0) as Y.XmlText;
      expect(xmlText.toString()).toBe('Only one');
    });
  });

  // ====================
  // yXmlFragmentToSlateValue
  // ====================

  describe('yXmlFragmentToSlateValue', () => {
    it('should convert a simple text element back to Slate', () => {
      const { fragment } = buildIntegratedFragment([
        makeElement('paragraph', [{ text: 'Hello World' }]),
      ]);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('paragraph');
      expect(result[0].id).toBe('elem-1');
      expect(result[0].children).toEqual([{ text: 'Hello World' }]);
    });

    it('should restore element props', () => {
      const props = { nodeType: 'block', align: 'center' };
      const { fragment } = buildIntegratedFragment([
        makeElement('paragraph', [{ text: '' }], 'elem-1', props),
      ]);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result[0].props).toEqual(props);
    });

    it('should not include props when not set', () => {
      const { fragment } = buildIntegratedFragment([
        makeElement('paragraph', [{ text: 'Hi' }]),
      ]);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result[0].props).toBeUndefined();
    });

    it('should restore formatted text with marks', () => {
      const { fragment } = buildIntegratedFragment([
        makeElement('paragraph', [
          { text: 'Hello ' },
          { text: 'bold', bold: true },
          { text: ' world' },
        ]),
      ]);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result[0].children).toHaveLength(3);
      expect(result[0].children[0]).toEqual({ text: 'Hello ' });
      expect(result[0].children[1]).toEqual({ text: 'bold', bold: true });
      expect(result[0].children[2]).toEqual({ text: ' world' });
    });

    it('should restore multiple marks on a single text node', () => {
      const { fragment } = buildIntegratedFragment([
        makeElement('paragraph', [
          { text: 'styled', bold: true, italic: true },
        ]),
      ]);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result[0].children[0]).toEqual({
        text: 'styled',
        bold: true,
        italic: true,
      });
    });

    it('should convert block-level children back to Slate', () => {
      const { fragment } = buildIntegratedFragment([
        makeElement('table-row', [
          makeElement('table-cell', [{ text: 'Cell 1' }], 'cell-1'),
          makeElement('table-cell', [{ text: 'Cell 2' }], 'cell-2'),
        ]),
      ]);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result[0].type).toBe('table-row');
      expect(result[0].children).toHaveLength(2);
      expect((result[0].children[0] as any).type).toBe('table-cell');
      expect((result[0].children[0] as any).children[0]).toEqual({ text: 'Cell 1' });
      expect((result[0].children[1] as any).type).toBe('table-cell');
      expect((result[0].children[1] as any).children[0]).toEqual({ text: 'Cell 2' });
    });

    it('should handle multiple elements in the fragment', () => {
      const { fragment } = buildIntegratedFragment([
        makeElement('heading-one', [{ text: 'Title' }], 'h1'),
        makeElement('paragraph', [{ text: 'Body' }], 'p1'),
      ]);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('heading-one');
      expect(result[0].id).toBe('h1');
      expect(result[1].type).toBe('paragraph');
      expect(result[1].id).toBe('p1');
    });

    it('should return empty array for empty fragment', () => {
      const doc = new Y.Doc();
      const fragment = doc.getXmlFragment('empty');

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toEqual([]);
    });

    it('should add default empty text child when element has no content', () => {
      const doc = new Y.Doc();
      const fragment = doc.getXmlFragment('test');

      doc.transact(() => {
        const xmlElement = new Y.XmlElement('paragraph');
        fragment.insert(0, [xmlElement]);
        xmlElement.setAttribute('id', 'empty-elem');
      });

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toHaveLength(1);
      expect(result[0].children).toEqual([{ text: '' }]);
    });

    it('should default id to empty string when not set', () => {
      const doc = new Y.Doc();
      const fragment = doc.getXmlFragment('test');

      doc.transact(() => {
        const xmlElement = new Y.XmlElement('paragraph');
        fragment.insert(0, [xmlElement]);
        const xmlText = new Y.XmlText();
        xmlElement.insert(0, [xmlText]);
        xmlText.insert(0, 'No ID');
      });

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result[0].id).toBe('');
    });

    it('should skip non-XmlElement children in fragment', () => {
      const doc = new Y.Doc();
      const fragment = doc.getXmlFragment('test');

      doc.transact(() => {
        const xmlText = new Y.XmlText();
        xmlText.insert(0, 'stray text');
        fragment.insert(0, [xmlText]);

        const xmlElement = new Y.XmlElement('paragraph');
        fragment.insert(1, [xmlElement]);
        xmlElement.setAttribute('id', 'real-elem');
        const innerText = new Y.XmlText();
        xmlElement.insert(0, [innerText]);
        innerText.insert(0, 'Real content');
      });

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('paragraph');
    });
  });

  // ====================
  // Round-trip tests (Slate → Yjs → Slate)
  // ====================

  describe('Round-trip (Slate → Yjs → Slate)', () => {
    it('should round-trip a simple paragraph', () => {
      const original = [makeElement('paragraph', [{ text: 'Hello World' }])];
      const { fragment } = buildIntegratedFragment(original);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toEqual(original);
    });

    it('should round-trip an element with props', () => {
      const original = [
        makeElement('image', [{ text: '' }], 'img-1', {
          nodeType: 'void',
          src: 'https://example.com/image.png',
          alt: 'Example',
        }),
      ];
      const { fragment } = buildIntegratedFragment(original);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toEqual(original);
    });

    it('should round-trip text with mixed marks', () => {
      const original = [
        makeElement('paragraph', [
          { text: 'plain ' },
          { text: 'bold', bold: true },
          { text: ' and ' },
          { text: 'italic', italic: true },
          { text: ' text' },
        ]),
      ];
      const { fragment } = buildIntegratedFragment(original);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toEqual(original);
    });

    it('should round-trip multiple marks on one node', () => {
      const original = [
        makeElement('paragraph', [
          { text: 'bold italic', bold: true, italic: true },
        ]),
      ];
      const { fragment } = buildIntegratedFragment(original);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toEqual(original);
    });

    it('should round-trip nested block-level elements', () => {
      const original = [
        makeElement('table-row', [
          makeElement('table-cell', [{ text: 'A1' }], 'cell-a1'),
          makeElement('table-cell', [{ text: 'A2' }], 'cell-a2'),
        ], 'row-1'),
      ];
      const { fragment } = buildIntegratedFragment(original);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toEqual(original);
    });

    it('should round-trip deeply nested structure', () => {
      const original = [
        makeElement('table', [
          makeElement('table-row', [
            makeElement('table-cell', [{ text: 'Deep' }], 'cell-1'),
          ], 'row-1'),
        ], 'table-1'),
      ];
      const { fragment } = buildIntegratedFragment(original);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toEqual(original);
    });

    it('should round-trip multiple top-level elements', () => {
      const original = [
        makeElement('heading-one', [{ text: 'Title' }], 'h1'),
        makeElement('paragraph', [{ text: 'First paragraph' }], 'p1'),
        makeElement('paragraph', [
          { text: 'Second with ' },
          { text: 'bold', bold: true },
        ], 'p2'),
      ];
      const { fragment } = buildIntegratedFragment(original);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toEqual(original);
    });

    it('should round-trip empty text', () => {
      const original = [makeElement('paragraph', [{ text: '' }])];
      const { fragment } = buildIntegratedFragment(original);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toEqual(original);
    });

    it('should round-trip with highlight mark (object value)', () => {
      const original = [
        makeElement('paragraph', [
          { text: 'highlighted', highlight: { color: 'red' } },
        ]),
      ];
      const { fragment } = buildIntegratedFragment(original);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toEqual(original);
    });

    it('should round-trip bold followed by plain text', () => {
      const original = [
        makeElement('paragraph', [
          { text: 'bold', bold: true },
          { text: ' plain' },
        ]),
      ];
      const { fragment } = buildIntegratedFragment(original);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toEqual(original);
    });
  });

  // ====================
  // Inline element embed round-trip
  // ====================

  describe('Inline element embeds', () => {
    it('should convert inline element to Y.XmlElement embed in Y.XmlText', () => {
      const linkElement = makeElement(
        'link',
        [{ text: 'click' }],
        'link-1',
        { url: 'https://example.com', nodeType: 'inline' },
      );
      const element = makeElement('paragraph', [
        { text: 'Visit ' },
        linkElement,
        { text: ' now' },
      ]);
      const xmlElement = integrate(slateElementToYXmlElement(element));
      const xmlText = xmlElement.get(0) as Y.XmlText;
      const delta = xmlText.toDelta();

      expect(delta).toHaveLength(3);
      expect(typeof delta[0].insert).toBe('string');
      expect(delta[0].insert).toBe('Visit ');

      const embed = delta[1].insert;
      expect(embed).toBeInstanceOf(Y.XmlElement);
      expect((embed as Y.XmlElement).nodeName).toBe('link');
      expect((embed as Y.XmlElement).getAttribute('id')).toBe('link-1');

      expect(typeof delta[2].insert).toBe('string');
      expect(delta[2].insert).toBe(' now');
    });

    it('should round-trip inline elements via integrated types', () => {
      const doc = new Y.Doc();
      const fragment = doc.getXmlFragment('test');

      doc.transact(() => {
        const xmlElement = new Y.XmlElement('paragraph');
        fragment.insert(0, [xmlElement]);
        xmlElement.setAttribute('id', 'p-1');

        const xmlText = new Y.XmlText();
        xmlElement.insert(0, [xmlText]);

        xmlText.insert(0, 'Visit ', {});

        const linkXml = new Y.XmlElement('link');
        linkXml.setAttribute('id', 'link-1');
        linkXml.setAttribute('props', JSON.stringify({ url: 'https://example.com', nodeType: 'inline' }));
        const linkText = new Y.XmlText();
        linkXml.insert(0, [linkText]);
        linkText.insert(0, 'click');
        xmlText.insertEmbed(xmlText.length, linkXml);

        xmlText.insert(xmlText.length, ' now', {});
      });

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toHaveLength(1);
      expect(result[0].children).toHaveLength(3);
      expect(result[0].children[0]).toEqual({ text: 'Visit ' });

      const inlineChild = result[0].children[1] as any;
      expect(inlineChild.type).toBe('link');
      expect(inlineChild.id).toBe('link-1');
      expect(inlineChild.props).toEqual({ url: 'https://example.com', nodeType: 'inline' });
      expect(inlineChild.children).toEqual([{ text: 'click' }]);

      expect(result[0].children[2]).toEqual({ text: ' now' });
    });
  });

  // ====================
  // Edge cases
  // ====================

  describe('Edge cases', () => {
    it('should handle Y.XmlFragment with multiple element types', () => {
      const doc = new Y.Doc();
      const fragment = doc.getXmlFragment('test');

      doc.transact(() => {
        const elem = new Y.XmlElement('paragraph');
        fragment.insert(0, [elem]);
        elem.setAttribute('id', 'p1');
        const text = new Y.XmlText();
        elem.insert(0, [text]);
        text.insert(0, 'Content');

        const elem2 = new Y.XmlElement('heading-one');
        fragment.insert(1, [elem2]);
        elem2.setAttribute('id', 'h1');
        const text2 = new Y.XmlText();
        elem2.insert(0, [text2]);
        text2.insert(0, 'Heading');
      });

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('paragraph');
      expect(result[1].type).toBe('heading-one');
    });

    it('should handle alternating formatted and plain text segments', () => {
      const { fragment } = buildIntegratedFragment([
        makeElement('paragraph', [
          { text: 'a' },
          { text: 'b', bold: true },
          { text: 'c' },
          { text: 'd', italic: true },
          { text: 'e' },
        ]),
      ]);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result[0].children).toHaveLength(5);
      expect(result[0].children[0]).toEqual({ text: 'a' });
      expect(result[0].children[1]).toEqual({ text: 'b', bold: true });
      expect(result[0].children[2]).toEqual({ text: 'c' });
      expect(result[0].children[3]).toEqual({ text: 'd', italic: true });
      expect(result[0].children[4]).toEqual({ text: 'e' });
    });

    it('should handle adjacent segments with different marks', () => {
      const { fragment } = buildIntegratedFragment([
        makeElement('paragraph', [
          { text: 'bold', bold: true },
          { text: 'italic', italic: true },
        ]),
      ]);

      const result = yXmlFragmentToSlateValue(fragment);

      expect(result[0].children).toHaveLength(2);
      expect(result[0].children[0]).toEqual({ text: 'bold', bold: true });
      expect(result[0].children[1]).toEqual({ text: 'italic', italic: true });
    });
  });
});
