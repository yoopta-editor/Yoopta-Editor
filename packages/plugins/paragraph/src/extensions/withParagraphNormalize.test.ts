import { Node } from 'slate';
import { withParagraphNormalize } from './withParagraphNormalize';
import { generateId } from '@yoopta/editor';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createMockSlateEditor,
  createMockYooEditor,
  setupSlateMocks,
  createTestNode,
  createTestParagraph,
  createTestBlockData,
} from 'test-utils';

describe('withParagraphNormalize', () => {
  let editor: ReturnType<typeof createMockYooEditor>;
  let slate: ReturnType<typeof createMockSlateEditor>;
  let originalNormalizeNode: any;

  beforeEach(() => {
    editor = createMockYooEditor();
    slate = createMockSlateEditor();
    originalNormalizeNode = slate.normalizeNode;
    setupSlateMocks();
    withParagraphNormalize(slate, editor);
  });

  it('should not normalize if there is no current path', () => {
    editor.path.current = null;
    const node = createTestNode([createTestParagraph('First'), createTestParagraph('Second')]);

    slate.normalizeNode([node, []]);

    expect(originalNormalizeNode).toHaveBeenCalledWith([node, []]);
    expect(editor.insertBlock).not.toHaveBeenCalled();
  });

  it('should not normalize if there is only one paragraph', () => {
    const node = createTestNode([createTestParagraph('First')]);

    slate.normalizeNode([node, []]);

    expect(originalNormalizeNode).toHaveBeenCalledWith([node, []]);
    expect(editor.insertBlock).not.toHaveBeenCalled();
  });

  it('should normalize multiple paragraphs into separate blocks', () => {
    const node = createTestNode([
      createTestParagraph('First'),
      createTestParagraph('Second'),
      createTestParagraph('Third'),
    ]);

    slate.normalizeNode([node, []]);

    expect(editor.insertBlock).toHaveBeenCalledTimes(2);
    expect(editor.insertBlock).toHaveBeenNthCalledWith(1, 'Paragraph', {
      at: 1,
      blockData: createTestBlockData([createTestParagraph('Second')]),
    });
    expect(editor.insertBlock).toHaveBeenNthCalledWith(2, 'Paragraph', {
      at: 2,
      blockData: createTestBlockData([createTestParagraph('Third')]),
    });
  });

  it('should handle non-paragraph elements in the children', () => {
    const node = createTestNode([
      createTestParagraph('First'),
      { id: generateId(), type: 'heading', children: [{ text: 'Heading' }] },
      createTestParagraph('Second'),
    ]);

    slate.normalizeNode([node, []]);

    expect(editor.insertBlock).toHaveBeenCalledTimes(1);
    expect(editor.insertBlock).toHaveBeenCalledWith('Paragraph', {
      at: 1,
      blockData: createTestBlockData([createTestParagraph('Second')]),
    });
  });

  it('should not normalize if the node is not an editor', () => {
    const node = {
      id: generateId(),
      type: 'paragraph',
      children: [{ text: 'Content' }],
    } as Node;

    slate.normalizeNode([node, []]);

    expect(originalNormalizeNode).toHaveBeenCalledWith([node, []]);
    expect(editor.insertBlock).not.toHaveBeenCalled();
  });
});
