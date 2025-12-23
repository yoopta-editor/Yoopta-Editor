import type { YooptaBlockData } from '@yoopta/editor';

import type { CodeElement } from '../types';

export const getCodeElement = (block: YooptaBlockData) => block.value[0];

export const getCodeElementText = (block: YooptaBlockData) => {
  const element = getCodeElement(block) as CodeElement;
  let text = '';

  element.children.forEach((child) => {
    // @ts-expect-error - fixme
    text += `${child.text}`;
  });

  return text;
};

export const escapeHTML = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
