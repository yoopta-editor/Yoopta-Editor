import { Elements, YooptaPlugin, serializeTextNodes, useYooptaEditor } from '@yoopta/editor';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Element } from 'slate';

import { TestimonialsCommands } from './testimonials-commands';
import type {
  TestimonialsElementMap,
  TestimonialsProps,
  TestimonialsHeadingProps,
  TestimonialsDescriptionProps,
  TestimonialCardProps,
  TestimonialQuoteProps,
  TestimonialAuthorProps,
  TestimonialRoleProps,
} from './types';
import './testimonials.css';

const gridDefaultProps: TestimonialsProps = {
  columns: 3,
  variant: 'cards',
  paddingY: 'lg',
  backgroundColor: '#ffffff',
};

const headingDefaultProps: TestimonialsHeadingProps = { color: '#111827' };
const descriptionDefaultProps: TestimonialsDescriptionProps = { color: '#6b7280' };

const cardDefaultProps: TestimonialCardProps = {
  avatar: '',
  rating: 5,
  accentColor: '#3b82f6',
};

const quoteDefaultProps: TestimonialQuoteProps = { color: '#374151' };
const authorDefaultProps: TestimonialAuthorProps = { color: '#111827' };
const roleDefaultProps: TestimonialRoleProps = { color: '#6b7280' };

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="yoo-cms-testimonial-stars" contentEditable={false}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? 'yoo-cms-testimonial-star-filled' : 'yoo-cms-testimonial-star-empty'}>
          ★
        </span>
      ))}
    </div>
  );
}

function AvatarDisplay({ avatar, name }: { avatar: string; name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="yoo-cms-testimonial-avatar" contentEditable={false}>
      {avatar ? <img src={avatar} alt={name} /> : initials || '?'}
    </div>
  );
}

function TestimonialsRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || gridDefaultProps) as TestimonialsProps;

  return (
    <div
      {...attributes}
      className="yoo-cms-testimonials"
      data-columns={elementProps.columns}
      data-padding-y={elementProps.paddingY}
      style={{ backgroundColor: elementProps.backgroundColor }}
    >
      {children}
    </div>
  );
}

function TestimonialsHeadingRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || headingDefaultProps) as TestimonialsHeadingProps;

  return (
    <h2
      {...attributes}
      className="yoo-cms-testimonials-heading"
      style={{ color: elementProps.color }}
    >
      {children}
    </h2>
  );
}

function TestimonialsDescriptionRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || descriptionDefaultProps) as TestimonialsDescriptionProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-testimonials-description"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

function TestimonialCardRender(props: PluginElementRenderProps) {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();
  const elementProps = (element.props || cardDefaultProps) as TestimonialCardProps;

  const block = blockId ? editor.children[blockId] : null;
  const gridEl = block?.value?.[0];
  const gridProps = (gridEl?.props || gridDefaultProps) as TestimonialsProps;

  // Get author name from children for avatar initials
  const authorEl = element.children?.find(
    (c: any) => Element.isElement(c) && c.type === 'testimonial-author',
  );
  const authorText = authorEl ? serializeTextNodes(authorEl.children) : '';

  return (
    <div
      {...attributes}
      className="yoo-cms-testimonial-card"
      data-variant={gridProps.variant}
      style={{ '--testimonial-accent': elementProps.accentColor } as React.CSSProperties}
    >
      <StarRating rating={elementProps.rating} />
      {children}
      <div className="yoo-cms-testimonial-author-row" contentEditable={false}>
        <AvatarDisplay avatar={elementProps.avatar} name={authorText} />
      </div>
    </div>
  );
}

function TestimonialQuoteRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || quoteDefaultProps) as TestimonialQuoteProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-testimonial-quote"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

function TestimonialAuthorRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || authorDefaultProps) as TestimonialAuthorProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-testimonial-author"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

function TestimonialRoleRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || roleDefaultProps) as TestimonialRoleProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-testimonial-role"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

const TestimonialsPlugin = new YooptaPlugin<TestimonialsElementMap>({
  type: 'Testimonials',
  elements: (
    <testimonials
      props={gridDefaultProps}
      render={(props) => <TestimonialsRender {...props} />}
    >
      <testimonials-heading
        props={headingDefaultProps}
        render={(props) => <TestimonialsHeadingRender {...props} />}
        placeholder="Section heading..."
      />
      <testimonials-description
        props={descriptionDefaultProps}
        render={(props) => <TestimonialsDescriptionRender {...props} />}
        placeholder="Section description..."
      />
      <testimonial-card
        props={cardDefaultProps}
        render={(props) => <TestimonialCardRender {...props} />}
      >
        <testimonial-quote
          props={quoteDefaultProps}
          render={(props) => <TestimonialQuoteRender {...props} />}
          placeholder="Testimonial quote..."
        />
        <testimonial-author
          props={authorDefaultProps}
          render={(props) => <TestimonialAuthorRender {...props} />}
          placeholder="Author name"
        />
        <testimonial-role
          props={roleDefaultProps}
          render={(props) => <TestimonialRoleRender {...props} />}
          placeholder="Role, Company"
        />
      </testimonial-card>
    </testimonials>
  ),
  lifecycle: {
    beforeCreate: (editor) => {
      const testimonials = [
        {
          quote: 'This product completely transformed how our team works. The intuitive interface and powerful features made onboarding a breeze.',
          author: 'Sarah Chen',
          role: 'VP of Engineering, TechCorp',
        },
        {
          quote: "We've tried many solutions, but nothing comes close to the flexibility and performance we get here. Highly recommend.",
          author: 'Marcus Johnson',
          role: 'CTO, StartupXYZ',
        },
        {
          quote: 'The support team is incredible and the product just keeps getting better. It has become an essential part of our workflow.',
          author: 'Emily Park',
          role: 'Product Manager, DesignCo',
        },
      ];

      const cards = testimonials.map((t) =>
        editor.y('testimonial-card', {
          props: cardDefaultProps,
          children: [
            editor.y('testimonial-quote', {
              props: quoteDefaultProps,
              children: [editor.y.text(t.quote)],
            }),
            editor.y('testimonial-author', {
              props: authorDefaultProps,
              children: [editor.y.text(t.author)],
            }),
            editor.y('testimonial-role', {
              props: roleDefaultProps,
              children: [editor.y.text(t.role)],
            }),
          ],
        }),
      );

      return editor.y('testimonials', {
        props: gridDefaultProps,
        children: [
          editor.y('testimonials-heading', {
            props: headingDefaultProps,
            children: [editor.y.text('What our customers say')],
          }),
          editor.y('testimonials-description', {
            props: descriptionDefaultProps,
            children: [editor.y.text('Trusted by thousands of teams worldwide')],
          }),
          ...cards,
        ],
      });
    },
  },
  commands: TestimonialsCommands,
  events: {
    onKeyDown(editor, slate, { hotkeys, currentBlock }) {
      return (event) => {
        if (hotkeys.isEnter(event)) {
          if (event.isDefaultPrevented()) return;
          event.preventDefault();
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

          if (currentElement.type === 'testimonials-heading' && isEmpty) {
            event.preventDefault();
            editor.deleteBlock({ blockId: currentBlock.id });
            return;
          }

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
      title: 'Testimonials',
      description: 'Customer testimonials with quotes, names, and ratings',
    },
    shortcuts: ['testimonials', 'reviews'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['SECTION'],
        parse: (el) => {
          if (el.getAttribute('data-type') !== 'testimonials') return;
        },
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta ?? {};

        if (element.type === 'testimonials') {
          const props = element.props as TestimonialsProps;
          const headingEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'testimonials-heading',
          );
          const descEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'testimonials-description',
          );
          const cards = element.children?.filter(
            (c: any) => Element.isElement(c) && c.type === 'testimonial-card',
          ) || [];

          const headingHtml = headingEl ? serializeTextNodes(headingEl.children) : '';
          const descHtml = descEl ? serializeTextNodes(descEl.children) : '';

          const cardsHtml = cards.map((card: any) => {
            const cardProps = card.props as TestimonialCardProps;
            const quoteEl = card.children?.find((c: any) => c.type === 'testimonial-quote');
            const authorEl = card.children?.find((c: any) => c.type === 'testimonial-author');
            const roleEl = card.children?.find((c: any) => c.type === 'testimonial-role');

            const quoteHtml = quoteEl ? serializeTextNodes(quoteEl.children) : '';
            const authorHtml = authorEl ? serializeTextNodes(authorEl.children) : '';
            const roleHtml = roleEl ? serializeTextNodes(roleEl.children) : '';

            const stars = Array.from({ length: 5 }, (_, i) =>
              `<span style="color:${i < (cardProps?.rating || 5) ? '#f59e0b' : '#d1d5db'};">★</span>`
            ).join('');

            const initials = authorHtml.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

            return `<div style="padding:24px;border-radius:12px;background:#f9fafb;border:1px solid #f3f4f6;">
              <div style="margin-bottom:12px;">${stars}</div>
              <p style="font-size:0.9375rem;line-height:1.6;font-style:italic;color:${(quoteEl as any)?.props?.color || '#374151'};margin:0 0 16px;">${quoteHtml}</p>
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:40px;height:40px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:0.875rem;color:#6b7280;">${
                  cardProps?.avatar ? `<img src="${cardProps.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" />` : initials
                }</div>
                <div>
                  <div style="font-size:0.875rem;font-weight:600;color:${(authorEl as any)?.props?.color || '#111827'};">${authorHtml}</div>
                  <div style="font-size:0.8125rem;color:${(roleEl as any)?.props?.color || '#6b7280'};">${roleHtml}</div>
                </div>
              </div>
            </div>`;
          }).join('');

          return `<section data-type="testimonials" data-meta-depth="${depth}" style="padding:64px 24px;background-color:${props?.backgroundColor || '#fff'};">
            <h2 style="font-size:2rem;font-weight:700;text-align:center;margin:0 0 8px;color:${(headingEl as any)?.props?.color || '#111827'};">${headingHtml}</h2>
            <p style="font-size:1.125rem;text-align:center;color:${(descEl as any)?.props?.color || '#6b7280'};margin:0 auto 48px;max-width:600px;">${descHtml}</p>
            <div style="display:grid;grid-template-columns:repeat(${props?.columns || 3}, 1fr);gap:24px;">${cardsHtml}</div>
          </section>`;
        }

        return '';
      },
    },
  },
});

export { TestimonialsPlugin };
