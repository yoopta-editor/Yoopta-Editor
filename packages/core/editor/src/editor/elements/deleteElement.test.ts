import { type Mock, vi, describe, it, expect, beforeEach } from 'vitest';
import { Editor, Element, Path, Transforms } from 'slate';

import { deleteElement } from './deleteElement';
import type { SlateElement, YooEditor } from '../types';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';

vi.mock('../../utils/findSlateBySelectionPath');
vi.mock('slate', () => ({
  Editor: {
    nodes: vi.fn(),
    node: vi.fn(),
    withoutNormalizing: vi.fn((slate, fn) => fn()),
  },
  Element: {
    isElement: vi.fn(),
  },
  Path: {
    isPath: vi.fn(),
  },
  Transforms: {
    removeNodes: vi.fn(),
    unwrapNodes: vi.fn(),
  },
}));

describe('deleteElement', () => {
  let editor: Partial<YooEditor>;
  let mockSlate: any;
  let mockElement: SlateElement;
  let mockBlock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockElement = {
      id: 'element-1',
      type: 'accordion-list-item',
      props: { isExpanded: true, nodeType: 'block' },
      children: [{ text: 'Item content' }],
    };

    mockSlate = {
      selection: { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 0 } },
      children: [mockElement],
    };

    mockBlock = {
      id: 'block-1',
      type: 'Accordion',
      meta: { order: 0, depth: 0 },
      value: [mockElement],
    };

    editor = {
      children: { 'block-1': mockBlock },
      plugins: {
        Accordion: {
          type: 'Accordion',
          elements: {
            'accordion-list-item': {
              props: { nodeType: 'block' },
            },
          },
        },
      },
      path: { current: 0 },
    };

    (findSlateBySelectionPath as Mock).mockReturnValue(mockSlate);
    (Element.isElement as unknown as Mock).mockImplementation(
      (node) => node && typeof node === 'object' && 'type' in node && 'children' in node,
    );
    (Path.isPath as unknown as Mock).mockImplementation(
      (value) => Array.isArray(value) && value.every((v: any) => typeof v === 'number'),
    );
  });

  describe('deleting by selection', () => {
    it('should delete block element found via selection', () => {
      (Editor.nodes as Mock).mockReturnValue([[mockElement, [0]]]);

      deleteElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'accordion-list-item',
      });

      expect(Transforms.removeNodes).toHaveBeenCalledWith(mockSlate, {
        at: [0],
        match: expect.any(Function),
      });
    });

    it('should use default remove mode', () => {
      (Editor.nodes as Mock).mockReturnValue([[mockElement, [0]]]);

      deleteElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'accordion-list-item',
      });

      expect(Transforms.removeNodes).toHaveBeenCalled();
      expect(Transforms.unwrapNodes).not.toHaveBeenCalled();
    });
  });

  describe('deleting by path', () => {
    it('should delete element at a direct path', () => {
      (Editor.node as Mock).mockReturnValue([mockElement, [0]]);

      deleteElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'accordion-list-item',
        path: [0],
      });

      expect(Transforms.removeNodes).toHaveBeenCalledWith(mockSlate, {
        at: [0],
        match: expect.any(Function),
      });
      expect(Editor.nodes).not.toHaveBeenCalled();
    });
  });

  describe('deleting with custom matcher', () => {
    it('should find element using custom match function', () => {
      (Editor.nodes as Mock).mockReturnValue([[mockElement, [0]]]);

      deleteElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'accordion-list-item',
        match: (el) => el.props?.isExpanded === true,
      });

      expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
        at: mockSlate.selection,
        match: expect.any(Function),
        mode: 'highest',
      });
      expect(Transforms.removeNodes).toHaveBeenCalled();
    });
  });

  describe('fallback when selection is null (unfocused block)', () => {
    it('should search entire document when slate has no selection', () => {
      mockSlate.selection = null;
      (Editor.nodes as Mock).mockReturnValue([[mockElement, [0]]]);

      deleteElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'accordion-list-item',
      });

      expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
        at: [],
        match: expect.any(Function),
        mode: 'highest',
      });
      expect(Transforms.removeNodes).toHaveBeenCalled();
    });

    it('should try selection first, then fallback to full document search', () => {
      (Editor.nodes as Mock)
        .mockReturnValueOnce([]) // selection search: no results
        .mockReturnValueOnce([[mockElement, [0]]]); // full doc search: found

      deleteElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'accordion-list-item',
      });

      // First call: at selection
      expect(Editor.nodes).toHaveBeenNthCalledWith(1, mockSlate, {
        at: mockSlate.selection,
        match: expect.any(Function),
        mode: 'highest',
      });
      // Second call: fallback to full document
      expect(Editor.nodes).toHaveBeenNthCalledWith(2, mockSlate, {
        at: [],
        match: expect.any(Function),
        mode: 'highest',
      });
      expect(Transforms.removeNodes).toHaveBeenCalled();
    });
  });

  describe('inline element deletion', () => {
    let inlineElement: SlateElement;

    beforeEach(() => {
      inlineElement = {
        id: 'link-1',
        type: 'link',
        props: { url: 'https://example.com', target: '_blank', rel: 'noopener', nodeType: 'inline' },
        children: [{ text: 'click here' }],
      };

      editor.plugins = {
        Paragraph: {
          type: 'Paragraph',
          elements: {
            paragraph: { props: { nodeType: 'block' } },
            link: { props: { nodeType: 'inline' } },
          },
        },
      };

      editor.children = {
        'block-2': {
          id: 'block-2',
          type: 'Paragraph',
          meta: { order: 1, depth: 0 },
          value: [
            {
              id: 'p-1',
              type: 'paragraph',
              children: [{ text: 'Hello ' }, inlineElement, { text: ' world' }],
            },
          ],
        },
      };
    });

    it('should use lowest mode for finding inline elements', () => {
      (findSlateBySelectionPath as Mock).mockReturnValue(mockSlate);
      (Editor.nodes as Mock).mockReturnValue([[inlineElement, [0, 1]]]);

      deleteElement(editor as YooEditor, {
        blockId: 'block-2',
        type: 'link',
      });

      expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
        at: mockSlate.selection,
        match: expect.any(Function),
        mode: 'lowest',
      });
    });

    it('should unwrap inline element when mode is unwrap', () => {
      (findSlateBySelectionPath as Mock).mockReturnValue(mockSlate);
      (Editor.nodes as Mock).mockReturnValue([[inlineElement, [0, 1]]]);

      deleteElement(editor as YooEditor, {
        blockId: 'block-2',
        type: 'link',
        mode: 'unwrap',
      });

      expect(Transforms.unwrapNodes).toHaveBeenCalledWith(mockSlate, {
        at: mockSlate.selection,
        match: expect.any(Function),
        split: true,
      });
      expect(Transforms.removeNodes).not.toHaveBeenCalled();
    });

    it('should remove inline element entirely when mode is remove', () => {
      (findSlateBySelectionPath as Mock).mockReturnValue(mockSlate);
      (Editor.nodes as Mock).mockReturnValue([[inlineElement, [0, 1]]]);

      deleteElement(editor as YooEditor, {
        blockId: 'block-2',
        type: 'link',
        mode: 'remove',
      });

      expect(Transforms.removeNodes).toHaveBeenCalledWith(mockSlate, {
        at: [0, 1],
        match: expect.any(Function),
      });
      expect(Transforms.unwrapNodes).not.toHaveBeenCalled();
    });

    it('should unwrap at path when no selection and mode is unwrap', () => {
      mockSlate.selection = null;
      (findSlateBySelectionPath as Mock).mockReturnValue(mockSlate);
      (Editor.nodes as Mock).mockReturnValue([[inlineElement, [0, 1]]]);

      deleteElement(editor as YooEditor, {
        blockId: 'block-2',
        type: 'link',
        mode: 'unwrap',
      });

      expect(Transforms.unwrapNodes).toHaveBeenCalledWith(mockSlate, {
        at: [0, 1],
        match: expect.any(Function),
      });
    });
  });

  describe('error cases', () => {
    it('should warn and return when block not found', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      deleteElement(editor as YooEditor, {
        blockId: 'non-existent',
        type: 'accordion-list-item',
      });

      expect(warnSpy).toHaveBeenCalledWith('Block non-existent not found');
      expect(Transforms.removeNodes).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn and return when slate not found', () => {
      (findSlateBySelectionPath as Mock).mockReturnValue(undefined);
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      deleteElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'accordion-list-item',
      });

      expect(warnSpy).toHaveBeenCalledWith('Slate editor not found for block block-1');
      expect(Transforms.removeNodes).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn and return when plugin not found', () => {
      editor.plugins = {};
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      deleteElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'accordion-list-item',
      });

      expect(warnSpy).toHaveBeenCalledWith('Plugin Accordion not found');
      expect(Transforms.removeNodes).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn and return when element type not in plugin', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      deleteElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'non-existent-element',
      });

      expect(warnSpy).toHaveBeenCalledWith('Element type non-existent-element not found in plugin Accordion');
      expect(Transforms.removeNodes).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn when element not found in selection or document', () => {
      (Editor.nodes as Mock).mockReturnValue([]);
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      deleteElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'accordion-list-item',
      });

      expect(warnSpy).toHaveBeenCalledWith('Element of type accordion-list-item not found in current selection');
      expect(Transforms.removeNodes).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn when element not found at provided path', () => {
      (Editor.node as Mock).mockImplementation(() => {
        throw new Error('Path does not exist');
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      deleteElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'accordion-list-item',
        path: [99],
      });

      expect(warnSpy).toHaveBeenCalledWith('Element not found at path 99');
      expect(Transforms.removeNodes).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});
