import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { clearDeserializeCache, deserializeHTML } from './deserializeHTML';
import type { SlateElement, YooEditor } from '../editor/types';
import type { Plugin } from '../plugins/types';
import { getRootBlockElementType } from '../utils/block-elements';

vi.mock('../editor/blocks', () => ({
  Blocks: {
    buildBlockData: vi.fn((data) => data),
  },
}));

vi.mock('../utils/block-elements', () => ({
  getRootBlockElementType: vi.fn(() => 'paragraph'),
}));

vi.mock('../utils/generateId', () => ({
  generateId: vi.fn(() => 'test-id'),
}));

// Helper to create HTML element from string
function createHTML(html: string): HTMLElement {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild as HTMLElement;
}

// Helper to create a mock editor
function createMockEditor(plugins: Record<string, Partial<Plugin<Record<string, SlateElement>>>> = {}): YooEditor {
  const defaultPlugins: Record<string, Partial<Plugin<Record<string, SlateElement>>>> = {
    Paragraph: {
      type: 'Paragraph',
      elements: {
        paragraph: {
          render: vi.fn(),
          props: { nodeType: 'block' },
        },
      },
      parsers: {
        html: {
          deserialize: {
            nodeNames: ['P', 'DIV'],
          },
        },
      },
    },
    HeadingOne: {
      type: 'HeadingOne',
      elements: {
        'heading-one': {
          render: vi.fn(),
          props: { nodeType: 'block' },
        },
      },
      parsers: {
        html: {
          deserialize: {
            nodeNames: ['H1'],
          },
        },
      },
    },
    HeadingTwo: {
      type: 'HeadingTwo',
      elements: {
        'heading-two': {
          render: vi.fn(),
          props: { nodeType: 'block' },
        },
      },
      parsers: {
        html: {
          deserialize: {
            nodeNames: ['H2'],
          },
        },
      },
    },
    Blockquote: {
      type: 'Blockquote',
      elements: {
        blockquote: {
          render: vi.fn(),
          props: { nodeType: 'block' },
        },
      },
      parsers: {
        html: {
          deserialize: {
            nodeNames: ['BLOCKQUOTE'],
          },
        },
      },
    },
    ...plugins,
  };

  return {
    id: 'test-editor',
    plugins: defaultPlugins,
  } as unknown as YooEditor;
}

describe('deserializeHTML', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getRootBlockElementType as Mock).mockReturnValue('paragraph');
  });

  describe('basic text deserialization', () => {
    it('should deserialize plain text inside a paragraph', () => {
      const editor = createMockEditor();
      const html = createHTML('<p>Hello world</p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('Paragraph');
      expect(result[0].value[0].children).toEqual([{ text: 'Hello world' }]);
    });

    it('should handle empty paragraph', () => {
      const editor = createMockEditor();
      const html = createHTML('<p></p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([{ text: '' }]);
    });

    it('should handle BR tags as newlines', () => {
      const editor = createMockEditor();
      const html = createHTML('<p>Line 1<br>Line 2</p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([
        { text: 'Line 1' },
        { text: '\n' },
        { text: 'Line 2' },
      ]);
    });

    it('should normalize whitespace in text', () => {
      const editor = createMockEditor();
      const html = createHTML('<p>Text\n\t  with\r\n  whitespace</p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      // Whitespace chars are replaced with single space
      expect(result[0].value[0].children[0].text).toContain('Text');
    });
  });

  describe('marks deserialization', () => {
    it('should deserialize bold text (B tag)', () => {
      const editor = createMockEditor();
      const html = createHTML('<p><b>Bold text</b></p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([{ text: 'Bold text', bold: true }]);
    });

    it('should deserialize bold text (STRONG tag)', () => {
      const editor = createMockEditor();
      const html = createHTML('<p><strong>Strong text</strong></p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([{ text: 'Strong text', bold: true }]);
    });

    it('should deserialize italic text (I tag)', () => {
      const editor = createMockEditor();
      const html = createHTML('<p><i>Italic text</i></p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([{ text: 'Italic text', italic: true }]);
    });

    it('should deserialize italic text (EM tag)', () => {
      const editor = createMockEditor();
      const html = createHTML('<p><em>Emphasis text</em></p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([{ text: 'Emphasis text', italic: true }]);
    });

    it('should deserialize underline text', () => {
      const editor = createMockEditor();
      const html = createHTML('<p><u>Underline text</u></p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([{ text: 'Underline text', underline: true }]);
    });

    it('should deserialize strikethrough text', () => {
      const editor = createMockEditor();
      const html = createHTML('<p><s>Strikethrough text</s></p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([{ text: 'Strikethrough text', strike: true }]);
    });

    it('should deserialize code text', () => {
      const editor = createMockEditor();
      const html = createHTML('<p><code>Code text</code></p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([{ text: 'Code text', code: true }]);
    });

    it('should deserialize nested marks', () => {
      const editor = createMockEditor();
      const html = createHTML('<p><b><i>Bold and italic</i></b></p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([
        { text: 'Bold and italic', bold: true, italic: true },
      ]);
    });

    it('should deserialize mixed content with marks', () => {
      const editor = createMockEditor();
      const html = createHTML('<p>Normal <b>bold</b> normal</p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([
        { text: 'Normal ' },
        { text: 'bold', bold: true },
        { text: ' normal' },
      ]);
    });

    it('should deserialize highlight with color', () => {
      const editor = createMockEditor();
      const html = createHTML('<p><mark style="color: red">Highlighted</mark></p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([
        { text: 'Highlighted', highlight: { color: 'red' } },
      ]);
    });

    it('should deserialize highlight without color', () => {
      const editor = createMockEditor();
      const html = createHTML('<p><mark>Highlighted</mark></p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([{ text: 'Highlighted', highlight: {} }]);
    });
  });

  describe('block types deserialization', () => {
    it('should deserialize H1 as HeadingOne', () => {
      const editor = createMockEditor();
      (getRootBlockElementType as Mock).mockReturnValue('heading-one');

      const html = createHTML('<h1>Heading 1</h1>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('HeadingOne');
    });

    it('should deserialize H2 as HeadingTwo', () => {
      const editor = createMockEditor();
      (getRootBlockElementType as Mock).mockReturnValue('heading-two');

      const html = createHTML('<h2>Heading 2</h2>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('HeadingTwo');
    });

    it('should deserialize BLOCKQUOTE', () => {
      const editor = createMockEditor();
      (getRootBlockElementType as Mock).mockReturnValue('blockquote');

      const html = createHTML('<blockquote>Quote text</blockquote>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('Blockquote');
    });

    it('should deserialize multiple blocks', () => {
      // Create editor without DIV as valid node to test multiple P tags
      const editor = createMockEditor();
      delete (editor.plugins.Paragraph.parsers?.html?.deserialize as { nodeNames?: string[] })
        ?.nodeNames;
      (editor.plugins.Paragraph.parsers!.html!.deserialize!.nodeNames as string[]) = ['P'];
      clearDeserializeCache(editor);

      const container = document.createElement('section');
      container.innerHTML = '<p>Paragraph 1</p><p>Paragraph 2</p>';

      const result = deserializeHTML(editor, container);

      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('Paragraph');
      expect(result[1].type).toBe('Paragraph');
    });
  });

  describe('block metadata', () => {
    it('should parse data-meta-align attribute', () => {
      const editor = createMockEditor();
      const html = createHTML('<p data-meta-align="center">Centered text</p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].meta.align).toBe('center');
    });

    it('should parse data-meta-depth attribute', () => {
      const editor = createMockEditor();
      const html = createHTML('<p data-meta-depth="2">Nested text</p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].meta.depth).toBe(2);
    });

    it('should default to depth 0 for invalid depth', () => {
      const editor = createMockEditor();
      const html = createHTML('<p data-meta-depth="invalid">Text</p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].meta.depth).toBe(0);
    });

    it('should ignore invalid align values', () => {
      const editor = createMockEditor();
      const html = createHTML('<p data-meta-align="invalid">Text</p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].meta.align).toBeUndefined();
    });

    it('should accept valid align values', () => {
      const editor = createMockEditor();

      const alignments = ['left', 'center', 'right'];
      for (const align of alignments) {
        const html = createHTML(`<p data-meta-align="${align}">Text</p>`);
        const result = deserializeHTML(editor, html);
        expect(result[0].meta.align).toBe(align);
        clearDeserializeCache(editor);
      }
    });
  });

  describe('custom plugin parsers', () => {
    it('should use custom parse function from plugin', () => {
      const customParse = vi.fn().mockReturnValue({
        id: 'custom-id',
        type: 'custom-element',
        children: [{ text: 'Custom content' }],
        props: { nodeType: 'block' },
      });

      const editor = createMockEditor({
        CustomBlock: {
          type: 'CustomBlock',
          elements: {
            'custom-element': {
              render: vi.fn(),
              props: { nodeType: 'block' },
            },
          },
          parsers: {
            html: {
              deserialize: {
                nodeNames: ['CUSTOM'],
                parse: customParse,
              },
            },
          },
        },
      });

      (getRootBlockElementType as Mock).mockReturnValue('custom-element');

      const html = createHTML('<custom>Custom content</custom>');
      deserializeHTML(editor, html);

      expect(customParse).toHaveBeenCalled();
    });

    it('should handle plugin returning inline element', () => {
      const editor = createMockEditor({
        Link: {
          type: 'Link',
          elements: {
            link: {
              render: vi.fn(),
              props: { nodeType: 'inline' },
            },
          },
          parsers: {
            html: {
              deserialize: {
                nodeNames: ['A'],
                parse: (el) => ({
                  id: 'link-id',
                  type: 'link',
                  children: [{ text: el.textContent ?? '' }],
                  props: {
                    nodeType: 'inline',
                    url: el.getAttribute('href'),
                  },
                }),
              },
            },
          },
        },
      });

      const html = createHTML('<p><a href="https://example.com">Link text</a></p>');
      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
    });

    it('should skip block if parse returns undefined', () => {
      const editor = createMockEditor({
        Conditional: {
          type: 'Conditional',
          elements: {
            conditional: {
              render: vi.fn(),
              props: { nodeType: 'block' },
            },
          },
          parsers: {
            html: {
              deserialize: {
                nodeNames: ['SPAN'],
                parse: () => undefined, // Skip this element
              },
            },
          },
        },
      });

      const html = createHTML('<p><span>Should be skipped</span></p>');
      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('Paragraph');
    });
  });

  describe('multiple plugins for same node name', () => {
    it('should try all plugins for same node name', () => {
      const parse1 = vi.fn().mockReturnValue(undefined);
      const parse2 = vi.fn().mockReturnValue({
        id: 'custom-id',
        type: 'custom',
        children: [{ text: 'Custom' }],
        props: { nodeType: 'block' },
      });

      const editor = createMockEditor({
        Plugin1: {
          type: 'Plugin1',
          elements: {
            element1: {
              render: vi.fn(),
              props: { nodeType: 'block' },
            },
          },
          parsers: {
            html: {
              deserialize: {
                nodeNames: ['SPAN'],
                parse: parse1,
              },
            },
          },
        },
        Plugin2: {
          type: 'Plugin2',
          elements: {
            element2: {
              render: vi.fn(),
              props: { nodeType: 'block' },
            },
          },
          parsers: {
            html: {
              deserialize: {
                nodeNames: ['SPAN'],
                parse: parse2,
              },
            },
          },
        },
      });

      const html = createHTML('<span>Test</span>');
      deserializeHTML(editor, html);

      expect(parse1).toHaveBeenCalled();
      expect(parse2).toHaveBeenCalled();
    });

    it('should fall through to children when all plugins return undefined', () => {
      // Simulate multiple plugins (like Carousel, Steps, Tabs) that all register DIV
      // but only match specific data attributes
      const parse1 = vi.fn().mockReturnValue(undefined);
      const parse2 = vi.fn().mockReturnValue(undefined);

      // Create editor without DIV in Paragraph to isolate the test
      const editor = createMockEditor();
      (editor.plugins.Paragraph.parsers!.html!.deserialize!.nodeNames as string[]) = ['P'];
      clearDeserializeCache(editor);

      // Add two plugins that both handle SECTION but return undefined
      editor.plugins.Plugin1 = {
        type: 'Plugin1',
        elements: {
          element1: {
            render: vi.fn(),
            props: { nodeType: 'block' },
          },
        },
        parsers: {
          html: {
            deserialize: {
              nodeNames: ['SECTION'],
              parse: parse1,
            },
          },
        },
      } as unknown as Plugin<Record<string, SlateElement>>;

      editor.plugins.Plugin2 = {
        type: 'Plugin2',
        elements: {
          element2: {
            render: vi.fn(),
            props: { nodeType: 'block' },
          },
        },
        parsers: {
          html: {
            deserialize: {
              nodeNames: ['SECTION'],
              parse: parse2,
            },
          },
        },
      } as unknown as Plugin<Record<string, SlateElement>>;

      clearDeserializeCache(editor);

      // SECTION contains a P - when both plugins return undefined, should fall through to P
      const html = createHTML('<section><p>Inner paragraph</p></section>');
      const result = deserializeHTML(editor, html);

      expect(parse1).toHaveBeenCalled();
      expect(parse2).toHaveBeenCalled();
      // Should fall through and return the inner paragraph block
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('Paragraph');
      expect(result[0].value[0].children).toEqual([{ text: 'Inner paragraph' }]);
    });

    it('should preserve nested block elements when container plugins return undefined', () => {
      // Create editor with proper heading support
      const editor = createMockEditor();
      (editor.plugins.Paragraph.parsers!.html!.deserialize!.nodeNames as string[]) = ['P'];

      // Add a plugin for HEADER that returns undefined (like many wrapper elements)
      editor.plugins.HeaderWrapper = {
        type: 'HeaderWrapper',
        elements: {
          header: {
            render: vi.fn(),
            props: { nodeType: 'block' },
          },
        },
        parsers: {
          html: {
            deserialize: {
              nodeNames: ['HEADER'],
              parse: () => undefined, // Always returns undefined
            },
          },
        },
      } as unknown as Plugin<Record<string, SlateElement>>;

      clearDeserializeCache(editor);

      // Mock different root element types for different plugins
      (getRootBlockElementType as Mock).mockImplementation((elements) => {
        if (elements?.['heading-one']) return 'heading-one';
        if (elements?.['heading-two']) return 'heading-two';
        return 'paragraph';
      });

      const container = document.createElement('div');
      container.innerHTML = '<header><h1>Main Title</h1><p>Subtitle</p></header>';

      const result = deserializeHTML(editor, container);

      // Should get both H1 and P blocks, not wrapped in HEADER
      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('HeadingOne');
      expect(result[1].type).toBe('Paragraph');
    });
  });

  describe('void elements', () => {
    it('should handle void elements with empty children', () => {
      const editor = createMockEditor({
        Image: {
          type: 'Image',
          elements: {
            image: {
              render: vi.fn(),
              props: { nodeType: 'void' },
            },
          },
          parsers: {
            html: {
              deserialize: {
                nodeNames: ['IMG'],
                parse: (el) => ({
                  id: 'img-id',
                  type: 'image',
                  children: [{ text: '' }],
                  props: {
                    nodeType: 'void',
                    src: el.getAttribute('src'),
                  },
                }),
              },
            },
          },
        },
      });

      (getRootBlockElementType as Mock).mockReturnValue('image');

      const html = createHTML('<img src="test.jpg" />');
      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('Image');
    });
  });

  describe('cache functionality', () => {
    it('should cache plugins map for editor', () => {
      const editor = createMockEditor();

      // First call
      const html1 = createHTML('<p>Test 1</p>');
      deserializeHTML(editor, html1);

      // Second call should use cached map
      const html2 = createHTML('<p>Test 2</p>');
      deserializeHTML(editor, html2);

      // The plugins should only be processed once due to caching
      // We verify by checking that the results are consistent
      expect(deserializeHTML(editor, html1)).toEqual(deserializeHTML(editor, createHTML('<p>Test 1</p>')));
    });

    it('should clear cache when clearDeserializeCache is called', () => {
      const editor = createMockEditor();

      const html = createHTML('<p>Test</p>');
      deserializeHTML(editor, html);

      // Clear cache
      clearDeserializeCache(editor);

      // Should work normally after cache clear
      const result = deserializeHTML(editor, html);
      expect(result).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('should handle empty HTML', () => {
      // Use a tag that is NOT mapped to any plugin
      const editor = createMockEditor();
      const html = document.createElement('section');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(0);
    });

    it('should handle text-only content without block wrapper', () => {
      // Use a tag that is NOT mapped to any plugin
      const editor = createMockEditor();
      const container = document.createElement('section');
      container.textContent = 'Plain text';

      const result = deserializeHTML(editor, container);

      // Plain text without block wrapper should not create blocks
      expect(result).toHaveLength(0);
    });

    it('should handle deeply nested content', () => {
      const editor = createMockEditor();
      const html = createHTML('<p><b><i><u>Deeply nested</u></i></b></p>');

      const result = deserializeHTML(editor, html);

      expect(result).toHaveLength(1);
      expect(result[0].value[0].children).toEqual([
        { text: 'Deeply nested', bold: true, italic: true, underline: true },
      ]);
    });

    it('should handle unknown node names gracefully', () => {
      const editor = createMockEditor();
      const html = createHTML('<unknown-tag>Unknown content</unknown-tag>');

      const result = deserializeHTML(editor, html);

      // Unknown tags are ignored, no blocks created
      expect(result).toHaveLength(0);
    });

    it('should handle comment nodes', () => {
      const editor = createMockEditor();
      const container = document.createElement('div');
      container.innerHTML = '<p>Text</p><!-- comment -->';

      const result = deserializeHTML(editor, container);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('Paragraph');
    });

    it('should handle plugin without elements gracefully', () => {
      const editor = createMockEditor({
        NoElements: {
          type: 'NoElements',
          parsers: {
            html: {
              deserialize: {
                nodeNames: ['SPECIAL'],
              },
            },
          },
        } as unknown as Partial<Plugin<Record<string, SlateElement>>>,
      });

      const html = createHTML('<special>Content</special>');
      const result = deserializeHTML(editor, html);

      // Should not crash, just return empty
      expect(result).toHaveLength(0);
    });

    it('should preserve correct block types for mixed semantic elements', () => {
      // Create editor without DIV as paragraph matcher
      const editor = createMockEditor();
      (editor.plugins.Paragraph.parsers!.html!.deserialize!.nodeNames as string[]) = ['P'];
      clearDeserializeCache(editor);

      // Mock different root element types for different plugins
      (getRootBlockElementType as Mock).mockImplementation((elements) => {
        if (elements?.['heading-one']) return 'heading-one';
        if (elements?.['heading-two']) return 'heading-two';
        if (elements?.blockquote) return 'blockquote';
        return 'paragraph';
      });

      const container = document.createElement('article');
      container.innerHTML = `
        <h1>Main Heading</h1>
        <p>First paragraph</p>
        <h2>Subheading</h2>
        <p>Second paragraph</p>
        <blockquote>A quote</blockquote>
      `;

      const result = deserializeHTML(editor, container);

      expect(result).toHaveLength(5);
      expect(result[0].type).toBe('HeadingOne');
      expect(result[1].type).toBe('Paragraph');
      expect(result[2].type).toBe('HeadingTwo');
      expect(result[3].type).toBe('Paragraph');
      expect(result[4].type).toBe('Blockquote');
    });

    it('should handle semantic elements nested in unknown containers', () => {
      // Create editor without DIV as paragraph matcher
      const editor = createMockEditor();
      (editor.plugins.Paragraph.parsers!.html!.deserialize!.nodeNames as string[]) = ['P'];
      clearDeserializeCache(editor);

      (getRootBlockElementType as Mock).mockImplementation((elements) => {
        if (elements?.['heading-one']) return 'heading-one';
        return 'paragraph';
      });

      // MAIN and ARTICLE are not registered - should fall through to children
      const container = document.createElement('div');
      container.innerHTML = `
        <main>
          <article>
            <h1>Title</h1>
            <p>Content</p>
          </article>
        </main>
      `;

      const result = deserializeHTML(editor, container);

      // Should extract the H1 and P from inside nested containers
      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('HeadingOne');
      expect(result[1].type).toBe('Paragraph');
    });

    it('should not create duplicate blocks when content is nested multiple levels', () => {
      const editor = createMockEditor();
      (editor.plugins.Paragraph.parsers!.html!.deserialize!.nodeNames as string[]) = ['P'];
      clearDeserializeCache(editor);

      const container = document.createElement('div');
      container.innerHTML = '<section><div><p>Only one paragraph</p></div></section>';

      const result = deserializeHTML(editor, container);

      // Should only create one paragraph, not duplicates from each wrapper level
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('Paragraph');
      expect(result[0].value[0].children).toEqual([{ text: 'Only one paragraph' }]);
    });

    it('should handle multiple DIV plugins that all return undefined for generic divs', () => {
      const editor = createMockEditor();
      // Remove DIV from Paragraph
      (editor.plugins.Paragraph.parsers!.html!.deserialize!.nodeNames as string[]) = ['P'];

      // Add plugins that handle DIV but only for specific attributes (like Carousel, Tabs, etc.)
      editor.plugins.Carousel = {
        type: 'Carousel',
        elements: {
          carousel: {
            render: vi.fn(),
            props: { nodeType: 'block' },
          },
        },
        parsers: {
          html: {
            deserialize: {
              nodeNames: ['DIV'],
              parse: (el) => {
                // Only match if it has data-carousel attribute
                if (el.getAttribute('data-carousel')) {
                  return {
                    id: 'carousel-id',
                    type: 'carousel',
                    children: [{ text: '' }],
                    props: { nodeType: 'void' },
                  };
                }
                return undefined;
              },
            },
          },
        },
      } as unknown as Plugin<Record<string, SlateElement>>;

      editor.plugins.Tabs = {
        type: 'Tabs',
        elements: {
          tabs: {
            render: vi.fn(),
            props: { nodeType: 'block' },
          },
        },
        parsers: {
          html: {
            deserialize: {
              nodeNames: ['DIV'],
              parse: (el) => {
                // Only match if it has data-tabs attribute
                if (el.getAttribute('data-tabs')) {
                  return {
                    id: 'tabs-id',
                    type: 'tabs',
                    children: [{ text: '' }],
                    props: { nodeType: 'void' },
                  };
                }
                return undefined;
              },
            },
          },
        },
      } as unknown as Plugin<Record<string, SlateElement>>;

      clearDeserializeCache(editor);

      (getRootBlockElementType as Mock).mockImplementation((elements) => {
        if (elements?.['heading-one']) return 'heading-one';
        return 'paragraph';
      });

      // Generic DIVs without special attributes should fall through to children
      const container = document.createElement('div');
      container.innerHTML = `
        <div class="wrapper">
          <h1>Title</h1>
          <div class="content">
            <p>Paragraph inside generic div</p>
          </div>
        </div>
      `;

      const result = deserializeHTML(editor, container);

      // Should extract H1 and P, not create empty blocks for the wrapper divs
      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('HeadingOne');
      expect(result[1].type).toBe('Paragraph');
    });
  });
});

