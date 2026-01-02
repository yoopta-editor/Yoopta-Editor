import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildBlockElementsStructure } from './block-elements';
import { buildSlateEditor } from './build-slate';
import { buildBlockSlateEditors, buildCommands, buildMarks, buildPlugins } from './editor-builders';
import { getValue } from '../editor/textFormats/getValue';
import { isActive } from '../editor/textFormats/isActive';
import { toggle } from '../editor/textFormats/toggle';
import { update } from '../editor/textFormats/update';
import type { YooEditor } from '../editor/types';
import type { YooptaMark } from '../marks';
import type { Plugin } from '../plugins/types';

vi.mock('./block-elements');
vi.mock('./build-slate');
vi.mock('../editor/textFormats/getValue');
vi.mock('../editor/textFormats/isActive');
vi.mock('../editor/textFormats/toggle');
vi.mock('../editor/textFormats/update');

describe('editor-builders', () => {
  describe('buildMarks', () => {
    let mockEditor: Partial<YooEditor>;
    let mockMarks: YooptaMark<any>[];

    beforeEach(() => {
      mockEditor = {};
      mockMarks = [
        {
          type: 'bold',
          hotkey: 'mod+b',
          render: vi.fn(),
        },
        {
          type: 'italic',
          hotkey: 'mod+i',
          render: vi.fn(),
        },
      ];

      (getValue as Mock).mockReturnValue(null);
      (isActive as Mock).mockReturnValue(false);
      (toggle as Mock).mockReturnValue(undefined);
      (update as Mock).mockReturnValue(undefined);
    });

    it('should build formats from marks', () => {
      const formats = buildMarks(mockEditor, mockMarks);

      expect(formats).toHaveProperty('bold');
      expect(formats).toHaveProperty('italic');
      expect(formats.bold.type).toBe('bold');
      expect(formats.bold.hotkey).toBe('mod+b');
      expect(formats.italic.type).toBe('italic');
      expect(formats.italic.hotkey).toBe('mod+i');
    });

    it('should create getValue function for each mark', () => {
      const formats = buildMarks(mockEditor, mockMarks);

      formats.bold.getValue();
      expect(getValue).toHaveBeenCalledWith(mockEditor, 'bold');
    });

    it('should create isActive function for each mark', () => {
      const formats = buildMarks(mockEditor, mockMarks);

      formats.bold.isActive();
      expect(isActive).toHaveBeenCalledWith(mockEditor, 'bold');
    });

    it('should create toggle function for each mark', () => {
      const formats = buildMarks(mockEditor, mockMarks);

      formats.bold.toggle();
      expect(toggle).toHaveBeenCalledWith(mockEditor, 'bold');
    });

    it('should create update function for each mark', () => {
      const formats = buildMarks(mockEditor, mockMarks);
      const props = { color: 'red' };

      formats.bold.update(props);
      expect(update).toHaveBeenCalledWith(mockEditor, 'bold', props);
    });

    it('should handle empty marks array', () => {
      const formats = buildMarks(mockEditor, []);

      expect(Object.keys(formats)).toHaveLength(0);
    });
  });

  describe('buildBlockSlateEditors', () => {
    let mockEditor: Partial<YooEditor>;

    beforeEach(() => {
      mockEditor = {
        children: {
          'block-1': {
            id: 'block-1',
            type: 'Paragraph',
            value: [],
            meta: { order: 0, depth: 0 },
          },
          'block-2': {
            id: 'block-2',
            type: 'Heading',
            value: [],
            meta: { order: 1, depth: 0 },
          },
        },
      };

      (buildBlockElementsStructure as Mock).mockReturnValue({
        id: 'element-id',
        type: 'paragraph',
        children: [{ text: '' }],
      });
    });

    it('should create slate editor for each block', () => {
      // Each call should return a new slate editor
      (buildSlateEditor as Mock).mockImplementation(() => ({
        children: [],
      }));

      const blockEditorsMap = buildBlockSlateEditors(mockEditor as YooEditor);

      expect(blockEditorsMap).toHaveProperty('block-1');
      expect(blockEditorsMap).toHaveProperty('block-2');
      expect(buildSlateEditor).toHaveBeenCalledTimes(2);
    });

    it('should initialize empty slate editors with block structure', () => {
      // Each call should return a new slate editor with empty children
      (buildSlateEditor as Mock).mockImplementation(() => ({
        children: [],
      }));

      buildBlockSlateEditors(mockEditor as YooEditor);

      expect(buildBlockElementsStructure).toHaveBeenCalledWith(mockEditor, 'Paragraph');
      expect(buildBlockElementsStructure).toHaveBeenCalledWith(mockEditor, 'Heading');
    });

    it('should not initialize slate editor if it already has children', () => {
      vi.clearAllMocks();

      // Return slate editors that already have children
      (buildSlateEditor as Mock).mockImplementation(() => ({
        children: [{ id: 'existing', type: 'paragraph', children: [{ text: '' }] }],
      }));

      buildBlockSlateEditors(mockEditor as YooEditor);

      expect(buildBlockElementsStructure).not.toHaveBeenCalled();
    });

    it('should handle editor with no children', () => {
      mockEditor.children = {};

      const blockEditorsMap = buildBlockSlateEditors(mockEditor as YooEditor);

      expect(Object.keys(blockEditorsMap)).toHaveLength(0);
    });
  });

  describe('buildPlugins', () => {
    it('should mark single-element plugin as root', () => {
      const plugins: Plugin<any>[] = [
        {
          type: 'Paragraph',
          elements: {
            paragraph: {
              render: vi.fn(),
              props: {},
            },
          },
        },
      ];

      const result = buildPlugins(plugins);

      expect(result.Paragraph.elements.paragraph.asRoot).toBe(true);
    });

    it('should not mark inline elements as root', () => {
      const plugins: Plugin<any>[] = [
        {
          type: 'Link',
          elements: {
            link: {
              render: vi.fn(),
              props: { nodeType: 'inline' },
            },
          },
        },
      ];

      const result = buildPlugins(plugins);

      expect(result.Link.elements.link.asRoot).toBeUndefined();
    });

    it('should collect inline elements across all plugins', () => {
      const plugins: Plugin<any>[] = [
        {
          type: 'Link',
          elements: {
            link: {
              render: vi.fn(),
              props: { nodeType: 'inline' },
            },
          },
        },
        {
          type: 'Paragraph',
          elements: {
            paragraph: {
              render: vi.fn(),
              props: {},
            },
          },
        },
      ];

      const result = buildPlugins(plugins);

      // Link element should be added to Paragraph plugin
      expect(result.Paragraph.elements).toHaveProperty('link');
      expect((result.Paragraph.elements as any).link.rootPlugin).toBe('Link');
    });

    it('should extend plugin with injectElementsFromPlugins elements', () => {
      const plugins: Plugin<any>[] = [
        {
          type: 'Callout',
          elements: {
            callout: {
              render: vi.fn(),
              props: {},
              asRoot: true,
              injectElementsFromPlugins: ['Paragraph'],
            },
          },
        },
        {
          type: 'Paragraph',
          elements: {
            paragraph: {
              render: vi.fn(),
              props: {},
              asRoot: true,
            },
          },
        },
      ];

      const result = buildPlugins(plugins);

      // Callout should have paragraph element from injectElementsFromPlugins
      expect(result.Callout.elements).toHaveProperty('paragraph');
      expect((result.Callout.elements as any).paragraph.rootPlugin).toBe('Paragraph');
    });

    it('should remove asRoot from nested elements', () => {
      const plugins: Plugin<any>[] = [
        {
          type: 'Callout',
          elements: {
            callout: {
              render: vi.fn(),
              props: {},
              asRoot: true,
              injectElementsFromPlugins: ['Paragraph'],
            },
          },
        },
        {
          type: 'Paragraph',
          elements: {
            paragraph: {
              render: vi.fn(),
              props: {},
              asRoot: true,
            },
          },
        },
      ];

      const result = buildPlugins(plugins);

      // Nested paragraph should NOT have asRoot
      expect((result.Callout.elements as any).paragraph.asRoot).toBeUndefined();
    });

    it('should filter out self-references in injectElementsFromPlugins', () => {
      const plugins: Plugin<any>[] = [
        {
          type: 'Accordion',
          elements: {
            'accordion-list': {
              render: vi.fn(),
              props: {},
              asRoot: true,
              children: ['accordion-list-item'] as any,
            },
            'accordion-list-item': {
              render: vi.fn(),
              props: {},
              children: ['accordion-list-item-content'] as any,
            },
            'accordion-list-item-content': {
              render: vi.fn(),
              props: {},
              injectElementsFromPlugins: ['Accordion', 'Paragraph'], // Self-reference + valid plugin
            },
          },
        },
        {
          type: 'Paragraph',
          elements: {
            paragraph: {
              render: vi.fn(),
              props: {},
              asRoot: true,
            },
          },
        },
      ];

      const result = buildPlugins(plugins);

      // Should have paragraph but NOT accordion-list (self-reference filtered out)
      expect(result.Accordion.elements).toHaveProperty('paragraph');

      // Count how many times 'accordion-list' appears (should be only once - the original)
      const accordionListCount = Object.keys(result.Accordion.elements).filter(
        (key) => key === 'accordion-list',
      ).length;
      expect(accordionListCount).toBe(1);
    });

    it('should add children elements from injectElementsFromPlugins', () => {
      const plugins: Plugin<any>[] = [
        {
          type: 'Callout',
          elements: {
            callout: {
              render: vi.fn(),
              props: {},
              asRoot: true,
              injectElementsFromPlugins: ['Accordion'],
            },
          },
        },
        {
          type: 'Accordion',
          elements: {
            'accordion-list': {
              render: vi.fn(),
              props: {},
              asRoot: true,
              children: ['accordion-list-item'] as any,
            },
            'accordion-list-item': {
              render: vi.fn(),
              props: {},
            },
          },
        },
      ];

      const result = buildPlugins(plugins);

      // Callout should have both accordion-list and accordion-list-item
      expect(result.Callout.elements).toHaveProperty('accordion-list');
      expect(result.Callout.elements).toHaveProperty('accordion-list-item');
      expect(result.Callout.elements['accordion-list-item'].rootPlugin).toBe('Accordion');
    });

    it('should handle plugins without elements', () => {
      const plugins: Plugin<any>[] = [
        {
          type: 'NoElements',
        } as any,
      ];

      const result = buildPlugins(plugins);

      expect(result.NoElements).toBeDefined();
      expect(result.NoElements.elements).toBeUndefined();
    });

    it('should not add duplicate elements', () => {
      const plugins: Plugin<any>[] = [
        {
          type: 'Container',
          elements: {
            container: {
              render: vi.fn(),
              props: {},
              asRoot: true,
              injectElementsFromPlugins: ['Paragraph', 'Paragraph'], // Duplicate
            },
          },
        },
        {
          type: 'Paragraph',
          elements: {
            paragraph: {
              render: vi.fn(),
              props: {},
              asRoot: true,
            },
          },
        },
      ];

      const result = buildPlugins(plugins);

      // Count how many times paragraph appears
      const paragraphKeys = Object.keys(result.Container.elements).filter(
        (key) => key === 'paragraph',
      );
      expect(paragraphKeys).toHaveLength(1);
    });

    it('should handle multiple plugins with injectElementsFromPlugins', () => {
      const plugins: Plugin<any>[] = [
        {
          type: 'Callout',
          elements: {
            callout: {
              render: vi.fn(),
              props: {},
              asRoot: true,
              injectElementsFromPlugins: ['Paragraph'],
            },
          },
        },
        {
          type: 'Accordion',
          elements: {
            'accordion-list': {
              render: vi.fn(),
              props: {},
              asRoot: true,
              injectElementsFromPlugins: ['Paragraph'],
            },
          },
        },
        {
          type: 'Paragraph',
          elements: {
            paragraph: {
              render: vi.fn(),
              props: {},
              asRoot: true,
            },
          },
        },
      ];

      const result = buildPlugins(plugins);

      // Both Callout and Accordion should have paragraph
      expect(result.Callout.elements).toHaveProperty('paragraph');
      expect(result.Accordion.elements).toHaveProperty('paragraph');
    });
  });

  describe('buildCommands', () => {
    let mockEditor: Partial<YooEditor>;

    beforeEach(() => {
      mockEditor = {
        id: 'test-editor',
      };
    });

    it('should build commands from plugins', () => {
      const mockCommand1 = vi.fn();
      const mockCommand2 = vi.fn();

      const plugins: Plugin<any>[] = [
        {
          type: 'Paragraph',
          elements: {},
          commands: {
            insertParagraph: mockCommand1,
            updateParagraph: mockCommand2,
          },
        },
      ];

      const commands = buildCommands(mockEditor as YooEditor, plugins);

      expect(commands).toHaveProperty('insertParagraph');
      expect(commands).toHaveProperty('updateParagraph');
    });

    it('should bind editor to command functions', () => {
      const mockCommand = vi.fn();

      const plugins: Plugin<any>[] = [
        {
          type: 'Paragraph',
          elements: {},
          commands: {
            insertParagraph: mockCommand,
          },
        },
      ];

      const commands = buildCommands(mockEditor as YooEditor, plugins);
      const arg1 = 'test';
      const arg2 = { value: 123 };

      commands.insertParagraph(arg1, arg2);

      expect(mockCommand).toHaveBeenCalledWith(mockEditor, arg1, arg2);
    });

    it('should handle plugins without commands', () => {
      const plugins: Plugin<any>[] = [
        {
          type: 'Paragraph',
          elements: {},
        },
      ];

      const commands = buildCommands(mockEditor as YooEditor, plugins);

      expect(Object.keys(commands)).toHaveLength(0);
    });

    it('should merge commands from multiple plugins', () => {
      const mockCommand1 = vi.fn();
      const mockCommand2 = vi.fn();

      const plugins: Plugin<any>[] = [
        {
          type: 'Paragraph',
          elements: {},
          commands: {
            insertParagraph: mockCommand1,
          },
        },
        {
          type: 'Heading',
          elements: {},
          commands: {
            insertHeading: mockCommand2,
          },
        },
      ];

      const commands = buildCommands(mockEditor as YooEditor, plugins);

      expect(commands).toHaveProperty('insertParagraph');
      expect(commands).toHaveProperty('insertHeading');
    });

    it('should handle empty plugins array', () => {
      const commands = buildCommands(mockEditor as YooEditor, []);

      expect(Object.keys(commands)).toHaveLength(0);
    });
  });
});
