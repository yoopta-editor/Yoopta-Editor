import type { SlateEditor, YooEditor } from '@yoopta/editor';
import type { Descendant} from 'slate';
import { Editor, Element, Transforms } from 'slate';
import { createTestNode } from 'test-utils';
import { vi } from 'vitest';

import { withCalloutNormalize } from './withCalloutNormalize';

describe('withCalloutNormalize', () => {
  let editor: Partial<YooEditor>;
  let slate: Partial<SlateEditor>;
  let originalNormalizeNode: any;

  beforeEach(() => {
    originalNormalizeNode = vi.fn();
    slate = {
      normalizeNode: originalNormalizeNode,
      children: [],
    };
    editor = {
      path: { current: 0 },
      batchOperations: vi.fn((callback) => callback()),
      insertBlock: vi.fn(),
    };

    // Mock Editor.isEditor
    vi.spyOn(Editor, 'isEditor').mockImplementation((node) => node && typeof node === 'object' && 'children' in node);

    // Mock Element.isElement
    vi.spyOn(Element, 'isElement').mockImplementation((node) => node && typeof node === 'object' && 'type' in node);

    // Mock Transforms.removeNodes
    vi.spyOn(Transforms, 'removeNodes').mockImplementation((editor, options) => {});
  });

  it('should not normalize if there is no current path', () => {
    if (!editor.path) editor.path = { current: null };
    editor.path.current = null;
    const normalize = withCalloutNormalize(slate as SlateEditor, editor as YooEditor);
    const node = createTestNode([]);
    normalize.normalizeNode([node, []]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([node, []]);
  });

  it('should not normalize if there is only one callout', () => {
    const callout = {
      id: '1',
      type: 'callout',
      children: [],
    } as Descendant;
    slate.children = [callout];
    const normalize = withCalloutNormalize(slate as SlateEditor, editor as YooEditor);
    const editorNode = createTestNode([callout]);
    normalize.normalizeNode([editorNode, []]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([editorNode, []]);
  });

  it('should normalize multiple callouts into separate blocks', () => {
    const callout1 = {
      id: '1',
      type: 'callout',
      children: [],
    } as Descendant;
    const callout2 = {
      id: '2',
      type: 'callout',
      children: [],
    } as Descendant;
    const callout3 = {
      id: '3',
      type: 'callout',
      children: [],
    } as Descendant;

    const node = {
      id: 'editor',
      type: 'editor',
      children: [callout1, callout2, callout3],
    } as unknown as Editor;

    slate.children = createTestNode([callout1, callout2, callout3]);

    const normalize = withCalloutNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([node, []]);

    expect(editor.insertBlock).toHaveBeenCalledTimes(2);
    expect(editor.insertBlock).toHaveBeenNthCalledWith(1, 'Callout', {
      at: 1,
      blockData: {
        id: '2',
        value: [callout2],
        meta: {
          align: 'left',
          depth: 0,
          order: 1,
        },
      },
    });
    expect(editor.insertBlock).toHaveBeenNthCalledWith(2, 'Callout', {
      at: 2,
      blockData: {
        id: '3',
        value: [callout3],
        meta: {
          align: 'left',
          depth: 0,
          order: 1,
        },
      },
    });
  });

  it('should handle non-callout elements in the children', () => {
    const paragraph = {
      id: 'p1',
      type: 'paragraph',
      children: [],
    } as unknown as Descendant;
    const callout1 = {
      id: '1',
      type: 'callout',
      children: [],
    } as Descendant;
    const callout2 = {
      id: '2',
      type: 'callout',
      children: [],
    } as Descendant;

    const node = {
      id: 'editor',
      type: 'editor',
      children: [paragraph, callout1, callout2],
    } as unknown as Editor;

    const normalize = withCalloutNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([node, []]);

    // Since callouts are not consecutive, they should be normalized
    expect(editor.insertBlock).toHaveBeenCalledTimes(1);
    expect(editor.insertBlock).toHaveBeenCalledWith('Callout', {
      at: 1,
      blockData: {
        id: '2',
        value: [callout2],
        meta: {
          align: 'left',
          depth: 0,
          order: 1,
        },
      },
    });
  });

  it('should not normalize if the node is not an editor', () => {
    const callout = {
      id: '1',
      type: 'callout',
      children: [],
    } as Descendant;
    const normalize = withCalloutNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([callout, [0]]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([callout, [0]]);
  });
});
