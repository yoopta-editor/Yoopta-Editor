import { Descendant, Editor, Element, Transforms } from 'slate';
import { vi } from 'vitest';
import { withBlockquoteNormalize } from './withBlockquoteNormalize';
import { createTestNode } from 'test-utils';
import { SlateEditor, YooEditor } from '@yoopta/editor';

describe('withBlockquoteNormalize', () => {
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

    vi.spyOn(Editor, 'isEditor').mockImplementation((node) => {
      return node && typeof node === 'object' && 'children' in node;
    });

    vi.spyOn(Element, 'isElement').mockImplementation((node) => {
      return node && typeof node === 'object' && 'type' in node;
    });

    vi.spyOn(Transforms, 'removeNodes').mockImplementation((editor, options) => {});
  });

  it('should not normalize if there is no current path', () => {
    if (!editor.path) editor.path = { current: null };
    editor.path.current = null;
    const normalize = withBlockquoteNormalize(slate as SlateEditor, editor as YooEditor);
    const node = createTestNode([]);
    normalize.normalizeNode([node, []]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([node, []]);
  });

  it('should not normalize if there is only one blockquote', () => {
    const blockquote = {
      id: '1',
      type: 'blockquote',
      children: [],
    } as Descendant;
    slate.children = [blockquote];
    const normalize = withBlockquoteNormalize(slate as SlateEditor, editor as YooEditor);
    const editorNode = createTestNode([blockquote]);
    normalize.normalizeNode([editorNode, []]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([editorNode, []]);
  });

  it('should normalize multiple blockquotes into separate blocks', () => {
    const blockquote1 = {
      id: '1',
      type: 'blockquote',
      children: [],
    } as Descendant;
    const blockquote2 = {
      id: '2',
      type: 'blockquote',
      children: [],
    } as Descendant;
    const blockquote3 = {
      id: '3',
      type: 'blockquote',
      children: [],
    } as Descendant;

    const node = {
      id: 'editor',
      type: 'editor',
      children: [blockquote1, blockquote2, blockquote3],
    } as unknown as Editor;

    console.log('Test node:', node);
    console.log('Editor path:', editor.path);

    slate.children = createTestNode([blockquote1, blockquote2, blockquote3]);

    const normalize = withBlockquoteNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([node, []]);

    expect(editor.insertBlock).toHaveBeenCalledTimes(2);
    expect(editor.insertBlock).toHaveBeenNthCalledWith(1, 'Blockquote', {
      at: 1,
      blockData: {
        id: '2',
        value: [blockquote2],
        meta: {
          align: 'left',
          depth: 0,
          order: 1,
        },
      },
    });
    expect(editor.insertBlock).toHaveBeenNthCalledWith(2, 'Blockquote', {
      at: 2,
      blockData: {
        id: '3',
        value: [blockquote3],
        meta: {
          align: 'left',
          depth: 0,
          order: 1,
        },
      },
    });
  });

  it('should handle non-blockquote elements in the children', () => {
    const paragraph = {
      id: 'p1',
      type: 'paragraph',
      children: [],
    } as unknown as Descendant;
    const blockquote1 = {
      id: '1',
      type: 'blockquote',
      children: [],
    } as Descendant;
    const blockquote2 = {
      id: '2',
      type: 'blockquote',
      children: [],
    } as Descendant;

    const node = {
      id: 'editor',
      type: 'editor',
      children: [paragraph, blockquote1, blockquote2],
    } as unknown as Editor;

    const normalize = withBlockquoteNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([node, []]);

    // Since blockquotes are not consecutive, they should be normalized
    expect(editor.insertBlock).toHaveBeenCalledTimes(1);
    expect(editor.insertBlock).toHaveBeenCalledWith('Blockquote', {
      at: 1,
      blockData: {
        id: '2',
        value: [blockquote2],
        meta: {
          align: 'left',
          depth: 0,
          order: 1,
        },
      },
    });
  });

  it('should not normalize if the node is not an editor', () => {
    const blockquote = {
      id: '1',
      type: 'blockquote',
      children: [],
    } as Descendant;
    const normalize = withBlockquoteNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([blockquote, [0]]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([blockquote, [0]]);
  });
});
