import { type Mock, vi, describe, it, expect, beforeEach } from 'vitest';
import { Editor, Element, Transforms } from 'slate';

import { updateElement } from './updateElement';
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
  Text: {
    isText: vi.fn(),
  },
  Transforms: {
    setNodes: vi.fn(),
    insertText: vi.fn(),
    insertNodes: vi.fn(),
    removeNodes: vi.fn(),
  },
}));

describe('updateElement', () => {
  let editor: Partial<YooEditor>;
  let mockSlate: any;
  let mockElement: SlateElement;
  let mockBlock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockElement = {
      id: 'element-1',
      type: 'code',
      props: { language: 'javascript', theme: 'github-dark', nodeType: 'block' },
      children: [{ text: 'const x = 1;' }],
    };

    mockSlate = {
      selection: { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 0 } },
      children: [mockElement],
    };

    mockBlock = {
      id: 'block-1',
      type: 'Code',
      meta: { order: 0, depth: 0 },
      value: [mockElement],
    };

    editor = {
      children: { 'block-1': mockBlock },
      plugins: {
        Code: {
          type: 'Code',
          elements: {
            code: {
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
  });

  describe('updating props by selection', () => {
    it('should update element props found via selection', () => {
      (Editor.nodes as Mock).mockReturnValue([[mockElement, [0]]]);

      updateElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'code',
        props: { language: 'typescript' },
      });

      expect(Transforms.setNodes).toHaveBeenCalledWith(
        mockSlate,
        { props: { language: 'typescript', theme: 'github-dark', nodeType: 'block' } },
        { at: [0] },
      );
    });

    it('should merge new props with existing props', () => {
      (Editor.nodes as Mock).mockReturnValue([[mockElement, [0]]]);

      updateElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'code',
        props: { theme: 'dracula' },
      });

      expect(Transforms.setNodes).toHaveBeenCalledWith(
        mockSlate,
        {
          props: {
            language: 'javascript',
            theme: 'dracula',
            nodeType: 'block',
          },
        },
        { at: [0] },
      );
    });
  });

  describe('updating props by path', () => {
    it('should update element at a direct path', () => {
      (Editor.node as Mock).mockReturnValue([mockElement, [0]]);

      updateElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'code',
        path: [0],
        props: { language: 'python' },
      });

      expect(Transforms.setNodes).toHaveBeenCalledWith(
        mockSlate,
        { props: { language: 'python', theme: 'github-dark', nodeType: 'block' } },
        { at: [0] },
      );
      // Should NOT search via Editor.nodes when path is provided
      expect(Editor.nodes).not.toHaveBeenCalled();
    });
  });

  describe('updating with custom matcher', () => {
    it('should find element using custom match function', () => {
      (Editor.nodes as Mock).mockReturnValue([[mockElement, [0]]]);

      updateElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'code',
        match: (el) => el.props?.language === 'javascript',
        props: { language: 'go' },
      });

      expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
        at: mockSlate.selection,
        match: expect.any(Function),
        mode: 'highest',
      });
      expect(Transforms.setNodes).toHaveBeenCalled();
    });
  });

  describe('fallback when selection is null (unfocused block)', () => {
    it('should search entire document when slate has no selection', () => {
      mockSlate.selection = null;
      (Editor.nodes as Mock).mockReturnValue([[mockElement, [0]]]);

      updateElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'code',
        props: { language: 'rust' },
      });

      // Should search with at: [] (entire document)
      expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
        at: [],
        match: expect.any(Function),
        mode: 'highest',
      });
      expect(Transforms.setNodes).toHaveBeenCalledWith(
        mockSlate,
        { props: { language: 'rust', theme: 'github-dark', nodeType: 'block' } },
        { at: [0] },
      );
    });

    it('should try selection first, then fallback to full document search', () => {
      // Selection search returns nothing
      (Editor.nodes as Mock)
        .mockReturnValueOnce([]) // selection search: no results
        .mockReturnValueOnce([[mockElement, [0]]]); // full doc search: found

      updateElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'code',
        props: { theme: 'monokai' },
      });

      // First call: search at selection
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
      expect(Transforms.setNodes).toHaveBeenCalled();
    });
  });

  describe('inline elements', () => {
    let inlineElement: SlateElement;

    beforeEach(() => {
      inlineElement = {
        id: 'link-1',
        type: 'link',
        props: { url: 'https://example.com', target: '_blank', rel: 'noopener', nodeType: 'inline' },
        children: [{ text: 'click here' }],
      };

      editor.plugins = {
        ...editor.plugins,
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

    it('should use lowest mode for inline elements', () => {
      (findSlateBySelectionPath as Mock).mockReturnValue(mockSlate);
      (Editor.nodes as Mock).mockReturnValue([[inlineElement, [0, 1]]]);

      updateElement(editor as YooEditor, {
        blockId: 'block-2',
        type: 'link',
        props: { url: 'https://new-url.com' },
      });

      expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
        at: mockSlate.selection,
        match: expect.any(Function),
        mode: 'lowest',
      });
    });
  });

  describe('error cases', () => {
    it('should warn and return when block not found', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateElement(editor as YooEditor, {
        blockId: 'non-existent',
        type: 'code',
        props: { language: 'python' },
      });

      expect(warnSpy).toHaveBeenCalledWith('Block non-existent not found');
      expect(Transforms.setNodes).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn and return when slate not found', () => {
      (findSlateBySelectionPath as Mock).mockReturnValue(undefined);
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'code',
        props: { language: 'python' },
      });

      expect(warnSpy).toHaveBeenCalledWith('Slate editor not found for block block-1');
      expect(Transforms.setNodes).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn and return when plugin not found', () => {
      editor.plugins = {};
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'code',
        props: { language: 'python' },
      });

      expect(warnSpy).toHaveBeenCalledWith('Plugin Code not found');
      expect(Transforms.setNodes).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn and return when element type not in plugin', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'non-existent-element',
        props: { foo: 'bar' },
      });

      expect(warnSpy).toHaveBeenCalledWith('Element type non-existent-element not found in plugin Code');
      expect(Transforms.setNodes).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn when element not found in selection or document', () => {
      (Editor.nodes as Mock).mockReturnValue([]);
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'code',
        props: { language: 'python' },
      });

      expect(warnSpy).toHaveBeenCalledWith('Element of type code not found in current selection');
      expect(Transforms.setNodes).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn when element not found at provided path', () => {
      (Editor.node as Mock).mockImplementation(() => {
        throw new Error('Path does not exist');
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'code',
        path: [99],
        props: { language: 'python' },
      });

      expect(warnSpy).toHaveBeenCalledWith('Element not found at path 99');
      expect(Transforms.setNodes).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe('text update for inline elements', () => {
    it('should warn when trying to update text on block element', () => {
      (Editor.nodes as Mock).mockReturnValue([[mockElement, [0]]]);
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'code',
        text: 'new text',
      });

      expect(warnSpy).toHaveBeenCalledWith('Text option is only supported for inline elements');
      warnSpy.mockRestore();
    });
  });
});
