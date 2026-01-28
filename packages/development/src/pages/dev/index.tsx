import YooptaEditor, { createYooptaEditor, generateId, Marks, type RenderBlockProps } from '@yoopta/editor';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { DEFAULT_VALUE } from '@/utils/yoopta/default-value';
import { withMentions } from '@yoopta/mention';
import { MentionDropdown } from '@yoopta/themes-shadcn';

import { YooptaToolbar } from '@/components/new-yoo-components/yoopta-toolbar';
import { YooptaFloatingBlockActions } from '@/components/new-yoo-components/yoopta-floating-block-actions';
import { YooptaSlashCommandMenu } from '@/components/new-yoo-components/yoopta-slash-command-menu';

import { SelectionBox } from '@yoopta/ui/selection-box';
import { BlockDndContext, SortableBlock, DragHandle } from '@yoopta/ui/block-dnd';
import { GripVertical } from 'lucide-react';

const EDITOR_STYLE = {
  width: 750,
  paddingBottom: 100,
};

const YooptaUIPackageExample = () => {
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(
    () =>
      withMentions(createYooptaEditor({
        plugins: YOOPTA_PLUGINS,
        marks: MARKS,
        value: DEFAULT_VALUE,
      })),
    [],
  );

  console.log('YooptaUIPackageExample editor', editor);

  useEffect(() => {
    editor.applyTransforms([{ type: 'validate_block_paths' }]);
  }, []);

  const markBlocksToBold = () => {
    Marks.update(editor, {
      type: 'highlight',
      value: { color: 'red', backgroundImage: 'linear-gradient(to right, red, blue)' },
      at: [0, 1, 2]
    });
  }

  const insertTabs = () => {
    const elements = editor.y('tabs-container', {
      props: { activeTabId: 'tab-1' },
      children: [
        editor.y('tabs-list', {
          children: [
            editor.y('tabs-item-heading', { id: 'tab-1', children: [editor.y.text('Tab 1')] }),
            editor.y('tabs-item-heading', { id: 'tab-2', children: [editor.y.text('Tab 2')] }),
            editor.y('tabs-item-heading', { id: 'tab-3', children: [editor.y.text('Tab 3')] }),
          ],
        }),
        editor.y('tabs-item-content', {
          props: { referenceId: 'tab-1' },
          children: [editor.y.text('Tab 1 content')],
        }),
        editor.y('tabs-item-content', {
          props: { referenceId: 'tab-2' },
          children: [editor.y.text('Tab 2 content')],
        }),
        editor.y('tabs-item-content', {
          props: { referenceId: 'tab-3' },
          children: [editor.y.text('Tab 3 content')],
        }),
      ],
    });

    editor.insertBlock('Tabs', {
      elements,
      at: 0,
      focus: true,
    });
  };

  const insertTable = () => {
    const elements = editor.y('table', {
      props: { columnWidths: [200, 150, 250] },
      children: [
        editor.y('table-row', {
          children: [
            editor.y('table-data-cell', {
              children: [editor.y.text('Cell 1')],
            }),
            editor.y('table-data-cell', { children: [editor.y.text('Cell 2')] }),
            editor.y('table-data-cell', { children: [editor.y.text('Cell 3')] }),
          ],
        }),
        editor.y('table-row', {
          children: [
            editor.y('table-data-cell', { children: [editor.y.text('Cell 4')] }),
            editor.y('table-data-cell', { children: [editor.y.text('Cell 5')] }),
            editor.y('table-data-cell', { children: [editor.y.text('Cell 6')] }),
          ],
        }),
        editor.y('table-row', {
          children: [
            editor.y('table-data-cell', { children: [editor.y.text('Cell 7')] }),
            editor.y('table-data-cell', { children: [editor.y.text('Cell 8')] }),
            editor.y('table-data-cell', { children: [editor.y.text('Cell 9')] }),
          ],
        }),
      ],
    });
    editor.insertBlock('Table', { elements, at: 0, focus: true });
  };

  const insertAccordion = () => {
    const elements = editor.y('accordion-list', {
      children: [
        editor.y('accordion-list-item', {
          props: { isExpanded: true },
          children: [
            editor.y('accordion-list-item-heading', { children: [editor.y.text('Accordion 1')] }),
            editor.y('accordion-list-item-content', {
              children: [editor.y.text('Accordion Content 1', { bold: true, italic: true })],
            }),
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
                    editor.y.text('Step 1: ', { bold: true, italic: true }),
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
                editor.y('step-list-item-content', {
                  children: [
                    editor.y('image', {
                      props: {
                        src: 'https://placehold.co/600x400',
                        sizes: { width: 600, height: 400 },
                      },
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const blockId = editor.insertBlock('Steps', {
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
            src: 'https://placehold.co/600x400',
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
    const bulletItemIds = [generateId(), generateId(), generateId()];

    editor.batchOperations(() => {
      bulletItemIds.forEach((id, idx) => {
        const bulletItemElements = editor.y('bulleted-list', {
          id,
          children: [editor.y.text(`Item ${idx + 1}`)],
        });

        editor.insertBlock('BulletedList', {
          elements: bulletItemElements,
          at: idx,
        });
      });
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
      children: [editor.y.text(children.map((child) => child.text).join('\n'))],
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
      children: [editor.y.text(children.map((child) => child.text).join('\n'))],
    });

    editor.insertBlock('Code', {
      elements,
      at: 0,
      focus: true,
    });
  };

  const insertMention = () => {
    const elements = editor.y('paragraph', {
      children: [
        editor.y.text('Visit '),
        editor.y.inline('mention', {
          props: {
            id: '123',
            name: 'John Doe',
            avatar: 'https://example.com/avatar.png',
            type: 'user',
          },
          // Note: inlineVoid elements don't need children - they're void
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

  // editor.y.markdown(`
  //   # Hello World
  //   This is a test of the markdown plugin.
  //   ## Subheading
  //   This is a subheading.
  //   ### Subsubheading
  //   This is a subsubheading.
  // `);

  // editor.y.mdx(`
  //   <Accordion>
  //     <AccordionItem isExpanded={true}>
  //       <AccordionTrigger>Accordion 1</AccordionTrigger>
  //       <AccordionContent>Accordion Content 1</AccordionContent>
  //     </AccordionItem>
  //   </Accordion>
  //   <Steps>
  //     <Step>
  //       <StepHeading>Step 1</StepHeading>
  //       <StepContent>Step Content 1</StepContent>
  //     </Step>
  //   </Steps>
  // `);

  return (
    <div className="flex flex-col gap-2" ref={selectionBoxRef}>
      <div className="flex flex-wrap gap-2 px-[100px] max-w-[900px] mx-auto my-10">
        <button
          type="button"
          onClick={insertAccordion}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
          Add Accordion
        </button>
        <button
          type="button"
          onClick={insertSteps}
          className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
          Add Steps
        </button>
        <button
          type="button"
          onClick={insertCallout}
          className="rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600">
          Add Callout
        </button>
        <button
          type="button"
          onClick={insertParagraphWithText}
          className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
          Add Paragraph with Text & Marks
        </button>
        <button
          type="button"
          onClick={insertParagraphWithLink}
          className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600">
          Add Paragraph with Link
        </button>
        <button
          type="button"
          onClick={insertBulletedList}
          className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
          Add Bulleted List
        </button>
        <button
          type="button"
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
          type="button"
          onClick={insertCodeJSBlock}
          className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600">
          Insert Code JS Block
        </button>
        <button
          type="button"
          onClick={insertCodePythonBlock}
          className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600">
          Insert Code Python Block
        </button>
        <button
          type="button"
          onClick={insertTable}
          className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600">
          Insert Table
        </button>
        <button
          type="button"
          onClick={insertTabs}
          className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600">
          Insert Tabs
        </button>
        <button
          type="button"
          onClick={() => markBlocksToBold()}
          className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600">
          Mark Blocks to Bold
        </button>
        <button
          type="button"
          onClick={insertMention}
          className="rounded-md bg-[red] px-4 py-2 text-sm font-medium text-white hover:bg-gray-600">
          Insert Mention
        </button>
      </div>
      <BlockDndContext editor={editor}>
        <YooptaEditor
          editor={editor}
          autoFocus
          placeholder="Type / to open menu"
          style={EDITOR_STYLE}
          onChange={(value) => console.log('value', value)}
          className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col">
          <YooptaToolbar />
          <YooptaFloatingBlockActions />
          <YooptaSlashCommandMenu />
          <SelectionBox selectionBoxElement={selectionBoxRef} />
          <MentionDropdown />
        </YooptaEditor>
      </BlockDndContext>
    </div>
  );
};

export default YooptaUIPackageExample;
