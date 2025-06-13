import { Ancestor, Editor, Element, Node, NodeEntry, Transforms } from 'slate';
import { vi } from 'vitest';
import { withAccordionListItemNormalize } from './withAccordionListItemNormalize';
import { SlateEditor, YooEditor } from '@yoopta/editor';
import { ACCORDION_ELEMENTS } from '../constants';

describe('withAccordionListItemNormalize', () => {
  let editor: Partial<YooEditor>;
  let slate: Partial<SlateEditor>;
  let originalNormalizeNode: any;

  beforeEach(() => {
    originalNormalizeNode = vi.fn();
    slate = {
      normalizeNode: originalNormalizeNode,
      children: [],
    };
    editor = {
      path: { current: 0 },
    };

    vi.spyOn(Editor, 'isEditor').mockImplementation((node) => {
      return node && typeof node === 'object' && 'children' in node;
    });

    vi.spyOn(Element, 'isElement').mockImplementation((node) => {
      return node && typeof node === 'object' && 'type' in node;
    });

    vi.spyOn(Transforms, 'unwrapNodes').mockImplementation((editor, options) => {});

    vi.spyOn(Transforms, 'setNodes').mockImplementation((editor, props, options) => {});

    vi.spyOn(Transforms, 'removeNodes').mockImplementation((editor, options) => {});

    vi.spyOn(Editor, 'nodes').mockImplementation(function* (editor, options) {
      return;
    });

    vi.spyOn(Editor, 'hasPath').mockImplementation((editor, path) => {
      return true;
    });
  });

  it('should not normalize if node is not an element', () => {
    const textNode = { text: 'test' };
    const normalize = withAccordionListItemNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([textNode, []]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([textNode, []]);
  });

  it('should not normalize if node is not an accordion list item', () => {
    const paragraphNode = {
      id: '1',
      type: 'paragraph',
      children: [{ text: 'test' }],
    } as unknown as Ancestor;
    const normalize = withAccordionListItemNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([paragraphNode, []]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([paragraphNode, []]);
  });

  it('should unwrap accordion list item if parent is not an accordion list', () => {
    const accordionListItem = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionListItem,
      children: [
        {
          id: '2',
          type: ACCORDION_ELEMENTS.AccordionListItemHeading,
          children: [{ text: 'Heading' }],
        },
        {
          id: '3',
          type: ACCORDION_ELEMENTS.AccordionListItemContent,
          children: [{ text: 'Content' }],
        },
      ],
    } as unknown as Ancestor;

    const parentNode = {
      id: '4',
      type: 'paragraph',
      children: [accordionListItem],
    } as unknown as Ancestor;

    vi.spyOn(Editor, 'parent').mockImplementation((editor, path) => {
      return [parentNode, [0]] as NodeEntry<Ancestor>;
    });

    const normalize = withAccordionListItemNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([accordionListItem, [0, 0]]);

    expect(Transforms.unwrapNodes).toHaveBeenCalledWith(slate, {
      at: [0, 0],
    });
  });

  it('should not unwrap accordion list item if parent is an accordion list', () => {
    const accordionListItem = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionListItem,
      children: [
        {
          id: '2',
          type: ACCORDION_ELEMENTS.AccordionListItemHeading,
          children: [{ text: 'Heading' }],
        },
        {
          id: '3',
          type: ACCORDION_ELEMENTS.AccordionListItemContent,
          children: [{ text: 'Content' }],
        },
      ],
    } as unknown as Ancestor;

    const parentNode = {
      id: '4',
      type: ACCORDION_ELEMENTS.AccordionList,
      children: [accordionListItem],
    } as unknown as Ancestor;

    // Mock Editor.parent to return the parent node
    vi.spyOn(Editor, 'parent').mockImplementation((editor, path) => {
      return [parentNode, [0]] as NodeEntry<Ancestor>;
    });

    const normalize = withAccordionListItemNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([accordionListItem, [0, 0]]);

    expect(Transforms.unwrapNodes).not.toHaveBeenCalled();
  });

  it('should normalize first child to heading if it is not', () => {
    const accordionListItem = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionListItem,
      children: [
        {
          id: '2',
          type: 'paragraph',
          children: [{ text: 'Heading' }],
        },
        {
          id: '3',
          type: ACCORDION_ELEMENTS.AccordionListItemContent,
          children: [{ text: 'Content' }],
        },
      ],
    } as unknown as Ancestor;

    const parentNode = {
      id: '4',
      type: ACCORDION_ELEMENTS.AccordionList,
      children: [accordionListItem],
    } as unknown as Ancestor;

    vi.spyOn(Editor, 'parent').mockImplementation((editor, path) => {
      return [parentNode, [0]] as NodeEntry<Ancestor>;
    });

    vi.spyOn(Editor, 'nodes').mockImplementation(function* (editor, options) {
      yield [accordionListItem.children[0], [0, 0]];
      yield [accordionListItem.children[1], [0, 1]];
    });

    const normalize = withAccordionListItemNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([accordionListItem, [0]]);

    expect(Transforms.setNodes).toHaveBeenCalledWith(
      slate,
      expect.objectContaining({
        type: ACCORDION_ELEMENTS.AccordionListItemHeading,
      }),
      { at: [0, 0] },
    );
  });

  it('should normalize second child to content if it is not', () => {
    const accordionListItem = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionListItem,
      children: [
        {
          id: '2',
          type: ACCORDION_ELEMENTS.AccordionListItemHeading,
          children: [{ text: 'Heading' }],
        },
        {
          id: '3',
          type: 'paragraph',
          children: [{ text: 'Content' }],
        },
      ],
    } as unknown as Ancestor;

    const parentNode = {
      id: '4',
      type: ACCORDION_ELEMENTS.AccordionList,
      children: [accordionListItem],
    } as unknown as Ancestor;

    vi.spyOn(Editor, 'parent').mockImplementation((editor, path) => {
      return [parentNode, [0]] as NodeEntry<Ancestor>;
    });

    vi.spyOn(Editor, 'nodes').mockImplementation(function* (editor, options) {
      yield [accordionListItem.children[0], [0, 0]];
      yield [accordionListItem.children[1], [0, 1]];
    });

    const normalize = withAccordionListItemNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([accordionListItem, [0]]);

    expect(Transforms.setNodes).toHaveBeenCalledWith(
      slate,
      expect.objectContaining({
        type: ACCORDION_ELEMENTS.AccordionListItemContent,
      }),
      { at: [0, 1] },
    );
  });

  it('should remove extra children beyond the first two', () => {
    const accordionListItem = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionListItem,
      children: [
        {
          id: '2',
          type: ACCORDION_ELEMENTS.AccordionListItemHeading,
          children: [{ text: 'Heading 1' }],
        },
        {
          id: '3',
          type: ACCORDION_ELEMENTS.AccordionListItemContent,
          children: [{ text: 'Content 1' }],
        },
        {
          id: '4',
          type: ACCORDION_ELEMENTS.AccordionListItemHeading,
          children: [{ text: 'Heading 2' }],
        },
        {
          id: '5',
          type: ACCORDION_ELEMENTS.AccordionListItemContent,
          children: [{ text: 'Content 2' }],
        },
      ],
    } as unknown as Ancestor;

    const parentNode = {
      id: '6',
      type: ACCORDION_ELEMENTS.AccordionList,
      children: [accordionListItem],
    } as unknown as Ancestor;

    vi.spyOn(Editor, 'parent').mockImplementation((editor, path) => {
      return [parentNode, [0]] as NodeEntry<Ancestor>;
    });

    vi.spyOn(Editor, 'nodes').mockImplementation(function* (editor, options) {
      yield [accordionListItem.children[0], [0, 0]];
      yield [accordionListItem.children[1], [0, 1]];
      yield [accordionListItem.children[2], [0, 2]];
      yield [accordionListItem.children[3], [0, 3]];
    });

    const normalize = withAccordionListItemNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([accordionListItem, [0]]);

    expect(Transforms.removeNodes).toHaveBeenCalledTimes(2);
    expect(Transforms.removeNodes).toHaveBeenNthCalledWith(1, slate, { at: [0, 2] });
    expect(Transforms.removeNodes).toHaveBeenNthCalledWith(2, slate, { at: [0, 3] });
  });
});
