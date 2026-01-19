import { Text } from 'slate';
import { ReactEditor } from 'slate-react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { getLastNodePoint } from '../../utils/get-node-points';
import { Elements } from '../elements';
import { Paths } from '../paths';
import type { SlateEditor, SlateElement, YooEditor } from '../types';
import { getBlock } from './getBlock';
import { getBlockSlate } from './getBlockSlate';
import { mergeBlock } from './mergeBlock';

vi.mock('../../utils/findSlateBySelectionPath', () => ({
  findSlateBySelectionPath: vi.fn(),
}));

vi.mock('../../utils/get-node-points', () => ({
  getLastNodePoint: vi.fn(),
}));

vi.mock('./getBlock', () => ({
  getBlock: vi.fn(),
}));

vi.mock('./getBlockSlate', () => ({
  getBlockSlate: vi.fn(),
}));

vi.mock('../elements', () => ({
  Elements: {
    getElement: vi.fn(),
  },
}));

vi.mock('../paths', () => ({
  Paths: {
    getPreviousBlockOrder: vi.fn((editor, order) => {
      const path = order ?? editor?.path?.current;
      if (typeof path === 'number' && path !== 0) return path - 1;
      return null;
    }),
  },
}));

vi.mock('slate', () => ({
  Editor: {
    withoutNormalizing: vi.fn((editor, fn) => fn()),
    start: vi.fn(() => ({ path: [0, 0], offset: 0 })),
  },
  Text: {
    isText: vi.fn() as any,
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

describe('mergeBlock', () => {
  let editor: Partial<YooEditor>;
  let mockSourceSlate: Partial<SlateEditor>;
  let mockTargetSlate: Partial<SlateEditor>;
  let mockSourceBlock: any;
  let mockTargetBlock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSourceBlock = {
      id: 'source-block',
      type: 'Paragraph',
      meta: {
        order: 1,
        depth: 0,
        align: 'left',
      },
      value: [
        {
          id: 'element-2',
          type: 'paragraph',
          children: [{ text: ' world' }],
        },
      ],
    };

    mockTargetBlock = {
      id: 'target-block',
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
          children: [{ text: 'Hello' }],
        },
      ],
    };

    mockSourceSlate = {
      children: [
        {
          id: 'element-2',
          type: 'paragraph',
          children: [{ text: ' world' }],
        } as SlateElement,
      ],
    };

    mockTargetSlate = {
      children: [
        {
          id: 'element-1',
          type: 'paragraph',
          children: [{ text: 'Hello' }],
        } as SlateElement,
      ],
    };

    (getBlock as Mock).mockImplementation((_editor, options) => {
      if (options.id === 'source-block' || options.at === 1) return mockSourceBlock;
      if (options.id === 'target-block' || options.at === 0) return mockTargetBlock;
      return null;
    });

    (findSlateBySelectionPath as Mock).mockImplementation((_editor, options) => {
      if (options.at === 1) return mockSourceSlate;
      if (options.at === 0) return mockTargetSlate;
      return null;
    });

    (getBlockSlate as Mock).mockImplementation((_editor, options) => {
      if (options.id === 'source-block') return mockSourceSlate;
      if (options.id === 'target-block') return mockTargetSlate;
      return null;
    });

    (getLastNodePoint as Mock).mockReturnValue({ path: [0, 0], offset: 5 });

    (Elements.getElement as Mock).mockReturnValue({
      props: { nodeType: 'block' },
    });

    // @ts-expect-error - Mock implementation
    (Text.isText as Mock).mockImplementation((node: any) => 'text' in node);

    editor = {
      path: { current: 1 },
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
        'source-block': mockSourceBlock,
        'target-block': mockTargetBlock,
      },
      applyTransforms: vi.fn(),
      setPath: vi.fn(),
    };
  });

  describe('Basic Functionality', () => {
    it('should merge current block into previous block', () => {
      mergeBlock(editor as YooEditor);

      expect(getBlock).toHaveBeenCalledWith(editor, { id: undefined, at: 1 });
      expect(Paths.getPreviousBlockOrder).toHaveBeenCalledWith(editor, 1);
      expect(editor.applyTransforms).toHaveBeenCalled();
      expect(editor.setPath).toHaveBeenCalledWith({ current: 0 });
    });

    it('should merge specific block by path', () => {
      mergeBlock(editor as YooEditor, { at: 1 });

      expect(getBlock).toHaveBeenCalledWith(editor, { id: undefined, at: 1 });
      expect(editor.applyTransforms).toHaveBeenCalled();
    });

    it('should merge specific block by id', () => {
      mergeBlock(editor as YooEditor, { blockId: 'source-block' });

      expect(getBlock).toHaveBeenCalledWith(editor, { id: 'source-block', at: 1 });
      expect(getBlockSlate).toHaveBeenCalledWith(editor, { id: 'source-block' });
      expect(editor.applyTransforms).toHaveBeenCalled();
    });

    it('should return early if source block not found', () => {
      (getBlock as Mock).mockReturnValue(null);

      mergeBlock(editor as YooEditor);

      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });

    it('should return early if source slate not found', () => {
      (findSlateBySelectionPath as Mock).mockImplementation((_ed, options) => {
        if (options.at === 1) return null;
        if (options.at === 0) return mockTargetSlate;
        return null;
      });

      mergeBlock(editor as YooEditor);

      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });

    it('should return early if target block not found', () => {
      (getBlock as Mock).mockImplementation((_ed, options) => {
        if (options.at === 1) return mockSourceBlock;
        return null;
      });

      mergeBlock(editor as YooEditor);

      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });

    it('should return early if target slate not found', () => {
      (findSlateBySelectionPath as Mock).mockImplementation((_ed, options) => {
        if (options.at === 1) return mockSourceSlate;
        return null;
      });

      mergeBlock(editor as YooEditor);

      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });
  });

  describe('Target Block Specification', () => {
    it('should merge into previous block by default', () => {
      mergeBlock(editor as YooEditor);

      expect(Paths.getPreviousBlockOrder).toHaveBeenCalledWith(editor, 1);
      expect(getBlock).toHaveBeenCalledWith(editor, { at: 0 });
    });

    it('should merge into specific target by path', () => {
      mergeBlock(editor as YooEditor, { at: 1, targetAt: 0 });

      expect(getBlock).toHaveBeenCalledWith(expect.anything(), { at: 0 });
      expect(findSlateBySelectionPath).toHaveBeenCalledWith(expect.anything(), { at: 0 });
    });

    it('should merge into specific target by id', () => {
      mergeBlock(editor as YooEditor, { at: 1, targetBlockId: 'target-block' });

      expect(getBlock).toHaveBeenCalledWith(expect.anything(), { id: 'target-block' });
      expect(getBlockSlate).toHaveBeenCalledWith(expect.anything(), { id: 'target-block' });
    });

    it('should return early if no previous block exists', () => {
      (Paths.getPreviousBlockOrder as Mock).mockReturnValue(null);

      mergeBlock(editor as YooEditor);

      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });
  });

  describe('Void Block Handling', () => {
    it('should return early if target block is void', () => {
      (Elements.getElement as Mock).mockReturnValue({
        props: { nodeType: 'void' },
      });

      mergeBlock(editor as YooEditor);

      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });

    it('should return early if target plugin not found', () => {
      (getBlock as Mock).mockImplementation((_ed, options) => {
        if (options.at === 1) return mockSourceBlock;
        if (options.at === 0)
          return {
            ...mockTargetBlock,
            type: 'UnknownPlugin',
          };
        return null;
      });

      mergeBlock(editor as YooEditor);

      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });
  });

  describe('Focus Behavior', () => {
    it('should focus target block by default', async () => {
      mergeBlock(editor as YooEditor);

      // Wait for setTimeout
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 10);
      });

      expect(ReactEditor.focus).toHaveBeenCalledWith(mockTargetSlate);
    });

    it('should not focus when focus is false', async () => {
      mergeBlock(editor as YooEditor, { focus: false });

      // Wait for setTimeout (if any)
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 10);
      });

      expect(ReactEditor.focus).not.toHaveBeenCalled();
    });
  });

  // [TODO] - These tests need further investigation as they rely on internal logic
  // that is executed inside Editor.withoutNormalizing

  describe('Edge Cases', () => {
    it('should handle block with null current path', () => {
      editor.path = { current: null };

      mergeBlock(editor as YooEditor);

      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });
  });
});
