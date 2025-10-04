import type { YooptaBlockData } from '@yoopta/editor';

import type { CodeElement } from '../types';

export const getCodeElement = (block: YooptaBlockData) => block.value[0];

export const getCodeElementText = (block: YooptaBlockData) => {
  const element = getCodeElement(block) as CodeElement;
  let text = '';

  element.children.forEach((child) => {
    // @ts-ignore - fixme
    text += `${child.text}`;
  });

  return text;
};
