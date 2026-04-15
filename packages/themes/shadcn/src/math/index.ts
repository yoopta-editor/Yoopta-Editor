import { MathElement } from './elements/math/math-element';
import { MathBlockElement } from './elements/math-block/math-block-element';

export { MathElement } from './elements/math/math-element';
export { MathPreview } from './elements/math/math-preview';
export { MathEdit } from './elements/math/math-edit';
export { MathBlockElement } from './elements/math-block/math-block-element';

export const MathInlineUI = {
  'math-inline': {
    render: MathElement,
  },
};

export const MathBlockUI = {
  'math-block': {
    render: MathBlockElement,
  },
};
