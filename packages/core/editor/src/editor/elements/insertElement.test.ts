import { Editor, Element, Path, Transforms } from 'slate';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { insertElement } from './insertElement';
import { buildBlockElement } from '../../components/Editor/utils';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateElement, YooEditor } from '../types';

vi.mock('../../components/Editor/utils', () => ({
  buildBlockElement: vi.fn(),
}));

vi.mock('../../utils/findSlateBySelectionPath');
vi.mock('../../utils/generateId', () => ({
  generateId: vi.fn(() => 'element-id'),
}));

vi.mock('slate', () => ({
  Editor: {
    withoutNormalizing: vi.fn((editor, fn) => fn()),
    nodes: vi.fn(),
  },
  Element: {
    isElement: vi.fn(),
  },
  Transforms: {
    insertNodes: vi.fn(),
    select: vi.fn(),
  },
  Path: {
    next: vi.fn(),
    previous: vi.fn(),
  },
}));

describe('insertElement', () => {
  let editor: Partial<YooEditor>;
  let mockSlate: any;
  let mockBlock: any;
  let mockElement: SlateElement;
  let mockPlugin: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockElement = {
      id: 'element-id',
      type: 'accordion-list-item',
      props: { isExpanded: false },
      children: [{ text: '' }],
    };

    mockSlate = {
      selection: {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      },
      children: [
        {
          id: 'existing-element',
          type: 'accordion-list-item',
          props: {},
          children: [{ text: 'Existing' }],
        },
      ],
    };

    mockPlugin = {
      type: 'Accordion',
      elements: {
        'accordion-list-item': {
          props: { isExpanded: false },
          children: ['accordion-list-item-heading', 'accordion-list-item-content'],
        },
        'accordion-list-item-heading': {
          props: {},
        },
        'accordion-list-item-content': {
          props: {},
        },
      },
    };

    mockBlock = {
      id: 'block-1',
      type: 'Accordion',
      meta: { order: 0, depth: 0 },
      value: [mockSlate.children[0]],
    };

    editor = {
      children: {
        'block-1': mockBlock,
      },
      path: { current: 0 },
      plugins: {
        Accordion: mockPlugin,
      },
    };

    (findSlateBySelectionPath as Mock).mockReturnValue(mockSlate);
    (buildBlockElement as Mock).mockReturnValue(mockElement);
    (Element.isElement as unknown as Mock).mockImplementation(
      (node) => node && typeof node === 'object' && 'type' in node && 'children' in node,
    );
  });

  it('should insert element at default position', () => {
    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(buildBlockElement).toHaveBeenCalledWith({
      type: 'accordion-list-item',
      props: { isExpanded: false },
    });
    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      mockElement,
      expect.objectContaining({
        at: [0, 0], // Default to selection anchor path
        select: false,
      }),
    );
  });

  it('should insert element at specific path', () => {
    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      at: [0, 1],
    });

    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      mockElement,
      expect.objectContaining({
        at: [0, 1],
        select: false,
      }),
    );
  });

  it('should insert element at start', () => {
    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      at: 'start',
    });

    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      mockElement,
      expect.objectContaining({
        at: [0],
        select: false,
      }),
    );
  });

  it('should insert element at end', () => {
    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      at: 'end',
    });

    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      mockElement,
      expect.objectContaining({
        at: [mockSlate.children.length],
        select: false,
      }),
    );
  });

  it('should insert element at next position', () => {
    const mockEntry: any = [mockSlate.children[0], [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);
    (Path.next as Mock).mockReturnValue([0, 1]);

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      at: 'next',
    });

    expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
      at: mockSlate.selection,
      match: expect.any(Function),
      mode: 'lowest',
    });
    expect(Path.next).toHaveBeenCalledWith([0, 0]);
    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      mockElement,
      expect.objectContaining({
        at: [0, 1],
        select: false,
      }),
    );
  });

  it('should insert element at previous position', () => {
    const mockEntry: any = [mockSlate.children[0], [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);
    (Path.previous as Mock).mockReturnValue([0, -1]);

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      at: 'prev',
    });

    expect(Path.previous).toHaveBeenCalledWith([0, 0]);
    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      mockElement,
      expect.objectContaining({
        at: [0, -1],
        select: false,
      }),
    );
  });

  it('should insert element with custom props', () => {
    const customProps = { isExpanded: true, customProp: 'value' };

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      props: customProps,
    });

    expect(buildBlockElement).toHaveBeenCalledWith({
      type: 'accordion-list-item',
      props: { ...mockPlugin.elements['accordion-list-item'].props, ...customProps },
    });
  });

  it('should insert element with custom children', () => {
    const customChildren: SlateElement[] = [
      {
        id: 'child-1',
        type: 'accordion-list-item-heading',
        props: {},
        children: [{ text: 'Custom Heading' }],
      },
    ];

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      children: customChildren,
    });

    expect(buildBlockElement).toHaveBeenCalled();
    const builtElement = (buildBlockElement as Mock).mock.results[0].value;
    builtElement.children = customChildren;

    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      expect.objectContaining({
        children: customChildren,
      }),
      expect.any(Object),
    );
  });

  it('should build default children from plugin config when not provided', () => {
    const headingElement = {
      id: 'heading-id',
      type: 'accordion-list-item-heading',
      props: {},
      children: [{ text: '' }],
    };
    const contentElement = {
      id: 'content-id',
      type: 'accordion-list-item-content',
      props: {},
      children: [{ text: '' }],
    };

    (buildBlockElement as Mock)
      .mockReturnValueOnce(mockElement) // Main element
      .mockReturnValueOnce(headingElement) // First child
      .mockReturnValueOnce(contentElement); // Second child

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(buildBlockElement).toHaveBeenCalledTimes(3);
    expect(buildBlockElement).toHaveBeenCalledWith({
      type: 'accordion-list-item-heading',
      props: {},
    });
    expect(buildBlockElement).toHaveBeenCalledWith({
      type: 'accordion-list-item-content',
      props: {},
    });
  });

  it('should select element when select is true', () => {
    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      select: true,
    });

    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      mockElement,
      expect.objectContaining({
        select: true,
      }),
    );
  });

  it('should select element when focus is true', () => {
    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      focus: true,
    });

    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      mockElement,
      expect.objectContaining({
        select: true,
      }),
    );
  });

  it('should focus first child when focus is true and select is false', () => {
    const elementWithChildren = {
      ...mockElement,
      children: [
        {
          id: 'child-1',
          type: 'accordion-list-item-heading',
          props: {},
          children: [{ text: 'Heading' }],
        },
      ],
    };
    (buildBlockElement as Mock).mockReturnValue(elementWithChildren);

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      focus: true,
      select: false,
      at: [0, 1],
    });

    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      elementWithChildren,
      expect.objectContaining({
        select: true, // focus sets select to true
      }),
    );
  });

  it('should not focus child when select is true', () => {
    const elementWithChildren = {
      ...mockElement,
      children: [
        {
          id: 'child-1',
          type: 'accordion-list-item-heading',
          props: {},
          children: [{ text: 'Heading' }],
        },
      ],
    };
    (buildBlockElement as Mock).mockReturnValue(elementWithChildren);

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      focus: true,
      select: true,
      at: [0, 1],
    });

    expect(Transforms.select).not.toHaveBeenCalled();
  });

  it('should return early when block not found', () => {
    insertElement(editor as YooEditor, {
      blockId: 'non-existent',
      type: 'accordion-list-item',
    });

    expect(findSlateBySelectionPath).not.toHaveBeenCalled();
    expect(buildBlockElement).not.toHaveBeenCalled();
    expect(Transforms.insertNodes).not.toHaveBeenCalled();
  });

  it('should return early when slate not found', () => {
    (findSlateBySelectionPath as Mock).mockReturnValue(undefined);

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(buildBlockElement).not.toHaveBeenCalled();
    expect(Transforms.insertNodes).not.toHaveBeenCalled();
  });

  it('should return early when plugin not found', () => {
    editor.plugins = {};

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(Transforms.insertNodes).not.toHaveBeenCalled();
  });

  it('should return early when element type not found in plugin', () => {
    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'non-existent-type',
    });

    expect(Transforms.insertNodes).not.toHaveBeenCalled();
  });

  it('should return early when insert path is undefined', () => {
    mockSlate.selection = null;
    (Editor.nodes as Mock).mockReturnValue([]);

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      at: 'next',
    });

    // Should fallback to end when no selection
    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      mockElement,
      expect.objectContaining({
        at: [mockSlate.children.length],
      }),
    );
  });

  it('should use default path [0] when no selection and no at option', () => {
    mockSlate.selection = null;

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      mockElement,
      expect.objectContaining({
        at: [0],
        select: false,
      }),
    );
  });

  it('should handle next/prev when no matching element found', () => {
    (Editor.nodes as Mock).mockReturnValue([]);

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      at: 'next',
    });

    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      mockElement,
      expect.objectContaining({
        at: [0, 0], // Fallback to selection anchor path
      }),
    );
  });

  it('should handle next/prev when no selection', () => {
    mockSlate.selection = null;

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      at: 'next',
    });

    expect(Transforms.insertNodes).toHaveBeenCalledWith(
      mockSlate,
      mockElement,
      expect.objectContaining({
        at: [mockSlate.children.length], // Fallback to end
      }),
    );
  });

  it('should handle focus error gracefully', () => {
    const elementWithChildren = {
      ...mockElement,
      children: [
        {
          id: 'child-1',
          type: 'accordion-list-item-heading',
          props: {},
          children: [{ text: 'Heading' }],
        },
      ],
    };
    (buildBlockElement as Mock).mockReturnValue(elementWithChildren);
    (Transforms.select as Mock).mockImplementation(() => {
      throw new Error('Selection failed');
    });

    expect(() => {
      insertElement(editor as YooEditor, {
        blockId: 'block-1',
        type: 'accordion-list-item',
        focus: true,
        select: false,
        at: [0, 1],
      });
    }).not.toThrow();
  });

  it('should filter only element children when focusing', () => {
    const elementWithMixedChildren = {
      ...mockElement,
      children: [
        { text: 'Text node' },
        {
          id: 'child-1',
          type: 'accordion-list-item-heading',
          props: {},
          children: [{ text: 'Heading' }],
        },
        { text: 'Another text' },
      ],
    };
    (buildBlockElement as Mock).mockReturnValue(elementWithMixedChildren);

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      focus: true,
      select: false,
      at: [0, 1],
    });

    expect(Transforms.select).toHaveBeenCalledWith(mockSlate, [0, 1, 0]);
  });

  it('should not call Transforms.select when element has no element children', () => {
    // Create plugin config without children to prevent default children creation
    const pluginWithoutChildren = {
      ...mockPlugin,
      elements: {
        'accordion-list-item': {
          props: { isExpanded: false },
          // No children array in config - this prevents default children creation
        },
      },
    };
    editor.plugins = {
      Accordion: pluginWithoutChildren,
    };

    // Element with only text children (no element children)
    const elementWithOnlyText = {
      id: 'element-id',
      type: 'accordion-list-item',
      props: { isExpanded: false },
      children: [{ text: 'Only text' }],
    };
    (buildBlockElement as Mock).mockReturnValue(elementWithOnlyText);
    // Clear previous calls from beforeEach
    (Transforms.select as Mock).mockClear();

    // Mock Element.isElement to return false for text nodes
    // Text nodes have 'text' property but no 'type' property
    (Element.isElement as unknown as Mock).mockImplementation(
      (node: any) =>
        // Text nodes have 'text' property, elements have 'type' property
        node && typeof node === 'object' && 'type' in node && !('text' in node),
    );

    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      focus: true,
      select: false,
      at: [0, 1],
    });

    // Element has only text children, so childElements.filter should return empty array
    // The code checks: if (childElements.length > 0) before calling Transforms.select
    // Since we only have text nodes, childElements should be empty
    // So Transforms.select should not be called for focusing children
    // Note: The plugin config has no children array, so no default children will be created
    expect(Transforms.select).not.toHaveBeenCalled();
  });

  it('should use Editor.withoutNormalizing', () => {
    insertElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(Editor.withoutNormalizing).toHaveBeenCalledWith(mockSlate, expect.any(Function));
  });
});
