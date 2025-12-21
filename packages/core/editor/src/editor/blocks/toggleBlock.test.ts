import { Editor, Transforms } from 'slate';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  buildBlockElementsStructure,
  getAllowedPluginsFromElement,
} from '../../utils/block-elements';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import { y } from '../elements/create-element-structure';
import type { SlateEditor, SlateElement, YooEditor } from '../types';
import { toggleBlock } from './toggleBlock';

vi.mock('../../utils/block-elements', () => ({
  buildBlockElementsStructure: vi.fn(),
  getAllowedPluginsFromElement: vi.fn(),
}));

vi.mock('../../utils/findSlateBySelectionPath', () => ({
  findSlateBySelectionPath: vi.fn(),
}));

vi.mock('../../utils/generateId', () => ({
  generateId: vi.fn(() => 'new-block-id'),
}));

vi.mock('../elements/create-element-structure', () => ({
  y: vi.fn(),
}));

vi.mock('slate', () => ({
  Editor: {
    isEditor: vi.fn(),
    isInline: vi.fn(),
    string: vi.fn(),
    above: vi.fn(),
    start: vi.fn(),
    end: vi.fn(),
  },
  Element: {
    isElement: vi.fn(),
  },
  Text: {
    isText: vi.fn(),
  },
  Transforms: {
    select: vi.fn(),
    delete: vi.fn(),
    insertNodes: vi.fn(),
    removeNodes: vi.fn(),
  },
}));

describe('toggleBlock', () => {
  let editor: Partial<YooEditor>;
  let mockSlate: Partial<SlateEditor>;
  let mockParagraphStructure: SlateElement;
  let mockHeadingStructure: SlateElement;

  beforeEach(() => {
    vi.clearAllMocks();

    mockParagraphStructure = {
      id: 'paragraph-id',
      type: 'paragraph',
      children: [{ text: '' }],
    };

    mockHeadingStructure = {
      id: 'heading-id',
      type: 'heading-one',
      children: [{ text: '' }],
    };

    mockSlate = {
      selection: {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      },
      children: [
        {
          id: 'current-element',
          type: 'paragraph',
          children: [{ text: 'Hello world' }],
        } as SlateElement,
      ],
    };

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
        HeadingOne: {
          type: 'HeadingOne',
          elements: {
            'heading-one': {
              asRoot: true,
              render: vi.fn(),
              props: {},
            },
          },
          lifecycle: {},
        },
      },
      children: {
        'block-id': {
          id: 'block-id',
          type: 'Paragraph',
          value: [mockParagraphStructure],
          meta: {
            order: 0,
            depth: 0,
          },
        },
      },
      applyTransforms: vi.fn(),
      focusBlock: vi.fn(),
    };

    (buildBlockElementsStructure as Mock).mockImplementation((_editor, type) => {
      if (type === 'Paragraph') return mockParagraphStructure;
      if (type === 'HeadingOne') return mockHeadingStructure;
      return mockParagraphStructure;
    });

    (findSlateBySelectionPath as Mock).mockReturnValue(mockSlate);
    (getAllowedPluginsFromElement as Mock).mockReturnValue(null);
    (Editor.isEditor as unknown as Mock).mockReturnValue(false);
    (Editor.isInline as unknown as Mock).mockReturnValue(false);
  });

  describe('Block scope', () => {
    it('should toggle block from Paragraph to HeadingOne', () => {
      const blockId = toggleBlock(editor as YooEditor, 'HeadingOne', {
        scope: 'block',
        preserveContent: false,
      });

      expect(blockId).toBe('new-block-id');
      expect(editor.applyTransforms).toHaveBeenCalledWith([
        {
          type: 'toggle_block',
          prevProperties: {
            sourceBlock: editor.children?.['block-id'],
            sourceSlateValue: mockSlate.children,
          },
          properties: {
            toggledBlock: expect.objectContaining({
              id: 'new-block-id',
              type: 'HeadingOne',
            }),
            toggledSlateValue: expect.any(Array),
          },
        },
      ]);
    });

    it('should preserve content when preserveContent is true', () => {
      (Editor.isEditor as unknown as Mock).mockReturnValue(false);
      (Editor.isInline as unknown as Mock).mockReturnValue(false);

      const blockId = toggleBlock(editor as YooEditor, 'HeadingOne', {
        scope: 'block',
        preserveContent: true,
      });

      expect(blockId).toBe('new-block-id');
      expect(editor.applyTransforms).toHaveBeenCalled();

      const operations = (editor.applyTransforms as Mock).mock.calls[0][0];
      const toggledBlock = operations[0].properties.toggledBlock;

      // Verify structure was created
      expect(toggledBlock.type).toBe('HeadingOne');
    });

    it('should toggle back to Paragraph when toggling to same type', () => {
      toggleBlock(editor as YooEditor, 'Paragraph', {
        scope: 'block',
      });

      const operations = (editor.applyTransforms as Mock).mock.calls[0][0];
      const toggledBlock = operations[0].properties.toggledBlock;

      expect(toggledBlock.type).toBe('Paragraph');
    });

    it('should focus block when focus option is true', () => {
      const blockId = toggleBlock(editor as YooEditor, 'HeadingOne', {
        scope: 'block',
        focus: true,
      });

      expect(editor.focusBlock).toHaveBeenCalledWith(blockId);
    });

    it('should use custom elements structure when provided', () => {
      const customStructure: SlateElement = {
        id: 'custom-id',
        type: 'heading-one',
        children: [{ text: 'Custom' }],
      };

      toggleBlock(editor as YooEditor, 'HeadingOne', {
        scope: 'block',
        elements: customStructure,
      });

      const operations = (editor.applyTransforms as Mock).mock.calls[0][0];
      const toggledBlock = operations[0].properties.toggledBlock;

      expect(toggledBlock.value[0]).toEqual(customStructure);
    });

    it('should call beforeCreate lifecycle event if available', () => {
      const beforeCreate = vi.fn().mockReturnValue(mockHeadingStructure);
      editor.plugins!.HeadingOne.lifecycle = { beforeCreate };

      toggleBlock(editor as YooEditor, 'HeadingOne', {
        scope: 'block',
      });

      expect(beforeCreate).toHaveBeenCalledWith(editor);
    });

    it('should throw error if block not found', () => {
      if (editor.children) {
        editor.children = {};
      }

      expect(() => {
        toggleBlock(editor as YooEditor, 'HeadingOne', {
          scope: 'block',
        });
      }).toThrow('Block not found at current selection');
    });

    it('should throw error if slate not found', () => {
      (findSlateBySelectionPath as Mock).mockReturnValue(null);

      expect(() => {
        toggleBlock(editor as YooEditor, 'HeadingOne', {
          scope: 'block',
        });
      }).toThrow('Slate not found for block in position 0');
    });
  });

  describe('Element scope', () => {
    describe('Element without allowedPlugins', () => {
      beforeEach(() => {
        // Setup for element without allowedPlugins (should be replaced)
        (getAllowedPluginsFromElement as Mock).mockReturnValue(['Paragraph', 'HeadingOne']);
        (y as Mock).mockReturnValue(mockParagraphStructure);

        (Editor.above as Mock).mockReturnValue([
          {
            id: 'current-element',
            type: 'simple-element', // Element without allowedPlugins
            children: [{ text: 'Hello' }],
          },
          [0],
        ]);

        // Mock plugin configuration - element WITHOUT allowedPlugins
        editor.plugins = {
          ...editor.plugins,
          TestPlugin: {
            type: 'TestPlugin',
            elements: {
              'simple-element': {
                render: vi.fn(),
                props: {},
                // No allowedPlugins - should be replaced
              },
            },
            lifecycle: {},
          },
        };

        editor.children = {
          'block-id': {
            id: 'block-id',
            type: 'TestPlugin',
            value: [],
            meta: { order: 0, depth: 0 },
          },
        };
      });

      it('should replace element without allowedPlugins', () => {
        toggleBlock(editor as YooEditor, 'Paragraph', {
          scope: 'element',
          preserveContent: false,
        });

        // Should remove the element and insert new one at same position
        expect(Transforms.removeNodes).toHaveBeenCalledWith(mockSlate, { at: [0] });
        expect(Transforms.insertNodes).toHaveBeenCalledWith(
          mockSlate,
          mockParagraphStructure,
          expect.objectContaining({
            at: [0],
            select: true,
          }),
        );
      });

      it('should preserve content when preserveContent is true', () => {
        (Editor.isEditor as unknown as Mock).mockReturnValue(false);
        (Editor.isInline as unknown as Mock).mockReturnValue(false);

        toggleBlock(editor as YooEditor, 'Paragraph', {
          scope: 'element',
          preserveContent: true,
        });

        // Should remove old element and insert new one with content
        expect(Transforms.removeNodes).toHaveBeenCalledWith(mockSlate, { at: [0] });
        expect(Transforms.insertNodes).toHaveBeenCalled();
      });

      it('should use custom elements structure', () => {
        const customStructure: SlateElement = {
          id: 'custom-id',
          type: 'paragraph',
          children: [{ text: 'Custom' }],
        };

        toggleBlock(editor as YooEditor, 'Paragraph', {
          scope: 'element',
          elements: customStructure,
        });

        expect(Transforms.insertNodes).toHaveBeenCalledWith(
          mockSlate,
          customStructure,
          expect.any(Object),
        );
      });
    });

    describe('Element with allowedPlugins', () => {
      beforeEach(() => {
        // Setup for element with allowedPlugins (e.g., callout, accordion-list-item-heading)
        (getAllowedPluginsFromElement as Mock).mockReturnValue(['Paragraph', 'HeadingOne']);
        (y as Mock).mockReturnValue(mockParagraphStructure);

        (Editor.above as Mock).mockReturnValue([
          {
            id: 'callout-element',
            type: 'callout',
            children: [{ text: 'Hello' }],
          },
          [0],
        ]);

        // Mock plugin configuration - element WITH allowedPlugins
        editor.plugins = {
          ...editor.plugins,
          Callout: {
            type: 'Callout',
            elements: {
              callout: {
                asRoot: true,
                render: vi.fn(),
                props: {},
                allowedPlugins: ['Paragraph', 'HeadingOne'], // Has allowedPlugins
              },
            },
            lifecycle: {},
          },
        };

        editor.children = {
          'block-id': {
            id: 'block-id',
            type: 'Callout',
            value: [],
            meta: { order: 0, depth: 0 },
          },
        };
      });

      it('should insert element inside element with allowedPlugins, not replace it', () => {
        const calloutElement = {
          id: 'callout-element',
          type: 'callout',
          children: [{ text: 'Hello' }],
        };

        (Editor.above as Mock).mockReturnValue([calloutElement, [0]]);

        toggleBlock(editor as YooEditor, 'Paragraph', {
          scope: 'element',
          preserveContent: false,
        });

        // Should remove children of root element
        expect(Transforms.removeNodes).toHaveBeenCalledWith(mockSlate, { at: [0, 0] });

        // Should insert new element INSIDE root element
        expect(Transforms.insertNodes).toHaveBeenCalledWith(
          mockSlate,
          mockParagraphStructure,
          expect.objectContaining({
            at: [0, 0], // Inside the root element
            select: true,
          }),
        );
      });

      it('should preserve content when inserting inside element with allowedPlugins', () => {
        (Editor.isEditor as unknown as Mock).mockReturnValue(false);
        (Editor.isInline as unknown as Mock).mockReturnValue(false);

        const calloutElement = {
          id: 'callout-element',
          type: 'callout',
          children: [{ text: 'Hello world' }],
        };

        (Editor.above as Mock).mockReturnValue([calloutElement, [0]]);

        toggleBlock(editor as YooEditor, 'Paragraph', {
          scope: 'element',
          preserveContent: true,
        });

        // Should remove children and insert new element with content
        expect(Transforms.removeNodes).toHaveBeenCalled();
        expect(Transforms.insertNodes).toHaveBeenCalledWith(
          mockSlate,
          expect.any(Object),
          expect.objectContaining({
            at: [0, 0],
            select: true,
          }),
        );
      });

      it('should insert inside accordion-list-item-heading with allowedPlugins', () => {
        const accordionHeadingElement = {
          id: 'accordion-heading',
          type: 'accordion-list-item-heading',
          children: [{ text: 'Heading text' }],
        };

        (Editor.above as Mock).mockReturnValue([accordionHeadingElement, [0, 0]]);

        // Mock Accordion plugin with allowedPlugins on heading element
        editor.plugins = {
          ...editor.plugins,
          Accordion: {
            type: 'Accordion',
            elements: {
              'accordion-list-item-heading': {
                render: vi.fn(),
                props: {},
                allowedPlugins: ['Paragraph', 'HeadingOne'], // Has allowedPlugins
              },
            },
            lifecycle: {},
          },
        };

        editor.children = {
          'block-id': {
            id: 'block-id',
            type: 'Accordion',
            value: [],
            meta: { order: 0, depth: 0 },
          },
        };

        toggleBlock(editor as YooEditor, 'HeadingOne', {
          scope: 'element',
          preserveContent: false,
        });

        // Should insert inside accordion-list-item-heading, not replace it
        expect(Transforms.removeNodes).toHaveBeenCalledWith(mockSlate, { at: [0, 0, 0] });
        expect(Transforms.insertNodes).toHaveBeenCalledWith(
          mockSlate,
          mockParagraphStructure,
          expect.objectContaining({
            at: [0, 0, 0], // Inside the heading element
            select: true,
          }),
        );
      });
    });

    it('should throw error if no selection in element scope', () => {
      mockSlate.selection = null;
      // Mock allowedPlugins so scope stays as 'element'
      (getAllowedPluginsFromElement as Mock).mockReturnValue(['Paragraph', 'HeadingOne']);

      expect(() => {
        toggleBlock(editor as YooEditor, 'Paragraph', {
          scope: 'element',
        });
      }).toThrow('No selection found');
    });

    it('should throw error if plugin not found in element scope', () => {
      expect(() => {
        toggleBlock(editor as YooEditor, 'NonExistentPlugin', {
          scope: 'element',
        });
      }).toThrow('Plugin "NonExistentPlugin" not found');
    });
  });

  describe('Auto scope', () => {
    it('should automatically detect block scope when no allowedPlugins', () => {
      (getAllowedPluginsFromElement as Mock).mockReturnValue(null);

      toggleBlock(editor as YooEditor, 'HeadingOne', {
        scope: 'auto',
      });

      expect(editor.applyTransforms).toHaveBeenCalled();
      const operations = (editor.applyTransforms as Mock).mock.calls[0][0];
      expect(operations[0].type).toBe('toggle_block');
    });

    it('should fallback to block scope when scope="element" but no allowedPlugins', () => {
      (getAllowedPluginsFromElement as Mock).mockReturnValue(null);

      toggleBlock(editor as YooEditor, 'HeadingOne', {
        scope: 'element',
      });

      // Should use block scope (applyTransforms) instead of element scope (Transforms)
      expect(editor.applyTransforms).toHaveBeenCalled();
      const operations = (editor.applyTransforms as Mock).mock.calls[0][0];
      expect(operations[0].type).toBe('toggle_block');
    });

    it('should automatically detect element scope when allowedPlugins present', () => {
      (getAllowedPluginsFromElement as Mock).mockReturnValue(['Paragraph']);
      (y as Mock).mockReturnValue(mockParagraphStructure);

      const leafElement = {
        id: 'leaf-element',
        type: 'accordion-list-item-content',
        children: [{ text: '' }],
      };

      (Editor.above as Mock).mockReturnValue([leafElement, [0]]);

      // Mock as leaf element
      editor.plugins = {
        ...editor.plugins,
        Accordion: {
          type: 'Accordion',
          elements: {
            'accordion-list-item-content': {
              asRoot: false,
              render: vi.fn(),
              props: {},
            },
          },
          lifecycle: {},
        },
      };

      editor.children = {
        'block-id': {
          id: 'block-id',
          type: 'Accordion',
          value: [],
          meta: { order: 0, depth: 0 },
        },
      };

      toggleBlock(editor as YooEditor, 'Paragraph', {
        scope: 'auto',
      });

      expect(Transforms.removeNodes).toHaveBeenCalled();
      expect(Transforms.insertNodes).toHaveBeenCalled();
    });

    it('should find allowedPlugins from parent when current element has none (nested case)', () => {
      // Simulate: Steps > step-list-item-content (has allowedPlugins) > blockquote (no allowedPlugins)
      // When cursor is on blockquote, should find allowedPlugins from parent
      (getAllowedPluginsFromElement as Mock).mockReturnValue(['Paragraph', 'HeadingOne']);
      (y as Mock).mockReturnValue(mockParagraphStructure);

      const blockquoteElement = {
        id: 'blockquote-element',
        type: 'blockquote',
        children: [{ text: 'Text' }],
      };

      (Editor.above as Mock).mockReturnValue([blockquoteElement, [0, 0, 1]]);

      editor.plugins = {
        ...editor.plugins,
        Steps: {
          type: 'Steps',
          elements: {
            'step-list-item-content': {
              render: vi.fn(),
              props: {},
              allowedPlugins: ['Paragraph', 'HeadingOne'], // Parent has allowedPlugins
            },
          },
          lifecycle: {},
        },
        Blockquote: {
          type: 'Blockquote',
          elements: {
            blockquote: {
              render: vi.fn(),
              props: {},
              // No allowedPlugins
            },
          },
          lifecycle: {},
        },
      };

      editor.children = {
        'block-id': {
          id: 'block-id',
          type: 'Steps',
          value: [],
          meta: { order: 0, depth: 0 },
        },
      };

      toggleBlock(editor as YooEditor, 'Paragraph', {
        scope: 'auto',
      });

      // Should use element scope (replace blockquote with paragraph inside step-list-item-content)
      expect(Transforms.removeNodes).toHaveBeenCalled();
      expect(Transforms.insertNodes).toHaveBeenCalled();
    });

    it('should default to auto scope when scope not specified', () => {
      (getAllowedPluginsFromElement as Mock).mockReturnValue(null);

      toggleBlock(editor as YooEditor, 'HeadingOne');

      expect(editor.applyTransforms).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle block at specific position', () => {
      if (editor.children) {
        editor.children = {
          'block-0': {
            id: 'block-0',
            type: 'Paragraph',
            value: [mockParagraphStructure],
            meta: { order: 0, depth: 0 },
          },
          'block-1': {
            id: 'block-1',
            type: 'Paragraph',
            value: [mockParagraphStructure],
            meta: { order: 1, depth: 0 },
          },
        };
      }

      toggleBlock(editor as YooEditor, 'HeadingOne', {
        at: 1,
        scope: 'block',
      });

      expect(findSlateBySelectionPath).toHaveBeenCalledWith(editor, { at: 1 });
    });

    it('should handle empty text nodes', () => {
      mockSlate.children = [
        {
          id: 'empty-element',
          type: 'paragraph',
          children: [{ text: '' }],
        } as SlateElement,
      ];

      toggleBlock(editor as YooEditor, 'HeadingOne', {
        scope: 'block',
        preserveContent: true,
      });

      expect(editor.applyTransforms).toHaveBeenCalled();
    });

    it('should handle deeply nested text nodes', () => {
      mockSlate.children = [
        {
          id: 'nested',
          type: 'blockquote',
          children: [
            {
              id: 'inner',
              type: 'paragraph',
              children: [{ text: 'Nested text' }],
            } as SlateElement,
          ],
        } as SlateElement,
      ];

      (Editor.isEditor as unknown as Mock).mockReturnValue(false);
      (Editor.isInline as unknown as Mock).mockReturnValue(false);

      toggleBlock(editor as YooEditor, 'HeadingOne', {
        scope: 'block',
        preserveContent: true,
      });

      expect(editor.applyTransforms).toHaveBeenCalled();
    });
  });
});
