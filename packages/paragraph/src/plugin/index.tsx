import { createYooptaPlugin } from '@yoopta/editor';
import { ParagraphRender } from '../ui/Paragraph';

const Paragraph = createYooptaPlugin({
  type: 'ParagraphPlugin',
  elements: {
    paragraph: {
      render: ParagraphRender,
    },
  },
  options: {
    displayLabel: 'Text',
  },
});

export { Paragraph };