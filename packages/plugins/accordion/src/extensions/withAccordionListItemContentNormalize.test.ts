import { Ancestor, Descendant, Editor, Element, Node, NodeEntry, Transforms } from 'slate';
import { vi } from 'vitest';
import { withAccordionListItemContentNormalize } from './withAccordionListItemContentNormalize';
import { SlateEditor, YooEditor } from '@yoopta/editor';
import { ACCORDION_ELEMENTS } from '../constants';

describe('withAccordionListItemContentNormalize', () => {
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

    vi.spyOn(Transforms, 'mergeNodes').mockImplementation((editor, options) => {
      console.log('Transforms.mergeNodes called with:', options);
    });

    vi.spyOn(Editor, 'next').mockImplementation((editor, options) => {
      return undefined;
    });
  });

  it('should not normalize if node is not an element', () => {
    const textNode = { text: 'test' };
    const normalize = withAccordionListItemContentNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([textNode, []]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([textNode, []]);
  });

  it('should not normalize if node is not an accordion list item content', () => {
    const paragraphNode = {
      id: '1',
      type: 'paragraph',
      children: [{ text: 'test' }],
    } as unknown as Ancestor;
    const normalize = withAccordionListItemContentNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([paragraphNode, []]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([paragraphNode, []]);
  });

  it('should merge with next sibling if it is also content', () => {
    const contentNode = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionListItemContent,
      children: [{ text: 'Content 1' }],
    } as unknown as Descendant;

    const nextSiblingNode = {
      id: '2',
      type: ACCORDION_ELEMENTS.AccordionListItemContent,
      children: [{ text: 'Content 2' }],
    } as unknown as Descendant;

    vi.spyOn(Editor, 'next').mockImplementation((editor, options) => {
      return [nextSiblingNode, [0, 1]] as NodeEntry<Descendant>;
    });

    const normalize = withAccordionListItemContentNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([contentNode, [0, 0]]);

    expect(Transforms.mergeNodes).toHaveBeenCalledWith(slate, {
      at: [0, 1],
      match: expect.any(Function),
    });
  });

  it('should not merge with next sibling if it is not content', () => {
    const contentNode = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionListItemContent,
      children: [{ text: 'Content 1' }],
    } as unknown as Descendant;

    const nextSiblingNode = {
      id: '2',
      type: 'paragraph',
      children: [{ text: 'Content 2' }],
    } as unknown as Descendant;

    vi.spyOn(Editor, 'next').mockImplementation((editor, options) => {
      return [nextSiblingNode, [0, 1]] as NodeEntry<Descendant>;
    });

    const normalize = withAccordionListItemContentNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([contentNode, [0, 0]]);

    expect(Transforms.mergeNodes).not.toHaveBeenCalled();
  });

  it('should not merge if there is no next sibling', () => {
    const contentNode = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionListItemContent,
      children: [{ text: 'Content 1' }],
    } as unknown as Descendant;

    vi.spyOn(Editor, 'next').mockImplementation((editor, options) => {
      return undefined;
    });

    const normalize = withAccordionListItemContentNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([contentNode, [0, 0]]);

    expect(Transforms.mergeNodes).not.toHaveBeenCalled();
  });
});
