import YooptaEditor, { YooEditor, createYooptaEditor } from '@yoopta/editor';
import { useEffect, useMemo } from 'react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';

const EDITOR_STYLE = {
  width: 750,
};

import { YooptaToolbar } from '@/components/new-yoo-components/yoopta-toolbar';
import { YooptaFloatingBlockActions } from '@/components/new-yoo-components/yoopta-floating-block-actions';
import { YooptaSlashCommandMenu } from '@/components/new-yoo-components/yoopta-slash-command-menu';
import { YooptaBlockOptions } from '@/components/new-yoo-components/yoopta-block-options';
import { YooptaActionMenuList } from '@/components/new-yoo-components/yoopta-action-menu-list';
import { FixedToolbar } from '@/components/FixedToolbar/FixedToolbar';
import { DEFAULT_VALUE } from '@/utils/yoopta/default-value';

const YooptaUIPackageExample = () => {
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);

  useEffect(() => {
    editor.applyTransforms([{ type: 'validate_block_paths' }]);
  }, []);

  const insertAccordion = () => {
    const elements = editor.y('accordion-list', {
      children: [
        editor.y('accordion-list-item', {
          props: { isExpanded: true },
          children: [
            editor.y('accordion-list-item-heading'),
            editor.y('accordion-list-item-content'),
          ],
        }),
        editor.y('accordion-list-item', {
          props: { isExpanded: false },
          children: [
            editor.y('accordion-list-item-heading'),
            editor.y('accordion-list-item-content'),
          ],
        }),
      ],
    });

    editor.insertBlock('Accordion', {
      at: 0,
      elements,
      focus: true,
    });
  };

  const insertSteps = () => {
    const elements = editor.y('step-container', {
      children: [
        editor.y('step-list', {
          children: [
            editor.y('step-list-item', {
              props: { isCompleted: false },
              children: [
                editor.y('step-list-item-heading', {
                  children: [
                    editor.y.text('Step 1: ', { bold: true }),
                    editor.y.text('Setup project'),
                  ],
                }),
                editor.y('step-list-item-content', {
                  children: [
                    editor.y('callout', { props: { theme: 'success' } }),
                    editor.y('blockquote', { children: [editor.y.text('I`m blockquote')] }),
                  ],
                }),
              ],
            }),
            editor.y('step-list-item', {
              props: { isCompleted: false },
              children: [
                editor.y('step-list-item-heading', {
                  children: [editor.y.text('Install dependencies', { bold: true })],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    editor.insertBlock('Steps', {
      elements,
      at: 0,
      focus: true,
    });
  };

  const insertCallout = () => {
    const elements = editor.y('callout', {
      props: { theme: 'success' },
      children: [
        editor.y('image', {
          props: {
            src: 'https://optim.tildacdn.com/tild3632-6534-4865-a532-613830613038/-/cover/720x792/center/center/-/format/webp/IMG_8173.jpg.webp',
            sizes: {
              width: 200,
              height: 200,
            },
            fit: 'contain',
          },
        }),
      ],
    });
    editor.insertBlock('Callout', {
      elements,
      at: 0,
      focus: true,
    });
  };

  const insertParagraphWithText = () => {
    const elements = editor.y('paragraph', {
      children: [
        editor.y.text('Hello '),
        editor.y.text('world', { bold: true }),
        editor.y.text('! ', { italic: true }),
        editor.y.text('This is ', { underline: true }),
        editor.y.text('formatted', { bold: true, italic: true }),
        editor.y.text(' text.'),
      ],
    });
    editor.insertBlock('Paragraph', {
      elements,
      at: 0,
      focus: true,
    });
  };

  const insertParagraphWithLink = () => {
    // Example: paragraph with inline link element
    const elements = editor.y('paragraph', {
      children: [
        editor.y.text('Visit '),
        editor.y.inline('link', {
          props: {
            url: 'https://example.com',
            target: '_blank',
            rel: 'noopener noreferrer',
            title: 'Example website',
          },
          children: [editor.y.text('example.com', { bold: true })],
        }),
        editor.y.text(' for more information.'),
      ],
    });
    editor.insertBlock('Paragraph', {
      elements,
      at: 0,
      focus: true,
    });
  };

  const insertBulletedList = () => {
    const elements = editor.y('bulleted-list', {
      children: [
        editor.y('bulleted-list-item', {
          children: [editor.y.text('Item 1'), editor.y.text(' First item', { bold: true })],
        }),
        editor.y('bulleted-list-item', {
          children: [editor.y.text('Item 2')],
        }),
        editor.y('bulleted-list-item', {
          children: [editor.y.text('Item 3')],
        }),
      ],
    });

    editor.insertBlock('BulletedList', {
      elements,
      at: typeof editor.path.current === 'number' ? editor.path.current : 0,
      focus: true,
    });
  };

  const insertCodeJSBlock = () => {
    const children = [
      { text: '// JavaScript Example' },
      { text: 'function fibonacci(n) {' },
      { text: '  if (n <= 1) return n;' },
      { text: '  return fibonacci(n - 1) + fibonacci(n - 2);' },
      { text: '}' },
      { text: '' },
      { text: 'const result = fibonacci(10);' },
      { text: 'console.log(`Fibonacci(10) = ${result}`);' },
    ];

    const elements = editor.y('code', {
      props: {
        language: 'javascript',
        theme: 'github-dark',
      },
      children: children.map((child) =>
        editor.y('code-line', { children: [editor.y.text(child.text)] }),
      ),
    });

    editor.insertBlock('Code', {
      elements,
      at: 0,
      focus: true,
    });
  };

  const insertCodePythonBlock = () => {
    const children = [
      { text: '# Python Example' },
      { text: 'def quick_sort(arr):' },
      { text: '    if len(arr) <= 1:' },
      { text: '        return arr' },
      { text: '    pivot = arr[len(arr) // 2]' },
      { text: '    left = [x for x in arr if x < pivot]' },
      { text: '    middle = [x for x in arr if x == pivot]' },
      { text: '    right = [x for x in arr if x > pivot]' },
      { text: '    return quick_sort(left) + middle + quick_sort(right)' },
      { text: '' },
      { text: 'numbers = [3, 6, 8, 10, 1, 2, 1]' },
      { text: 'print(quick_sort(numbers))' },
    ];

    const elements = editor.y('code', {
      props: {
        language: 'python',
        theme: 'github-dark',
      },
      children: children.map((child) =>
        editor.y('code-line', { children: [editor.y.text(child.text)] }),
      ),
    });

    editor.insertBlock('Code', {
      elements,
      at: 0,
      focus: true,
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 px-[100px] max-w-[900px] mx-auto my-10">
        <button
          onClick={insertAccordion}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
          Add Accordion
        </button>
        <button
          onClick={insertSteps}
          className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
          Add Steps
        </button>
        <button
          onClick={insertCallout}
          className="rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600">
          Add Callout
        </button>
        <button
          onClick={insertParagraphWithText}
          className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
          Add Paragraph with Text & Marks
        </button>
        <button
          onClick={insertParagraphWithLink}
          className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600">
          Add Paragraph with Link
        </button>
        <button
          onClick={insertBulletedList}
          className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
          Add Bulleted List
        </button>
        <button
          onClick={() => {
            editor.toggleBlock('HeadingThree', {
              at: editor.path.current,
              scope: 'element',
              focus: true,
              preserveContent: true,
            });
          }}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
          Toggle Block into HeadingThree for {editor.path.current}
        </button>
        <button
          onClick={insertCodeJSBlock}
          className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600">
          Insert Code JS Block
        </button>
        <button
          onClick={insertCodePythonBlock}
          className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600">
          Insert Code Python Block
        </button>
      </div>
      <YooptaEditor
        editor={editor}
        plugins={YOOPTA_PLUGINS}
        marks={MARKS}
        autoFocus
        readOnly={false}
        placeholder="Type / to open menu"
        style={EDITOR_STYLE}
        onChange={(value) => console.log('value', value)}
        value={DEFAULT_VALUE}
        className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col">
        <YooptaToolbar />
        <YooptaFloatingBlockActions />
        <YooptaBlockOptions />
        <YooptaSlashCommandMenu />
        <YooptaActionMenuList />
        <FixedToolbar editor={editor} />
      </YooptaEditor>
    </>
  );
};

export default YooptaUIPackageExample;
