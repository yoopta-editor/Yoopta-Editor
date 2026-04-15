import type { PluginElementRenderProps } from '@yoopta/editor';
import { YooptaPlugin, generateId, useYooptaEditor } from '@yoopta/editor';

import { MathInlineCommands } from '../commands/math-inline-commands';
import type { MathInlineElementMap, MathInlineElementProps, MathYooEditor } from '../types';
import { renderLatexToHTML } from '../utils';

const DefaultMathInlineRender = (props: PluginElementRenderProps) => {
  const { element, attributes, children } = props;
  const editor = useYooptaEditor() as MathYooEditor;
  const { latex } = element.props as MathInlineElementProps;

  const html = renderLatexToHTML(latex || '\\text{math}');

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (editor?.math) {
      editor.math.open({
        element: element as any,
        blockId: props.blockId,
        anchorEl: e.currentTarget,
      });
    }
  };

  return (
    <span
      {...attributes}
      contentEditable={false}
      data-math-inline
      data-latex={latex}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <span dangerouslySetInnerHTML={{ __html: html }} />
      {children}
    </span>
  );
};

const defaultMathInlineProps: MathInlineElementProps = {
  latex: '',
  nodeType: 'inlineVoid',
};

const MathInline = new YooptaPlugin<MathInlineElementMap>({
  type: 'MathInline',
  elements: (
    <math-inline
      render={DefaultMathInlineRender}
      props={defaultMathInlineProps}
      nodeType="inlineVoid"
    />
  ),
  options: {
    display: {
      title: 'Math (Inline)',
      description: 'Insert an inline math expression',
    },
  },
  commands: MathInlineCommands,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['SPAN'],
        parse: (el) => {
          if (el.nodeName === 'SPAN' && el.hasAttribute('data-math-inline')) {
            const latex = el.getAttribute('data-latex') ?? '';
            return {
              id: generateId(),
              type: 'math-inline',
              children: [{ text: '' }],
              props: {
                latex,
                nodeType: 'inlineVoid',
              },
            };
          }
        },
      },
      serialize: (element) => {
        const { latex } = element.props ?? {};
        const html = renderLatexToHTML(latex || '');
        return `<span data-math-inline data-latex="${encodeURIComponent(latex || '')}">${html}</span>`;
      },
    },
    markdown: {
      serialize: (element) => `$${element.props?.latex ?? ''}$`,
    },
    email: {
      serialize: (element) => {
        const { latex } = element.props ?? {};
        const html = renderLatexToHTML(latex || '');
        return `<span style="font-family: 'Times New Roman', serif;">${html}</span>`;
      },
    },
  },
  extensions: (slate) => {
    const { isVoid, isInline, markableVoid } = slate;

    slate.isVoid = (element) => element.type === 'math-inline' || isVoid(element);
    slate.isInline = (element) => element.type === 'math-inline' || isInline(element);
    slate.markableVoid = (element) => element.type === 'math-inline' || markableVoid(element);

    return slate;
  },
});

export { MathInline };
