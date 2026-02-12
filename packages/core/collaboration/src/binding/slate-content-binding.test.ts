import { Transforms } from 'slate';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';

import { SlateContentBinding } from './slate-content-binding';
import { yXmlFragmentToSlateValue } from './yjs-slate-converters';
import { LOCAL_ORIGIN } from '../types';
// Mock Slate — needed for remote → Slate fallback paths
vi.mock('slate', () => ({
  Editor: {
    withoutNormalizing: vi.fn((_editor: unknown, fn: () => void) => fn()),
  },
  Transforms: {
    removeNodes: vi.fn(),
    insertNodes: vi.fn(),
    setNodes: vi.fn(),
  },
}));

type MinimalSlateEditor = {
  children: any[];
  selection: any;
  operations: any[];
  apply: (op: any) => void;
}

function applyMinimalOp(editor: MinimalSlateEditor, op: any): void {
  switch (op.type) {
    case 'insert_text': {
      const [ei, ci] = op.path;
      if (!editor.children[ei]?.children?.[ci]) break;
      const node = editor.children[ei].children[ci];
      node.text = node.text.slice(0, op.offset) + op.text + node.text.slice(op.offset);
      break;
    }
    case 'remove_text': {
      const [ei, ci] = op.path;
      if (!editor.children[ei]?.children?.[ci]) break;
      const node = editor.children[ei].children[ci];
      node.text = node.text.slice(0, op.offset) + node.text.slice(op.offset + op.text.length);
      break;
    }
    case 'set_node': {
      const node =
        op.path.length === 2
          ? editor.children[op.path[0]].children[op.path[1]]
          : editor.children[op.path[0]];
      for (const key of Object.keys(op.properties)) {
        if (!(key in op.newProperties)) {
          delete node[key];
        }
      }
      Object.assign(node, op.newProperties);
      break;
    }
    case 'insert_node': {
      if (op.path.length === 2) {
        const [ei, ci] = op.path;
        editor.children[ei].children.splice(ci, 0, JSON.parse(JSON.stringify(op.node)));
      } else {
        const [ei] = op.path;
        editor.children.splice(ei, 0, JSON.parse(JSON.stringify(op.node)));
      }
      break;
    }
    case 'remove_node': {
      if (op.path.length === 2) {
        const [ei, ci] = op.path;
        editor.children[ei].children.splice(ci, 1);
      } else {
        const [ei] = op.path;
        editor.children.splice(ei, 1);
      }
      break;
    }
    case 'split_node': {
      if (op.path.length === 2) {
        const [ei, ci] = op.path;
        const node = editor.children[ei].children[ci];
        if ('text' in node) {
          const rest = { ...node, text: node.text.slice(op.position), ...op.properties };
          node.text = node.text.slice(0, op.position);
          editor.children[ei].children.splice(ci + 1, 0, rest);
        }
      }
      break;
    }
    case 'merge_node': {
      if (op.path.length === 2) {
        const [ei, ci] = op.path;
        if (ci > 0) {
          const prev = editor.children[ei].children[ci - 1];
          const current = editor.children[ei].children[ci];
          if ('text' in prev && 'text' in current) {
            prev.text += current.text;
            editor.children[ei].children.splice(ci, 1);
          }
        }
      }
      break;
    }
    case 'set_selection':
      editor.selection = op.newProperties;
      break;
    default:
      break;
  }
}

function createMinimalSlate(initialChildren: any[]): MinimalSlateEditor {
  const editor: MinimalSlateEditor = {
    children: JSON.parse(JSON.stringify(initialChildren)),
    selection: null,
    operations: [],
    apply(op: any) {
      editor.operations.push(JSON.parse(JSON.stringify(op)));
      applyMinimalOp(editor, op);
    },
  };
  return editor;
}

// ---- Setup helpers ----

const REMOTE_ORIGIN = 'test-remote';

/**
 * Build Y.Doc structure using INTEGRATED types (insert element into doc first,
 * then populate its children). This ensures formatted text segments are stored
 * correctly — unintegrated Y.XmlText may lose formatting attributes.
 */
function populateFragment(doc: Y.Doc, fragment: Y.XmlFragment, elements: any[]) {
  doc.transact(() => {
    for (const element of elements) {
      const xmlElement = new Y.XmlElement(element.type);
      fragment.insert(fragment.length, [xmlElement]);

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
            const attrs = Object.keys(marks).length > 0 ? marks : undefined;
            xmlText.insert(xmlText.length, text, attrs);
          }
        }
      }
    }
  });
}

function createSetup(initialValue: any[]) {
  const doc = new Y.Doc();
  const fragment = doc.getXmlFragment('test-block');

  populateFragment(doc, fragment, initialValue);

  const slate = createMinimalSlate(initialValue);
  const binding = new SlateContentBinding(fragment, slate as any, doc);

  return { doc, fragment, slate, binding };
}

function getXmlText(fragment: Y.XmlFragment, elementIndex: number): Y.XmlText {
  const xmlElement = fragment.get(elementIndex) as Y.XmlElement;
  return xmlElement.get(0) as Y.XmlText;
}

function readFragmentAsSlate(fragment: Y.XmlFragment) {
  return yXmlFragmentToSlateValue(fragment);
}

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

// ---- Tests ----

describe('SlateContentBinding', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  // ====================
  // Constructor / Lifecycle
  // ====================

  describe('constructor and destroy', () => {
    it('should wrap slate.apply on construction', () => {
      const initial = [makeElement('paragraph', [{ text: 'Hello' }])];
      const { slate, binding } = createSetup(initial);

      // The apply should be different from the original
      const originalRef = (binding as any).originalApply;
      expect(slate.apply).not.toBe(originalRef);
    });

    it('should restore original apply on destroy', () => {
      const initial = [makeElement('paragraph', [{ text: 'Hello' }])];
      const { slate, binding } = createSetup(initial);

      const originalRef = (binding as any).originalApply;
      binding.destroy();
      expect(slate.apply).toBe(originalRef);
    });

    it('should stop observing fragment on destroy', () => {
      const initial = [makeElement('paragraph', [{ text: 'Hello' }])];
      const { doc, fragment, slate, binding } = createSetup(initial);

      binding.destroy();

      // Remote changes should no longer affect Slate
      slate.operations = [];
      const xmlText = getXmlText(fragment, 0);
      doc.transact(() => {
        xmlText.insert(0, 'X');
      }, REMOTE_ORIGIN);

      expect(slate.operations).toHaveLength(0);
    });
  });

  // ====================
  // Local → Y.Doc
  // ====================

  describe('Local → Y.Doc', () => {
    describe('insert_text', () => {
      it('should insert text into Y.XmlText at the correct offset', () => {
        const initial = [makeElement('paragraph', [{ text: 'Hello' }])];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'insert_text',
          path: [0, 0],
          offset: 5,
          text: ' World',
        });

        const ydocValue = readFragmentAsSlate(fragment);
        expect(ydocValue[0].children[0]).toEqual(
          expect.objectContaining({ text: 'Hello World' }),
        );
      });

      it('should insert text at the beginning', () => {
        const initial = [makeElement('paragraph', [{ text: 'World' }])];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'insert_text',
          path: [0, 0],
          offset: 0,
          text: 'Hello ',
        });

        const ydocValue = readFragmentAsSlate(fragment);
        expect(ydocValue[0].children[0]).toEqual(
          expect.objectContaining({ text: 'Hello World' }),
        );
      });

      it('should preserve marks when inserting into a marked text node', () => {
        const initial = [
          makeElement('paragraph', [{ text: 'Bold', bold: true }]),
        ];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'insert_text',
          path: [0, 0],
          offset: 4,
          text: ' text',
        });

        const xmlText = getXmlText(fragment, 0);
        const delta = xmlText.toDelta();
        expect(delta).toHaveLength(1);
        expect(delta[0].insert).toBe('Bold text');
        expect(delta[0].attributes).toEqual({ bold: true });
      });

      it('should insert into the correct child when there are multiple text nodes', () => {
        const initial = [
          makeElement('paragraph', [
            { text: 'Hello' },
            { text: ' World', bold: true },
          ]),
        ];
        const { fragment, slate } = createSetup(initial);

        // Insert into the second child at offset 0
        slate.apply({
          type: 'insert_text',
          path: [0, 1],
          offset: 0,
          text: 'Beautiful',
        });

        const xmlText = getXmlText(fragment, 0);
        const delta = xmlText.toDelta();
        // "Hello" (no marks) + "Beautiful World" (bold)
        expect(delta[0].insert).toBe('Hello');
        expect(delta[1].insert).toBe('Beautiful World');
        expect(delta[1].attributes).toEqual({ bold: true });
      });
    });

    describe('remove_text', () => {
      it('should delete text from Y.XmlText', () => {
        const initial = [makeElement('paragraph', [{ text: 'Hello World' }])];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'remove_text',
          path: [0, 0],
          offset: 5,
          text: ' World',
        });

        const ydocValue = readFragmentAsSlate(fragment);
        expect(ydocValue[0].children[0]).toEqual(
          expect.objectContaining({ text: 'Hello' }),
        );
      });

      it('should delete from the correct offset in a multi-child element', () => {
        const initial = [
          makeElement('paragraph', [
            { text: 'Hello' },
            { text: ' World' },
          ]),
        ];
        const { fragment, slate } = createSetup(initial);

        // Delete "Wor" from second child (offset 1, length 3)
        slate.apply({
          type: 'remove_text',
          path: [0, 1],
          offset: 1,
          text: 'Wor',
        });

        const xmlText = getXmlText(fragment, 0);
        expect(xmlText.toString()).toBe('Hello ld');
      });
    });

    describe('set_node (text child — marks)', () => {
      it('should format Y.XmlText when adding a mark', () => {
        const initial = [makeElement('paragraph', [{ text: 'Hello World' }])];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'set_node',
          path: [0, 0],
          properties: {},
          newProperties: { bold: true },
        });

        const xmlText = getXmlText(fragment, 0);
        const delta = xmlText.toDelta();
        expect(delta).toHaveLength(1);
        expect(delta[0].insert).toBe('Hello World');
        expect(delta[0].attributes).toEqual({ bold: true });
      });

      it('should remove a mark by formatting with null', () => {
        const initial = [
          makeElement('paragraph', [{ text: 'Bold text', bold: true }]),
        ];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'set_node',
          path: [0, 0],
          properties: { bold: true },
          newProperties: {},
        });

        const xmlText = getXmlText(fragment, 0);
        const delta = xmlText.toDelta();
        expect(delta).toHaveLength(1);
        expect(delta[0].insert).toBe('Bold text');
        expect(delta[0].attributes).toBeUndefined();
      });

      it('should handle changing one mark to another', () => {
        const initial = [
          makeElement('paragraph', [{ text: 'text', bold: true }]),
        ];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'set_node',
          path: [0, 0],
          properties: { bold: true },
          newProperties: { italic: true },
        });

        const xmlText = getXmlText(fragment, 0);
        const delta = xmlText.toDelta();
        expect(delta[0].attributes).toEqual({ italic: true });
        // bold should be removed (null in Y.js means delete)
        expect(delta[0].attributes?.bold).toBeUndefined();
      });

      it('should format only the correct text child in a multi-child element', () => {
        const initial = [
          makeElement('paragraph', [
            { text: 'Hello' },
            { text: ' World' },
          ]),
        ];
        const { fragment, slate } = createSetup(initial);

        // Apply bold to second child only
        slate.apply({
          type: 'set_node',
          path: [0, 1],
          properties: {},
          newProperties: { bold: true },
        });

        const xmlText = getXmlText(fragment, 0);
        const delta = xmlText.toDelta();
        expect(delta).toHaveLength(2);
        expect(delta[0].insert).toBe('Hello');
        expect(delta[0].attributes).toBeUndefined();
        expect(delta[1].insert).toBe(' World');
        expect(delta[1].attributes).toEqual({ bold: true });
      });
    });

    describe('set_node (element — props)', () => {
      it('should update element props attribute in Y.XmlElement', () => {
        const initial = [
          makeElement('paragraph', [{ text: 'Hello' }], 'elem-1', {
            nodeType: 'block',
          }),
        ];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'set_node',
          path: [0],
          properties: { props: { nodeType: 'block' } },
          newProperties: { props: { nodeType: 'block', align: 'center' } },
        });

        const xmlElement = fragment.get(0) as Y.XmlElement;
        const props = JSON.parse(xmlElement.getAttribute('props') as string);
        expect(props).toEqual({ nodeType: 'block', align: 'center' });
      });
    });

    describe('insert_node (text child)', () => {
      it('should insert a text node into Y.XmlText', () => {
        const initial = [makeElement('paragraph', [{ text: 'Hello' }])];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'insert_node',
          path: [0, 1],
          node: { text: ' World' },
        });

        const xmlText = getXmlText(fragment, 0);
        expect(xmlText.toString()).toBe('Hello World');
      });

      it('should insert a marked text node', () => {
        const initial = [makeElement('paragraph', [{ text: 'Hello' }])];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'insert_node',
          path: [0, 1],
          node: { text: ' Bold', bold: true },
        });

        const xmlText = getXmlText(fragment, 0);
        const delta = xmlText.toDelta();
        expect(delta).toHaveLength(2);
        expect(delta[0].insert).toBe('Hello');
        expect(delta[1].insert).toBe(' Bold');
        expect(delta[1].attributes).toEqual({ bold: true });
      });
    });

    describe('insert_node (element)', () => {
      it('should insert a new element into the Y.XmlFragment', () => {
        const initial = [makeElement('paragraph', [{ text: 'First' }])];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'insert_node',
          path: [1],
          node: makeElement('paragraph', [{ text: 'Second' }], 'elem-2'),
        });

        expect(fragment.length).toBe(2);
        const ydocValue = readFragmentAsSlate(fragment);
        expect(ydocValue[1].children[0]).toEqual(
          expect.objectContaining({ text: 'Second' }),
        );
      });

      it('should insert element at the beginning of the fragment', () => {
        const initial = [makeElement('paragraph', [{ text: 'Second' }])];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'insert_node',
          path: [0],
          node: makeElement('paragraph', [{ text: 'First' }], 'elem-0'),
        });

        expect(fragment.length).toBe(2);
        const ydocValue = readFragmentAsSlate(fragment);
        expect(ydocValue[0].children[0]).toEqual(
          expect.objectContaining({ text: 'First' }),
        );
        expect(ydocValue[1].children[0]).toEqual(
          expect.objectContaining({ text: 'Second' }),
        );
      });
    });

    describe('remove_node (text child)', () => {
      it('should remove text content from Y.XmlText', () => {
        const initial = [
          makeElement('paragraph', [
            { text: 'Hello' },
            { text: ' World' },
          ]),
        ];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'remove_node',
          path: [0, 1],
          node: { text: ' World' },
        });

        const xmlText = getXmlText(fragment, 0);
        expect(xmlText.toString()).toBe('Hello');
      });
    });

    describe('remove_node (element)', () => {
      it('should remove element from Y.XmlFragment', () => {
        const initial = [
          makeElement('paragraph', [{ text: 'First' }], 'elem-1'),
          makeElement('paragraph', [{ text: 'Second' }], 'elem-2'),
        ];
        const { fragment, slate } = createSetup(initial);

        slate.apply({
          type: 'remove_node',
          path: [0],
          node: initial[0],
        });

        expect(fragment.length).toBe(1);
        const ydocValue = readFragmentAsSlate(fragment);
        expect(ydocValue[0].children[0]).toEqual(
          expect.objectContaining({ text: 'Second' }),
        );
      });
    });

    describe('split_node (text child)', () => {
      it('should be a no-op for Y.Doc (Slate internal boundary change)', () => {
        const initial = [makeElement('paragraph', [{ text: 'Hello World' }])];
        const { fragment, slate } = createSetup(initial);

        const xmlTextBefore = getXmlText(fragment, 0);
        const deltaBefore = xmlTextBefore.toDelta();

        slate.apply({
          type: 'split_node',
          path: [0, 0],
          position: 5,
          properties: {},
        });

        // Y.Doc should be unchanged
        const deltaAfter = xmlTextBefore.toDelta();
        expect(deltaAfter).toEqual(deltaBefore);

        // But Slate should have 2 children now
        expect(slate.children[0].children).toHaveLength(2);
        expect(slate.children[0].children[0].text).toBe('Hello');
        expect(slate.children[0].children[1].text).toBe(' World');
      });
    });

    describe('merge_node (text child)', () => {
      it('should be a no-op for Y.Doc', () => {
        const initial = [
          makeElement('paragraph', [
            { text: 'Hello' },
            { text: ' World' },
          ]),
        ];
        const { fragment, slate } = createSetup(initial);

        const xmlText = getXmlText(fragment, 0);
        const deltaBefore = xmlText.toDelta();

        slate.apply({
          type: 'merge_node',
          path: [0, 1],
          position: 5,
          properties: {},
        });

        // Y.Doc unchanged
        const deltaAfter = xmlText.toDelta();
        expect(deltaAfter).toEqual(deltaBefore);

        // Slate merged
        expect(slate.children[0].children).toHaveLength(1);
        expect(slate.children[0].children[0].text).toBe('Hello World');
      });
    });

    describe('move_node', () => {
      it('should trigger full fragment re-sync', () => {
        const initial = [
          makeElement('paragraph', [{ text: 'First' }], 'elem-1'),
          makeElement('paragraph', [{ text: 'Second' }], 'elem-2'),
        ];
        const { slate, binding } = createSetup(initial);

        const syncSpy = vi.spyOn(binding as any, 'syncFullFragment');

        slate.apply({
          type: 'move_node',
          path: [0],
          newPath: [1],
        });

        expect(syncSpy).toHaveBeenCalled();
        syncSpy.mockRestore();
      });
    });

    describe('set_selection', () => {
      it('should be ignored (no Y.Doc changes)', () => {
        const initial = [makeElement('paragraph', [{ text: 'Hello' }])];
        const { fragment, slate } = createSetup(initial);

        const xmlText = getXmlText(fragment, 0);
        const deltaBefore = xmlText.toDelta();

        slate.apply({
          type: 'set_selection',
          properties: null,
          newProperties: {
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 5 },
          },
        });

        const deltaAfter = xmlText.toDelta();
        expect(deltaAfter).toEqual(deltaBefore);
      });
    });
  });

  // ====================
  // Offset conversion after split (bug fix verification)
  // ====================

  describe('Offset conversion after split_node', () => {
    it('should compute correct Y.Doc offset for set_node after split_node', () => {
      // This tests the bug fix: split_node is a no-op for Y.Doc, but changes
      // Slate's child segmentation. The subsequent set_node must use Slate's
      // children (not Y.XmlText delta) for offset computation.
      const initial = [
        makeElement('paragraph', [{ text: 'Hello World' }]),
      ];
      const { fragment, slate } = createSetup(initial);

      // Step 1: Split at position 5 → ["Hello", " World"]
      slate.apply({
        type: 'split_node',
        path: [0, 0],
        position: 5,
        properties: {},
      });

      // Verify Slate state after split
      expect(slate.children[0].children).toHaveLength(2);
      expect(slate.children[0].children[0].text).toBe('Hello');
      expect(slate.children[0].children[1].text).toBe(' World');

      // Step 2: Apply bold to second child (childIndex=1)
      slate.apply({
        type: 'set_node',
        path: [0, 1],
        properties: {},
        newProperties: { bold: true },
      });

      // Verify Y.Doc has the correct formatting at the right offset
      const xmlText = getXmlText(fragment, 0);
      const delta = xmlText.toDelta();

      // Should be: "Hello" (no marks) + " World" (bold)
      expect(delta).toHaveLength(2);
      expect(delta[0].insert).toBe('Hello');
      expect(delta[0].attributes).toBeUndefined();
      expect(delta[1].insert).toBe(' World');
      expect(delta[1].attributes).toEqual({ bold: true });
    });

    it('should handle double split then set_node (partial bold)', () => {
      // Simulate: select "llo W" in "Hello World" and apply bold
      // Slate ops: split at 2, split at 7 (now childIndex 1 at position 5), set_node
      const initial = [
        makeElement('paragraph', [{ text: 'Hello World' }]),
      ];
      const { fragment, slate } = createSetup(initial);

      // Split 1: "He" | "llo World"
      slate.apply({
        type: 'split_node',
        path: [0, 0],
        position: 2,
        properties: {},
      });

      // Split 2: "He" | "llo W" | "orld"
      slate.apply({
        type: 'split_node',
        path: [0, 1],
        position: 5,
        properties: {},
      });

      expect(slate.children[0].children).toHaveLength(3);
      expect(slate.children[0].children[0].text).toBe('He');
      expect(slate.children[0].children[1].text).toBe('llo W');
      expect(slate.children[0].children[2].text).toBe('orld');

      // set_node: bold on child 1
      slate.apply({
        type: 'set_node',
        path: [0, 1],
        properties: {},
        newProperties: { bold: true },
      });

      const xmlText = getXmlText(fragment, 0);
      const delta = xmlText.toDelta();

      // Y.Doc: "He" (plain) + "llo W" (bold) + "orld" (plain)
      expect(delta).toHaveLength(3);
      expect(delta[0].insert).toBe('He');
      expect(delta[0].attributes).toBeUndefined();
      expect(delta[1].insert).toBe('llo W');
      expect(delta[1].attributes).toEqual({ bold: true });
      expect(delta[2].insert).toBe('orld');
      expect(delta[2].attributes).toBeUndefined();
    });

    it('should handle insert_node after split_node (paste into split)', () => {
      const initial = [makeElement('paragraph', [{ text: 'Hello World' }])];
      const { fragment, slate } = createSetup(initial);

      // Split at position 5
      slate.apply({
        type: 'split_node',
        path: [0, 0],
        position: 5,
        properties: {},
      });

      // Insert a bold text node at childIndex 1 (between "Hello" and " World")
      slate.apply({
        type: 'insert_node',
        path: [0, 1],
        node: { text: ' Beautiful', italic: true },
      });

      const xmlText = getXmlText(fragment, 0);
      const delta = xmlText.toDelta();

      expect(delta).toHaveLength(3);
      expect(delta[0].insert).toBe('Hello');
      expect(delta[1].insert).toBe(' Beautiful');
      expect(delta[1].attributes).toEqual({ italic: true });
      expect(delta[2].insert).toBe(' World');
    });
  });

  // ====================
  // Remote → Slate
  // ====================

  describe('Remote → Slate', () => {
    describe('text insert (character-level)', () => {
      it('should apply remote text insert to Slate', () => {
        const initial = [makeElement('paragraph', [{ text: 'Hello' }])];
        const { doc, fragment, slate } = createSetup(initial);

        // Clear tracked ops from construction
        slate.operations = [];

        // Simulate remote insert
        const xmlText = getXmlText(fragment, 0);
        doc.transact(() => {
          xmlText.insert(5, ' World');
        }, REMOTE_ORIGIN);

        // Slate should have received an insert_text op
        expect(slate.children[0].children[0].text).toBe('Hello World');
        const insertOps = slate.operations.filter(
          (op: any) => op.type === 'insert_text',
        );
        expect(insertOps).toHaveLength(1);
        expect(insertOps[0]).toEqual(
          expect.objectContaining({
            type: 'insert_text',
            path: [0, 0],
            offset: 5,
            text: ' World',
          }),
        );
      });

      it('should apply remote text insert at beginning', () => {
        const initial = [makeElement('paragraph', [{ text: 'World' }])];
        const { doc, fragment, slate } = createSetup(initial);
        slate.operations = [];

        const xmlText = getXmlText(fragment, 0);
        doc.transact(() => {
          xmlText.insert(0, 'Hello ');
        }, REMOTE_ORIGIN);

        expect(slate.children[0].children[0].text).toBe('Hello World');
      });
    });

    describe('text delete (character-level)', () => {
      it('should apply remote text delete to Slate', () => {
        const initial = [makeElement('paragraph', [{ text: 'Hello World' }])];
        const { doc, fragment, slate } = createSetup(initial);
        slate.operations = [];

        const xmlText = getXmlText(fragment, 0);
        doc.transact(() => {
          xmlText.delete(5, 6);
        }, REMOTE_ORIGIN);

        expect(slate.children[0].children[0].text).toBe('Hello');
        const removeOps = slate.operations.filter(
          (op: any) => op.type === 'remove_text',
        );
        expect(removeOps).toHaveLength(1);
      });
    });

    describe('text delete at child boundary', () => {
      it('should correctly delete text at the boundary between two children', () => {
        // After split, Slate has: ["Hello", " World"]
        // Remote deletes at absolute offset 5 (start of " World")
        const initial = [
          makeElement('paragraph', [
            { text: 'Hello' },
            { text: ' World' },
          ]),
        ];
        const { doc, fragment, slate } = createSetup(initial);
        slate.operations = [];

        const xmlText = getXmlText(fragment, 0);
        doc.transact(() => {
          xmlText.delete(5, 1); // Delete " " at boundary
        }, REMOTE_ORIGIN);

        expect(slate.children[0].children[1].text).toBe('World');
        const removeOps = slate.operations.filter(
          (op: any) => op.type === 'remove_text',
        );
        expect(removeOps).toHaveLength(1);
        expect(removeOps[0].path).toEqual([0, 1]);
        expect(removeOps[0].offset).toBe(0);
      });
    });

    describe('format change (fallback)', () => {
      it('should fallback to full element replace on remote format change', () => {
        const initial = [
          makeElement('paragraph', [{ text: 'Hello World' }]),
        ];
        const { doc, fragment, slate, binding } = createSetup(initial);
        slate.operations = [];

        const xmlText = getXmlText(fragment, 0);
        doc.transact(() => {
          xmlText.format(0, 5, { bold: true });
        }, REMOTE_ORIGIN);

        // Fallback path uses Transforms.removeNodes + Transforms.insertNodes
        expect(Transforms.removeNodes).toHaveBeenCalledWith(
          slate,
          expect.objectContaining({ at: [0] }),
        );
        expect(Transforms.insertNodes).toHaveBeenCalledWith(
          slate,
          expect.objectContaining({
            children: expect.arrayContaining([
              expect.objectContaining({ text: 'Hello', bold: true }),
              expect.objectContaining({ text: ' World' }),
            ]),
          }),
          expect.objectContaining({ at: [0] }),
        );

        binding.destroy();
      });
    });

    describe('local origin is ignored', () => {
      it('should not apply local-origin Y.Doc changes back to Slate', () => {
        const initial = [makeElement('paragraph', [{ text: 'Hello' }])];
        const { doc, fragment, slate } = createSetup(initial);
        slate.operations = [];

        // Simulate a local-origin transaction (as if pushed by the binding itself)
        const xmlText = getXmlText(fragment, 0);
        doc.transact(() => {
          xmlText.insert(5, ' Local');
        }, LOCAL_ORIGIN);

        // No ops should have been applied to Slate from the observer
        const insertOps = slate.operations.filter(
          (op: any) => op.type === 'insert_text',
        );
        expect(insertOps).toHaveLength(0);
      });
    });
  });

  // ====================
  // Remote → Slate (XmlEvent)
  // ====================

  describe('Remote → Slate (Y.YXmlEvent)', () => {
    describe('element attribute change', () => {
      it('should apply remote props change via Transforms.setNodes', () => {
        const initial = [
          makeElement('paragraph', [{ text: 'Hello' }], 'elem-1', {
            nodeType: 'block',
          }),
        ];
        const { doc, fragment, slate, binding } = createSetup(initial);

        const xmlElement = fragment.get(0) as Y.XmlElement;
        doc.transact(() => {
          xmlElement.setAttribute(
            'props',
            JSON.stringify({ nodeType: 'block', align: 'center' }),
          );
        }, REMOTE_ORIGIN);

        expect(Transforms.setNodes).toHaveBeenCalledWith(
          slate,
          expect.objectContaining({
            props: { nodeType: 'block', align: 'center' },
          }),
          expect.objectContaining({ at: [0] }),
        );

        binding.destroy();
      });
    });

    describe('fragment structural change', () => {
      it('should do full fragment replace when remote adds element to fragment', () => {
        const initial = [makeElement('paragraph', [{ text: 'First' }])];
        const { doc, fragment, slate, binding } = createSetup(initial);

        doc.transact(() => {
          const newXmlElement = new Y.XmlElement('paragraph');
          newXmlElement.setAttribute('id', 'new-elem');
          const newXmlText = new Y.XmlText();
          newXmlText.insert(0, 'Second');
          newXmlElement.insert(0, [newXmlText]);
          fragment.insert(1, [newXmlElement]);
        }, REMOTE_ORIGIN);

        // Should have called Transforms.removeNodes and Transforms.insertNodes
        // for the full fragment replace
        expect(Transforms.removeNodes).toHaveBeenCalled();
        expect(Transforms.insertNodes).toHaveBeenCalled();

        binding.destroy();
      });
    });
  });

  // ====================
  // isApplyingRemote flag
  // ====================

  describe('isApplyingRemote flag', () => {
    it('should not push to Y.Doc when isApplyingRemote is true', () => {
      const initial = [makeElement('paragraph', [{ text: 'Hello' }])];
      const { fragment, slate, binding } = createSetup(initial);

      const xmlText = getXmlText(fragment, 0);
      const deltaBefore = xmlText.toDelta();

      // Manually set flag and apply
      binding.isApplyingRemote = true;
      slate.apply({
        type: 'insert_text',
        path: [0, 0],
        offset: 5,
        text: ' World',
      });
      binding.isApplyingRemote = false;

      // Y.Doc should NOT have changed
      const deltaAfter = xmlText.toDelta();
      expect(deltaAfter).toEqual(deltaBefore);

      // But Slate should have changed (originalApply still runs)
      expect(slate.children[0].children[0].text).toBe('Hello World');
    });
  });

  // ====================
  // Edge cases
  // ====================

  describe('Edge cases', () => {
    it('should handle empty text nodes', () => {
      const initial = [makeElement('paragraph', [{ text: '' }])];
      const { fragment, slate } = createSetup(initial);

      slate.apply({
        type: 'insert_text',
        path: [0, 0],
        offset: 0,
        text: 'Hello',
      });

      const ydocValue = readFragmentAsSlate(fragment);
      expect(ydocValue[0].children[0]).toEqual(
        expect.objectContaining({ text: 'Hello' }),
      );
    });

    it('should handle set_node with no format changes (no-op)', () => {
      const initial = [makeElement('paragraph', [{ text: 'Hello' }])];
      const { fragment, slate } = createSetup(initial);

      const xmlText = getXmlText(fragment, 0);
      const deltaBefore = xmlText.toDelta();

      // set_node with empty properties on both sides
      slate.apply({
        type: 'set_node',
        path: [0, 0],
        properties: {},
        newProperties: {},
      });

      const deltaAfter = xmlText.toDelta();
      expect(deltaAfter).toEqual(deltaBefore);
    });

    it('should handle out-of-bounds element index gracefully', () => {
      const initial = [makeElement('paragraph', [{ text: 'Hello' }])];
      const { fragment, slate } = createSetup(initial);

      // This should not throw
      slate.apply({
        type: 'insert_text',
        path: [5, 0],
        offset: 0,
        text: 'X',
      });

      // Y.Doc should be unchanged (guard clause returns early)
      const ydocValue = readFragmentAsSlate(fragment);
      expect(ydocValue).toHaveLength(1);
      expect(ydocValue[0].children[0]).toEqual(
        expect.objectContaining({ text: 'Hello' }),
      );
    });

    it('should handle multiple elements in the fragment', () => {
      const initial = [
        makeElement('heading-one', [{ text: 'Title' }], 'elem-1'),
        makeElement('paragraph', [{ text: 'Body text' }], 'elem-2'),
      ];
      const { fragment, slate } = createSetup(initial);

      // Insert into second element
      slate.apply({
        type: 'insert_text',
        path: [1, 0],
        offset: 4,
        text: ' more',
      });

      const ydocValue = readFragmentAsSlate(fragment);
      expect(ydocValue[0].children[0]).toEqual(
        expect.objectContaining({ text: 'Title' }),
      );
      expect(ydocValue[1].children[0]).toEqual(
        expect.objectContaining({ text: 'Body more text' }),
      );
    });
  });
});
