import type { PluginElementRenderProps } from '@yoopta/editor';
import { YooptaPlugin, generateId, useYooptaEditor } from '@yoopta/editor';

import { MathBlockCommands } from '../commands/math-block-commands';
import type { MathBlockElementMap, MathBlockElementProps, MathYooEditor } from '../types';
import { renderLatexToHTML } from '../utils';

const DefaultMathBlockRender = (props: PluginElementRenderProps) => {
  const { element, attributes, children } = props;
  const editor = useYooptaEditor() as MathYooEditor;
  const { latex } = element.props as MathBlockElementProps;

  const html = renderLatexToHTML(latex || '\\text{Enter math expression...}', true);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (editor?.math) {
      editor.math.open({
        element: element as any,
        blockId: props.blockId,
        anchorEl: e.currentTarget,
      });
    }
  };

  return (
    <div
      {...attributes}
      contentEditable={false}
      data-math-block
      data-latex={latex}
      onClick={handleClick}
      style={{
        padding: '1em 0',
        textAlign: 'center',
        cursor: 'pointer',
        minHeight: '3em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span dangerouslySetInnerHTML={{ __html: html }} />
      {children}
    </div>
  );
};

const defaultMathBlockProps: MathBlockElementProps = {
  latex: '',
  nodeType: 'void',
};

const MathBlock = new YooptaPlugin<MathBlockElementMap>({
  type: 'MathBlock',
  elements: (
    <math-block
      render={DefaultMathBlockRender}
      props={defaultMathBlockProps}
      nodeType="void"
    />
  ),
  options: {
    display: {
      title: 'Math (Block)',
      description: 'Insert a display math equation',
    },
  },
  commands: MathBlockCommands,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['DIV'],
        parse: (el) => {
          if (el.nodeName === 'DIV' && el.hasAttribute('data-math-block')) {
            const latex = el.getAttribute('data-latex') ?? '';
            return {
              id: generateId(),
              type: 'math-block',
              children: [{ text: '' }],
              props: {
                latex,
                nodeType: 'void',
              },
            };
          }
        },
      },
      serialize: (element) => {
        const { latex } = element.props ?? {};
        const html = renderLatexToHTML(latex || '', true);
        return `<div data-math-block data-latex="${encodeURIComponent(latex || '')}" style="text-align:center;padding:1em 0;">${html}</div>`;
      },
    },
    markdown: {
      serialize: (element) => `$$\n${element.props?.latex ?? ''}\n$$`,
    },
    email: {
      serialize: (element) => {
        const { latex } = element.props ?? {};
        const html = renderLatexToHTML(latex || '', true);
        return `<div style="text-align:center;padding:1em 0;font-family:'Times New Roman',serif;">${html}</div>`;
      },
    },
  },
});

export { MathBlock };
