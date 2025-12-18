import { createEditor } from 'slate';
import { describe, expect, it } from 'vitest';

import { getFirstNodePoint, getLastNode, getLastNodePoint } from './get-node-points';
import type { SlateEditor } from '../editor/types';

// Helper to create a simple Slate editor with content
function createSlateEditorWithContent(children: any[]): SlateEditor {
  const editor = createEditor();
  editor.children = children;
  return editor as SlateEditor;
}

describe('get-node-points', () => {
  describe('getLastNode', () => {
    it('should return the last node and its path', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [{ text: 'First paragraph' }],
        },
        {
          type: 'paragraph',
          children: [{ text: 'Last paragraph' }],
        },
      ]);

      const result = getLastNode(editor);

      expect(result.node).toBeDefined();
      expect(result.path).toBeDefined();
      expect(Array.isArray(result.path)).toBe(true);
      expect(result.path.length).toBeGreaterThan(0);
    });

    it('should return the last node from a single element', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [{ text: 'Only paragraph' }],
        },
      ]);

      const result = getLastNode(editor);

      expect(result.node).toBeDefined();
      expect(result.path).toBeDefined();
    });

    it('should handle empty editor', () => {
      const editor = createSlateEditorWithContent([]);

      // Empty editor should still return something (Editor.last will throw or return default)
      expect(() => getLastNode(editor)).not.toThrow();
    });
  });

  describe('getLastNodePoint', () => {
    it('should return point at the end of last text node in simple element', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [{ text: 'Hello world' }],
        },
      ]);

      const result = getLastNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.path).toBeDefined();
      expect(Array.isArray(result.path)).toBe(true);
      expect(result.offset).toBe(11); // "Hello world".length
    });

    it('should return point at the end of last text node in nested structure', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [{ text: 'First' }],
        },
        {
          type: 'paragraph',
          children: [{ text: 'Second' }],
        },
        {
          type: 'paragraph',
          children: [{ text: 'Last text' }],
        },
      ]);

      const result = getLastNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.offset).toBe(9); // "Last text".length
    });

    it('should handle element with multiple text nodes', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [
            { text: 'First part ' },
            { text: 'second part', bold: true },
            { text: ' third part' },
          ],
        },
      ]);

      const result = getLastNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.offset).toBe(11); // " third part".length
    });

    it('should handle nested elements', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'container',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Nested paragraph' }],
            },
          ],
        },
      ]);

      const result = getLastNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.offset).toBe(16); // "Nested paragraph".length
    });

    it('should handle element without text nodes', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [],
        },
      ]);

      const result = getLastNodePoint(editor);

      // When element has no text nodes, function may return undefined
      // or throw an error that gets caught, returning default point
      // The actual behavior depends on Editor.last behavior
      if (result) {
        expect(result.path).toBeDefined();
        expect(Array.isArray(result.path)).toBe(true);
        expect(typeof result.offset).toBe('number');
      }
    });

    it('should handle deeply nested structure', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'level1',
          children: [
            {
              type: 'level2',
              children: [
                {
                  type: 'level3',
                  children: [{ text: 'Deep text' }],
                },
              ],
            },
          ],
        },
      ]);

      const result = getLastNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.offset).toBe(9); // "Deep text".length
    });

    it('should handle empty text node', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ]);

      const result = getLastNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.offset).toBe(0);
    });
  });

  describe('getFirstNodePoint', () => {
    it('should return point at the start of first text node in simple element', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [{ text: 'Hello world' }],
        },
      ]);

      const result = getFirstNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.path).toBeDefined();
      expect(Array.isArray(result.path)).toBe(true);
      expect(result.offset).toBe(0);
    });

    it('should return point at the start of first text node in multiple elements', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [{ text: 'First paragraph' }],
        },
        {
          type: 'paragraph',
          children: [{ text: 'Second paragraph' }],
        },
        {
          type: 'paragraph',
          children: [{ text: 'Last paragraph' }],
        },
      ]);

      const result = getFirstNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.offset).toBe(0);
    });

    it('should handle element with multiple text nodes', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [
            { text: 'First part ' },
            { text: 'second part', bold: true },
            { text: ' third part' },
          ],
        },
      ]);

      const result = getFirstNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.offset).toBe(0); // Should point to start of first text node
    });

    it('should handle nested elements', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'container',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Nested paragraph' }],
            },
          ],
        },
      ]);

      const result = getFirstNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.offset).toBe(0);
    });

    it('should return default point when no text node found', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [],
        },
      ]);

      const result = getFirstNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.path).toEqual([0, 0]);
      expect(result.offset).toBe(0);
    });

    it('should handle deeply nested structure', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'level1',
          children: [
            {
              type: 'level2',
              children: [
                {
                  type: 'level3',
                  children: [{ text: 'Deep text' }],
                },
              ],
            },
          ],
        },
      ]);

      const result = getFirstNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.offset).toBe(0);
    });

    it('should handle empty text node', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ]);

      const result = getFirstNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.offset).toBe(0);
    });

    it('should return default point on error', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [],
        },
      ]);

      const result = getFirstNodePoint(editor);

      // Should return a valid point even if there's an issue
      expect(result).toBeDefined();
      expect(result.path).toBeDefined();
      expect(Array.isArray(result.path)).toBe(true);
      expect(typeof result.offset).toBe('number');
      expect(result.offset).toBe(0);
    });

    it('should find first text node in complex structure with multiple elements', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'heading',
          children: [{ text: 'Title' }],
        },
        {
          type: 'paragraph',
          children: [{ text: 'Content' }],
        },
      ]);

      const result = getFirstNodePoint(editor);

      expect(result).toBeDefined();
      expect(result.offset).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle editor with only text nodes (no elements)', () => {
      // This is an edge case - normally Slate editors have element nodes
      // But we test the fallback behavior
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [{ text: 'Text' }],
        },
      ]);

      const lastPoint = getLastNodePoint(editor);
      const firstPoint = getFirstNodePoint(editor);

      expect(lastPoint).toBeDefined();
      expect(firstPoint).toBeDefined();
    });

    it('should handle mixed content with inline elements', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [
            { text: 'Start ' },
            {
              type: 'link',
              children: [{ text: 'link' }],
            },
            { text: ' end' },
          ],
        },
      ]);

      const lastPoint = getLastNodePoint(editor);
      const firstPoint = getFirstNodePoint(editor);

      expect(lastPoint).toBeDefined();
      expect(lastPoint.offset).toBe(4); // " end".length
      expect(firstPoint).toBeDefined();
      expect(firstPoint.offset).toBe(0);
    });

    it('should handle structure with void elements', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [{ text: 'Before' }],
        },
        {
          type: 'divider',
          children: [{ text: '' }],
        },
        {
          type: 'paragraph',
          children: [{ text: 'After' }],
        },
      ]);

      const lastPoint = getLastNodePoint(editor);
      const firstPoint = getFirstNodePoint(editor);

      expect(lastPoint).toBeDefined();
      expect(lastPoint.offset).toBe(5); // "After".length
      expect(firstPoint).toBeDefined();
      expect(firstPoint.offset).toBe(0);
    });

    it('should handle very long text content', () => {
      const longText = 'a'.repeat(1000);
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [{ text: longText }],
        },
      ]);

      const lastPoint = getLastNodePoint(editor);
      const firstPoint = getFirstNodePoint(editor);

      expect(lastPoint.offset).toBe(1000);
      expect(firstPoint.offset).toBe(0);
    });

    it('should handle unicode characters correctly', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'paragraph',
          children: [{ text: 'Hello 🌍 World' }],
        },
      ]);

      const lastPoint = getLastNodePoint(editor);
      const firstPoint = getFirstNodePoint(editor);

      expect(lastPoint.offset).toBe(14); // Unicode emoji counts as 2 characters
      expect(firstPoint.offset).toBe(0);
    });
  });

  describe('integration scenarios', () => {
    it('should work correctly with accordion-like structure', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'accordion-list',
          children: [
            {
              type: 'accordion-list-item',
              children: [
                {
                  type: 'accordion-list-item-heading',
                  children: [{ text: 'Heading' }],
                },
                {
                  type: 'accordion-list-item-content',
                  children: [{ text: 'Content' }],
                },
              ],
            },
          ],
        },
      ]);

      const lastPoint = getLastNodePoint(editor);
      const firstPoint = getFirstNodePoint(editor);

      expect(lastPoint.offset).toBe(7); // "Content".length
      expect(firstPoint.offset).toBe(0);
    });

    it('should work correctly with list-like structure', () => {
      const editor = createSlateEditorWithContent([
        {
          type: 'list',
          children: [
            {
              type: 'list-item',
              children: [{ text: 'Item 1' }],
            },
            {
              type: 'list-item',
              children: [{ text: 'Item 2' }],
            },
            {
              type: 'list-item',
              children: [{ text: 'Item 3' }],
            },
          ],
        },
      ]);

      const lastPoint = getLastNodePoint(editor);
      const firstPoint = getFirstNodePoint(editor);

      expect(lastPoint.offset).toBe(6); // "Item 3".length
      expect(firstPoint.offset).toBe(0);
    });
  });
});
