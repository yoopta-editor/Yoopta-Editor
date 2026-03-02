import { Blocks, Elements, YooptaPlugin, serializeTextNodes, useYooptaEditor } from '@yoopta/editor';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Element } from 'slate';

import { FAQCommands } from './faq-commands';
import type {
  FAQElementMap,
  FAQProps,
  FAQHeadingProps,
  FAQDescriptionProps,
  FAQItemProps,
  FAQItemQuestionProps,
  FAQItemAnswerProps,
  FAQIconStyle,
} from './types';
import './faq.css';

const faqDefaultProps: FAQProps = {
  variant: 'default',
  paddingY: 'lg',
  backgroundColor: '#ffffff',
  iconStyle: 'plus',
};

const headingDefaultProps: FAQHeadingProps = { color: '#111827' };
const descriptionDefaultProps: FAQDescriptionProps = { color: '#6b7280' };
const itemDefaultProps: FAQItemProps = { isExpanded: false, borderColor: '#e5e7eb' };
const questionDefaultProps: FAQItemQuestionProps = { color: '#111827' };
const answerDefaultProps: FAQItemAnswerProps = { color: '#4b5563' };

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="yoo-cms-faq-chevron-icon"
      data-expanded={expanded}
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FAQRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || faqDefaultProps) as FAQProps;

  return (
    <div
      {...attributes}
      className="yoo-cms-faq"
      data-variant={elementProps.variant}
      data-padding-y={elementProps.paddingY}
      style={{ backgroundColor: elementProps.backgroundColor }}
    >
      {children}
    </div>
  );
}

function FAQHeadingRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || headingDefaultProps) as FAQHeadingProps;

  return (
    <h2
      {...attributes}
      className="yoo-cms-faq-heading"
      style={{ color: elementProps.color }}
    >
      {children}
    </h2>
  );
}

function FAQDescriptionRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || descriptionDefaultProps) as FAQDescriptionProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-faq-description"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

function FAQItemRender(props: PluginElementRenderProps) {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();
  const elementProps = (element.props || itemDefaultProps) as FAQItemProps;

  const block = blockId ? editor.children[blockId] : null;
  const faqEl = block?.value?.[0];
  const faqProps = (faqEl?.props || faqDefaultProps) as FAQProps;
  const iconStyle: FAQIconStyle = faqProps.iconStyle || 'plus';

  return (
    <div
      {...attributes}
      className="yoo-cms-faq-item"
      data-expanded={elementProps.isExpanded}
      style={{ borderColor: elementProps.borderColor }}
    >
      <div className="yoo-cms-faq-item-icon" contentEditable={false}>
        {iconStyle === 'plus' ? (
          elementProps.isExpanded ? <MinusIcon /> : <PlusIcon />
        ) : (
          <ChevronIcon expanded={elementProps.isExpanded} />
        )}
      </div>
      {children}
    </div>
  );
}

function FAQItemQuestionRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || questionDefaultProps) as FAQItemQuestionProps;

  return (
    <div
      {...attributes}
      className="yoo-cms-faq-item-question"
      style={{ color: elementProps.color }}
    >
      {children}
    </div>
  );
}

function FAQItemAnswerRender(props: PluginElementRenderProps) {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();
  const elementProps = (element.props || answerDefaultProps) as FAQItemAnswerProps;

  // Check if parent faq-item is expanded
  const itemEntry = blockId
    ? Elements.getElementEntry(editor, { blockId, type: 'faq-item' })
    : null;
  const itemProps = itemEntry ? (itemEntry[0]?.props as FAQItemProps) : null;
  const isExpanded = itemProps?.isExpanded ?? false;

  return (
    <div
      {...attributes}
      className="yoo-cms-faq-item-answer"
      style={{ color: elementProps.color }}
      data-expanded={isExpanded}
    >
      {children}
    </div>
  );
}

const FAQPlugin = new YooptaPlugin<FAQElementMap>({
  type: 'FAQ',
  elements: (
    <faq
      props={faqDefaultProps}
      render={(props) => <FAQRender {...props} />}
    >
      <faq-heading
        props={headingDefaultProps}
        render={(props) => <FAQHeadingRender {...props} />}
        placeholder="Section heading..."
      />
      <faq-description
        props={descriptionDefaultProps}
        render={(props) => <FAQDescriptionRender {...props} />}
        placeholder="Section description..."
      />
      <faq-item
        props={itemDefaultProps}
        render={(props) => <FAQItemRender {...props} />}
      >
        <faq-item-question
          props={questionDefaultProps}
          render={(props) => <FAQItemQuestionRender {...props} />}
          placeholder="Question..."
        />
        <faq-item-answer
          props={answerDefaultProps}
          render={(props) => <FAQItemAnswerRender {...props} />}
          placeholder="Answer..."
        />
      </faq-item>
    </faq>
  ),
  lifecycle: {
    beforeCreate: (editor) => {
      const items = [
        {
          question: 'How do I get started?',
          answer: 'Sign up for a free account and follow our quick start guide to begin building in minutes.',
        },
        {
          question: 'Is there a free plan available?',
          answer: 'Yes, we offer a generous free tier that includes all core features for small teams.',
        },
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Absolutely. You can cancel your subscription at any time with no hidden fees or penalties.',
        },
      ];

      const faqItems = items.map((item) =>
        editor.y('faq-item', {
          props: itemDefaultProps,
          children: [
            editor.y('faq-item-question', {
              props: questionDefaultProps,
              children: [editor.y.text(item.question)],
            }),
            editor.y('faq-item-answer', {
              props: answerDefaultProps,
              children: [editor.y.text(item.answer)],
            }),
          ],
        }),
      );

      return editor.y('faq', {
        props: faqDefaultProps,
        children: [
          editor.y('faq-heading', {
            props: headingDefaultProps,
            children: [editor.y.text('Frequently Asked Questions')],
          }),
          editor.y('faq-description', {
            props: descriptionDefaultProps,
            children: [editor.y.text('Find answers to common questions about our platform')],
          }),
          ...faqItems,
        ],
      });
    },
  },
  commands: FAQCommands,
  events: {
    onKeyDown(editor, slate, { hotkeys, currentBlock }) {
      return (event) => {
        if (hotkeys.isEnter(event)) {
          if (event.isDefaultPrevented()) return;
          event.preventDefault();

          const currentElement = Elements.getElement(editor, {
            blockId: currentBlock.id,
          });

          if (!currentElement) return;

          // Toggle expand/collapse when pressing Enter on a question
          if (currentElement.type === 'faq-item-question') {
            const itemEntry = Elements.getElementEntry(editor, {
              blockId: currentBlock.id,
              type: 'faq-item',
            });

            if (itemEntry) {
              const [itemEl, itemPath] = itemEntry;
              Elements.updateElement(editor, {
                blockId: currentBlock.id,
                type: 'faq-item',
                props: {
                  isExpanded: !itemEl?.props?.isExpanded,
                },
                path: itemPath,
              });
            }
            return;
          }

          // In answer: insert a new faq-item after the current one
          if (currentElement.type === 'faq-item-answer') {
            Elements.insertElement(editor, {
              blockId: currentBlock.id,
              type: 'faq-item',
              props: { isExpanded: true, borderColor: '#e5e7eb' },
              at: 'next',
              focus: true,
            });
            return;
          }

          return;
        }

        if (hotkeys.isBackspace(event)) {
          if (event.isDefaultPrevented()) return;
          if (!slate.selection) return;

          const currentElement = Elements.getElement(editor, {
            blockId: currentBlock.id,
          });

          if (!currentElement) return;

          const isEmpty = Elements.isElementEmpty(editor, {
            blockId: currentBlock.id,
            type: currentElement.type,
          });

          // Delete entire block if heading is empty
          if (currentElement.type === 'faq-heading' && isEmpty) {
            event.preventDefault();
            editor.deleteBlock({ blockId: currentBlock.id });
            return;
          }

          // Handle empty question: delete the faq-item (or entire block if last one)
          if (currentElement.type === 'faq-item-question' && isEmpty) {
            event.preventDefault();

            const faqItems = Elements.getElementChildren(editor, {
              blockId: currentBlock.id,
              type: 'faq',
            });
            // Filter to only faq-item children
            const itemChildren = faqItems?.filter(
              (c: any) => Element.isElement(c) && c.type === 'faq-item',
            );

            if (!itemChildren || itemChildren.length <= 1) {
              Blocks.deleteBlock(editor, { blockId: currentBlock.id });
              return;
            }

            const itemEntry = Elements.getElementEntry(editor, {
              blockId: currentBlock.id,
              type: 'faq-item',
            });

            if (itemEntry) {
              const [, itemPath] = itemEntry;
              Elements.deleteElement(editor, {
                blockId: currentBlock.id,
                type: 'faq-item',
                path: itemPath,
              });
            }
            return;
          }

          // Prevent backspace on empty structural elements
          if (isEmpty) {
            event.preventDefault();
            return;
          }
        }
      };
    },
  },
  options: {
    display: {
      title: 'FAQ',
      description: 'Expandable question and answer pairs',
    },
    shortcuts: ['faq', 'accordion', 'questions'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['SECTION'],
        parse: (el) => {
          if (el.getAttribute('data-type') !== 'faq') return;
        },
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta ?? {};

        if (element.type === 'faq') {
          const props = element.props as FAQProps;
          const headingEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'faq-heading',
          );
          const descEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'faq-description',
          );
          const items = element.children?.filter(
            (c: any) => Element.isElement(c) && c.type === 'faq-item',
          ) || [];

          const headingHtml = headingEl ? serializeTextNodes(headingEl.children) : '';
          const descHtml = descEl ? serializeTextNodes(descEl.children) : '';

          const itemsHtml = items.map((item: any) => {
            const itemProps = item.props as FAQItemProps;
            const questionEl = item.children?.find((c: any) => c.type === 'faq-item-question');
            const answerEl = item.children?.find((c: any) => c.type === 'faq-item-answer');

            const questionHtml = questionEl ? serializeTextNodes(questionEl.children) : '';
            const answerHtml = answerEl ? serializeTextNodes(answerEl.children) : '';

            const borderStyle = props?.variant === 'bordered'
              ? `border:1px solid ${itemProps?.borderColor || '#e5e7eb'};border-radius:8px;`
              : props?.variant === 'separated'
                ? `background:#f9fafb;border-radius:8px;`
                : `border-bottom:1px solid ${itemProps?.borderColor || '#e5e7eb'};`;

            return `<details style="padding:16px 20px;${borderStyle}" open>
              <summary style="font-size:1rem;font-weight:600;cursor:pointer;color:${(questionEl as any)?.props?.color || '#111827'};list-style:none;display:flex;justify-content:space-between;align-items:center;">
                ${questionHtml}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-left:12px;">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </summary>
              <p style="margin:12px 0 0;font-size:0.9375rem;line-height:1.6;color:${(answerEl as any)?.props?.color || '#4b5563'};">${answerHtml}</p>
            </details>`;
          }).join('');

          const paddingMap = { sm: '32px 24px', md: '48px 24px', lg: '64px 24px', xl: '80px 24px' };
          const padding = paddingMap[props?.paddingY || 'lg'];

          return `<section data-type="faq" data-meta-depth="${depth}" style="padding:${padding};background-color:${props?.backgroundColor || '#fff'};">
            <h2 style="font-size:2rem;font-weight:700;text-align:center;margin:0 0 8px;color:${(headingEl as any)?.props?.color || '#111827'};">${headingHtml}</h2>
            <p style="font-size:1.125rem;text-align:center;color:${(descEl as any)?.props?.color || '#6b7280'};margin:0 auto 48px;max-width:600px;">${descHtml}</p>
            <div style="display:flex;flex-direction:column;gap:${props?.variant === 'separated' ? '12px' : '0'};max-width:768px;margin:0 auto;">${itemsHtml}</div>
          </section>`;
        }

        return '';
      },
    },
  },
});

export { FAQPlugin };
