import { Ancestor, Descendant, Editor, Element, Node, NodeEntry, Transforms } from 'slate';
import { vi } from 'vitest';
import { withAccordionListItemHeadingNormalize } from './withAccordionListItemHeadingNormalize';
import { SlateEditor, YooEditor } from '@yoopta/editor';
import { ACCORDION_ELEMENTS } from '../constants';

describe('withAccordionListItemHeadingNormalize', () => {
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

    vi.spyOn(Transforms, 'setNodes').mockImplementation((editor, props, options) => {
      console.log('Transforms.setNodes called with:', { props, options });
    });

    vi.spyOn(Editor, 'next').mockImplementation((editor, options) => {
      return undefined;
    });

    vi.spyOn(Editor, 'previous').mockImplementation((editor, options) => {
      return undefined;
    });
  });

  it('should not normalize if node is not an element', () => {
    const textNode = { text: 'test' };
    const normalize = withAccordionListItemHeadingNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([textNode, []]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([textNode, []]);
  });

  it('should not normalize if node is not an accordion list item heading', () => {
    const paragraphNode = {
      id: '1',
      type: 'paragraph',
      children: [{ text: 'test' }],
    } as unknown as Ancestor;
    const normalize = withAccordionListItemHeadingNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([paragraphNode, []]);
    expect(originalNormalizeNode).toHaveBeenCalledWith([paragraphNode, []]);
  });

  // TODO: Fix this test
  it.skip('should normalize next sibling to content if it is not content', () => {
    const headingNode = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionListItemHeading,
      children: [{ text: 'Heading' }],
    } as unknown as Descendant;

    const nextSiblingNode = {
      id: '2',
      type: 'paragraph',
      children: [{ text: 'Content' }],
    } as unknown as Descendant;

    vi.spyOn(Editor, 'next').mockImplementation((editor, options) => {
      return [nextSiblingNode, [0, 1]] as NodeEntry<Descendant>;
    });

    const normalize = withAccordionListItemHeadingNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([headingNode, [0, 0]]);

    expect(Transforms.setNodes).toHaveBeenCalledWith(
      slate,
      expect.objectContaining({
        id: expect.any(String),
        type: ACCORDION_ELEMENTS.AccordionListItemContent,
      }),
      { at: [0, 1] },
    );
  });

  // TODO: Fix this test
  it.skip('should not normalize next sibling if it is already content', () => {
    const headingNode = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionListItemHeading,
      children: [{ text: 'Heading' }],
    } as unknown as Descendant;

    const nextSiblingNode = {
      id: '2',
      type: ACCORDION_ELEMENTS.AccordionListItemContent,
      children: [{ text: 'Content' }],
    } as unknown as Descendant;

    vi.spyOn(Editor, 'next').mockImplementation((editor, options) => {
      return [nextSiblingNode, [0, 1]] as NodeEntry<Descendant>;
    });

    const normalize = withAccordionListItemHeadingNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([headingNode, [0, 0]]);

    expect(Transforms.setNodes).not.toHaveBeenCalled();
  });

  it('should normalize current node to content if previous sibling is content', () => {
    const headingNode = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionListItemHeading,
      children: [{ text: 'Heading' }],
    } as unknown as Descendant;

    const prevSiblingNode = {
      id: '2',
      type: ACCORDION_ELEMENTS.AccordionListItemContent,
      children: [{ text: 'Content' }],
    } as unknown as Descendant;

    vi.spyOn(Editor, 'previous').mockImplementation((editor, options) => {
      return [prevSiblingNode, [0, 0]] as NodeEntry<Descendant>;
    });

    const normalize = withAccordionListItemHeadingNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([headingNode, [0, 1]]);

    expect(Transforms.setNodes).toHaveBeenCalledWith(
      slate,
      expect.objectContaining({
        id: expect.any(String),
        type: ACCORDION_ELEMENTS.AccordionListItemContent,
      }),
      { at: [0, 1] },
    );
  });

  it('should not normalize current node if previous sibling is not content', () => {
    const headingNode = {
      id: '1',
      type: ACCORDION_ELEMENTS.AccordionListItemHeading,
      children: [{ text: 'Heading' }],
    } as unknown as Descendant;

    const prevSiblingNode = {
      id: '2',
      type: 'paragraph',
      children: [{ text: 'Content' }],
    } as unknown as Descendant;

    vi.spyOn(Editor, 'previous').mockImplementation((editor, options) => {
      return [prevSiblingNode, [0, 0]] as NodeEntry<Descendant>;
    });

    const normalize = withAccordionListItemHeadingNormalize(slate as SlateEditor, editor as YooEditor);
    normalize.normalizeNode([headingNode, [0, 1]]);

    expect(Transforms.setNodes).not.toHaveBeenCalled();
  });
});
