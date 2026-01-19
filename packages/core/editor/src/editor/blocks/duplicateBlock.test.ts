import cloneDeep from 'lodash.clonedeep';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { generateId } from '../../utils/generateId';
import type { SlateElement, YooEditor, YooptaBlockData } from '../types';
import { duplicateBlock } from './duplicateBlock';
import { getBlock } from './getBlock';

vi.mock('../../utils/generateId', () => ({
  generateId: vi.fn(() => 'new-block-id'),
}));

vi.mock('./getBlock', () => ({
  getBlock: vi.fn(),
}));

vi.mock('lodash.clonedeep', () => ({
  default: vi.fn((val) => JSON.parse(JSON.stringify(val))),
}));

describe('duplicateBlock', () => {
  let editor: Partial<YooEditor>;
  let mockBlock: YooptaBlockData;

  beforeEach(() => {
    vi.clearAllMocks();

    mockBlock = {
      id: 'block-123',
      type: 'Paragraph',
      meta: {
        order: 3,
        depth: 0,
        align: 'left',
      },
      value: [
        {
          id: 'element-1',
          type: 'paragraph',
          children: [{ text: 'Hello world' }],
        } as SlateElement,
      ],
    };

    (getBlock as Mock).mockImplementation((_editor, options) => {
      if (options.at === 3 || options.id === 'block-123') return mockBlock;
      return null;
    });

    editor = {
      path: { current: 3 },
      children: {
        'block-123': mockBlock,
      },
      applyTransforms: vi.fn(),
      focusBlock: vi.fn(),
    };
  });

  describe('Basic Functionality', () => {
    it('should duplicate current block', () => {
      const newBlockId = duplicateBlock(editor as YooEditor);

      expect(newBlockId).toBe('new-block-id');
      expect(getBlock).toHaveBeenCalledWith(editor, { at: 3 });
      expect(cloneDeep).toHaveBeenCalledWith(mockBlock);
      expect(generateId).toHaveBeenCalled();
      expect(editor.applyTransforms).toHaveBeenCalled();
      expect(editor.focusBlock).toHaveBeenCalledWith('new-block-id', { waitExecution: true });
    });

    it('should duplicate specific block by path', () => {
      const newBlockId = duplicateBlock(editor as YooEditor, { at: 3 });

      expect(newBlockId).toBe('new-block-id');
      expect(getBlock).toHaveBeenCalledWith(editor, { at: 3 });
    });

    it('should duplicate specific block by id', () => {
      const newBlockId = duplicateBlock(editor as YooEditor, { blockId: 'block-123' });

      expect(newBlockId).toBe('new-block-id');
      expect(editor.children?.['block-123']).toBe(mockBlock);
    });

    it('should return undefined if block not found', () => {
      (getBlock as Mock).mockReturnValue(null);

      const newBlockId = duplicateBlock(editor as YooEditor);

      expect(newBlockId).toBeUndefined();
      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });

    it('should return undefined if block with id not found', () => {
      editor.children = {};

      const newBlockId = duplicateBlock(editor as YooEditor, { blockId: 'block-123' });

      expect(newBlockId).toBeUndefined();
      expect(editor.applyTransforms).not.toHaveBeenCalled();
    });
  });

  describe('Insert Position', () => {
    it('should insert after original block by default', () => {
      duplicateBlock(editor as YooEditor);

      expect(editor.applyTransforms).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'insert_block',
            block: expect.objectContaining({
              id: 'new-block-id',
              meta: expect.objectContaining({
                order: 4, // original order (3) + 1
              }),
            }),
          }),
        ]),
      );
    });

    it('should insert at specific position when insertAt provided', () => {
      duplicateBlock(editor as YooEditor, { insertAt: 0 });

      expect(editor.applyTransforms).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'insert_block',
            block: expect.objectContaining({
              id: 'new-block-id',
              meta: expect.objectContaining({
                order: 0,
              }),
            }),
          }),
        ]),
      );
    });

    it('should insert at specific position when duplicating by id', () => {
      duplicateBlock(editor as YooEditor, { blockId: 'block-123', insertAt: 10 });

      expect(editor.applyTransforms).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'insert_block',
            block: expect.objectContaining({
              id: 'new-block-id',
              meta: expect.objectContaining({
                order: 10,
              }),
            }),
          }),
        ]),
      );
    });
  });

  describe('Focus Behavior', () => {
    it('should focus new block by default', () => {
      duplicateBlock(editor as YooEditor);

      expect(editor.focusBlock).toHaveBeenCalledWith('new-block-id', { waitExecution: true });
    });

    it('should not focus when focus is false', () => {
      duplicateBlock(editor as YooEditor, { focus: false });

      expect(editor.focusBlock).not.toHaveBeenCalled();
    });
  });

  describe('Custom Elements', () => {
    it('should use custom elements when provided', () => {
      const customElement: SlateElement = {
        id: 'custom-element',
        type: 'paragraph',
        children: [{ text: 'Custom content' }],
      };

      duplicateBlock(editor as YooEditor, { elements: customElement });

      expect(editor.applyTransforms).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'insert_block',
            block: expect.objectContaining({
              id: 'new-block-id',
              value: [customElement],
            }),
          }),
        ]),
      );
    });

    it('should preserve original value when no custom elements provided', () => {
      duplicateBlock(editor as YooEditor);

      expect(editor.applyTransforms).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'insert_block',
            block: expect.objectContaining({
              id: 'new-block-id',
              value: mockBlock.value,
            }),
          }),
        ]),
      );
    });
  });

  describe('Operation Details', () => {
    it('should create correct insert_block operation', () => {
      duplicateBlock(editor as YooEditor);

      expect(editor.applyTransforms).toHaveBeenCalledWith([
        {
          type: 'insert_block',
          path: { current: 4 },
          block: {
            id: 'new-block-id',
            type: 'Paragraph',
            meta: {
              order: 4,
              depth: 0,
              align: 'left',
            },
            value: mockBlock.value,
          },
        },
      ]);
    });

    it('should preserve block type and meta properties', () => {
      mockBlock.meta.depth = 2;
      mockBlock.meta.align = 'center';

      duplicateBlock(editor as YooEditor);

      expect(editor.applyTransforms).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'insert_block',
            block: expect.objectContaining({
              type: 'Paragraph',
              meta: expect.objectContaining({
                depth: 2,
                align: 'center',
              }),
            }),
          }),
        ]),
      );
    });

    it('should return new block id', () => {
      const newBlockId = duplicateBlock(editor as YooEditor);

      expect(newBlockId).toBe('new-block-id');
    });
  });

  describe('Edge Cases', () => {
    it('should handle block with null current path', () => {
      editor.path = { current: null };

      const newBlockId = duplicateBlock(editor as YooEditor);

      expect(newBlockId).toBeUndefined();
    });

    it('should handle complex block structures', () => {
      mockBlock.value = [
        {
          id: 'element-1',
          type: 'paragraph',
          children: [
            { text: 'Hello ' },
            {
              type: 'link',
              props: { url: 'http://example.com' },
              children: [{ text: 'world' }],
            } as any,
          ],
        } as SlateElement,
      ];

      const newBlockId = duplicateBlock(editor as YooEditor);

      expect(newBlockId).toBe('new-block-id');
      expect(editor.applyTransforms).toHaveBeenCalled();
    });

    it('should generate unique id for duplicated block', () => {
      duplicateBlock(editor as YooEditor);

      expect(generateId).toHaveBeenCalled();
      expect(editor.applyTransforms).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            block: expect.objectContaining({
              id: 'new-block-id',
            }),
          }),
        ]),
      );
    });
  });

  describe('Multiple Duplications', () => {
    it('should support multiple duplications in sequence', () => {
      (generateId as Mock)
        .mockReturnValueOnce('block-copy-1')
        .mockReturnValueOnce('block-copy-2')
        .mockReturnValueOnce('block-copy-3');

      const id1 = duplicateBlock(editor as YooEditor);
      const id2 = duplicateBlock(editor as YooEditor);
      const id3 = duplicateBlock(editor as YooEditor);

      expect(id1).toBe('block-copy-1');
      expect(id2).toBe('block-copy-2');
      expect(id3).toBe('block-copy-3');
      expect(editor.applyTransforms).toHaveBeenCalledTimes(3);
    });
  });
});
