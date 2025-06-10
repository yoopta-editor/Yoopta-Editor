import { Ancestor, Editor, Element, Node, NodeEntry, Transforms } from 'slate';
import { vi } from 'vitest';
import { withAccordionListNormalize } from './withAccordionListNormalize';
import { SlateEditor, YooEditor } from '@yoopta/editor';
import { ACCORDION_ELEMENTS } from '../constants';

describe('withAccordionListNormalize', () => {
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

    // Mock Editor.isEditor
    vi.spyOn(Editor, 'isEditor').mockImplementation((node) => {
      return node && typeof node === 'object' && 'children' in node;
    });

    // Mock Element.isElement
    vi.spyOn(Element, 'isElement').mockImplementation((node) => {
      return node && typeof node === 'object' && 'type' in node;
    });

    // Mock Transforms.unwrapNodes
    vi.spyOn(Transforms, 'unwrapNodes').mockImplementation((editor, options) => {});
  });

  it('should not normalize if node is not an element', () => {
    const textNode = { text: 'test' };
    const normalize = withAccordionListNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([textNode, []]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([textNode, []]);
  });

  it('should not normalize if node is not an accordion list', () => {
    const paragraphNode = {
      id: '1',
      type: 'paragraph',
      children: [{ text: 'test' }],
    } as unknown as Ancestor;
    const normalize = withAccordionListNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([paragraphNode, []]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([paragraphNode, []]);
  });

  it('should unwrap accordion list if parent is an element', () => {
    const accordionList = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionList,
      children: [
        {
          id: '2',
          type: ACCORDION_ELEMENTS.AccordionListItem,
          children: [
            {
              id: '3',
              type: ACCORDION_ELEMENTS.AccordionListItemHeading,
              children: [{ text: 'Heading' }],
            },
            {
              id: '4',
              type: ACCORDION_ELEMENTS.AccordionListItemContent,
              children: [{ text: 'Content' }],
            },
          ],
        },
      ],
    } as unknown as Ancestor;

    const parentNode = {
      id: '5',
      type: 'paragraph',
      children: [accordionList],
    } as unknown as Ancestor;

    vi.spyOn(Editor, 'parent').mockImplementation((editor, path) => {
      return [parentNode, [0]] as NodeEntry<Ancestor>;
    });

    const normalize = withAccordionListNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([accordionList, [0, 0]]);

    expect(Transforms.unwrapNodes).toHaveBeenCalledWith(slate, {
      at: [0, 0],
    });
  });

  it('should not unwrap accordion list if parent is not an element type', () => {
    const accordionList = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionList,
      children: [
        {
          id: '2',
          type: ACCORDION_ELEMENTS.AccordionListItem,
          children: [
            {
              id: '3',
              type: ACCORDION_ELEMENTS.AccordionListItemHeading,
              children: [{ text: 'Heading' }],
            },
            {
              id: '4',
              type: ACCORDION_ELEMENTS.AccordionListItemContent,
              children: [{ text: 'Content' }],
            },
          ],
        },
      ],
    } as unknown as Ancestor;

    const parentNode = {
      id: '5',
      children: [accordionList],
    } as unknown as Ancestor;

    // Mock Editor.parent to return a non-element parent
    vi.spyOn(Editor, 'parent').mockImplementation((editor, path) => {
      return [parentNode, [0]] as NodeEntry<Ancestor>;
    });

    const normalize = withAccordionListNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([accordionList, [0, 0]]);

    expect(Transforms.unwrapNodes).not.toHaveBeenCalled();
    expect(originalNormalizeNode).toHaveBeenCalledWith([accordionList, [0, 0]]);
  });
});
