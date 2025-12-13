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
              props: { isCompleted: true },
              children: [
                editor.y('step-list-item-heading', {
                  children: [
                    editor.y.text('Step 2: ', { bold: true }),
                    editor.y.text('Completed', { strike: true }),
                  ],
                }),
                editor.y('step-list-item-content', {
                  children: [editor.y('image')],
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
          onClick={() => {
            console.log('editor.path.current', editor.path.current);
            editor.toggleBlock('BulletedList', {
              at: editor.path.current,
              scope: 'element',
              focus: true,
              preserveContent: true,
            });
          }}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
          Toggle Block into Bulleted List for {editor.path.current}
        </button>
      </div>
      <YooptaEditor
        editor={editor}
        plugins={YOOPTA_PLUGINS}
        marks={MARKS}
        autoFocus
        readOnly={false}
        placeholder="Type / to open menu"
        tools={TOOLS}
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

/**
 * -- block elements before --
 *
 * - accordion-list
 *  - accordion-list-item
 *    - accordion-list-item-heading
 *    - accordion-list-item-content
 *      - callout (with text "nested callout (Callout plugin) to heading-one (HeadingOne plugin)")
 *
 * Trigger toggleBlock
 *
 * -- block elements after --
 *
 * - accordion-list
 *  - accordion-list-item
 *    - accordion-list-item-heading
 *    - accordion-list-item-content
 *      - callout (with text "nested callout (Callout plugin) to heading-one (HeadingOne plugin)")
 *      - heading-one (with text "nested callout (Callout plugin) to heading-one (HeadingOne plugin)")
 *
 * But it should be:
 * -- correct block elements --
 *
 * - accordion-list
 *  - accordion-list-item
 *    - accordion-list-item-heading
 *    - accordion-list-item-content
 *      - heading-one (with text "nested callout (Callout plugin) to heading-one (HeadingOne plugin)")
 */

/**
 * -- block elements before --
 * - callout
 *
 * Trigger toggleBlock
 *
 * -- block elements after --
 * - callout
 * - heading-three
 *
 * But it should be:
 *
 * - callout
 *    - heading-three
 */
