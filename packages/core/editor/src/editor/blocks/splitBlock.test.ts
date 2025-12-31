import cloneDeep from 'lodash.clonedeep';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildSlateNodeElement } from '../../utils/block-elements';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateEditor, SlateElement, YooEditor } from '../types';
import { getBlock } from './getBlock';
import { getBlockSlate } from './getBlockSlate';
import { splitBlock } from './splitBlock';

vi.mock('../../utils/findSlateBySelectionPath', () => ({
  findSlateBySelectionPath: vi.fn(),
}));

vi.mock('../../utils/block-elements', () => ({
  buildSlateNodeElement: vi.fn(),
}));

vi.mock('../../utils/generateId', () => ({
  generateId: vi.fn(() => 'new-block-id'),
}));

vi.mock('./getBlock', () => ({
  getBlock: vi.fn(),
}));

vi.mock('./getBlockSlate', () => ({
  getBlockSlate: vi.fn(),
}));

vi.mock('slate', () => ({
  Editor: {
    withoutNormalizing: vi.fn((editor, fn) => fn()),
    end: vi.fn(() => ({ path: [0, 0], offset: 0 })),
  },
  Node: {
    string: vi.fn(),
  },
  Transforms: {
    select: vi.fn(),
  },
}));

vi.mock('slate-react', () => ({
  ReactEditor: {
    focus: vi.fn(),
  },
}));

vi.mock('lodash.clonedeep', () => ({
  default: vi.fn((val) => JSON.parse(JSON.stringify(val))),
}));

describe('splitBlock', () => {
  let editor: Partial<YooEditor>;
  let mockSlate: Partial<SlateEditor>;
  let mockBlock: any;
  let mockParagraphStructure: SlateElement;

  beforeEach(() => {
    vi.clearAllMocks();

    mockParagraphStructure = {
      id: 'paragraph-id',
      type: 'paragraph',
      children: [{ text: '' }],
    };

    (buildSlateNodeElement as Mock).mockReturnValue(mockParagraphStructure);

    mockBlock = {
      id: 'block-123',
      type: 'Paragraph',
      meta: {
        order: 0,
        depth: 0,
        align: 'left',
      },
      value: [
        {
          id: 'element-1',
          type: 'paragraph',
          children: [{ text: 'Hello world' }],
        },
      ],
    };

    mockSlate = {
      selection: {
        anchor: { path: [0, 0], offset: 5 },
        focus: { path: [0, 0], offset: 5 },
      },
      children: [
        {
          id: 'element-1',
          type: 'paragraph',
          children: [{ text: 'Hello world' }],
        } as SlateElement,
      ],
    };

    (getBlock as Mock).mockReturnValue(mockBlock);
    (findSlateBySelectionPath as Mock).mockReturnValue(mockSlate);
    (getBlockSlate as Mock).mockReturnValue(mockSlate);

    editor = {
      path: { current: 0 },
      plugins: {
        Paragraph: {
          type: 'Paragraph',
          elements: {
            paragraph: {
              asRoot: true,
              render: vi.fn(),
              props: {},
            },
          },
          lifecycle: {},
        },
      },
      children: {
        'block-123': mockBlock,
      },
      applyTransforms: vi.fn(),
      focusBlock: vi.fn(),
    };
  });

  describe('Basic Functionality', () => {
    it('should split current block at selection', () => {
      const newBlockId = splitBlock(editor as YooEditor);

      expect(newBlockId).toBe('new-block-id');
      expect(getBlock).toHaveBeenCalledWith(editor, { id: undefined, at: 0 });
      expect(findSlateBySelectionPath).toHaveBeenCalledWith(editor, { at: 0 });
      expect(editor.applyTransforms).toHaveBeenCalled();
      expect(editor.focusBlock).toHaveBeenCalledWith('new-block-id');
    });

    it('should split specific block by path', () => {
      const newBlockId = splitBlock(editor as YooEditor, { at: 0 });

      expect(newBlockId).toBe('new-block-id');
      expect(getBlock).toHaveBeenCalledWith(editor, { id: undefined, at: 0 });
    });

    it('should split specific block by id', () => {
      const newBlockId = splitBlock(editor as YooEditor, { blockId: 'block-123' });

      expect(newBlockId).toBe('new-block-id');
      expect(getBlock).toHaveBeenCalledWith(editor, { id: 'block-123', at: null });
      expect(getBlockSlate).toHaveBeenCalledWith(editor, { id: 'block-123' });
    });

    it('should return undefined if block not found', () => {
      (getBlock as Mock).mockReturnValue(null);

      const newBlockId = splitBlock(editor as YooEditor);

      expect(newBlockId).toBeUndefined();
      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });

    it('should return undefined if slate editor not found', () => {
      (findSlateBySelectionPath as Mock).mockReturnValue(null);

      const newBlockId = splitBlock(editor as YooEditor);

      expect(newBlockId).toBeUndefined();
      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });

    it('should return undefined if no selection available', () => {
      mockSlate.selection = null;

      const newBlockId = splitBlock(editor as YooEditor);

      expect(newBlockId).toBeUndefined();
      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });
  });

  describe('Split Position', () => {
    it('should split at current selection by default', () => {
      const newBlockId = splitBlock(editor as YooEditor);

      expect(newBlockId).toBe('new-block-id');
      expect(Transforms.select).not.toHaveBeenCalled(); // Should not change selection
    });

    it('should split at specified position', () => {
      const customSelection = {
        anchor: { path: [0, 0], offset: 3 },
        focus: { path: [0, 0], offset: 3 },
      };

      const newBlockId = splitBlock(editor as YooEditor, {
        splitAt: customSelection,
      });

      expect(newBlockId).toBe('new-block-id');
      expect(Transforms.select).toHaveBeenCalledWith(mockSlate, customSelection);
    });

    it('should restore original selection after split with custom splitAt', () => {
      const originalSelection = mockSlate.selection;
      const customSelection = {
        anchor: { path: [0, 0], offset: 3 },
        focus: { path: [0, 0], offset: 3 },
      };

      splitBlock(editor as YooEditor, {
        splitAt: customSelection,
      });

      // Should select custom position first
      expect(Transforms.select).toHaveBeenCalledWith(mockSlate, customSelection);
      // Then restore original (called in finally block)
      expect(Transforms.select).toHaveBeenCalledWith(mockSlate, originalSelection);
    });
  });

  describe('Focus Behavior', () => {
    it('should focus new block by default', () => {
      const newBlockId = splitBlock(editor as YooEditor);

      expect(editor.focusBlock).toHaveBeenCalledWith('new-block-id');
    });

    it('should focus new block when focusTarget is "new"', () => {
      const newBlockId = splitBlock(editor as YooEditor, {
        focusTarget: 'new',
      });

      expect(editor.focusBlock).toHaveBeenCalledWith('new-block-id');
      expect(ReactEditor.focus).not.toHaveBeenCalled();
    });

    it('should focus original block when focusTarget is "original"', () => {
      const newBlockId = splitBlock(editor as YooEditor, {
        focusTarget: 'original',
      });

      expect(editor.focusBlock).not.toHaveBeenCalled();
      expect(ReactEditor.focus).toHaveBeenCalledWith(mockSlate);
      expect(Transforms.select).toHaveBeenCalled();
    });

    it('should not focus when focusTarget is "none"', () => {
      const newBlockId = splitBlock(editor as YooEditor, {
        focusTarget: 'none',
      });

      expect(editor.focusBlock).not.toHaveBeenCalled();
      expect(ReactEditor.focus).not.toHaveBeenCalled();
    });

    it('should not focus when focus is false', () => {
      const newBlockId = splitBlock(editor as YooEditor, {
        focus: false,
      });

      expect(editor.focusBlock).not.toHaveBeenCalled();
      expect(ReactEditor.focus).not.toHaveBeenCalled();
    });

    it('should not focus when focus is false even if focusTarget is set', () => {
      const newBlockId = splitBlock(editor as YooEditor, {
        focus: false,
        focusTarget: 'new',
      });

      expect(editor.focusBlock).not.toHaveBeenCalled();
    });
  });

  describe('Content Preservation', () => {
    it('should preserve content by default', () => {
      const newBlockId = splitBlock(editor as YooEditor);

      expect(newBlockId).toBe('new-block-id');
      expect(cloneDeep).toHaveBeenCalledWith(mockSlate.children);
      expect(editor.applyTransforms).toHaveBeenCalled();
    });

    it('should not preserve content when preserveContent is false', () => {
      const newBlockId = splitBlock(editor as YooEditor, {
        preserveContent: false,
      });

      expect(newBlockId).toBe('new-block-id');
      expect(editor.applyTransforms).toHaveBeenCalled();
    });
  });

  describe('Operation Details', () => {
    it('should create correct split_block operation', () => {
      const newBlockId = splitBlock(editor as YooEditor);

      expect(editor.applyTransforms).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'split_block',
            prevProperties: {
              originalBlock: mockBlock,
              originalValue: expect.any(Array),
            },
            properties: {
              nextBlock: {
                id: 'new-block-id',
                type: 'Paragraph',
                meta: {
                  order: 1,
                  depth: 0,
                  align: 'left',
                },
                value: [],
              },
              nextSlateValue: expect.any(Array),
              splitSlateValue: expect.any(Array),
            },
            path: editor.path,
          }),
        ]),
      );
    });

    it('should preserve block meta properties in new block', () => {
      mockBlock.meta = {
        order: 5,
        depth: 2,
        align: 'center',
      };

      splitBlock(editor as YooEditor);

      expect(editor.applyTransforms).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            properties: expect.objectContaining({
              nextBlock: expect.objectContaining({
                meta: {
                  order: 6, // Should be original + 1
                  depth: 2,
                  align: 'center',
                },
              }),
            }),
          }),
        ]),
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle error when focusing original block', () => {
      (ReactEditor.focus as Mock).mockImplementation(() => {
        throw new Error('Focus error');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const newBlockId = splitBlock(editor as YooEditor, {
        focusTarget: 'original',
      });

      expect(newBlockId).toBe('new-block-id');
      // Should not throw, just log error in dev mode

      consoleSpy.mockRestore();
    });

    it('should handle error when restoring selection', () => {
      const customSelection = {
        anchor: { path: [0, 0], offset: 3 },
        focus: { path: [0, 0], offset: 3 },
      };

      (Transforms.select as Mock).mockImplementation((slate, selection) => {
        if (selection === mockSlate.selection) {
          throw new Error('Invalid selection');
        }
      });

      // Should not throw, just ignore invalid selection
      const newBlockId = splitBlock(editor as YooEditor, {
        splitAt: customSelection,
      });

      expect(newBlockId).toBe('new-block-id');
    });

    it('should handle block with null current path', () => {
      editor.path = { current: null };

      const newBlockId = splitBlock(editor as YooEditor);

      expect(newBlockId).toBeUndefined();
    });
  });
});

