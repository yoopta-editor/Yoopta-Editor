import type { SlateElement, YooptaBlockBaseMeta, YooptaBlockData } from '../../editor/types';
import { generateId } from '../../utils/generateId';

export const buildBlockElement = (element?: Partial<SlateElement>): SlateElement => ({
    id: generateId(),
    type: element?.type || 'paragraph',
    children: element?.children || [{ text: '' }],
    props: {
      nodeType: 'block',
      ...element?.props,
    },
  });

type BuildBlockDataOptions = Partial<YooptaBlockData<SlateElement>> & {
  value?: SlateElement[];
  meta?: Partial<YooptaBlockBaseMeta>;
};

export const buildBlockData = (block?: BuildBlockDataOptions): YooptaBlockData => ({
  id: block?.id || generateId(),
  value: block?.value || [buildBlockElement()],
  type: block?.type || 'Paragraph',
  meta: {
    order: 0,
    depth: 0,
    ...block?.meta,
  },
});

export const getDefaultYooptaChildren = () => {
  const pId = generateId();

  return {
    [pId]: buildBlockData({ id: pId }),
  };
};
