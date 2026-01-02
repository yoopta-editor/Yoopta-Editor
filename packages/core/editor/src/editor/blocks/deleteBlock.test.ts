import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { Paths } from '../paths';
import type { SlateEditor, SlateElement, YooEditor, YooptaBlockData } from '../types';
import { deleteBlock } from './deleteBlock';
import { getBlock } from './getBlock';
import { getBlockSlate } from './getBlockSlate';

vi.mock('./getBlock', () => ({
  getBlock: vi.fn(),
}));

vi.mock('./getBlockSlate', () => ({
  getBlockSlate: vi.fn(),
}));

vi.mock('../paths', () => ({
  Paths: {
    getPreviousBlockOrder: vi.fn((_editor, order) => {
      const path = order ?? _editor?.path?.current;
      if (typeof path === 'number' && path !== 0) return path - 1;
      return null;
    }),
    getNextBlockOrder: vi.fn((_editor, order) => {
      const path = order ?? _editor?.path?.current;
      if (typeof path === 'number') return path + 1;
      return null;
    }),
    getLastNodePoint: vi.fn(() => ({ path: [0, 0], offset: 10 })),
  },
}));

describe('deleteBlock', () => {
  let editor: Partial<YooEditor>;
  let mockBlock: YooptaBlockData;
  let mockPrevBlock: YooptaBlockData;
  let mockNextBlock: YooptaBlockData;
  let mockSlate: Partial<SlateEditor>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockBlock = {
      id: 'block-2',
      type: 'Paragraph',
      meta: {
        order: 2,
        depth: 0,
        align: 'left',
      },
      value: [
        {
          id: 'element-2',
          type: 'paragraph',
          children: [{ text: 'Block to delete' }],
        } as SlateElement,
      ],
    };

    mockPrevBlock = {
      id: 'block-1',
      type: 'Paragraph',
      meta: {
        order: 1,
        depth: 0,
        align: 'left',
      },
      value: [
        {
          id: 'element-1',
          type: 'paragraph',
          children: [{ text: 'Previous block' }],
        } as SlateElement,
      ],
    };

    mockNextBlock = {
      id: 'block-3',
      type: 'Paragraph',
      meta: {
        order: 3,
        depth: 0,
        align: 'left',
      },
      value: [
        {
          id: 'element-3',
          type: 'paragraph',
          children: [{ text: 'Next block' }],
        } as SlateElement,
      ],
    };

    mockSlate = {
      children: [
        {
          id: 'element-1',
          type: 'paragraph',
          children: [{ text: 'Some content' }],
        } as SlateElement,
      ],
    };

    (getBlock as Mock).mockImplementation((_editor, options) => {
      if (options.id === 'block-1' || options.at === 1) return mockPrevBlock;
      if (options.id === 'block-2' || options.at === 2) return mockBlock;
      if (options.id === 'block-3' || options.at === 3) return mockNextBlock;
      return null;
    });

    (getBlockSlate as Mock).mockReturnValue(mockSlate);

    editor = {
      path: { current: 2 },
      children: {
        'block-1': mockPrevBlock,
        'block-2': mockBlock,
        'block-3': mockNextBlock,
      },
      plugins: {
        Paragraph: {
          type: 'Paragraph',
          elements: {},
          lifecycle: {
            onDestroy: vi.fn(),
          },
        } as any,
      },
      applyTransforms: vi.fn(),
      focusBlock: vi.fn(),
    };
  });

  describe('Basic Functionality', () => {
    it('should delete current block', () => {
      deleteBlock(editor as YooEditor);

      expect(getBlock).toHaveBeenCalledWith(editor, { id: undefined, at: 2 });
      expect(editor.applyTransforms).toHaveBeenCalledWith(
        [
          {
            type: 'delete_block',
            block: mockBlock,
            path: editor.path,
          },
        ],
        { validatePaths: false },
      );
    });

    it('should delete specific block by path', () => {
      deleteBlock(editor as YooEditor, { at: 2 });

      expect(getBlock).toHaveBeenCalledWith(editor, { id: undefined, at: 2 });
      expect(editor.applyTransforms).toHaveBeenCalled();
    });

    it('should delete specific block by id', () => {
      deleteBlock(editor as YooEditor, { blockId: 'block-2' });

      expect(getBlock).toHaveBeenCalledWith(editor, { id: 'block-2', at: 2 });
      expect(editor.applyTransforms).toHaveBeenCalled();
    });

    it('should return early if block not found', () => {
      (getBlock as Mock).mockReturnValue(null);

      deleteBlock(editor as YooEditor);

      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });

    it('should call onDestroy lifecycle hook', () => {
      const onDestroy = editor.plugins?.Paragraph?.lifecycle?.onDestroy;

      deleteBlock(editor as YooEditor);

      expect(onDestroy).toHaveBeenCalledWith(editor, 'block-2');
    });
  });

  describe('Focus Behavior - Previous', () => {
    it('should focus previous block by default', () => {
      deleteBlock(editor as YooEditor);

      expect(Paths.getPreviousBlockOrder).toHaveBeenCalledWith(editor, 2);
      expect(getBlock).toHaveBeenCalledWith(editor, { at: 1 });
      expect(getBlockSlate).toHaveBeenCalledWith(editor, { id: 'block-1' });
      expect(editor.focusBlock).toHaveBeenCalledWith('block-1', {
        focusAt: { path: [0, 0], offset: 10 },
      });
    });

    it('should focus previous block when focusTarget is "previous"', () => {
      deleteBlock(editor as YooEditor, { focusTarget: 'previous' });

      expect(editor.focusBlock).toHaveBeenCalledWith('block-1', {
        focusAt: { path: [0, 0], offset: 10 },
      });
    });

    it('should not focus when focus is false', () => {
      deleteBlock(editor as YooEditor, { focus: false });

      expect(editor.focusBlock).not.toHaveBeenCalled();
    });

    it('should not focus when focusTarget is "none"', () => {
      deleteBlock(editor as YooEditor, { focusTarget: 'none' });

      expect(editor.focusBlock).not.toHaveBeenCalled();
    });

    it('should not focus if no previous block exists', () => {
      (Paths.getPreviousBlockOrder as Mock).mockReturnValue(null);

      deleteBlock(editor as YooEditor);

      expect(editor.focusBlock).not.toHaveBeenCalled();
    });
  });

  describe('Focus Behavior - Next', () => {
    it('should focus next block when focusTarget is "next"', () => {
      deleteBlock(editor as YooEditor, { focusTarget: 'next' });

      expect(Paths.getNextBlockOrder).toHaveBeenCalledWith(editor, 2);
      expect(getBlock).toHaveBeenCalledWith(editor, { at: 3 });
      expect(getBlockSlate).toHaveBeenCalledWith(editor, { id: 'block-3' });
      expect(editor.focusBlock).toHaveBeenCalledWith('block-3', {
        focusAt: { path: [0, 0], offset: 10 },
      });
    });

    it('should not focus if no next block exists', () => {
      (Paths.getNextBlockOrder as Mock).mockReturnValue(null);

      deleteBlock(editor as YooEditor, { focusTarget: 'next' });

      expect(editor.focusBlock).not.toHaveBeenCalled();
    });

    it('should not focus if next block slate not found', () => {
      (getBlockSlate as Mock).mockReturnValue(null);

      deleteBlock(editor as YooEditor, { focusTarget: 'next' });

      expect(editor.focusBlock).not.toHaveBeenCalled();
    });
  });

  describe('Operation Details', () => {
    it('should create correct delete_block operation', () => {
      deleteBlock(editor as YooEditor);

      expect(editor.applyTransforms).toHaveBeenCalledWith(
        [
          {
            type: 'delete_block',
            block: mockBlock,
            path: editor.path,
          },
        ],
        { validatePaths: false },
      );
    });

    it('should call applyTransforms with validatePaths: false', () => {
      deleteBlock(editor as YooEditor);

      expect(editor.applyTransforms).toHaveBeenCalledWith(expect.any(Array), {
        validatePaths: false,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle block with null current path', () => {
      editor.path = { current: null };

      deleteBlock(editor as YooEditor);

      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });

    it('should handle plugin without lifecycle', () => {
      if (editor.plugins?.Paragraph) {
        editor.plugins.Paragraph.lifecycle = undefined;
      }

      // Should not throw
      expect(() => deleteBlock(editor as YooEditor)).not.toThrow();
      expect(editor.applyTransforms).toHaveBeenCalled();
    });

    it('should handle plugin without onDestroy', () => {
      if (editor.plugins?.Paragraph?.lifecycle) {
        editor.plugins.Paragraph.lifecycle.onDestroy = undefined;
      }

      // Should not throw
      expect(() => deleteBlock(editor as YooEditor)).not.toThrow();
      expect(editor.applyTransforms).toHaveBeenCalled();
    });

    it('should handle missing target block when focusing previous', () => {
      (getBlock as Mock).mockImplementation((_editor, options) => {
        if (options.at === 2) return mockBlock;
        return null;
      });

      deleteBlock(editor as YooEditor, { focusTarget: 'previous' });

      expect(editor.applyTransforms).toHaveBeenCalled();
      expect(editor.focusBlock).not.toHaveBeenCalled();
    });

    it('should handle missing target slate when focusing', () => {
      (getBlockSlate as Mock).mockReturnValue(null);

      deleteBlock(editor as YooEditor);

      expect(editor.applyTransforms).toHaveBeenCalled();
      expect(editor.focusBlock).not.toHaveBeenCalled();
    });
  });

  describe('Multiple Scenarios', () => {
    it('should delete first block and focus next', () => {
      mockBlock.meta.order = 0;
      editor.path = { current: 0 };

      (getBlock as Mock).mockImplementation((_editor, options) => {
        if (options.at === 0) return { ...mockBlock, meta: { ...mockBlock.meta, order: 0 } };
        if (options.at === 1) return mockNextBlock;
        return null;
      });

      (Paths.getPreviousBlockOrder as Mock).mockReturnValue(null);

      deleteBlock(editor as YooEditor, { focusTarget: 'next' });

      expect(editor.applyTransforms).toHaveBeenCalled();
      expect(Paths.getNextBlockOrder).toHaveBeenCalled();
    });

    it('should delete last block and focus previous', () => {
      mockBlock.meta.order = 10;
      editor.path = { current: 10 };

      (getBlock as Mock).mockImplementation((_editor, options) => {
        if (options.at === 10) return { ...mockBlock, meta: { ...mockBlock.meta, order: 10 } };
        if (options.at === 9) return mockPrevBlock;
        return null;
      });

      (Paths.getNextBlockOrder as Mock).mockReturnValue(null);
      (Paths.getPreviousBlockOrder as Mock).mockImplementation((_editor, order) => {
        if (order === 10) return 9;
        return null;
      });

      deleteBlock(editor as YooEditor);

      expect(editor.applyTransforms).toHaveBeenCalled();
      expect(Paths.getPreviousBlockOrder).toHaveBeenCalled();
    });

    it('should delete middle block with custom focus behavior', () => {
      (getBlock as Mock).mockImplementation((_editor, options) => {
        if (options.at === 2) return mockBlock;
        if (options.at === 3) return mockNextBlock;
        return null;
      });

      (Paths.getNextBlockOrder as Mock).mockImplementation((_editor, order) => {
        if (order === 2) return 3;
        return null;
      });

      deleteBlock(editor as YooEditor, { at: 2, focusTarget: 'next', focus: true });

      expect(getBlock).toHaveBeenCalledWith(editor, { id: undefined, at: 2 });
      expect(editor.applyTransforms).toHaveBeenCalled();
      expect(editor.focusBlock).toHaveBeenCalledWith('block-3', expect.any(Object));
    });
  });
});
